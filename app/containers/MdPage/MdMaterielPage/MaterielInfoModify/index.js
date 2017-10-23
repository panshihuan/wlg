

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col,Tabs } from 'antd';
import { Link } from 'react-router';
import AppButton from 'components/AppButton';
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

import TextField from 'components/Form/TextField'
import SelectField from 'components/Form/SelectField'
import TableField from 'components/Form/TableField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import CheckBoxField from 'components/Form/CheckBoxField'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil';

import pubsub from 'pubsub-js'
import Immutable from 'immutable'

const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}
    if (!values.get('code')) {
        errors.code = '必填项'
    }
    return errors
}
const asyncValidate = values => {
    let dataSource = {
        mode: "dataContext",
        type: "api",
        method: "POST",
        url: "/sm/checkUnique/check.action",
    }
    let className = "com.neusoft.ime.md.mdMaterielInfo.dto.MdMaterielInfoDTO";
    let fieldNames = "code,delete";
    let fieldValues = values.get('code') + ",0";
    let gid = values.get('gid');

    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:gid,  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {

        resolve(res)
    })).then(function (res) {
        if(!res.data){
            throw { code: "已存在" }
        }

    })

}
export class MaterielInfoModify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function


    constructor(props) {
        super(props);

        if(this.props.location.state[0]!=undefined){

            console.log(this.props.location.state[0])
            pubsub.publish("@@form.init", { id: "MaterielInfoModify", data: Immutable.fromJS(this.props.location.state[0]) })
            // pubsub.publish("mdMaterielInfo0103.dataContext", { eventPayload: this.props.location.state[0]})

        }

    }


    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>物料</Breadcrumb.Item>
                    <Breadcrumb.Item>物料详情</Breadcrumb.Item>
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
                        <Col span={8} xs={24}>

                            <AppButton config={{
                            id: "mdMaterielInfo0103",
                            title: "保存",
                            visible: true,
                            enabled: true,
                            type: "primary",
                            subscribes: [
                            {
                            event: "mdMaterielInfo0103.click",
                            behaviors: [
                            {
                            type: "request",
                            dataSource: {
                            type: "api",
                            method: "POST",
                            url: "/ime/mdMaterielInfo/modify.action?id="+this.props.location.state[0].gid,
                            withForm: "MaterielInfoModify"
                            },
                            successPubs: [  //获取数据完成后要发送的事件
                            {
                            event: "@@navigator.push",
                            payload: {
                            url: "/mdMateriel"
                            }
                            }, {
                            event: "@@message.success",
                            payload: "修改成功"
                            }
                            ],
                            errorPubs: [
                            {
                            event: "@@message.error",
                            payload: "修改失败"
                            }
                            ]
                            }
                            ],
                            }
                            ]
                            }}/>
                            <AppButton config={{
                                id: "mdMaterielInfo0102",
                                title: "取消",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "mdMaterielInfo0102.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "/mdMateriel"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}/>


                        </Col>

                    </Row>
                </Card>
                <Card bordered={true}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="基本信息" key="1">
                            <Row>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "code",
                                        label: "物料编码",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入编码",
                                    }} component={TextField} name="code" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "name",
                                        label: "物料名称",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入名称",
                                    }} component={TextField} name="name" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "materielTypeGidRef.name",
                                        label: "物料类型",
                                        form:"MaterielInfoModify",
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）

                                        tableInfo: {
                                            id: "tablewuliao0101",
                                            size: "small",
                                            rowKey: "gid",
                                            width:100,
                                            tableTitle: "物料类型",
                                            columns: [
                                                { title: '物料类型编码', dataIndex: 'code', key: '1', width: 100 },
                                                { title: '物料类型名称', dataIndex: 'name', key: '2', width: 100 },
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/ime/mdMaterielType/query.action',
                                            }
                                        },
                                        pageId: 'findBackwuliao0102',
                                        displayField: "materielTypeGidRef.name",
                                        valueField: {
                                            "from": "name",
                                            "to": "materielTypeGidRef.name"
                                        },
                                        associatedFields: [
                                            {
                                                "from": "gid",
                                                "to": "materielTypeGid"
                                            }
                                        ],

                                    }} name="materielTypeGidRef.name" component={FindbackField} />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "measurementUnitGidRef.name",
                                        label: "主单位",
                                        form:"MaterielInfoModify",
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）

                                        tableInfo: {
                                            id: "tabledanwei0102",
                                            size: "small",
                                            rowKey: "gid",
                                            width:100,
                                            tableTitle: "计量单位 ",
                                            columns: [
                                                { title: '计量单位编码', dataIndex: 'code', key: '1', width: 100 },
                                                { title: '计量单位名称', dataIndex: 'name', key: '2', width: 100 },
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/ime/mdMeasurementUnit/query.action',
                                            }
                                        },
                                        pageId: 'findBackdanwei0103',
                                        displayField: "measurementUnitGidRef.name",
                                        valueField: {
                                            "from": "name",
                                            "to": "measurementUnitGidRef.name"
                                        },
                                        associatedFields: [
                                            {
                                                "from": "gid",
                                                "to": "measurementUnitGid"
                                            }
                                        ],

                                    }} name="measurementUnitGidRef.name" component={FindbackField} />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "spec",
                                        label: "规格",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入规格",
                                    }} component={TextField} name="spec" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "model",
                                        label: "型号",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入型号",
                                    }} component={TextField} name="model" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "materialWarehouseRef.warehouseName",
                                        label: "默认仓库",
                                        form:"MaterielInfoModify",
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）

                                        tableInfo: {
                                            id: "tablecangku0102",
                                            size: "small",
                                            rowKey: "gid",
                                            width:100,
                                            tableTitle: "仓库 ",
                                            columns: [
                                                { title: '仓库编码', dataIndex: 'warehouseCode', key: '1', width: 100 },
                                                { title: '仓库名称', dataIndex: 'warehouseName', key: '2', width: 100 },
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/ime/mdWarehouse/query.action',
                                            }
                                        },
                                        pageId: 'findBackcangku0103',
                                        displayField: "materialWarehouseRef.warehouseName",
                                        valueField: {
                                            "from": "warehouseName",
                                            "to": "materialWarehouseRef.warehouseName"
                                        },
                                        associatedFields: [
                                            {
                                                "from": "gid",
                                                "to": "materialWarehouse"
                                            }
                                        ],

                                    }} name="materialWarehouseRef.warehouseName" component={FindbackField} />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        id: "sourceMode",
                                        label: "物料来源方式",  //标签名称
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
                                                        {"field":"smDictionaryEnumGid","type":"eq","value":"563553CDEB433E07E055000000000001"}
                                                    ],
                                                    "sorted":"seq"
                                                }
                                            },
                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    }} component={SelectField} name="sourceMode" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "abbreviation",
                                        label: "简称",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入简称",
                                    }} component={TextField} name="abbreviation" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "alias",
                                        label: "别名",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入别名",
                                    }} component={TextField} name="alias" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "versionNumber",
                                        label: "版本号",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入版本号",
                                    }} component={TextField} name="versionNumber" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "figureNumber",
                                        label: "图号",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入图号",
                                    }} component={TextField} name="figureNumber" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Field config={{
                                        id: "packWay",
                                        label: "包装方式",  //标签名称
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
                                                        {"field":"smDictionaryEnumGid","type":"eq","value":"585A3538E4747896E055000000000001"}
                                                    ],
                                                    "sorted":"seq"
                                                }
                                            },
                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    }} component={SelectField} name="packWay" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "packNumber",
                                        label: "包装数量",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={TextField} name="packNumber" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "equipment",
                                        label: "是否设备",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="equipment" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "resources",
                                        label: "是否资源",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="resources" />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="工艺信息" key="2">
                            <Row>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "technicsProcessGidRef.name",
                                        label: "主工艺路线",
                                        form:"MaterielInfoModify",
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）

                                        tableInfo: {
                                            id: "tablegongyi0101",
                                            size: "small",
                                            rowKey: "gid",
                                            width:100,
                                            tableTitle: "工艺",
                                            columns: [
                                                { title: '工艺路线编码', dataIndex: 'routeLineCode', key: '1', width: 100 },
                                                { title: '工艺路线名称', dataIndex: 'routeLineName', key: '2', width: 100 },
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/ime/mdRouteLine/query.action',
                                            }
                                        },
                                        pageId: 'findBackgongyi0102',
                                        displayField: "technicsProcessGidRef.name",
                                        valueField: {
                                            "from": "routeLineName",
                                            "to": "technicsProcessGidRef.name"
                                        },
                                        associatedFields: [
                                            {
                                                "from": "gid",
                                                "to": "technicsProcessGid"
                                            }
                                        ],

                                    }} name="technicsProcessGidRef.name" component={FindbackField} />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "substitute",
                                        label: "代替件",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="substitute" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "replacementPart",
                                        label: "替换件",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="replacementPart" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "barCodeManagement",
                                        label: "条码管理",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="barCodeManagement" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "serialNumManagement",
                                        label: "序列号管理",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="serialNumManagement" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "productionPath",
                                        label: "允许生成路径",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="productionPath" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "taktTime",
                                        label: "生产节拍",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入生产节拍",
                                    }} component={TextField} name="taktTime" />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="质量信息" key="3">
                            <Row>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "qualityAssurance",
                                        label: "启用质量管理",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="qualityAssurance" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        id: "inspectionMode",
                                        label: "检验方式",  //标签名称
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
                                                        {"field":"smDictionaryEnumGid","type":"eq","value":"5635A6275A1B3F5EE055000000000001"}
                                                    ],
                                                    "sorted":"seq"
                                                }
                                            },
                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    }} component={SelectField} name="inspectionMode" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        id: "inspectionType",
                                        label: "检验类别",  //标签名称
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
                                                        {"field":"smDictionaryEnumGid","type":"eq","value":"5635A6275A1C3F5EE055000000000001"}
                                                    ],
                                                    "sorted":"seq"
                                                }
                                            },
                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    }} component={SelectField} name="inspectionType" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "traceBack",
                                        label: "是否追溯",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="traceBack" />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="生产信息" key="4">
                            <Row>
                                <Col span={6}>
                                    <Field config={{
                                        id: "materialWay",
                                        label: "领料方式",  //标签名称
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
                                                        {"field":"smDictionaryEnumGid","type":"eq","value":"56272988A1791D58E156200100000001"}
                                                    ],
                                                    "sorted":"seq"
                                                }
                                            },
                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    }} component={SelectField} name="materialWay" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "productionBatch",
                                        label: "生产批次",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="productionBatch" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "dailyWorkNum",
                                        label: "报工批量",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入报工批量",
                                    }} component={TextField} name="dailyWorkNum" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "minProductionNum",
                                        label: "最低生产量",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入最低生产量",
                                    }} component={TextField} name="minProductionNum" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "personGidRef.personnelName",
                                        label: "计划员",
                                        form:"MaterielInfoModify",
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）

                                        tableInfo: {
                                            id: "tablerenyuan0102",
                                            size: "small",
                                            rowKey: "gid",
                                            width:100,
                                            tableTitle: "人员 ",
                                            columns: [
                                                { title: '人员编码', dataIndex: 'personnelCode', key: '1', width: 100 },
                                                { title: '人员名称', dataIndex: 'personnelName', key: '2', width: 100 },
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/sm/personnel/query.action',
                                            }
                                        },
                                        pageId: 'findBackrenyuan0103',
                                        displayField: "personGidRef.personnelName",
                                        valueField: {
                                            "from": "personnelName",
                                            "to": "personGidRef.personnelName"
                                        },
                                        associatedFields: [
                                            {
                                                "from": "gid",
                                                "to": "personGid"
                                            }
                                        ],

                                    }} name="personGidRef.personnelName" component={FindbackField} />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "productionMultiple",
                                        label: "生产倍数",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入生产倍数",
                                    }} component={TextField} name="productionMultiple" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "workCenterGidRef.workCenterName",
                                        label: "生产单位",
                                        form:"MaterielInfoModify",
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）

                                        tableInfo: {
                                            id: "tablegongzuozhongxin0102",
                                            size: "small",
                                            rowKey: "gid",
                                            width:100,
                                            tableTitle: "工作中心",
                                            columns: [
                                                { title: '工作中心编码', dataIndex: 'workCenterCode', key: '1', width: 100 },
                                                { title: '工作中心名称', dataIndex: 'workCenterName', key: '2', width: 100 },
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/ime/mdFactoryWorkCenter/query.action',
                                            }
                                        },
                                        pageId: 'findBackgongzuozhongxin0103',
                                        displayField: "workCenterGidRef.workCenterName",
                                        valueField: {
                                            "from": "workCenterName",
                                            "to": "workCenterGidRef.workCenterName"
                                        },
                                        associatedFields: [
                                            {
                                                "from": "gid",
                                                "to": "workCenterGid"
                                            }
                                        ],

                                    }} name="workCenterGidRef.workCenterName" component={FindbackField} />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        enabled: true,
                                        id: "pieLot",
                                        label: "派工批量",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入派工批量",
                                    }} component={TextField} name="pieLot" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Field config={{
                                        id: "dailyWorkMode",
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
                                                        {"field":"smDictionaryEnumGid","type":"eq","value":"5635A6275A1F3F5EE055000000000001"}
                                                    ],
                                                    "sorted":"seq"
                                                }
                                            },
                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    }} component={SelectField} name="dailyWorkMode" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        id: "dispatchingMode",
                                        label: "派工方式",  //标签名称
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
                                                        {"field":"smDictionaryEnumGid","type":"eq","value":"5635A6275A203F5EE055000000000001"}
                                                    ],
                                                    "sorted":"seq"
                                                }
                                            },
                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    }} component={SelectField} name="dispatchingMode" />
                                </Col>
                                <Col span={6}>
                                    <Field config={{
                                        id: "sequentialMode",
                                        label: "转序方式",  //标签名称
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
                                                        {"field":"smDictionaryEnumGid","type":"eq","value":"5635A6275A213F5EE055000000000001"}
                                                    ],
                                                    "sorted":"seq"
                                                }
                                            },
                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    }} component={SelectField} name="sequentialMode" />
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );
    }
}

MaterielInfoModify.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

function mapStateToProps(props) {
    return {
        onSubmit:()=>{debugger}
    };
}

let MaterielInfoModifyForm =  reduxForm({
    form: "MaterielInfoModify",
    validate,
    asyncValidate,
    asyncBlurFields: ['code']
})(MaterielInfoModify)
export default connect(mapStateToProps, mapDispatchToProps)(MaterielInfoModifyForm);
