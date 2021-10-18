import React, { Component } from 'react';
import isEqual from 'react-fast-compare';
import cls from 'classnames';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Checkbox from 'antd/es/checkbox';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import List from 'antd/es/list';
import { cloneDeep } from 'lodash';
import { formatMsg, getUUID } from '../utils';
import { LocaleItem } from '../locale';
import ExtIcon from '../ExtIcon';
import ScrollBar from '../ScrollBar';
import IColumnProps from './columnProps';
import GUID from './guid';

export interface IColumnAssignProps<T> {
  columns: IColumnProps<T>[];
  targetColumns: IColumnProps<T>[];
  locale: LocaleItem;
  onColumnCheckedChange: (cols: IColumnProps<T>[]) => void;
  saveToggleToStorage: (cols: IColumnProps<T>[], needSave: boolean | undefined) => void;
  storageId?: GUID;
  hasStorage?: boolean;
}

export interface IColumnAssignState<T> {
  selectAll: boolean;
  selectIndeterminate: boolean;
  targetColumns: IColumnProps<T>[];
  hasStorage?: boolean;
  droppableId: GUID;
}

class ColumnAssign<T> extends Component<IColumnAssignProps<T>, IColumnAssignState<T>> {
  static defaultProps = {
    columns: [],
  };

  constructor(props: IColumnAssignProps<T>) {
    super(props);
    const { columns, targetColumns, hasStorage } = props;
    const targetCols = targetColumns.filter(col => col.dataIndex || col.key);
    const droppableId = getUUID();
    this.state = {
      targetColumns: targetCols,
      selectAll: targetCols.length === columns.length,
      selectIndeterminate: targetCols.length > 0 && targetCols.length < columns.length,
      hasStorage,
      droppableId,
    };
  }

  componentDidUpdate(_prevProps: IColumnAssignProps<T>, prevState: IColumnAssignState<T>) {
    if (!isEqual(this.state.targetColumns, prevState.targetColumns)) {
      const { onColumnCheckedChange } = this.props;
      if (onColumnCheckedChange) {
        const { targetColumns } = this.state;
        onColumnCheckedChange(
          targetColumns.map(col => {
            col.optional = false;
            return col;
          }),
        );
      }
    }
  }

  onItemCheck = (e: any, item: IColumnProps<T>) => {
    const { columns } = this.props;
    const { targetColumns } = this.state;
    const checkedColumns = cloneDeep(targetColumns);
    let selectAll = false;
    let selectIndeterminate = false;
    if (e.target.checked) {
      checkedColumns.push(item);
    } else {
      checkedColumns.forEach((col: IColumnProps<T>, idx: number) => {
        if (col.dataIndex === item.dataIndex || (col.key === item.key && col.key && item.key)) {
          checkedColumns.splice(idx, 1);
        }
      });
    }
    if (checkedColumns.length > 0) {
      selectIndeterminate = true;
      if (checkedColumns.length === columns.length) {
        selectAll = true;
        selectIndeterminate = false;
      }
    }
    this.setState({
      selectIndeterminate,
      selectAll,
      targetColumns: checkedColumns,
    });
  };

  onSelectAllChange = (e: any) => {
    const { columns } = this.props;
    let targetColumns: IColumnProps<T>[] = [];
    let selectAll = false;
    let selectIndeterminate = false;
    if (e.target.checked) {
      targetColumns = cloneDeep(columns);
      selectAll = true;
    } else {
      targetColumns = columns.filter(col => col.required);
    }
    if (targetColumns.length > 0 && targetColumns.length < columns.length) {
      selectIndeterminate = true;
    }
    this.setState({
      selectAll,
      selectIndeterminate,
      targetColumns,
    });
  };

  isColumnChecked = (col: IColumnProps<T>): boolean => {
    const { targetColumns } = this.state;
    let checked = false;
    for (let i = 0; i < targetColumns.length; i += 1) {
      if (
        isEqual(targetColumns[i].dataIndex, col.dataIndex) ||
        (isEqual(targetColumns[i].key, col.key) && targetColumns[i].key && col.key)
      ) {
        checked = true;
        break;
      }
    }
    return checked;
  };

  saveToLocal = () => {
    const { hasStorage, targetColumns } = this.state;
    this.setState(
      {
        hasStorage: !hasStorage,
      },
      () => {
        const { saveToggleToStorage } = this.props;
        if (saveToggleToStorage) {
          saveToggleToStorage(targetColumns, this.state.hasStorage);
        }
      },
    );
  };

  reorder = (startIndex: number, endIndex: number) => {
    const { targetColumns } = this.state;
    const result = Array.from(targetColumns);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  getItemStyle = (draggableStyle: any, isDragging: boolean) => {
    const styles: any = {
      userSelect: 'none',
      ...draggableStyle,
    };
    if (isDragging) {
      Object.assign(styles, {
        cursor: 'grabbing',
        pointerEvents: 'all',
      });
    }
    return styles;
  };

  onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const targetColumns = this.reorder(result.source.index, result.destination.index);
    this.setState(
      {
        targetColumns,
      },
      () => {
        const { hasStorage, targetColumns: storageColumns } = this.state;
        const { saveToggleToStorage } = this.props;
        if (hasStorage && saveToggleToStorage) {
          saveToggleToStorage(storageColumns, true);
        }
      },
    );
  };

  render() {
    const { locale, columns, storageId } = this.props;
    const { targetColumns, selectAll, selectIndeterminate, hasStorage, droppableId } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className={cls('column-assign-box')}>
          <Row gutter={0}>
            <Col span={12} className="source-column-box">
              <div className="column-header">
                <div className="tool-action-box">
                  <Checkbox
                    checked={selectAll}
                    indeterminate={selectIndeterminate}
                    onChange={this.onSelectAllChange}
                  />
                </div>
                <div className="title">
                  {formatMsg(locale.optionalFields, { count: columns.length })}
                </div>
              </div>
              <div className="column-body">
                <ScrollBar>
                  <List
                    dataSource={columns}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          className={cls({ required: item.required })}
                          avatar={
                            <Checkbox
                              checked={this.isColumnChecked(item)}
                              disabled={item.required}
                              onChange={e => this.onItemCheck(e, item)}
                            />
                          }
                          title={item.title}
                        />
                      </List.Item>
                    )}
                  />
                </ScrollBar>
              </div>
            </Col>
            <Col span={12}>
              <div className="column-header">
                <div className="title">
                  {formatMsg(locale.displayFields, { count: targetColumns.length })}
                </div>
                <div className="action-box">
                  {storageId ? (
                    <ExtIcon
                      type="star"
                      tooltip={{ title: hasStorage ? locale.cancelStorageTip : locale.storageTip }}
                      antd
                      theme={hasStorage ? 'filled' : 'outlined'}
                      onClick={this.saveToLocal}
                    />
                  ) : null}
                </div>
              </div>
              <div className="column-body">
                <Droppable droppableId={droppableId}>
                  {(dropProvided: any, dropSnapshot: any) => (
                    <div
                      ref={dropProvided.innerRef}
                      className={cls('drag-list', { 'dragging-over': dropSnapshot.isDraggingOver })}
                      {...dropProvided.droppableProps}
                    >
                      <ScrollBar className="drag-scroll-bar">
                        {targetColumns.map((item, index) => (
                          <Draggable
                            key={item.dataIndex || item.key}
                            draggableId={item.dataIndex || item.key}
                            index={index}
                          >
                            {(dragProvided: any, dragSnapshot: any) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.dragHandleProps}
                                {...dragProvided.draggableProps}
                                style={this.getItemStyle(
                                  dragProvided.draggableProps.style,
                                  dragSnapshot.isDragging,
                                )}
                                className={cls('drag-column-item', {
                                  dragging: dragSnapshot.isDragging,
                                })}
                              >
                                <ExtIcon type="drag-vertical" className="sort-handler" />
                                <span className="title">{item.title}</span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {dropProvided.placeholder}
                      </ScrollBar>
                    </div>
                  )}
                </Droppable>
              </div>
            </Col>
          </Row>
        </div>
      </DragDropContext>
    );
  }
}

export default ColumnAssign;
