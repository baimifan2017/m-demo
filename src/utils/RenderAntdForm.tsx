/**
 * @author lzh
 * @desc: 根据传入数组生成antd form表单
 * @date:2021-03-30
 */
import React, {ReactNode, useState} from 'react';
import {Form, Input} from 'antd';
import {ComboGrid, ComboList} from 'suid';
import {IMyProps} from './IExtTableProps';


export interface IRenderForm {
  formItems: IMyProps.IFormItemProps[],
  /** 布局方式*/
  layOut?: IMyProps.IFormLayOut,
  /** 提交事件*/
  onSubmit: (value: any) => void
}

const RenderAntdForm = (props: IRenderForm) => {
  const {formItems, layOut, onSubmit} = props;

  type LayoutType = Parameters<typeof Form>[0]['layout'];
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>(layOut || "horizontal");
  const formItemLayout =
    formLayout === 'horizontal'
      ? {
        labelCol: {span: 4},
        wrapperCol: {span: 14},
      }
      : null;


  // @ts-ignore
  const _onFinishFailed = ({values, errorFields, outOfDate}): void => {
    console.log(values, errorFields, outOfDate)
  }

  /** 循环生成Form.Item*/
  const _renderItem = (): ReactNode => {
    let element: ReactNode;

    if (formItems && formItems.length > 0) {
      formItems.forEach((item, key) => {
        switch (item.type) {
          case 'ComboList':
            element = <ComboList {...item.comboProps}/>;
            break;
          case 'ComboTree':

            break;
          case 'ComboGrid':
            element = <ComboGrid {...item.comboProps}/>
            break;
          default:
            element = <Input/>
            break;
        }

        return <Form.Item
          {...formItemLayout}
          name={item.name}
          label={item.label || ''}
          rules={item.rules}
          initialValue={item.initialValue || ''}
          tooltip={item.tooltip || null}
        >
          {element}
        </Form.Item>
      })
    }
    return ;
  }

  return (
    <>
      <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{layout: formLayout}}
        onFinish={value => onSubmit(value)}
        onFinishFailed={({values, errorFields, outOfDate}) => _onFinishFailed({values, errorFields, outOfDate})}
      >
        {_renderItem()}
      </Form>
    </>)
}

RenderAntdForm.defaultProps = {
  layOut: 'inline'
}

export default RenderAntdForm;



