import React  from 'react';
import { Collapse,Row,Col } from 'antd';
const Panel = Collapse.Panel;
import CanvasCore from '../../Components/CanvasCore'
import {Layer, Rect, Stage} from 'react-konva';
import BaseStage from '../../Components/BaseStage'
import Process from '../../Components/Process'
import RouteLine from '../../Components/RouteLine'




class Sider extends CanvasCore {
    //构造
    constructor(props) {
        super(props);
    }

    //不用
    componentWillMount() {
    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {
    }

    //销毁
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    //不用
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div className='sider'>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={'工艺'} key="1">
                        <Row  type="flex" justify="center" align="middle">
                            <Col span={8}>单工序</Col>
                            <Col span={16}>
                                <BaseStage>
                                    <Process/>
                                </BaseStage>
                            </Col>
                        </Row>
                        <Row  type="flex" justify="center" align="middle" style={{visibility: 'hidden'}} >
                            <Col span={8}>单工序</Col>
                            <Col span={16}>
                                <BaseStage>
                                    <RouteLine/>
                                </BaseStage>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}

export default Sider;
