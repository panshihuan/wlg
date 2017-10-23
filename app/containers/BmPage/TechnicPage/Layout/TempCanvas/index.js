import React from 'react';
import CanvasCore from '../../Components/CanvasCore'


import {Layer, Stage} from 'react-konva';
import pubsub from 'pubsub-js'

//sider向content拖拽时 临时拖拽到此层
class TempCanvas extends CanvasCore {
    //构造
    constructor(props) {
        super(props);
        //维护组件pubsub数组，  组件删除后移除事件
        this.pubsubEvents = {
            'tempCanvas.add': 'tempCanvas.add',
            'tempCanvas.empty': 'tempCanvas.empty',
            'tempCanvas.visible': 'tempCanvas.visible',
        }
    }

    //不用
    componentWillMount() {
    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {
        this.initSubscribe();
        this.initBindEvent();
    }

    //绑定事件
    initBindEvent(){
        let layer = this.refs.tempCanvasLayer;
        let stage = layer.getStage();

        stage.on('contentMouseup', (evt) => {
            pubsub.publish('tempCanvas.visible',false);
        })
    }

    initSubscribe() {
        let layer = this.refs.tempCanvasLayer;

        // 清空tempCanvas的显示
        pubsub.subscribe('tempCanvas.visible', (e, d = true) => {
            let tempCanvasDom = this.refs.tempCanvas;
            let style;
            if (d) {
                style = 'visibility:visible'
            } else {
                style = 'visibility:hidden'
            }
            tempCanvasDom.setAttribute('style', style);
        });

        // 添加元素
        pubsub.subscribe('tempCanvas.add', (e, shape, evt) => {
            //先清空
            pubsub.publish('tempCanvas.visible', true);
            pubsub.publish('tempCanvas.empty');

            // 更改shape的位置，保持与鼠标点击位置相同
            let canvasLayoutDom = document.querySelector('#canvasLayout');
            let canvasMainDom = document.querySelector('.ant-layout');

            let mouseEvent = evt.evt;
            let currentMousePostion = {
                top: mouseEvent.clientY,
                left: mouseEvent.clientX
            }

            // 要增加滚动条的高度 与宽度
            shape.setAttrs({
                x: currentMousePostion.left - canvasLayoutDom.offsetLeft,
                y: currentMousePostion.top - canvasLayoutDom.offsetTop,
            });

            shape.off('dragstart');
            shape.on('dragend', () => {
                // 讲元素添加到content中
                pubsub.publish(`content.add`, shape)
            })

            setTimeout(() => {
                layer.add(shape);
                shape.startDrag();
                layer.draw();
            }, 20)

        })

        // 清空
        pubsub.subscribe('tempCanvas.empty', (e, d) => {
            layer.destroyChildren();
            layer.draw();
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
            <div className='temp-canvas' ref='tempCanvas' style={{visibility: 'hidden'}}>
                <Stage ref="tempCanvasStage" width={this.props.config.width}
                       height={this.props.config.layoutContentHeight}>
                    <Layer ref="tempCanvasLayer"></Layer>
                </Stage>
            </div>
        )
    }
}

export default TempCanvas;
