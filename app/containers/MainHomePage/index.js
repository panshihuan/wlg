/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import {Row, Col, Switch, Icon, Button, Badge, Layout, Card} from 'antd';
import HomeCalendar from './HomeCalendar';
import {Icons} from "../../images";
import {colors, ImeRow} from "../../global-styles";

class MainHomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Layout style={{paddingTop: '16px'}}>
        <Row gutter={32}>

          <Col className='left-bar'>
            <ImeRow bottom='base'>
              <Card
                title="订阅消息"
                noHovering={true}
                extra={<a href="#">添加</a>}
              >
                <ImeRow bottom='sm'>
                  <Row type="flex" justify="space-between" align="middle">
                    <Col>订单1</Col>
                    <Col><Switch checkedChildren="开" unCheckedChildren="关"/></Col>
                  </Row>
                  <Row type="flex" justify="space-between" align="middle">
                    <Col>工单</Col>
                    <Col><Switch checkedChildren="开" unCheckedChildren="关"/></Col>
                  </Row>
                  <Row type="flex" justify="space-between" align="middle">
                    <Col>派工单</Col>
                    <Col><Switch checkedChildren="开" unCheckedChildren="关"/></Col>
                  </Row>
                  <Row type="flex" justify="space-between" align="middle">
                    <Col>任务单</Col>
                    <Col><Switch checkedChildren="开" unCheckedChildren="关"/></Col>
                  </Row>
                  <Row type="flex" justify="space-between" align="middle">
                    <Col>配送单</Col>
                    <Col><Switch checkedChildren="开" unCheckedChildren="关"/></Col>
                  </Row>
                </ImeRow>
              </Card>
              <Card
                title="关注资源"
                noHovering={true}
                extra={<a href="#">添加</a>}
              >
                <ImeRow bottom='base'>
                  <ImeRow bottom='sm'>
                    <Row type="flex" justify="space-between">
                      <Col>关注人员</Col>
                      <Col><a href="javascript:void(0);"><Icon type="double-right"/></a></Col>
                    </Row>
                    <Row type="flex" justify="space-around">
                      <Col className="w-xxs text-center">
                        <img className="w-full rounded" src={Icons.p1} />
                        张三
                      </Col>
                      <Col className="w-xxs text-center">
                        <img className="w-full rounded" src={Icons.p2} />
                        张三
                      </Col>
                      <Col className="w-xxs text-center">
                        <img className="w-full rounded" src={Icons.p3} />
                        张三
                      </Col>
                    </Row>
                  </ImeRow>
                  <hr/>
                  <ImeRow bottom='sm'>
                    <Row type="flex" justify="space-between">
                      <Col>关注设备</Col>
                      <Col><a href="javascript:void(0);"><Icon type="double-right"/></a></Col>
                    </Row>
                    <Row type="flex" justify="space-around">
                      <Col className="w-xxs text-center">
                        <img className="w-full rounded" src={Icons.a2} style={{backgroundColor: colors.blue_1}} />
                        设备一
                      </Col>
                      <Col className="w-xxs text-center">
                        <img className="w-full rounded" src={Icons.a2} style={{backgroundColor: colors.blue_1}}  />
                        设备二
                      </Col>
                      <Col className="w-xxs text-center">
                        <img className="w-full rounded" src={Icons.a2} style={{backgroundColor: colors.blue_1}}  />
                        设备三
                      </Col>
                    </Row>
                  </ImeRow>
                  <hr/>
                  <ImeRow bottom='sm'>
                    <Row type="flex" justify="space-between">
                      <Col>关注组织</Col>
                      <Col><a href="javascript:void(0);"><Icon type="double-right"/></a></Col>
                    </Row>
                    <Row type="flex" justify="space-around">
                      <Col className="w-xxs text-center">
                        <img className="w-full rounded" src={Icons.a3} style={{backgroundColor: colors.blue_1}}  />
                        组织一
                      </Col>
                      <Col className="w-xxs text-center">
                        <img className="w-full rounded" src={Icons.a3} style={{backgroundColor: colors.blue_1}}  />
                        组织二
                      </Col>
                      <Col className="w-xxs text-center">
                        <img className="w-full rounded" src={Icons.a3} style={{backgroundColor: colors.blue_1}} />
                        组织三
                      </Col>
                    </Row>
                  </ImeRow>
                </ImeRow>
              </Card>
              <Card
                title="我的任务"
                noHovering={true}
                extra={<a href="#">添加</a>}
              >
                <Row className='text-center'>
                  <ImeRow bottom='md'>
                    <Col span={12}>
                      <Badge count={5} style={{background: colors.red_5}}>
                        <Button type="primary">打包任务</Button>
                      </Badge>
                    </Col>
                    <Col span={12}>
                      <Badge count={12} style={{background: colors.red_5}}>
                        <Button type="primary">组配任务</Button>
                      </Badge>
                    </Col>
                    <Col span={12}>
                      <Badge count={7} style={{background: colors.red_5}}>
                        <Button type="primary">发货任务</Button>
                      </Badge>
                    </Col>
                    <Col span={12}>
                      <Badge count={27} style={{background: colors.red_5}}>
                        <Button type="primary">收货任务</Button>
                      </Badge>
                    </Col>
                  </ImeRow>
                </Row>
              </Card>
            </ImeRow>
          </Col>

          <Col className='right-bar'>
            <Card
              title="我的日程"
              noHovering={true}
              extra={<a href="#">添加</a>}
            >
              <HomeCalendar/>
            </Card>
          </Col>
        </Row>
      </Layout>
    );
  }

}

MainHomePage.propTypes = {};

export default MainHomePage;
