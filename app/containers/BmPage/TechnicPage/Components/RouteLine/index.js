import React  from 'react';
import CanvasCore from '../../Components/CanvasCore'
import {Ellipse} from 'react-konva';
import pubsub from 'pubsub-js'
import {uuid} from '../../Services/Util'
import throttle from 'lodash/throttle'
import {Text} from 'react-konva';

// 工艺路线
class RouteLine extends CanvasCore {
    //构造
    constructor(props) {
        super(props);
        this.pubsubEvents = {
            'routeLine.dblclick': 'routeLine.dblclick'
        }
    }

    //不用
    componentWillMount() {
    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {
        // 注册事件
        this.initSubscribe();
    }

    initSubscribe(){
        let _this = this;
        super.componentWillUnmount()
        // 产线双击编辑
        pubsub.subscribe('routeLine.dblclick', (e,shape) => {
            let shapeType = shape.getAttr('shapeType');
            if(shapeType == 'routeLine'){
                pubsub.publish('technic.changeModelForm', shape)
            }
        })

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
            <Text x={10}
                  y={15}
                  fontSize={18}
                  name='shape'
                  id={uuid()}
                  shapeType='routeLine'
                  shapeData={{
                      code:'', //工艺路线编码
                      name:'', //工艺路线名称
                      routeLineVersion:'', //工艺路线版本
                      routeLineType:'', //工艺路线类型
                      outputNum:'', //请输入数量
                      rhythm:'', //工艺节拍
                      timeTypeRhythm: '', //timeTypeRhythm节拍间隔
                      workModeGid: '', //报工方式
                      trackOrderModeGid: '', //派工单产生
                      materialInfoCode: '', //产品编码
                      materialInfoName: '', //产品名称
                      spec: '', //规格
                      model: '', //型号
                      productVersion:'', //产品版本
                      produceCycle:'', //生产周期
                      timeTypeProduceCycle: '', //生命周期类型
                  }}
                  fill={'#666'}
                  {...this.props.config}
            >
            </Text>
        )
    }
}

export default RouteLine;
