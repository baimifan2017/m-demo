import { Layout, Tabs, Tag } from 'antd';
import { Animate } from 'm-demo';
import React from 'react';
import '../../../site/theme/static/animate.less';
const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;

class AnimateDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animationName: 'fadeInRight',
    };
  }

  animateMe = e => {
    console.log(e,'ee')
    debugger
    this.setState({
      animationName: e.target.innerText,
    });
  };

  render() {
    const { animationName } = this.state;
    const sidebarStyle = {
      borderRight: '1px solid #ddd',
      background: '#f5f5f5',
    };
    return (
      <Layout className='css-animate-page'>
        <Sider width={350} className='css-animate-page-sider' style={sidebarStyle}>
          <div className='header'>
            <h3>动画演示</h3>
            <hr />
          </div>
          <Tabs>
            <TabPane tab='进场' key='1'>
              <div className='pane'>
                <h6>旋转进入:</h6>
                <div className='content'>
                  <Tag onClick={this.animateMe} color='blue'>
                    rotateIn
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    rotateInDownLeft
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    rotateInDownRight
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    rotateInUpLeft
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    rotateInUpRight
                  </Tag>
                </div>
                <h6>淡入:</h6>
                <div className='content'>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeIn
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeInUp
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeInDown
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeInLeft
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeInRight
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeInUpBig
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeInDownBig
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeInLeftBig
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeInRightBig
                  </Tag>
                </div>
                <h6>弹跳进入:</h6>
                <div className='content'>
                  <Tag onClick={this.animateMe} color='red'>
                    bounceIn
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    bounceInDown
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    bounceInUp
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    bounceInRight
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    bounceInLeft
                  </Tag>
                </div>
              </div>
            </TabPane>
            <TabPane tab='退场' key='2'>
              <div className='pane'>
                <h6>旋转退出:</h6>
                <div className='content'>
                  <Tag onClick={this.animateMe} color='blue'>
                    rotateOut
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    rotateOutDownLeft
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    rotateOutDownRight
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    rotateOutUpLeft
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    rotateOutUpRight
                  </Tag>
                </div>
                <h6>淡出:</h6>
                <div className='content'>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeOut
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeOutUp
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeOutDown
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeOutLeft
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeOutRight
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeOutUpBig
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeOutDownBig
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeOutLeftBig
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    fadeOutRightBig
                  </Tag>
                </div>
                <h6>弹跳退出:</h6>
                <div className='content'>
                  <Tag onClick={this.animateMe} color='red'>
                    bounceOut
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    bounceOutDown
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    bounceOutUp
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    bounceOutRight
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    bounceOutLeft
                  </Tag>
                </div>
              </div>
            </TabPane>
            <TabPane tab='效果' key='3'>
              <div className='pane'>
                <h6>Attention Seekers:</h6>
                <div className='content'>
                  <Tag onClick={this.animateMe} color='blue'>
                    bounce
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    shake
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    tada
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    swing
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    wobble
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    pulse
                  </Tag>
                  <Tag onClick={this.animateMe} color='blue'>
                    flash
                  </Tag>
                </div>
                <h6>Flippers:</h6>
                <div className='content'>
                  <Tag onClick={this.animateMe} color='magenta'>
                    flip
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    flipInX
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    flipOutX
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    flipInY
                  </Tag>
                  <Tag onClick={this.animateMe} color='magenta'>
                    flipOutY
                  </Tag>
                </div>
                <h6>Sliders:</h6>
                <div className='content'>
                  <Tag onClick={this.animateMe} color='red'>
                    slideInDown
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    slideInLeft
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    slideInRight
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    slideOutUp
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    slideOutLeft
                  </Tag>
                  <Tag onClick={this.animateMe} color='red'>
                    slideOutRight
                  </Tag>
                </div>
                <h6>Specials:</h6>
                <div className='content'>
                  <Tag onClick={this.animateMe} color='purple'>
                    lightSpeedIn
                  </Tag>
                  <Tag onClick={this.animateMe} color='purple'>
                    lightSpeedOut
                  </Tag>
                  <Tag onClick={this.animateMe} color='purple'>
                    hinge
                  </Tag>
                  <Tag onClick={this.animateMe} color='purple'>
                    rollIn
                  </Tag>
                  <Tag onClick={this.animateMe} color='purple'>
                    rollOut
                  </Tag>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Sider>
        <Content
          style={{
            marginTop: 32,
            fontSize: '4em',
            textAlign: 'center',
            height: 360,
            width: '100%',
            color: '#009688',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Animate type={animationName}>
            <strong>Animate</strong> Me<strong>!</strong>
          </Animate>
        </Content>
      </Layout>
    );
  }
}

export default AnimateDemo;
