import React, { PropTypes } from 'react';
import CanvasCore from '../../Components/CanvasCore';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col,Tabs } from 'antd';
import AppTable from '../../../../../components/AppTable';
import TextField from 'components/Form/TextField'
import SelectField from 'components/Form/SelectField'
import TableField from 'components/Form/TableField'
import FindbackField from 'components/Form/FindbackField'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'
const TabPane = Tabs.TabPane;


class Footer extends CanvasCore {
    //构造
    constructor(props) {
        super(props);
        this.state = {
            tabContentDisplay: false
        }
    }

    //不用
    componentWillMount() {
    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {
    }
    //销毁
    componentWillUnmount() {

    }

    //不用
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div className='footer'>
                <Tabs defaultActiveKey="1" className={this.state.tabContentDisplay ? 'show' : 'hidden'}>
                    <TabPane tab="工序信息" key="1" forceRender={true}>
                        <AppTable name="bmTechnicalProcessList" config={{
                            "id": "bmTechnicalProcessList",
                            "name": "bmTechnicalProcessList",
                            "type": "checkbox",//表格单选复选类型
                            "size": "default",//表格尺寸
                            "rowKey": "code",//主键
                            "onLoadData": false,//初始化是否加载数据
                            "width": "100%",//表格宽度
                            "showSerial": false,//是否显示序号
                            "editType": false,//是否增加编辑列
                            "isPager": false,//是否分页
                            "isSearch": false,//是否显示模糊查询
                            "columns": [
                                { title: '序号', width: "5%", dataIndex: 'sortNum', key: '0' },
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

                            ]
                        }} />
                    </TabPane>
                    <TabPane tab="设备" key="2">
                        <Row>
                            <Col span={24}>
                                <FieldArray name="routeEquipmentQueryList" config={{
                                    "id": "mdRouteEquipmentTable01",
                                    "name": "mdRouteEquipmentTable01",
                                    "rowKey": "id",
                                    "showSelect":true, //是否显示选择框
                                    "columns": [
                                        {
                                            "id": "sbTabSelectFiled01",
                                            "type": "selectField",
                                            "title": "需求方式",
                                            "name": "demandModeGid",
                                            dataSource: {
                                                type: "api",
                                                method:"post",
                                                url:"/sm/dictionaryEnumValue/query.action",
                                                mode:"payload",
                                                payload:{
                                                    "query":{
                                                        "query":[
                                                            {"field":"smDictionaryEnumGid","type":"eq","value":"56E9CDAAE31B53F5E055000000000001"}
                                                        ],
                                                        "sorted":"seq"
                                                    }
                                                }
                                            },
                                            displayField: "val",
                                            valueField: "gid"
                                        },
                                        {
                                            "id": "sbTabSelectFiled02",
                                            "type": "selectField",
                                            "title": "需求规则",
                                            "name": "demandRuleGid",
                                            dataSource: {
                                                type: "api",
                                                method:"post",
                                                url:"/sm/dictionaryEnumValue/query.action",
                                                mode:"payload",
                                                payload:{
                                                    "query":{
                                                        "query":[
                                                            {"field":"smDictionaryEnumGid","type":"eq","value":"56E9CDAAE31C53F5E055000000000001"}
                                                        ],
                                                        "sorted":"seq"
                                                    }
                                                }
                                            },
                                            displayField: "val",
                                            valueField: "gid"
                                        },
                                        {
                                            "id": "sbTabFindbackField01",
                                            "type": "findbackField",
                                            "title": "设备编码",
                                            "form": "mdRouteEquipmentForm",
                                            "name": "mdEquipmentCode",

                                            tableInfo: {
                                                id: "tapdjbdvchaskjcnda",
                                                size: "small",
                                                rowKey: "gid",
                                                tableTitle: "设备信息",
                                                showSerial: true,  //序号
                                                width:100,
                                                columns: [
                                                    { title: '设备编码', width: 150, dataIndex: 'code', key: '1' },
                                                    { title: '设备名称', width: 150, dataIndex: 'name', key: '2' },
                                                    { title: '设备类型', width: 150, dataIndex: 'mdEquipmentTypeGidRef.name', key: '3' },
                                                ],
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'post',
                                                    url: '/ime/mdEquipment/query.action'
                                                }
                                            },
                                            pageId: 'tableFijoshahhfkae',
                                            displayField: "mdEquipmentCode",
                                            valueField: {
                                                "from": "code",
                                                "to": "mdEquipmentCode"
                                            },
                                            associatedFields: [
                                                {
                                                    "from": "name",
                                                    "to": "mdEquipmentName"
                                                },
                                                {
                                                    "from": "mdEquipmentTypeGidRef.name",
                                                    "to": "mdEquipmentType"
                                                },
                                                {
                                                    "from": "gid",
                                                    "to": "mdEquipmentGid"
                                                },
                                            ]
                                        },
                                        {
                                            "id": "sbTabTextFiled01",
                                            "type": "textField",
                                            "title": "设备名称",
                                            "name": "mdEquipmentName",
                                            "enabled": false
                                        },
                                        {
                                            "id": "sbTabTextFiled02",
                                            "type": "textField",
                                            "title": "设备类型",
                                            "name": "mdEquipmentType",
                                            "enabled": false
                                        },
                                        {
                                            "id": "sbTabFindbackField15",
                                            "type": "findbackField",
                                            "title": "工序编码",
                                            "form": "mdRouteEquipmentForm",
                                            "name": "mdDefOperationCode",
                                            tableInfo: {
                                                id: "tapdjbdvchaskjcnda",
                                                size: "small",
                                                rowKey: "gid",
                                                tableTitle: "工序信息",
                                                showSerial: true,  //序号
                                                //onLoadData: false,
                                                width:100,
                                                columns: [
                                                    { title: '工序编码', width: 150, dataIndex: 'mdDefOperationCode', key: '1' },
                                                    { title: '工序名称', width: 150, dataIndex: 'mdDefOperationName', key: '2' },
                                                ],

                                                dataSource: {
                                                    type: 'api',
                                                    method: 'post',
                                                    url: '/ime/mdDefOperation/query.action',
                                                    bodyExpression:`
                                  resolveFetch({fetch:{id:'bmTechnicalProcessList',data:'state'}}).then(function(data){
                                    let operationDtos = data.dataSource
                                    let gids = ''
                                    if(operationDtos){
                                        for(var i=0;i<operationDtos.length;i++){
                                            if(operationDtos[i].mdDefOperationGid){
                                                 gids += operationDtos[i].mdDefOperationGid + ","
                                            }
                                        }
                                    }
                                    console.log(gids)
                                    callback({
                                        "query": {
                                          "query": [
                                            {
                                              "field": "mdDefOperationGid", "type": "in","value": gids.substring(0, gids.lastIndexOf(","))
                                            }
                                          ],
                                         // "sorted": "gid asc"
                                        },
                                        "pager":{
                                            "page":1,
                                            "pageSize":10
                                        }
                                    })
                                  })
                                  `
                                                }
                                            },
                                            pageId: 'tableFijoshahhjvsjoe',
                                            displayField: "mdDefOperationCode",
                                            valueField: {
                                                "from": "mdDefOperationCode",
                                                "to": "mdDefOperationCode"
                                            },
                                            associatedFields: [
                                                {
                                                    "from": "mdDefOperationName",
                                                    "to": "mdDefOperationName"
                                                },
                                                {
                                                    "from": "mdDefOperationGid",
                                                    "to": "mdDefOperationGid"
                                                }
                                            ],
                                        },

                                        {
                                            "id": "sbTabTextFiled16",
                                            "type": "textField",
                                            "title": "工序名称",
                                            "name": "mdDefOperationName",
                                            "enabled": false
                                        },
                                        {
                                            "id": "sbTabTextFiled03",
                                            "type": "textField",
                                            "title": "设备数量",
                                            "name": "equipmentNumber",
                                            "enabled": true
                                        },
                                        {
                                            "id": "sbTabFindbackField012",
                                            "type": "findbackField",
                                            "title": "设备日历",
                                            "form": "mdRouteEquipmentForm",
                                            "name": "equipmentCalendarName",

                                            tableInfo: {
                                                id: "tapdjicdjijiaknda",
                                                size: "small",
                                                rowKey: "gid",
                                                tableTitle: "日历信息",
                                                showSerial: true,  //序号
                                                width:100,
                                                columns: [
                                                    { title: '日历编码', width: 200, dataIndex: 'calendarCode', key: '1' },
                                                    { title: '日历名称', width: 200, dataIndex: 'calendarName', key: '2' },

                                                ],
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'post',
                                                    url: '/sm/calendar/query.action'
                                                }
                                            },
                                            pageId: 'tableFijoshkahkkae',
                                            displayField: "equipmentCalendarName",
                                            valueField: {
                                                "from": "calendarName",
                                                "to": "equipmentCalendarName"
                                            },
                                            associatedFields: [
                                                {
                                                    "from": "gid",
                                                    "to": "equipmentCalendar"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "sbTabTextFiled04",
                                            "type": "textField",
                                            "title": "设备产能",
                                            "name": "equipmentCapacity",
                                            "enabled": true
                                        },
                                        {
                                            "id": "sbTabTextFiled05",
                                            "type": "textField",
                                            "title": "加工批量",
                                            "name": "processBatch",
                                            "enabled": true
                                        },
                                        {
                                            "id": "sbTabTextFiled06",
                                            "type": "textField",
                                            "title": "有效工作时间",
                                            "name": "effectiveWorkingTime",
                                            "enabled": true
                                        }
                                    ]
                                }}component={TableField}/>

                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="共享产品" key="3">
                        <Row>
                            <Col span={24}>
                                <FieldArray name="routeProductDTOs" config={{
                                    "id": "mdRouteProduceTable01",
                                    "name": "mdRouteProduceTable01",
                                    "rowKey": "id",
                                    "showSelect":true, //是否显示选择框
                                    "columns": [
                                        {
                                            "id": "routeProduceField0101",
                                            "type": "findbackField",
                                            "title": "产品编码",
                                            "form": "mdRouteEquipmentForm",
                                            "name": "productCode",
                                            tableInfo: {
                                                id: "tablechanpin0102",
                                                size: "small",
                                                rowKey: "gid",
                                                width:100,
                                                tableTitle: "产品",
                                                //onLoadData: false,
                                                columns: [
                                                    { title: '产品编码', dataIndex: 'materialGidRef.code', key: '1', width: 100 },
                                                    { title: '产品名称', dataIndex: 'materialGidRef.name', key: '2', width: 100 },
                                                    { title: 'bom类型', dataIndex: 'bomType', key: '3', width: 50 },
                                                    { title: '基本数量', dataIndex: 'baseQuantity', key: '4', width: 50 },
                                                    { title: '工艺路线', dataIndex: 'routePathRef.name', key: '5', width: 50 },
                                                    { title: '虚拟件', dataIndex: 'isVirtual', key: '6', width: 50 ,columnsType:{"type":"replace","text":{true:"是",false:"否"}}},
                                                ],
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'post',
                                                    url: '/ime/mdProductInfo/query.action',
                                                    bodyExpression:`
                                  resolveFetch({fetch:{id:'mdRouteEquipmentForm',data:'@@formValues'}}).then(function(data){
                                    console.log(data)
                                    let gids = ''
                                    let productGids = data.routeProductDTOs
                                    //console.log(productGids)
                                    if(productGids){
                                        for(var i=0;i<productGids.length;i++){
                                            if(productGids[i].productInfoGid&&productGids[i].productInfoGid!=''){
                                                 gids += productGids[i].productInfoGid + ","
                                            }
                                        }
                                    }
                                    //console.log(gids)
                                    let field = "routePath"
                                    callback({
                                        "query": {
                                          "query": [
                                            {
                                              "field": field, "type": "null" ,"operator":"and"
                                            },
                                            {
                                              "field": "gid", "type": "noin","value": gids.substring(0, gids.lastIndexOf(","))
                                            }
                                          ],
                                         // "sorted": "gid asc"
                                        },
                                        "pager":{
                                            "page":1,
                                            "pageSize":10
                                        }
                                    })
                                  })
                                  `
                                                }
                                            },
                                            pageId: 'routeProduceTable0101',
                                            displayField: "productCode",
                                            valueField: {
                                                "from": "materialGidRef.code",
                                                "to": "productCode"
                                            },
                                            associatedFields: [
                                                {
                                                    "from": "gid",
                                                    "to": "productInfoGid"
                                                },
                                                {
                                                    "from": "materialGidRef.name",
                                                    "to": "productName"
                                                },
                                                {
                                                    "from": "mdEquipmentTypeGidRef.name",
                                                    "to": "mdEquipmentType"
                                                },
                                                {
                                                    "from": "bomType",
                                                    "to": "bomType"
                                                },
                                                {
                                                    "from": "baseQuantity",
                                                    "to": "baseQuantity"
                                                },
                                                {
                                                    "from": "routePathRef.name",
                                                    "to": "routePathName"
                                                },
                                                {
                                                    "from": "isVirtual",
                                                    "to": "isVirtual"
                                                }

                                            ],
                                        },
                                        {
                                            "id": "routeProduceField0102",
                                            "type": "textField",
                                            "title": "产品名称",
                                            "enabled": false,
                                            "name": "productName",
                                            "enabled": false
                                        },
                                        {
                                            "id": "routeProduceField0103",
                                            "type": "selectField",
                                            "title": "bom类型",
                                            "enabled": false,
                                            "name": "bomType",
                                            dataSource: {
                                                type: "api",
                                                method:"post",
                                                url:"/sm/dictionaryEnumValue/query.action",
                                                mode:"payload",
                                                payload:{
                                                    "query":{
                                                        "query":[
                                                            {"field":"smDictionaryEnumGid","type":"eq","value":"56272988A1761D58E055000000000001"}
                                                        ],
                                                        "sorted":"seq"
                                                    }
                                                }
                                            },
                                            displayField: "val",
                                            valueField: "gid"
                                        },
                                        {
                                            "id": "routeProduceField0104",
                                            "type": "textField",
                                            "title": "基本数量",
                                            "name": "baseQuantity",
                                            "enabled": true
                                        },
                                        {
                                            "id": "routeProduceField0105",
                                            "type": "findbackField",
                                            "title": "工艺路线",
                                            "form": "mdRouteEquipmentForm",
                                            "enabled": true,
                                            "name": "routePathName",

                                            tableInfo: {
                                                id: "tablechanpin0103",
                                                size: "small",
                                                rowKey: "gid",
                                                tableTitle: "工艺路线信息",
                                                showSerial: true,  //序号
                                                width:100,
                                                columns: [
                                                    { title: '工艺路线编码', width: 200, dataIndex: 'routeLineCode', key: '1' },
                                                    { title: '工艺路线名称', width: 200, dataIndex: 'routeLineName', key: '2' },

                                                ],
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'post',
                                                    url: '/ime/mdRouteLine/query.action'
                                                }
                                            },
                                            pageId: 'routeProduceTable0102',
                                            displayField: "routePathName",
                                            valueField: {
                                                "from": "routeLineName",
                                                "to": "routePathName"
                                            },
                                            associatedFields: [
                                                {
                                                    "from": "gid",
                                                    "to": "routePathGid"
                                                }
                                            ],

                                        },
                                        {
                                            "id": "routeProduceField0106",
                                            "type": "switchField",
                                            "title": "虚拟件",
                                            "name": "isVirtual",
                                            "checkedChildren":"是",
                                            "unCheckedChildren":"否"
                                        }

                                    ],
                                    /*rowOperationItem: [
                                        {
                                            id: "productDelBtn",
                                            type: "linkButton",
                                            title: "删除",
                                            subscribes: [
                                                {
                                                    event: "productDelBtn.click",
                                                    pubs:[
                                                        {
                                                            event:"productDelBtn.expression",
                                                            meta:{
                                                                expression:`
                                                              let data = me.eventPayload
                                                              console.log(data)

                                                              `
                                                            }
                                                        }
                                                    ]
                                                    /!*behaviors: [
                                                        {
                                                            type: "request",
                                                            dataSource: {
                                                                type: "api",
                                                                method: "POST",
                                                                url: "/api/ddd.json",
                                                                payloadMapping: [{
                                                                    from: "gid",
                                                                    to: "id"
                                                                }]
                                                            },
                                                            successPubs: [
                                                                {
                                                                    event: "1.enabled",
                                                                    payload: false
                                                                }
                                                            ]


                                                        }
                                                    ]*!/
                                                }
                                            ]

                                        }
                                    ]*/
                                }}component={TableField}/>

                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}


Footer.propTypes = {
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

let FORM =  reduxForm({
    form: "mdRouteEquipmentForm",
})(Footer)

export default connect(mapStateToProps, mapDispatchToProps)(FORM);
