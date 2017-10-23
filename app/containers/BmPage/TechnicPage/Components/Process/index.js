import React  from 'react';
import CanvasCore from '../../Components/CanvasCore'
import {Ellipse} from 'react-konva';
import pubsub from 'pubsub-js'
import {uuid} from '../../Services/Util'
import throttle from 'lodash/throttle'
import uniq from 'lodash/uniq';
import remove from 'lodash/remove'

// 工序组件
class Process extends CanvasCore {
    //构造
    constructor(props) {
        super(props);
        this.pubsubEvents = {
            'anchorGroup.process': 'anchorGroup.process',
            'anchorGroup.anchorGroupEvent': 'anchorGroup.anchorGroupEvent',
            'process.dblclick': 'process.dblclick',
            'process.delete': 'process.delete',
        }
        this.throttleTime = 100;
        this.drawLine = null;  //正在画的线
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

        // 产线双击编辑
        pubsub.subscribe('process.dblclick', (e,shape) => {
            let shapeType = shape.getAttr('shapeType');
            if(shapeType == 'process'){
                pubsub.publish('technic.changeModelForm', shape)
            }
        })


        pubsub.subscribe('anchorGroup.process', (e,evt) => {
            let shape = evt.target;
            var clone = shape.clone({
                x: 0,
                y: 0,
                id:uuid(),
            })
            clone.draggable(false); //停止拖动
            var cloneGroup = new Konva.Group({
                draggable: true,
                groupType:'process',
                name:'anchorGroup',
                id:uuid(),
            });

            //添加节点
            cloneGroup.add(clone);

            //添加锚点 获取长短轴半径为
            let ellipseLong = clone.getAttr('radius').x
            let ellipseShort = clone.getAttr('radius').y
            this.addAnchor(cloneGroup, 0, -ellipseShort, 'left');
            this.addAnchor(cloneGroup, ellipseLong, 0, 'top');
            this.addAnchor(cloneGroup, -ellipseLong, 0, 'right');
            // 添加group事件  从group事件中遍历下面节点发送anchor事件
            this.anchorGroupEvent(cloneGroup);


            // 添加文字
            var text = new Konva.Text({
                x:-ellipseLong,
                y:-5,
                fontSize:12,
                width:2*ellipseLong,
                name:'procssText',
                id:uuid(),
                text:'zzz',
                shapeType:'processText',
                fill:'darkblue',
                align:'center'
            });
            cloneGroup.add(text);


            pubsub.publish('tempCanvas.add', cloneGroup,evt);
        })

        pubsub.subscribe('anchorGroup.anchorGroupEvent', (e,group) => {
            _this.anchorGroupEvent(group)
        })
        
        
        // 删除功能
        pubsub.subscribe('process.delete', (e,shape) => {
            // 删除proces要删除其连接线，及连接线所引用的对应元素的属性值。
            // 找到它的group
            let group = shape.getParent()
            if(group.getName() == 'anchorGroup' && group.getAttr('groupType') == 'process'){
                let layer = group.getLayer();

                // 获取当前所有的anchors
                let anchors = group.getChildren((item) => {
                    return item.getName() == 'anchor'
                })
                
                // 获取anchor下所有lines
                let allLines = [];
                for(var anchor of anchors){
                    allLines = allLines.concat([].concat(anchor.getAttr('startLine'), anchor.getAttr('endLine')))
                }

                // 去重
                allLines = uniq(allLines);

                //删除所有线
                this.deleteLines(allLines,group);

                group.destroy();
                layer.draw();
            }
        })
    }

    // todo: 1：查询线  对应的anchor中删除线
    deleteLines(lineArray,group){
        let layer = group.getLayer();
        for(var lineId of lineArray){
            let line = layer.findOne(`#${lineId}`);
            let startAnchor = line.getAttr('startAnchor');
            let endAnchor = line.getAttr('endAnchor');
            this.deleteAnchorRefLine(startAnchor, 'startAnchor', line)
            this.deleteAnchorRefLine(endAnchor, 'endAnchor', line)

            // 删除此line
            line.destroy();
        }
    }
    //删除anchor对应line的引用
    deleteAnchorRefLine(anchorId, type, line){
        let layer = line.getLayer();
        let lines = [];
        let anchor = layer.findOne(`#${anchorId}`);
        let lineId = line.getId();
        if(type =='startAnchor'){
            lines = anchor.getAttr('startLine');
            remove(lines, (line) => {
                return line == lineId
            })
            anchor.setAttr('startLine',lines);
        } else if( type == 'endAnchor'){
            lines = anchor.getAttr('endLine');
            remove(lines, (line) => {
                return line == lineId
            })
            anchor.setAttr('endLine',lines);
        }
    }
    
    // group事件
    anchorGroupEvent(group){
        let _this = this;
        //group的拖动事件
        group.on('dragmove', throttle((evt) => {
            //判断当前
            let layer = group.getLayer();
            let anchors = group.getChildren((node) =>{
                return node.getName() == 'anchor'
            })

            for (var anchor of anchors) {
                // 如果有左边的线
                let startLine = anchor.getAttr('startLine')
                if(startLine.length != 0){
                    let anchorPoint = anchor.getAbsolutePosition();
                    for(var lineId of startLine){
                        let line = layer.find(`#${lineId}`)[0];
                        let points = line.points();
                        // 移除最后两个
                        points.splice(0, 2, anchorPoint.x, anchorPoint.y);
                        line.points(points);
                        layer.draw();
                    }
                }
                // 如果有右边的线
                let endLine = anchor.getAttr('endLine')
                if(endLine.length != 0){
                    let anchorPoint = anchor.getAbsolutePosition();
                    for(var lineId of endLine){
                        let line = layer.find(`#${lineId}`)[0];
                        let points = line.points();
                        // 移除最后两个
                        points.splice(points.length-2, 2, anchorPoint.x, anchorPoint.y);
                        line.points(points);
                        layer.draw();
                    }
                }
            }
        },_this.throttleTime))

        // 遍历group中的anchor 逐一统一添加事件
        let anchors = group.find('.anchor');
        for(var anchor of anchors){
            _this.anchorEvent(anchor);
        }
    }

    // 添加更改的锚点
    addAnchor(group, x, y,type) {
        var anchor = new Konva.Circle({
            x: x,
            y: y,
            stroke: '#666',
            fill: 'white',
            strokeWidth: 1,
            radius: 6,
            dragOnTop: false,
            draggable:false,
            id:uuid(),
            name:'anchor',
            type:type,
            startLine:[],  //起始点的线
            endLine:[],    //终点的线
        });
        group.add(anchor);
    }
    
    // 锚点的事件
    anchorEvent(anchor){
        let _this = this;
        anchor.on('mouseenter',()=> {
            let layer = anchor.getLayer();
            let group = anchor.getParent();
            group.setDraggable(false);
            document.body.style.cursor = 'crosshair';
            anchor.setStrokeWidth(2);

            // 正在制作线  并且不能等于其本身
            if(_this.drawLine && layer.find(`#${_this.drawLine.getAttr('startAnchor')}`)[0] != anchor){
                let anchorEndLineAttrArray = anchor.getAttr('endLine');
                anchorEndLineAttrArray.push(_this.drawLine.getId())
                anchor.setAttr('endLine',anchorEndLineAttrArray);
                _this.drawLine.setAttr('endAnchor',anchor.getId()); //双向绑定
            }
            layer.draw();
        })
        
        anchor.on('mouseleave',()=> {
            let layer = anchor.getLayer();
            let group = anchor.getParent();
            group.setDraggable(true);
            document.body.style.cursor = 'default';
            anchor.setStrokeWidth(1);

            if(_this.drawLine && layer.find(`#${_this.drawLine.getAttr('startAnchor')}`)[0] != anchor){
                let anchorEndLineAttrArray = anchor.getAttr('endLine');
                // 如果不存在则添加
                if(anchorEndLineAttrArray.includes(_this.drawLine.getId())){
                    anchorEndLineAttrArray = anchorEndLineAttrArray.filter((lineId) => {
                        return lineId != _this.drawLine.getId()
                    })
                    anchor.setAttr('endLine',anchorEndLineAttrArray);
                    _this.drawLine.setAttr('endAnchor',null); //双向绑定
                }
            }
            layer.draw();
        })

        // 鼠标左键生成连接线
        anchor.on('mousedown',()=> {
            let group = anchor.getParent();
            let layer = anchor.getLayer();
            let startAnchorId = anchor.getId();
            let startAnchorPoints = anchor.getAbsolutePosition();

            var anchorLine = new Konva.Arrow({
                strokeWidth: 2,
                stroke: '#999',
                fill: '#999',
                lineCap: 'round',
                id: uuid(),
                startAnchor: startAnchorId,
                endAnchor: null,
                shapeType:'anchorLine',
                points: [startAnchorPoints.x,startAnchorPoints.y,startAnchorPoints.x,startAnchorPoints.y]
            });
            let anchorStartLineAttrArray = anchor.getAttr('startLine');
            anchorStartLineAttrArray.push(anchorLine.getId())
            anchor.setAttr('startLine',anchorStartLineAttrArray);
            layer.add(anchorLine);
            layer.draw();
            _this.drawLine = anchorLine;
            this.lineMouseMove(anchorLine);  // 这个是拖动整个stage
        })
    }



    // 连接线拖拽事件
    lineMouseMove(anchorLine){
        let _this = this;
        let stage = anchorLine.getStage();
        let layer = anchorLine.getLayer();
        stage.off('contentMousemove');
        stage.off('contentMouseup');

        stage.on('contentMousemove',throttle((evt) => {
            let mousePoint = evt.evt;
            let points = anchorLine.points();
            // 移除最后两个
            points.splice(points.length-2, 2);
            anchorLine.points(points.concat([mousePoint.offsetX, mousePoint.offsetY]));
            layer.draw();
        },_this.throttleTime));

        stage.on('contentMouseup',(evt) => {
            // 如果连接点是false
            if(_this.drawLine && !_this.drawLine.getAttr('endAnchor')){
                // 需要清除anchor上面的startLine
                let startAnchor = layer.find(`#${anchorLine.getAttr("startAnchor")}`)[0];
                let startLineArray = startAnchor.getAttr('startLine');

                startAnchor.setAttr('startLine', startLineArray.filter((value) => {
                    return value != _this.drawLine.getId()
                }))

                anchorLine.destroy();
            }

            _this.drawLine = null;
            // 判断当前是否在Anchor上
            stage.off('contentMousemove');
            stage.off('contentMouseup');
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
            <Ellipse
                x={this.props.config.stageWidth/2}
                y={this.props.config.stageWidth/2}
                radius={{
                    x: this.props.config.stageWidth/2.5,
                    y: this.props.config.stageWidth/5
                }}
                stroke='lightblue'
                strokeWidth={2}
                originalX = {this.props.config.stageWidth/2}  //自定义属性为了 siderDrag 拖放位置还原
                originalY = {this.props.config.stageWidth/2}
                draggable = 'true'
                name='shape'
                shapeType='process'
                shapeData={{
                    mdDefOperationCode: "", //工序编码
                    mdDefOperationName: "",  //工序名称
                    mdDefOperationTypeGid: "", //工序类型
                    mdFactoryWorkCenterName: '', //工作中心
                    mdFactoryLineName: "", //产线
                    mdFactoryWorkUnitName: "", //工作单元
                    mdFactoryStationName: "", //工位
                    processingModeGid: "", //加工方式
                    businessModeGid: "", //报工方式
                    worksheetGenarationModeGid:"", //派工单产生
                    rhythm:"", //节拍
                    rhythmTypeGid:"", //节拍类型
                    processTest:"", //是否质检
                }}
            />
        )
    }
}

export default Process;
