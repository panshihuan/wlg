import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col,Tabs,Popconfirm,Input,Button,InputNumber  } from 'antd';
import pubsub from 'pubsub-js'
import { fromJS } from "immutable"
import {Link} from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppTable from '../../../components/AppTable';
import DropdownButton from '../../../components/DropdownButton';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import TreeField from '../../../components/Form/TreeField';
import AutoCompleteField from '../../../components/Form/AutoCompleteField';

import TextField from 'components/Form/TextField'
import DateField from 'components/Form/DateField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import TextAreaField from 'components/Form/TextAreaField'
import TableField from 'components/Form/TableField'
import {resolveDataSource, publishEvents, resolveFetch,resolveDataSourceCallback} from 'utils/componentUtil'


import Konva from 'konva/src/Core';
import 'konva/src/shapes/Rect';
import 'konva/src/shapes/Circle';
import 'konva/src/shapes/Line';
import 'konva/src/shapes/Text';
import 'konva/src/Container.js';
import 'konva/src/Shape.js';
import 'konva/src/Stage.js';
import 'konva/src/BaseLayer.js';
import 'konva/src/Layer.js';
import 'konva/src/FastLayer.js';
import 'konva/src/Group.js';
import 'konva/src/Animation.js';
import 'konva/src/Tween.js';
import 'konva/src/DragAndDrop.js';

// 创建公共类
import Util from './services/Util.js';
// 引用konva入口文件
import Stage from './stage/Stage.js';
// 绑定事件中心  反序列化后执行统一方法 重新绑定事件

import BindEventCenter from './page/BindEventCenter';
import WorkCenterForm from './page/WorkCenterForm';
import WorkLineForm from './page/WorkLineForm';
import WorkUnitForm from './page/WorkUnitForm';
import WorkStationForm from './page/WorkStationForm';


const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;


const validate = values => {
    const errors = {}
    if (!values.get('FactoryModelingPage')) {
        errors.busiGroupCode = '必填项'
    }
    return errors
}

export class FactoryModelingPage extends React.PureComponent {
    //构造
    constructor(props) {
        super(props);

        this.state= {
            dbclickShapeType: '',  // 双击选中的组件
            dbclickShapeId: '',
            factoryId: '',// 当前选中的工厂id
            factoryName: '', // 当前选中工厂的name
            currentModalForm: '',  // 当前模态窗口该显示的form
            rightClickPopStyle: {  //右键pop样式
                position: 'absolute',
                zIndex: '99999',
                visibility: 'hidden'
            },
            rightClickPopTitle: '',
            stageSize: {
                width: 0,
                height: 0,
            },
        }

        this.labelStyle = {
            lineHeight:'30px'
        }

    }

    //不用
    componentWillMount() {

    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {
        let _this = this;

        // 选中工厂渲染工厂内容
        pubsub.subscribe(`bmFactoryFactorySelector.onChange`, (e, d) => {
            _this.setState({
                factoryName: d.smBusiUnitGidRef.busiUnitName,
                factoryId: d.smBusiUnitGid,
                smBusiGroupGid: d.smBusiUnitGidRef.smBusiGroupGid,
            })
            bindEventCenter.getFactoryCanvasById({factoryGid: d.smBusiUnitGid, smBusiGroupGid:d.smBusiUnitGidRef.smBusiGroupGid} );

            pubsub.publish('bmFactoryModelingTab.reflash');

        })


        pubsub.subscribe('bmFactoryModelingTab.reflash', (e,d) =>{
            resolveFetch({fetch:{id:"FactoryModelingPage",data:"@@formValues"}}).then(function (param) {
                let query = { "query": {
                    "query": [
                        {
                            "field": "smBusiUnitGid",
                            "type": "eq",
                            "value": param.bmFactoryFactorySelector
                        }
                    ]
                },
                    "pager":{
                        "page":1,
                        "pageSize":10
                    }
                }
                pubsub.publish('bmFactoryDetailsWorkCenterList.loadData',{eventPayload:query})
                pubsub.publish('bmFactoryDetailsWorkLineList.loadData',{eventPayload:query})
                pubsub.publish('bmFactoryDetailsWorkUnitList.loadData',{eventPayload:query})
                pubsub.publish('bmFactoryDetailsWorkStationList.loadData',{eventPayload:query})
            })
        })



        //清除画布
        pubsub.subscribe(`bmFactoryClearButton.click`, (e,d) => {
            mainLayerClass.mainLayer.destroyChildren();
            mainLayerClass.mainLayer.draw();
        })

        // 保存画布
        pubsub.subscribe(`bmFactorySaveButton.click`, (e,d) => {
            bindEventCenter.saveFactoryCanvas()
        })


        // 获取json数据
        pubsub.subscribe(`bmFactoryGetJsonButton.click`, (e,d) => {
            console.log(bindEventCenter.getMainLayerJson());

        })

        // 更改画布大小
        pubsub.subscribe(`stageSize.change`, (e,d) => {
            let tempStateSize = _this.state.stageSize;
            let newStateSize = Object.assign({},tempStateSize,d )
            
            _this.setState({
                stageSize: newStateSize
            })

            // 更改画布大小
            stageClass.stage.setAttrs(
                _this.state.stageSize
            )
            stageClass.stage.draw();
        })


        // 更改画布扩大或者缩小
        pubsub.subscribe(`stageSize.expand`, (e,d) => {
            let tempStageSize = _this.state.stageSize;
            let expand = 200; //每次固定增加或者减少200

            let newStateSize = {};

            if(_this.state.stageSize.width < expand || _this.state.stageSize.height < expand){
                return;
            }

            // 如果是放大
            if(d == 'plus'){
                newStateSize = Object.assign({},tempStageSize,{
                    width: tempStageSize.width + expand,
                    height:tempStageSize.height + expand,
                })
            }

            // 如果是缩小
            if(d == 'minus'){
                newStateSize = Object.assign({},tempStageSize,{
                    width: tempStageSize.width - expand,
                    height:tempStageSize.height - expand,
                })
            }

            _this.setState({
                stageSize: newStateSize
            })

            // 更改画布大小
            stageClass.stage.setAttrs({
                    width:  newStateSize.width,
                    height: newStateSize.height,
                }
            )
            stageClass.stage.draw();
        })



        // mainLayer 中双击弹出的事件
        pubsub.subscribe(`mainLayer.dbclick`, (e,d) => {
            _this.setState({
                dbclickShapeType: d.shapeType,
                dbclickShapeId: d.shapeId,
                currentModalForm: _.upperFirst(`${d.shapeType}Form`)
            })

            pubsub.publish('editFormModal.openModal');
        })

        // 右键弹出框
        pubsub.subscribe(`mainLayer.rightClick`, (e,d) => {
            // 获取当前元素
            var shape = d.target;
            let groupShape = shape.findAncestor('.anchorGroup');
            let shapeName = '';
            switch (groupShape.getAttr('groupType')) {
                case 'workCenter':
                    shapeName = '工作中心'
                    break;
                case 'workLine':
                    shapeName = '产线'
                    break;
                case 'workStation':
                    shapeName = '工位'
                    break;
                case 'workUnit':
                    shapeName = '工作单元'
                    break;
            }

            let rightClickPopStyle = Object.assign({},this.state.rightClickPopStyle, {
                left: d.evt.offsetX+'px',
                top: d.evt.offsetY+100+'px',
            })


            let rightClickPopTitle = `确定要此'${shapeName}'以及其子节点？`

            _this.setState({
                rightClickPopStyle,
                rightClickPopTitle
            })
            _this.refs.rightClickPop.click();
        })

        // 禁止自定义右键
        document.oncontextmenu = function(ev) {
            var oEvent = ev || event;
            //return false阻止系统自带的菜单，
            //return false必须写在最后，否则自定义的右键菜单也不会出现
            return false;
        }

        var util = new Util();
        window.util = util;
        window.stageClass = new Stage();
        window.bindEventCenter = new BindEventCenter();

    }

    // 右键删除元素
    rightClickConfirm(e){
        pubsub.publish('rightClickConfirm.click');
    }

    // openModelForm 打开视图窗口
    returnModelForm(){
        let currentModalForm = this.state.currentModalForm;

        switch (currentModalForm){
            case 'WorkCenterForm':
                return <WorkCenterForm factoryName={this.state.factoryName}/>;
                break;
            case 'WorkLineForm':
                return <WorkLineForm/>;
                break;
            case 'WorkStationForm':
                return <WorkStationForm/>;
                break;
            case 'WorkUnitForm':
                return <WorkUnitForm/>;
                break;
        }
    }

    //销毁
    componentWillUnmount() {
        pubsub.unsubscribe(`workCenterEditFormSaveButton.click`)
        pubsub.unsubscribe(`bmFactoryFactorySelector.onChange`)
        pubsub.unsubscribe(`bmFactoryClearButton.click`)
        pubsub.unsubscribe(`bmFactorySaveButton.click`)
        pubsub.unsubscribe(`mainLayer.dbclick`)
        pubsub.unsubscribe(`bmFactoryModelingTab.reflash`)
    }

    //不用
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div style={{position:'relative'}}>
                {/*右键做了个删除元素 ， 黑魔法好恶心*/}
                <Popconfirm title={this.state.rightClickPopTitle}   onConfirm={this.rightClickConfirm} okText="是" cancelText="否"  placement="top">
                    <a ref="rightClickPop" style={this.state.rightClickPopStyle}>Delete</a>
                </Popconfirm>


                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>工厂</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true}
                      style={{"marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px"}}
                      bodyStyle={{
                          "paddingTop": "10px",
                          "paddingBottom": "10px",
                          "paddingLeft": "25px",
                          "paddingRight": "25px"
                      }}>
                    <Row>
                        <Col span={8}>
                            <AppButton config={{
                                id: "bmFactorySaveButton",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: []
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "bmFactoryClearButton",
                                title: "清除画布",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                            }}>
                            </AppButton>
                        </Col>

                        <Col span={8} >
                            <Field config={{
                                enabled: true,
                                id: "bmFactoryFactorySelector",
                                label: "工厂",  //标签名称
                                labelSpan: 4,   //标签栅格比例（0-24）
                                wrapperSpan: 20,  //输入框栅格比例（0-24）
                                //showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请选择工厂",
                                tableInfo: {
                                    id: "bmFactoryFactorySelectorList",
                                    size: "small",
                                    rowKey: "gid",
                                    width: "500",
                                    tableTitle: "工厂",
                                    columns: [
                                        {
                                            title: '工厂编码',
                                            dataIndex: 'smBusiUnitGidRef.busiUnitCode',
                                            key: '1',
                                            width: 200
                                        },
                                        {
                                            title: '工厂名称',
                                            dataIndex: 'smBusiUnitGidRef.busiUnitName',
                                            key: '2',
                                            width: 200
                                        }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/sm/busiUnitFunc/query.action',
                                        mode: 'payload',
                                        payload: {
                                            "query": {
                                                "query": [
                                                    {
                                                        "field": "funcGid",
                                                        "type": "eq",
                                                        "value": "55E4572C74781206E055000000000006"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                pageId: 'bmFactoryFactorySelectorPage',
                                displayField: "smBusiUnitGidRef.busiUnitName",
                                valueField: {
                                    "from": "smBusiUnitGid",
                                    "to": "bmFactoryFactorySelector"
                                },
                            }} component={FindbackField} name="bmFactoryFactorySelector"/>
                        </Col>

                        <Col span={8} >
                            <Col span={12}  offset={6}>
                                <span>画布大小：</span>

                                <ButtonGroup>
                                    <Button type="primary" icon="plus" onClick={() => pubsub.publish('stageSize.expand','plus')}/>
                                    <Button type="primary" icon="minus" onClick={() => pubsub.publish('stageSize.expand', 'minus')}/>
                                </ButtonGroup>
                            </Col>
       {/*                     <Col span={8}>
                                <Input  addonAfter="%" value={this.state.stageSize.scale} disabled/>
                            </Col>

                            <Col span={6} >
                                <InputNumber
                                    value={this.state.stageSize.width}
                                    formatter={value => `${value}像素`}
                                    parser={value => value.replace('像素', '')}
                                    min={0}
                                    step="200"
                                    onChange={(value) => pubsub.publish('stageSize.change', {width:value})}
                                />
                            </Col>
                            <Col span={6}>
                                <InputNumber
                                    value={this.state.stageSize.height}
                                    formatter={value => `${value}像素`}
                                    parser={value => value.replace('像素', '')}
                                    min={0}
                                    step="200"
                                    onChange={(value) => pubsub.publish('stageSize.change', {height:value})}
                                />
                            </Col>*/}


{/*                            <Col span={2} offset={5} style={this.labelStyle}>
                                宽度:
                            </Col>
                            <Col span={6} >
                                <InputNumber
                                    value={this.state.stageSize.width}
                                    formatter={value => `${value}像素`}
                                    parser={value => value.replace('像素', '')}
                                    min={0}
                                    step="200"
                                    onChange={(value) => pubsub.publish('stageSize.change', {width:value})}
                                />
                            </Col>
                            <Col span={2} offset={2} style={this.labelStyle}>
                                高度:
                            </Col>
                            <Col span={6}>
                                <InputNumber
                                    value={this.state.stageSize.height}
                                    formatter={value => `${value}像素`}
                                    parser={value => value.replace('像素', '')}
                                    min={0}
                                    step="200"
                                    onChange={(value) => pubsub.publish('stageSize.change', {height:value})}
                                />
                            </Col>*/}
                        </Col>
                    </Row>
                </Card>
                <Row>
                   <Col span={24}>
                       <div id="canvas-main" style={{overflow: 'auto',background:'white'}}></div>
                   </Col>
                </Row>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "10px" }} bodyStyle={{ padding: "10px" }}>
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="工作中心" key="1" forceRender={true}>
                            <AppTable name="bmFactoryDetailsWorkCenterList" config={{
                                "id": "bmFactoryDetailsWorkCenterList",
                                "name": "bmFactoryDetailsWorkCenterList",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "gid",//主键
                                "onLoadData": false,//初始化是否加载数据
                                //"tableTitle": "订单信息",//表头信息
                                "width": "100%",//表格宽度
                                "showSerial": false,//是否显示序号
                                "editType": false,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": true,//是否分页
                                "isSearch": false,//是否显示模糊查询
                                "columns": [
                                    { title: '工作中心编码', width: "20%", dataIndex: 'workCenterCode', key: '1' },
                                    { title: '工作中心名称', width: "20%", dataIndex: 'workCenterName', key: '2' },
                                    { title: '所属工厂', width: "20%", dataIndex: 'factoryInfoGidRef.smBusiUnitGidRef.busiUnitName', key: '3' },
                                    { title: '工作日历', width: "20%",  dataIndex: 'smCalendarGidRef.calendarName', key: '4'},
                                    { title: '备注',  width: "20%", dataIndex: 'remarks', key: '5'}
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    pager:false,
                                    url: '/ime/mdFactoryWorkCenter/query.action'
                                }
                            }} />
                        </TabPane>
                        <TabPane tab="产线" key="2" forceRender={true}>
                            <AppTable name="bmFactoryDetailsWorkLineList" config={{
                                "id": "bmFactoryDetailsWorkLineList",
                                "name": "bmFactoryDetailsWorkLineList",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "gid",//主键
                                "onLoadData": false,//初始化是否加载数据
                                //"tableTitle": "订单信息",//表头信息
                                "width": "100%",//表格宽度
                                "showSerial": false,//是否显示序号
                                "editType": false,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": true,//是否分页
                                "isSearch": false,//是否显示模糊查询
                                "columns": [
                                    { title: '产线编码', width: "18%", dataIndex: 'lineCode', key: '1' },
                                    { title: '产线名称', width: "18%", dataIndex: 'lineName', key: '2' },
                                    { title: '所属工作中心', width: "18%", dataIndex: 'workCenterGidRef.workCenterName', key: '3' },
                                    { title: '产线类型', width: "10%", dataIndex: 'lineType', key: '4' },
                                    { title: '工作日历', width: "18%",  dataIndex: 'smCalendarGidRef.calendarName', key: '5'},
                                    { title: '备注',  width: "18%", dataIndex: 'remarks', key: '6'}
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    pager:false,
                                    url: '/ime/mdFactoryLine/query.action'
                                }
                            }} />
                        </TabPane>
                        <TabPane tab="工作单元" key="3" forceRender={true}>
                            <AppTable name="bmFactoryDetailsWorkUnitList" config={{
                                "id": "bmFactoryDetailsWorkUnitList",
                                "name": "bmFactoryDetailsWorkUnitList",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "gid",//主键
                                "onLoadData": false,//初始化是否加载数据
                                //"tableTitle": "订单信息",//表头信息
                                "width": "100%",//表格宽度
                                "showSerial": false,//是否显示序号
                                "editType": false,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": true,//是否分页
                                "isSearch": false,//是否显示模糊查询
                                "columns": [
                                    { title: '工作单元编码', width: "20%", dataIndex: 'workUnitCode', key: '1' },
                                    { title: '工作单元名称', width: "20%", dataIndex: 'workUnitName', key: '2' },
                                    { title: '所属产线', width: "20%", dataIndex: 'factoryLineGidRef.lineName', key: '3' },
                                    { title: '工作日历', width: "20%",  dataIndex: 'smCalendarGidRef.calendarName', key: '4'},
                                    { title: '备注',  width: "20%", dataIndex: 'remarks', key: '6'}
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    pager:false,
                                    url: '/ime/mdFactoryWorkUnit/query.action'
                                }
                            }} />
                        </TabPane>
                        <TabPane tab="工位" key="4" forceRender={true}>
                            <AppTable name="bmFactoryDetailsWorkStationList" config={{
                                "id": "bmFactoryDetailsWorkStationList",
                                "name": "bmFactoryDetailsWorkStationList",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "gid",//主键
                                "onLoadData": false,//初始化是否加载数据
                                //"tableTitle": "订单信息",//表头信息
                                "width": "100%",//表格宽度
                                "showSerial": false,//是否显示序号
                                "editType": false,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": true,//是否分页
                                "isSearch": false,//是否显示模糊查询
                                "columns": [
                                    { title: '工位编码', width: "20%", dataIndex: 'stationCode', key: '1' },
                                    { title: '工位名称', width: "20%", dataIndex: 'stationName', key: '2' },
                                    { title: '所属工作单元', width: "20%", dataIndex: 'workUnitGidRef.workUnitName', key: '3' },
                                    { title: '工作日历', width: "20%",  dataIndex: 'smCalendarGidRef.calendarName', key: '4'},
                                    { title: '备注',  width: "20%", dataIndex: 'remarks', key: '6'}
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    pager:false,
                                    url: '/ime/mdFactoryWorkStation/query.action'
                                }
                            }} />
                        </TabPane>
                    </Tabs>
                </Card>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "editFormModal", // id，必填*
                    pageId: "editFormModal", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    closable: true, // 是否显示右上角关闭按钮，默认不显示
                    width: "800", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: {top: 120}, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >
                    {this.returnModelForm()}


                </ModalContainer>

            </div>
        );
    }
}

FactoryModelingPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
    form: "FactoryModelingPage",
    validate,
})(FactoryModelingPage)

//export default connect(null, mapDispatchToProps)(BusiGroupForm);