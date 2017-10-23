import {resolveDataSource, publishEvents, resolveFetch,resolveDataSourceCallback} from 'utils/componentUtil'
import pubsub from 'pubsub-js'

export default class BindEventCenter{
    constructor() {
        this.factoryGid = '';  //当前选中的工厂编号
        this.smBusiGroupGid = ''; //工厂组id
    }

    // 渲染出来的mainLayer事件重新绑定
    layerShapeReBind(){
        mainLayerClass.initEvent();
        let stage = stageClass.stage
        let layer = mainLayerClass.mainLayer;
        // 绑定所有的Anchor事件
        let anchorGroup = layer.find('.anchorGroup');

        for(var i=0 ; i<anchorGroup.length; i++){
            let group = anchorGroup[i];

            let groupType = group.getAttr('groupType');
            let superClass = window[groupType+'Class'];

            if(superClass.addAnchorGroupEvent){
                superClass.addAnchorGroupEvent(group);
            }

            // 这里绑定锚点  因为是嵌套关系 只找当前一层的
            let anchors = group.getChildren((node) => {
                return node.getClassName() == 'Circle'
            })

            for(var j=0; j<anchors.length; j++){
                if(superClass.addAnchorEvent){
                    superClass.addAnchorEvent(stage,layer,group,anchors[j])
                }
            }
            this.changeText(group);
        }
    }

    // 刷新group
    reflashGroup(group){
        this.changeText(group);
        mainLayerClass.mainLayer.draw();
    }

    // 更换文描
    changeText(group){
        // 改变文描
        let shapeArray = group.getChildren((node) => {
            return node.getName() == 'shape'
        })
        let groupTextArray = group.getChildren((node) => {
            return node.getName() == 'groupText'
        })

        let shape = shapeArray[0];
        let groupText = groupTextArray[0]

        let shapeType = shape.getAttr('shapeType');
        let shapeName = shape.getAttr('shapeData').name;
        groupText.setText(shapeName);
    }


    // 根据工厂id获取工厂渲染
    getFactoryCanvasById(factory){
        let _this = this;
       
        this.factoryGid = factory.factoryGid;
        this.smBusiGroupGid = factory.smBusiGroupGid;

        let dataSource = {
            type: "api",
            method: "POST",
            url: "/bm/bmFactory/queryByFactoryGid.action?id="+this.factoryGid,
        }
        resolveDataSource({ dataSource }).then(function (response) {
           _this.reflashFactory(response);
        })
    }

    // ajax回调后 重新渲染工厂
    reflashFactory(response){
        let data = response.data;
        if(!data.factoryData){
            return;
        }
        mainLayerClass.mainLayer.destroy();
        // mainLayerClass.mainLayer.destroyChildren();
        mainLayerClass.mainLayer = Konva.Node.create(data.factoryData);
        stageClass.stage.add(mainLayerClass.mainLayer)
        this.layerShapeReBind();
        stageClass.stage.draw();

    }


    // 绑定保存按钮事件
    saveFactoryCanvas(success){
        let _this = this;

        if(!this.factoryGid){
            pubsub.publish('@@message.error', '请选择工厂');
            return;
        }

        // todo :　　判断下面的所有元素是否均有name和code字段  如果没有则提示第一个， 并显示表单出来
        let shapes = mainLayerClass.mainLayer.find('.shape');
        for(var i=0; i<shapes.length; i++){
            // 如果有一个没有写
            if(!this.checkShapeValidate(shapes[i])){
                pubsub.publish('@@message.error', '请完善信息');
                mainLayerClass.dbClick(shapes[i]);
                return;
            }
        }

        let getMainLayerJson = _this.getMainLayerJson();

        let postData = {
            factoryGid: _this.factoryGid,
            smBusiGroupGid: _this.smBusiGroupGid,
            factoryData: getMainLayerJson,
            deleteData: JSON.stringify(mainLayerClass.deleteElements),
        }

        let dataSource = {
            mode:"dataContext",
            type: "api",
            method: "POST",
            url: '/bm/bmFactory/saveFactoryModeling.action',
        }

        resolveDataSource({ dataSource, dataContext: postData}).then(function (response) {
            if(response.success){
                pubsub.publish('@@message.success','保存成功');
                _this.reflashFactory(response);
                pubsub.publish('bmFactoryModelingTab.reflash');
            } else {
                pubsub.publish('@@message.success','保存失败')
            }

        })

    }


    //检查shape中必填项是否填写
    checkShapeValidate(shape){
        let shapeData = shape.getAttr('shapeData')
        // name和code是必填项
        if(!(shapeData.name && shapeData.code)){
            return false
        } else {
            return true;
        }
    }

    getMainLayerJson() {
        let json = '';
        let mainLayer = mainLayerClass.mainLayer;
        try {
            json = mainLayer.toJSON();
            if(json){
                return json;
            }
        } catch (e) {
            return this.getMainLayerJson();
        }
    }

}