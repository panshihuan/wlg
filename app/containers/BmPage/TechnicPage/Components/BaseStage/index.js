import React  from 'react';
import CanvasCore from '../../Components/CanvasCore'
import {Stage,Layer,Rect} from 'react-konva';
import pubsub from 'pubsub-js'

class BaseStage extends CanvasCore {
    static propTypes = {
        children: React.PropTypes.node,
    };

    constructor(props) {
        super(props);
        this.state = {
            stageWidth: 0
        }
    }

    //不用
    componentWillMount() {
    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {
        let stage = this.refs.compomentStage.getStage();
        let currentContainer = stage.container();
        //把当前页面dom节点大小传递过去
        this.setState({
            stageWidth: currentContainer.offsetWidth
        })
    }

    //销毁
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    //不用
    componentWillReceiveProps(nextProps) {
    }

    //drag事件
    baseStageDrag(evt){
        var shape = evt.target;
        let layer = shape.getLayer();
        shape.stopDrag();

        // 还原坐标的位置
        let config = {
            x: 0,
            y: 0,
        }
        let originalX = shape.getAttr('originalX');
        let originalY = shape.getAttr('originalY');
        if(originalX && originalY){
            config = {
                x: originalX,
                y: originalY,
            }
        }
        shape.setAttrs(config)
        layer.draw();
        let shapeType = shape.getAttr('shapeType')
        pubsub.publish(`anchorGroup.${shapeType}`,evt)
    }

    render() {
        return (
            <Stage ref='compomentStage' width={this.state.stageWidth} height={this.state.stageWidth}
                   onDragstart={this.baseStageDrag}>
                <Layer ref='compomentLayer'>
                    {React.cloneElement(this.props.children, {config: {
                        stageWidth: this.state.stageWidth,
                    }})}
                </Layer>
            </Stage>
        )
    }
}

export default BaseStage;
