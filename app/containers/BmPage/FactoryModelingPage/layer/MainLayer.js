// 右边主体内容
import pubsub from 'pubsub-js'

export default class MainLayer{
    // 系统信息
    constructor () {
        this.currentTarget = '';
        this.mainLayer = new Konva.Layer({
            id: 'mainLayer',
            x: util.MENU_LAYER_WIDTH,
            y: 0,
            draggable: false,
        })

        this.initData();
        this.initEvent();
        // mainLayer右键删除
        this.pubsubSubscribe();
    }

    // pubsub监听注入
    pubsubSubscribe(){
        pubsub.subscribe(`rightClickConfirm.click`, (e,d) => {
            let anchorGroup = this.currentTarget.findAncestor('.anchorGroup');
            // 找到删除的元素
            let tempGid = this.currentTarget.getAttr('shapeData').gid;
            if(tempGid){
                let tempDeleteElement = {
                    gid: tempGid,
                    type: this.currentTarget.getAttr('shapeType')
                }
                this.deleteElements.push(tempDeleteElement);
            }

            anchorGroup.destroy();
            mainLayerClass.mainLayer.draw();
        })
    }

    initData(){
        this.deleteElements = [];
    }


    // 初始化事件
    initEvent(){
        let _this = this;
        _this.initData();

        _this.mainLayer.off('dblclick');
        _this.mainLayer.on('dblclick',(evt) => {
            //左键两次
            let button = evt.evt.button;
            if(button == 0){
                // get the shape that was clicked on
                var shape = evt.target;
                this.dbClick(shape)
            }
        })
        this.sortAnchorGroupZIndex();
        
        // 全局的右键删除事件
        _this.mainLayer.off('click');
        _this.mainLayer.on('click',(evt) => {
            let button = evt.evt.button;
            if(button == 2){
                _this.rightClick(evt);
            }
        })
    }

    // 右键双击
    dbClick(shape){
        this.currentTarget = shape;
        let shapeType = shape.getAttr('shapeType')
        let shapeId = shape.getAttr('id')
        if(shapeType){
            pubsub.publish('mainLayer.dbclick', {shapeType: shapeType, shapeId: shapeId,shape: shape});
        }
    }


    // 右键事件
    rightClick(evt){
        var shape = evt.target;
        this.currentTarget = shape;
        pubsub.publish('mainLayer.rightClick',evt);
    }




    // 重置画布所有anchorGroup的z-index值， 这里的z-index必须要连续的
    sortAnchorGroupZIndex(){
        // 获取所有anchorGroup元素
        let anchorGroups = this.mainLayer.find('.anchorGroup');

        let groupsTypesObj = {
            workCenter: [],
            workLine: [],
            workUnit: [],
            workStation: [],
        }

        for(var i=0; i<anchorGroups.length; i++){
            let tempGroup = anchorGroups[i]
            groupsTypesObj[tempGroup.getAttr('groupType')].push(tempGroup)
        }

        let groupsTypesArray = [];
        for (var key of Object.keys(groupsTypesObj)) {
            groupsTypesArray = groupsTypesArray.concat(groupsTypesObj[key])
        }

        for(var i=0; i<groupsTypesArray.length; i++){
            groupsTypesArray[i].setZIndex(i);
        }

        this.mainLayer.draw();
    }
}


