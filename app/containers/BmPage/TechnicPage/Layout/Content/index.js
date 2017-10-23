import React  from 'react';
import {Layer, Stage } from 'react-konva';
import {Popconfirm} from 'antd'
import CanvasCore from '../../Components/CanvasCore'
import {connect} from 'react-redux';
import pubsub from 'pubsub-js'
import {getCanvasJson} from '../../Services/Util'
import ContentService from './ContentService'
import Routerline from '../../Components/RouteLine'

class Content extends CanvasCore {
    //构造
    constructor(props) {
        super(props);
        this.pubsubEvents = {
            'content.add': 'content.add',
            'content.save': 'content.save',
            'content.clear': 'content.clear',
            'content.getJson': 'content.getJson',
            'content.changeGridDisplay': 'content.changeGridDisplay', //表格展示
        }
        this.clickShape = null;
        this.contentService = new ContentService(this);
        this.state = {
            routerLine: null,
            rightClickPopStyle: {  //右键pop样式
                position: 'absolute',
                zIndex: '99999',
                visibility: 'hidden'
            },
            rightClickPopTitle: '',
            rightClickShape: null,
            technicGid:'',
        }
    }

    //不用
    componentWillMount() {

    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {
        // 初始化刷新获取数据
        this.contentService.initContent();
    }

    initContentEvent(){
        let _this = this;
        let layer = this.refs.contentLayer;
        let stage = layer.getStage();
        
       /* //绑定全局点击事件
        layer.on('click',(evt) => {
            _this.removeClickShape()
            stage.off('contentClick');
            let shape =  evt.target;
            _this.clickShape = shape
            shape.setAttrs({
                shadowColor: 'red',
                shadowBlur: 10,
            })
            layer.draw();
            setTimeout(() => {
                stage.on('contentClick',(evt) => {
                    _this.removeClickShape();
                });
            },100)
        })

        // 键盘删除监听
        let canvasLayout = document.querySelector('#canvasLayout >.content');
        document.onkeyup = (e) =>{
            // 如果有选中元素
            if(_this.clickShape && e.code == 'Delete' ){
                // 删除此元素
                let layer = _this.clickShape.getLayer();
                _this.clickShape.destroy();
                layer.draw();
            }
        }*/
       
       
       // 增加全局左键双击弹出事件
        layer.on('dblclick',(evt) => {
            let shape = evt.target;
            let shapeType = shape.getAttr('shapeType');

            let button = evt.evt.button;
            if(shapeType && button == 0){
                // 如果点击到文字上
                if(shapeType == 'processText'){
                    let processShape = shape.getParent().getChildren((item) => {
                        return item.getAttr('shapeType') == 'process'
                    })
                    pubsub.publish(`process.dblclick`,processShape[0])
                    
                    
                } else {
                    pubsub.publish(`${shapeType}.dblclick`,shape)
                }


            }
        })

        // 绑定点击事件
        layer.on('click',(evt) => {
            let button = evt.evt.button;
            //右键
            if(button == 2){
                _this.rightClick(evt);
            }
        })
    }

    // 点击事件绑定
    rightClick(d){
        var rightClickShape = d.target;


        let groupShape = rightClickShape.findAncestor('.anchorGroup');
        let shapeName = '';
        if(groupShape){
            switch (groupShape.getAttr('groupType')) {
                case 'process':
                    shapeName = '工序'
                    break;
            }
        }

        // 如果存在内容
        if(shapeName){
            let rightClickPopStyle = Object.assign({},this.state.rightClickPopStyle, {
                left: d.evt.offsetX-15+'px',
                top: d.evt.offsetY-20+'px',
            })

            let rightClickPopTitle = `确定要此'${shapeName}'以及其子节点？`

            this.setState({
                rightClickPopStyle,
                rightClickPopTitle,
                rightClickShape
            })
            this.refs.rightClickPop.click();
        }

    }

    // 删除元素
    rightClickConfirm = () =>{
        // 获取对应类型 执行对应的delete方法
        let shape = this.state.rightClickShape;
        if(shape){
            let type = shape.getAttr('shapeType');

            if(type == 'processText'){
                // 让processText 模拟 process
                let processShape = shape.getParent().getChildren((item) => {
                    return item.getAttr('shapeType') == 'process'
                })
                type = 'process';
                shape = processShape[0];
            }

            if(type){
                pubsub.publish(`${type}.delete`,shape);
            }
        }

    }


    

    // 清空点击状态
/*    removeClickShape(){
        if(this.clickShape){
            let layer = this.clickShape.getLayer();
            this.clickShape.setAttrs({
                shadowBlur: 0,
            })
            this.clickShape = null;
            layer.draw();
        }
    }*/

    initSubscribe(){
        let layer = this.refs.contentLayer
        pubsub.subscribe('content.add', (e,d) => {
            // 隐藏tempCanvas
            pubsub.publish('tempCanvas.visible',false);
            pubsub.publish('tempCanvas.empty');
            let contentStageDom = document.querySelector('#canvasMain .content')
            let postion = d.getPosition();
            // 获取当前的滚动条
            d.setPosition({
                x: postion.x + contentStageDom.scrollLeft - this.props.config.siderWidth,
                y: postion.y + contentStageDom.scrollTop
            })
            // 去掉绑定的dragEnd
            d.off('dragend')
            layer.add(d);
            layer.draw();
        })

        // 保存画布
        pubsub.subscribe('content.save', (e,d) => {
            this.contentService.saveCanvas();

        })

        // 清空画布
        pubsub.subscribe('content.clear', (e,d) => {
            layer.destroyChildren();
            layer.draw();
        })

        // 获取静态json
        pubsub.subscribe('content.getJson', (e,d) => {
            console.log(getCanvasJson(layer));
        })

        // 切换为表格模式
        pubsub.subscribe('content.changeGridDisplay', (e,d) => {
            // 如果没有gid则跳转新增  如果有则跳转到修改

            
            if(this.state.technicGid){
                // 需要获取工艺表格中内容
                let routeLineShape = layer.find('.shape').filter((shape) => {
                    return shape.getAttr('shapeType') == 'routeLine'
                })

                let shapeData = routeLineShape[0].getAttr('shapeData')
                shapeData.gid = this.state.technicGid;
                shapeData.routeLineCode = shapeData.code;
                shapeData.routeLineName = shapeData.name;
                
                pubsub.publish("@@navigator.push", {url: "/mdRouteLine/modify",0:shapeData});
            } else {
                pubsub.publish("@@navigator.push", {url: "/mdRouteLine/create"});
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
        // 计算stage的高度值
        let width = this.props.config.contentWidth ? this.props.config.contentWidth : this.props.config.width - this.props.config.siderWidth
        let height = this.props.config.contentHeight ? this.props.config.contentHeight :   this.props.config.layoutContentHeight - 20

        return (
            <div className='content'>
                <Stage width={width} height={height} ref="contentStage">
                    <Layer ref="contentLayer">
                        {/*工艺路线组件*/}
                        {this.state.routerLine}
                    </Layer>
                </Stage>

                {/*右键做了个删除元素 ， 黑魔法好恶心*/}
                <Popconfirm title={this.state.rightClickPopTitle}   onConfirm={this.rightClickConfirm} okText="是" cancelText="否"  placement="top">
                    <a ref="rightClickPop" style={this.state.rightClickPopStyle}>Delete</a>
                </Popconfirm>

            </div>
        )
    }
}

export default Content;
