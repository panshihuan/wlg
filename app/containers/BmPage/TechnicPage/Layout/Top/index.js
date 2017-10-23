import React  from 'react';
import {Breadcrumb, Card, Row, Col,Icon,Button  } from 'antd';
import CanvasCore from '../../Components/CanvasCore'
import AppButton from '../../../../../components/AppButton';
import pubsub from 'pubsub-js'


// 样式组件
import TopCss from './TopCss'

const ButtonGroup = Button.Group;


class Top extends CanvasCore {
    //构造
    constructor(props) {
        super(props);
        this.pubsubEvents = {

        }
    }

    //不用
    componentWillMount() {
    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {
        this.initSubscribe();
    }
    //销毁
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    
    initSubscribe() {

    }

    //不用
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <TopCss className='top clear'>
                <Breadcrumb className="breadcrumb padder">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>工艺</Breadcrumb.Item>
                    <Breadcrumb.Item>工艺详情</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true}
                      style={{ "backgroundColor": "rgba(247, 247, 247, 1)"}}
                      bodyStyle={{
                          'padding':'10px'
                      }}>
                    <Row>
                        <Col span={16}>
                            <AppButton config={{
                                id: "technicSaveButton",
                                title: "保存",
                                type: "primary",
                                size: "default",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "technicSaveButton.click",
                                        pubs:[{
                                            event: "content.save",
                                            payload: false
                                        }]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "technicClearButton",
                                title: "清除画布",
                                type: "primary",
                                size: "default",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "technicClearButton.click",
                                        pubs:[{
                                            event: "content.clear",
                                            payload: false
                                        }]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "getJsonCanvasButton",
                                title: "获取静态json",
                                type: "primary",
                                size: "default",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "getJsonCanvasButton.click",
                                        pubs:[{
                                            event: "content.getJson",
                                            payload: false
                                        }]
                                    }
                                ]
                            }}>
                            </AppButton>
                        </Col>

                        <Col span={3} offset={5}>
                            <ButtonGroup className='pull-right'>
                                <Button icon="bars"  onClick={() => {
                                    pubsub.publish("content.changeGridDisplay");
                                }}/>
                                <Button icon="appstore"  type="primary" />
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Card>
            </TopCss>
        )
    }
}

export default Top;
