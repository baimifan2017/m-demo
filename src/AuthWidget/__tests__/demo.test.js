import React from 'react';
import { render, mount } from 'enzyme';
import { Input } from 'antd';
import toJson from 'enzyme-to-json';
import { AuthWidget } from 'seid';

describe('AuthWidget', () => {
  it('No Auth', () => {
    const AuthInput = AuthWidget(Input);
    const inputRender = mount(<AuthInput authCode="authCode" />);
    expect(inputRender.contains(<Input />)).toEqual(false);
    expect(toJson(inputRender)).toMatchSnapshot();
  });

  it('has Auth', () => {
    const AuthInput = AuthWidget(Input);
    const authInput = mount(<AuthInput authCode="authCode" authorities={['authCode']} />);
    expect(authInput.contains(<Input />)).toEqual(true);
  });

  it('no Contorl', () => {
    const AuthInput = AuthWidget(Input);
    const inputRender = render(<AuthInput />);
    expect(toJson(inputRender)).toMatchSnapshot();
  });
});
