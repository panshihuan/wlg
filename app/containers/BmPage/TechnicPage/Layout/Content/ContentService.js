import React  from 'react';
import {resolveDataSource, publishEvents, resolveFetch,resolveDataSourceCallback} from 'utils/componentUtil'
import pubsub from 'pubsub-js'
import {getCanvasJson} from '../../Services/Util'
import Routerline from '../../Components/RouteLine'
import { fromJS } from "immutable"

// 跟业务有关的service代码
export default class ContentService{
    constructor(_this) {
        this.super = _this;

    }

    //初始化canvas内容
    initContent(){
        // this.reflashContent(json);
        // 通过url拿参数 判断有没有工艺路线id
        let routerLineId = this.super.props.location.query.id;
        // 如果存在id  则去查询 说明是修改
        if(routerLineId){
            this.super.setState({
                technicGid: routerLineId
            })
            this.getContent(routerLineId);
        } else {
            // 新增工艺路线
            this.super.setState({
                'routerLine': <Routerline config={{text:'工艺路线'}} />
            })
            // 重新绑定
            this.super.initSubscribe();
            this.super.initContentEvent();
        }
    }
    
    // 获取工艺信息
    getContent(routerLineId){
        let _this = this;
        let dataSource = {
            type: "api",
            method: "POST",
            url: '/bm/bmTechnic/queryByTechnicGid.action?id='+routerLineId,
        }

        resolveDataSource({ dataSource }).then(function (response) {
            if(response.success){
               // 加载画布信息
                let data = response.data;
                let canvasData = data.technicData;
                _this.reflashContent(canvasData)

                // 加载工序信息列表
                let routeOperationQueryList = data.routeOperationQueryList;
                console.log(routeOperationQueryList);
                
                _this.loadRouteOperation(routeOperationQueryList);

                // 加载设备信息
                let routeEquipmentQueryList = data.routeEquipmentQueryList;
                _this.loadRouteEquipment(routeEquipmentQueryList);

                // 加载共享产品
                let routeProductDTOs = data.routeProductDTOs;
                _this.loadRouteProduct(routeProductDTOs);

            } else {
                pubsub.publish('@@message.success','获取信息失败')
            }
        })
    }

    //加载工序信息
    loadRouteOperation(routeOperationQueryList){
        pubsub.publish("bmTechnicalProcessList.setData",{eventPayload:routeOperationQueryList});
    }

    //加载设备信息
    loadRouteEquipment(routeEquipmentQueryList){
        pubsub.publish("@@form.change", { id: "mdRouteEquipmentForm",name:"routeEquipmentQueryList" ,value: fromJS(routeEquipmentQueryList) })
    }

    //加载共享产品
    loadRouteProduct(routeProductDTOs){
        pubsub.publish("@@form.change", { id: "mdRouteEquipmentForm",name:"routeProductDTOs" ,value: fromJS(routeProductDTOs) })
    }


    reflashContent(data){
        if(data){
            let stage = this.super.refs.contentStage.getStage();
            let layer = this.super.refs.contentLayer;
            layer.destroy();
            this.super.refs.contentLayer = Konva.Node.create(data)
            stage.add(this.super.refs.contentLayer)
            // todo: 重新绑定元素事件
            this.layerShapeReBind();
            this.super.initSubscribe();
            this.super.initContentEvent();

            //更新内部状态显示
            this.reflashProcess();
            stage.draw();
        }
    }
    
    // 工序中如果有id则其状态发生改变
    reflashProcess(){
        let layer = this.super.refs.contentLayer;
        let processArray = layer.find('.shape').filter((shape) => {
            return shape.getAttr('shapeType') == 'process'
        })

        // 如果process的id不为空， 则背景色改变深色  并且文字颜色取反
        for(var process of processArray){
            this.changeProcess(process);
        }
    }

    // 工序样式更改
    changeProcess(process){
        let code = process.getAttr('shapeData').code;
        // 如果有值
        if(code){
            process.setAttr('fill','lightblue')
            let text = process.getParent().getChildren((item) => {
                return item.getAttr('shapeType') == 'processText'
            })
            text.setAttr('fill', 'white')
        }
    }
    
    // 数据重新刷新
    layerShapeReBind(){
        let stage = this.super.refs.contentStage.getStage();
        let layer = this.super.refs.contentLayer;
        // 绑定所有的Anchor事件
        let anchorGroup = layer.find('.anchorGroup');
        for(var i=0 ; i<anchorGroup.length; i++){
            let group = anchorGroup[i];
            pubsub.publish('anchorGroup.anchorGroupEvent',group);
        }
    }


    // 绑定保存按钮事件
    saveCanvas(){
        let _this = this;
        let layer = this.super.refs.contentLayer;
        // 还需要获取设备与共享产品的值

        // 获取设备信息
        let  mdRouteEquipmentForm = window.store.getState().get("form").get('mdRouteEquipmentForm');
        let routeEquipmentQueryListData = [];
        // 如果存在内容
        if(mdRouteEquipmentForm && mdRouteEquipmentForm.toJS().values){
            routeEquipmentQueryListData = mdRouteEquipmentForm.toJS().values.routeEquipmentQueryList || [];
        }

        // 获取产品信息
        let routeProductDTOsData = [];
        // 如果存在内容
        if(mdRouteEquipmentForm && mdRouteEquipmentForm.toJS().values){
            routeProductDTOsData = mdRouteEquipmentForm.toJS().values.routeProductDTOs || [];
        }
        
        // 获取画布数据
        let canvasData = getCanvasJson(layer);

        let postData = {
            technicGid: this.super.state.technicGid,
            technicData: canvasData,
            routeEquipmentQueryList: routeEquipmentQueryListData,
            routeProductDTOs: routeProductDTOsData,
        }

        let dataSource = {
            mode:"dataContext",
            type: "api",
            method: "POST",
            url: '/bm/bmTechnic/saveTechnicModeling.action',
        }

        resolveDataSource({ dataSource, dataContext: postData}).then(function (response) {
            if(response.success){
                pubsub.publish('@@message.success','保存成功');

                _this.super.setState({
                    technicGid: response.data.technicGid
                })
                // 需要将数据重新加载一遍
                // _this.reflashFactory(response);
                // pubsub.publish('bmFactoryModelingTab.reflash');
            } else {
                pubsub.publish('@@message.success','保存失败')
            }
        })

    }
}