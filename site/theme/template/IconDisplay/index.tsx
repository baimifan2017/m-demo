import * as React from 'react';
import manifest from '@ant-design/icons/lib/manifest';
import { ThemeType as ThemeFolderType } from '@ant-design/icons/lib/types';
import { Icon, Input, Radio } from 'antd';
import { ExtIcon } from 'seid';
import { RadioChangeEvent } from 'antd/es/radio/interface';
import { injectIntl } from 'react-intl';
import debounce from 'lodash/debounce';
import { ThemeType } from 'antd/es/icon';
import Category from './Category';
import IconPicSearcher from './IconPicSearcher';
import { FilledIcon, OutlinedIcon, TwoToneIcon } from './themeIcons';
import categories, { Categories, CategoriesKeys } from './fields';
import seidIcons from './seidIcons';
import appDemoIcons from './appDemoIcon';

interface IconDisplayProps {
  intl: any;
}

interface IconDisplayState {
  theme: ThemeType;
  searchKey: string;
}

class IconDisplay extends React.Component<IconDisplayProps, IconDisplayState> {
  static categories: Categories = categories;

  static newIconNames: string[] = [];

  static themeTypeMapper: { [key: string]: ThemeFolderType } = {
    filled: 'fill',
    outlined: 'outline',
    twoTone: 'twotone',
  };

  state: IconDisplayState = {
    theme: 'outlined',
    searchKey: '',
  };

  constructor(props: IconDisplayProps) {
    super(props);
    appDemoIcons.initIcon();
    this.handleSearchIcon = debounce(this.handleSearchIcon, 300);
  }

  getComputedDisplayList() {
    return Object.keys(IconDisplay.categories)
      .map((category: CategoriesKeys) => ({
        category,
        icons: (IconDisplay.categories[category] || []).filter(
          name => manifest[IconDisplay.themeTypeMapper[this.state.theme]].indexOf(name) !== -1,
        ),
      }))
      .filter(({ icons }) => Boolean(icons.length));
  }

  handleChangeTheme = (e: RadioChangeEvent) => {
    this.setState({
      theme: e.target.value as ThemeType,
    });
  };

  handleSearchIcon = (searchKey: string) => {
    this.setState(prevState => ({
      ...prevState,
      searchKey,
    }));
  };

  renderCategories(list: Array<{ category: CategoriesKeys; icons: string[] }>) {
    const { searchKey, theme } = this.state;
    const otherIcons = categories.all.filter(icon => {
      return list
        .filter(({ category }) => category !== 'all')
        .every(item => !item.icons.includes(icon));
    });

    return list
      .filter(({ category }) => category !== 'all')
      .concat({ category: 'other', icons: otherIcons })
      .map(({ category, icons }) => ({
        category,
        icons: icons
          .filter(name => name.includes(searchKey))
          .filter(name => manifest[IconDisplay.themeTypeMapper[theme]].includes(name)),
      }))
      .filter(({ icons }) => !!icons.length)
      .map(({ category, icons }) => (
        <Category
          key={category}
          title={category}
          icons={icons}
          theme={this.state.theme}
          newIcons={IconDisplay.newIconNames}
        />
      ));
  }

  render() {
    const {
      intl: { messages },
    } = this.props;
    const list = this.getComputedDisplayList();
    return (
      <>
        <div>
          <div style={{ fontSize: 18, color: '#000' }}>Seid???????????????????????????</div>
          <p>
            ExtIcon??????Antd???Icon?????????????????????Andt????????????????????????????????????????????????iconfont?????????
          </p>
          <p>
            ???????????????<code>{`<ExtIcon type="?????????" />`}</code>
          </p>
          <p>
            Antd?????????<code>{`<ExtIcon type="antd?????????" antd />`}</code>
          </p>
          <p>
            ?????????????????????<code>{`<ExtIcon type="?????????" font="[???????????????]" />`}</code>
          </p>
          <div style={{ color: '#000', fontWeight: 700, marginTop: 8, marginBottom: 8 }}>
            ??????????????????iconfont??????????????????FontClass/Symbol
            ??????,???????????????????????????js????????????????????????????????????
          </div>
          <div style={{ marginTop: 16 }}>
            <ul className="anticons-list">
              {seidIcons.map(icon => (
                <li key={icon} className="icon-item">
                  <ExtIcon className="anticon" type={icon} style={{ fontSize: 36 }} />
                  <span className="anticon-class">{icon}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 18, color: '#000', marginTop: 8, marginBottom: 16 }}>
            Antd???????????????????????????
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Radio.Group
              value={this.state.theme}
              onChange={this.handleChangeTheme}
              size="large"
              buttonStyle="solid"
            >
              <Radio.Button value="outlined">
                <Icon component={OutlinedIcon} /> {messages['app.docs.components.icon.outlined']}
              </Radio.Button>
              <Radio.Button value="filled">
                <Icon component={FilledIcon} /> {messages['app.docs.components.icon.filled']}
              </Radio.Button>
              <Radio.Button value="twoTone">
                <Icon component={TwoToneIcon} /> {messages['app.docs.components.icon.two-tone']}
              </Radio.Button>
            </Radio.Group>
            <Input.Search
              placeholder={messages['app.docs.components.icon.search.placeholder']}
              style={{ marginLeft: 10, flex: 1 }}
              allowClear
              onChange={e => this.handleSearchIcon(e.currentTarget.value)}
              size="large"
              autoFocus
              suffix={<IconPicSearcher />}
            />
          </div>
          {this.renderCategories(list)}
        </div>
      </>
    );
  }
}

export default injectIntl(IconDisplay);
