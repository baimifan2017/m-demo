import React from 'react';
import { getChildren } from 'jsonml.js/lib/utils';
import get from 'lodash/get';

const locations = {
  'zh-CN': {
    params: '参数',
    desc: '说明',
    type: '类型',
    default: '默认值',
  },
  'en-US': {
    params: 'Parameter',
    desc: 'Description',
    type: 'Type',
    default: 'Default Value',
  },
};

const locals = ['zh-CN', 'en-US'];

const strToObj = str => {
  const b = locals.every(l => str.includes(`${l}:`)); // 是否包含所有的语言信息;
  const obj = {};
  if (b) {
    const strList = str.split('\n');
    strList.forEach(subStr => {
      locals.forEach(l => {
        if (subStr.startsWith(l)) {
          obj[l] = subStr.slice(l.length + 1);
        }
      });
    });
    return obj;
  }
  locals.forEach(l => {
    obj[l] = str;
  });
  return obj;
};

const getDesc = (props, propsKey, local, prefix) => {
  const desc = get(props, `${propsKey}${prefix}`);
  const obj = desc ? strToObj(desc.toString()) : desc;
  return obj ? obj[local] : '';
};

const ApiContent = ({ api, apiData = {}, utils, locale }) => {
  if (api || !apiData) {
    return utils.toReactComponent(
      [
        'section',
        {
          className: 'markdown api-container',
        },
      ].concat(getChildren(api || ['placeholder'])),
    );
  }
  const constData = locations[locale];
  const { displayName, props = {} } = apiData;
  return (
    <section className="markdown api-container">
      <h2 id="API">
        <span>API</span>
        <a href="#API" className="anchor">
          #
        </a>
      </h2>
      <h3 id="API">
        <span>{displayName}</span>
        <a href={`#${displayName}`} className="anchor">
          #
        </a>
      </h3>
      <table>
        <thead>
          <tr>
            <th>{constData.params}</th>
            <th>{constData.desc}</th>
            <th>{constData.type}</th>
            <th>{constData.default}</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props).map(propsKey => (
            <tr key={propsKey}>
              <td>{propsKey}</td>
              <td>{getDesc(props, propsKey, locale, '.description')}</td>
              <td>{getDesc(props, propsKey, locale, '.type.name')}</td>
              <td>{getDesc(props, propsKey, locale, '.defaultValue.value')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ApiContent;
