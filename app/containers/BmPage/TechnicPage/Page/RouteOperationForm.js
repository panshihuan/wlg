/*
 *
 * 工作中心属性编辑表单
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
import { fromJS } from "immutable"
import unionBy  from 'lodash/unionBy'

import TextField from 'components/Form/TextField'
import RadiosField from 'components/Form/RadiosField'
import AutoCompleteField from 'components/Form/AutoCompleteField'
import CheckBoxField from 'components/Form/CheckBoxField'
import DateField from 'components/Form/DateField'
import InputNumberField from 'components/Form/InputNumberField'
import SelectField from 'components/Form/SelectField'
import SwitchField from 'components/Form/SwitchField'
import TableField from 'components/Form/TableField'
import TextAreaField from 'components/Form/TextAreaField'
import UploadField from 'components/Form/UploadField'
import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import Immutable from 'immutable'
import { submit } from 'redux-form/immutable'

import CanvasBaseForm from './CanvasBaseForm'


import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'


const validate = values => {
    const errors = {}
    if (!values.get('code')) {
        errors.code = '必填项'
    }

    return errors
}

class RouteOperationForm extends CanvasBaseForm { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props)

        this.pubsubEvents = {
            'routeOperationFormConfirmButton.click': 'routeOperationFormConfirmButton.click'
        }

    }

    componentWillMount() {
    }

    componentDidMount() {
        this.initSubscribe();
        this.initData();
    }

    // 初始化数据
    initData(){
        let shape = this.props.shape;
        let layer = shape.getLayer();
        let shapeData = shape.getAttr('shapeData');
        // 名称和label保持同步
        shapeData.name = shape.getAttr('text');
        //将canvas中的数据同步到表格中去
        pubsub.publish("@@form.init", { id: "RouteOperationForm", data: Immutable.fromJS(shape.getAttr('shapeData')) })
    }

    // 注册事件
    initSubscribe(){
        let _this = this;
        //按钮提交事件
        pubsub.subscribe("routeOperationFormConfirmButton.click", () => {
            resolveFetch({
                fetch: {
                    id: "RouteOperationForm",
                    data: "@@formValues"
                }
            }).then(function (data) {
                window.store.dispatch(submit('RouteOperationForm'));
                let currentForm=window.store.getState().get("form").get('RouteOperationForm');
                let error=false;
                if(currentForm!=undefined)
                {
                    if(currentForm.get('syncErrors')|| currentForm.get('asyncErrors'))
                    {
                        error=true
                    }
                }
                if(!error){
                    let shape = _this.props.shape;
                    let layer = shape.getLayer();
                    if(data){
                        shape.setAttr('shapeData',data);
                        shape.setAttr('text',data.name);
                        layer.draw();
                        pubsub.publish('technicFormModal.onCancel');
                        //根据选中的工序模板，导入相关联的设备到设备列表中
                        let dataSource= {type: "api",method: "POST",url: "/ime/mdDefOperation/findDtoById.action?id="+data.mdDefOperationGid};
                        resolveDataSource({dataSource:dataSource}).then(function(res){

                            let mdData = res.data.defEquipmentExtList

                            for(var i = 0;i<mdData.length;i++){
                                mdData[i].mdDefOperationCode = res.data.mdDefOperationCode
                                mdData[i].mdDefOperationName = res.data.mdDefOperationName
                                mdData[i].mdDefOperationGid = res.data.mdDefOperationGid
                            }

                            // 获取数据
                            let  mdRouteEquipmentForm = window.store.getState().get("form").get('mdRouteEquipmentForm');
                            if(!mdRouteEquipmentForm){
                                pubsub.publish("@@form.change", { id: "mdRouteEquipmentForm",name:"routeEquipmentQueryList" ,value: fromJS(mdData) })
                            } else {
                                let routeEquipmentQueryList = mdRouteEquipmentForm.toJS().values.routeEquipmentQueryList || []
                                let imeArr = unionBy(routeEquipmentQueryList.concat(mdData), 'mdDefOperationCode');
                                pubsub.publish("@@form.change", { id: "mdRouteEquipmentForm",name:"routeEquipmentQueryList" ,value: fromJS(imeArr) })
                            }
                        });
                    }
                }

            })
        })
    }


    componentWillUnmount() {
        super.componentWillUnmount()
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>工序</Breadcrumb.Item>
                    <Breadcrumb.Item>编辑属性</Breadcrumb.Item>
                </Breadcrumb>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                id: "routeOperationFiled0101",
                                form:"RouteOperationForm",
                                label: "工序编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入编码",

                                tableInfo: {
                                    id: "mdDefOperatioinTemp00",
                                    size: "small",
                                    rowKey: "gid",
                                    tableTitle: "信息",
                                    showSerial: true,  //序号
                                    width:1500,
                                    columns: [
                                        { title: '工序编码', width: 150, dataIndex: 'mdDefOperationCode', key: '1' },
                                        { title: '工序名称', width: 80, dataIndex: 'mdDefOperationName', key: '2' },
                                        { title: '工序类型', width: 50, dataIndex: 'mdDefOperationTypeName', key: '3' },
                                        { title: '工作中心', width: 150, dataIndex: 'mdFactoryWorkCenterName', key: '4' },
                                        { title: '产线', width: 150, dataIndex: 'mdFactoryLineName', key: '5' },
                                        { title: '工作单元', width: 150, dataIndex: 'mdFactoryWorkUnitName', key: '6' },
                                        { title: '工位', width: 150, dataIndex: 'mdFactoryStationName', key: '7' },
                                        { title: '加工方式', width: 50, dataIndex: 'processingModeName', key: '8' },
                                        { title: '是否质检', width: 50, dataIndex: 'processTest', key: '9' },
                                        { title: '派工单产生', width: 100, dataIndex: 'worksheetGenarationModeName', key: '10' },
                                        { title: '报工方式', width: 180, dataIndex: 'businessModeName', key: '11' },
                                        { title: '节拍', width: 50, dataIndex: 'rhythm', key: '12' },
                                        { title: '节拍类型', width: 50, dataIndex: 'rhythmTypeName', key: '13' },
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/ime/mdDefOperation/query.action'
                                    }
                                },
                                pageId: 'routeOperationTable0101',
                                displayField: "mdDefOperationCode",
                                valueField: {
                                    "from": "mdDefOperationCode",
                                    "to": "code"
                                },
                                associatedFields: [
                                    {
                                        "from": "mdDefOperationName",
                                        "to": "name"
                                    },
                                    {
                                        "from": "mdDefOperationTypeGid",
                                        "to": "mdDefOperationTypeGid"
                                    },
                                    {
                                        "from": "mdFactoryWorkCenterName",
                                        "to": "mdFactoryWorkCenterName"
                                    },
                                    {
                                        "from": "mdFactoryWorkCenterGid",
                                        "to": "mdFactoryWorkCenterGid"
                                    },
                                    {
                                        "from": "mdFactoryLineName",
                                        "to": "mdFactoryLineName"
                                    },
                                    {
                                        "from": "mdFactoryLineGid",
                                        "to": "mdFactoryLineGid"
                                    },
                                    {
                                        "from": "mdFactoryWorkUnitName",
                                        "to": "mdFactoryWorkUnitName"
                                    },
                                    {
                                        "from": "mdFactoryWorkUnitGid",
                                        "to": "mdFactoryWorkUnitGid"
                                    },
                                    {
                                        "from": "mdFactoryStationName",
                                        "to": "mdFactoryStationName"
                                    },
                                    {
                                        "from": "mdFactoryStationGid",
                                        "to": "mdFactoryStationGid"
                                    },
                                    {
                                        "from": "processingModeGid",
                                        "to": "processingModeGid"
                                    },
                                    {
                                        "from": "processTest",
                                        "to": "processTest"
                                    },
                                    {
                                        "from": "worksheetGenarationModeGid",
                                        "to": "worksheetGenarationModeGid"
                                    },
                                    {
                                        "from": "businessModeGid",
                                        "to": "businessModeGid"
                                    },
                                    {
                                        "from": "rhythm",
                                        "to": "rhythm"
                                    },
                                    {
                                        "from": "rhythmTypeGid",
                                        "to": "rhythmTypeGid"
                                    },
                                    {
                                        "from": "mdDefOperationGid",
                                        "to": "mdDefOperationGid"
                                    }
                                ]
                            }} component={FindbackField} name="code" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "routeOperationFiled0102",
                                form:"RouteOperationForm",
                                label: "工序名称",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                //showRequiredStar: true,  //是否显示必填星号
                                //placeholder: "请输入名称",

                            }} component={TextField} name="name" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "routeOperationFiled0103",
                                form:"RouteOperationForm",
                                label: "工序类型",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请输入版本",
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload:{
                                        "query":{
                                            "query":[
                                                {"field":"smDictionaryEnumGid","type":"eq","value":"5627BE1FB43E0FE1E055000000000001"}
                                            ],
                                            "sorted":"seq"
                                        }
                                    }
                                },
                                displayField: "val",
                                valueField: "gid"
                            }} component={SelectField} name="mdDefOperationTypeGid" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "routeOperationFiled0104",
                                form:"RouteOperationForm",
                                label: "工作中心",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                tableInfo: {
                                    id: "tableId555jjkdjkljkldjd",
                                    size: "small",
                                    rowKey: "gid",
                                    width:100,
                                    tableTitle: "工作中心",
                                    style:{top:80},
                                    //onLoadData: false,
                                    columns: [
                                        { title: '工作中心编码', width: 200, dataIndex: 'workCenterCode', key: '24567y' },
                                        { title: '工作中心名称', width: 200, dataIndex: 'workCenterName', key: '36yyhhh' },
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/ime/mdFactoryWorkCenter/query.action',
                                    }
                                },
                                pageId: 'routeOperationTable0102',
                                displayField: "mdFactoryWorkCenterName",
                                valueField: {
                                    "from": "workCenterName",
                                    "to": "mdFactoryWorkCenterName"
                                },
                                associatedFields: [
                                    {
                                        "from": "gid",
                                        "to": "mdFactoryWorkCenterGid"
                                    }
                                ]
                            }} component={FindbackField} name="mdFactoryWorkCenterName" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                id: "routeOperationFiled0105",
                                form:"RouteOperationForm",
                                label: "产线",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                subscribes: [
                                    {
                                        event: "routeOperationFiled0104.onChange",
                                        pubs: [
                                            {
                                                event: "routeOperationFiled0105.expression",//在某个组件上执行表达式
                                                meta: {
                                                    expression: `
                            me.dataContext={gid:data.eventPayload.gid}
                          `
                                                }
                                            }
                                        ]
                                    }
                                ],
                                tableInfo: {
                                    id: "tableIkkkkdlldgge",
                                    size: "small",
                                    rowKey: "gid",
                                    width:100,
                                    tableTitle: "产线",
                                    //onLoadData: false,
                                    showSerial: true,
                                    columns: [
                                        { title: '产线编码', dataIndex: 'lineCode', key: '9', width: 200 },
                                        { title: '产线名称', dataIndex: 'lineName', key: '10', width: 200 },
                                    ],
                                    subscribes: [
                                        {
                                            event: "tableIkkkkdlldgge.onTableTodoAny",
                                            behaviors: [
                                                {
                                                    type: "fetch",
                                                    id: "routeOperationFiled0105", //要从哪个组件获取数据
                                                    data: "dataContext",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "tableIkkkkdlldgge.loadData",
                                                            eventPayloadExpression:`
                                let payload ={}
                                if(eventPayload != undefined){
                                  payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "workCenterGid", "type": "eq", "value": eventPayload.gid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                                }
                                 callback(payload)
                              `
                                                        }
                                                    ]
                                                }
                                            ],
                                        }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        mode:"payload&&eventPayload",
                                        url: '/ime/mdFactoryLine/query.action',
                                    }
                                },
                                pageId: 'routeOperationTable0103',
                                displayField: "mdFactoryLineName",
                                valueField: {
                                    "from": "lineName",
                                    "to": "mdFactoryLineName"
                                },
                                associatedFields: [
                                    {
                                        "from": "gid",
                                        "to": "mdFactoryLineGid"
                                    }
                                ]
                            }} component={FindbackField} name="mdFactoryLineName" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "routeOperationFiled0106",
                                form:"RouteOperationForm",
                                label: "工作单元",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                tableInfo: {
                                    id: "tableIkwkkdlldgge",
                                    size: "small",
                                    rowKey: "gid",
                                    width:100,
                                    tableTitle: "工作单元",
                                    columns: [
                                        { title: '工作单元编码', dataIndex: 'workUnitCode', key: '9', width: 200 },
                                        { title: '工作单元名称', dataIndex: 'workUnitName', key: '10', width: 200 },
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/ime/mdFactoryWorkUnit/query.action',
                                    }
                                },
                                pageId: 'routeOperationTable0104',
                                displayField: "mdFactoryWorkUnitName",
                                valueField: {
                                    "from": "workUnitName",
                                    "to": "mdFactoryWorkUnitName"
                                },
                                associatedFields: [
                                    {
                                        "from": "gid",
                                        "to": "mdFactoryWorkUnitGid"
                                    }
                                ]
                            }} component={FindbackField} name="mdFactoryWorkUnitName" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "routeOperationFiled0107",
                                form:"RouteOperationForm",
                                label: "工位",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                tableInfo: {
                                    id: "tableIkwkvdlldgge",
                                    size: "small",
                                    rowKey: "gid",
                                    width:100,
                                    tableTitle: "工位",
                                    columns: [
                                        { title: '工位编码', dataIndex: 'stationCode', key: '9', width: 200 },
                                        { title: '工位名称', dataIndex: 'stationName', key: '10', width: 200 },
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/ime/mdFactoryWorkStation/query.action',
                                    }
                                },
                                pageId: 'routeOperationTable0105',
                                displayField: "mdFactoryStationName",
                                valueField: {
                                    "from": "stationName",
                                    "to": "mdFactoryStationName"
                                },
                                associatedFields: [
                                    {
                                        "from": "gid",
                                        "to": "mdFactoryStationGid"
                                    }
                                ]
                            }} component={FindbackField} name="mdFactoryStationName" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "routeOperationFiled0108",
                                form:"RouteOperationForm",
                                label: "加工方式",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload:{
                                        "query":{
                                            "query":[
                                                {"field":"smDictionaryEnumGid","type":"eq","value":"5627BE1FB43F0FE1E055000000000001"}
                                            ],
                                            "sorted":"seq"
                                        }
                                    }
                                },
                                displayField: "val",
                                valueField: "gid"
                            }} component={SelectField} name="processingModeGid" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                id: "routeOperationFiled0111",
                                form:"RouteLineForm",
                                label: "报工方式",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload:{
                                        "query":{
                                            "query":[
                                                {"field":"smDictionaryEnumGid","type":"eq","value":"5628CF31424726A8E055000000000001"}
                                            ],
                                            "sorted":"seq"
                                        }
                                    },
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} component={SelectField} name="businessModeGid" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "routeOperationFiled0110",
                                form:"RouteLineForm",
                                label: "派工单产生",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload:{
                                        "query":{
                                            "query":[
                                                {"field":"smDictionaryEnumGid","type":"eq","value":"5628CF31424826A8E055000000000001"}
                                            ],
                                            "sorted":"seq"
                                        }
                                    },
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} component={SelectField} name="worksheetGenarationModeGid" />
                        </Col>
                        <Col span={4}>
                            <Field config={{
                                id: "routeOperationFiled0113",
                                form:"RouteOperationForm",
                                label: "节拍",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="rhythm" />
                        </Col>
                        <Col span={4}>
                            <Field config={{
                                id: "routeOperationFiled0114",
                                form:"RouteOperationForm",
                                label: "节拍类型",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload:{
                                        "query":{
                                            "query":[
                                                {"field":"smDictionaryEnumGid","type":"eq","value":"56354B1899A83E18E055000000000001"}
                                            ],
                                            "sorted":"seq"
                                        }
                                    }
                                },
                                displayField: "val",
                                valueField: "gid"
                            }} component={SelectField} name="rhythmTypeGid" />
                        </Col>
                        <Col span={3}>
                            <Field config={{
                                id: "routeOperationFiled0109",
                                form:"RouteOperationForm",
                                label: "是否质检",  //标签名称
                                labelSpan: 16,   //标签栅格比例（0-24）
                                wrapperSpan: 8,  //输入框栅格比例（0-24）
                                isNumber: true,
                                checkedChildren:"是",
                                unCheckedChildren:"否"
                            }} component={SwitchField} name="processTest" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <AppButton config={{
                                id: "routeOperationFormConfirmButton",
                                title: "确定",
                                visible: true,
                                enabled: true,
                                type: "primary",
                            }}></AppButton>
                            <AppButton config={{
                                id: "routeOperationFormCancelButton",
                                title: "取消",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "routeOperationFormCancelButton.click",
                                        pubs:[{
                                            event: "technicFormModal.onCancel",
                                        }]
                                    }
                                ]
                            }}></AppButton>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}

RouteOperationForm.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        onSubmit:()=>{}
    };
}

let RouteOperationFormForm = reduxForm({
    form: "RouteOperationForm",
    validate,
})(RouteOperationForm)

export default connect(null, mapDispatchToProps)(RouteOperationFormForm);
