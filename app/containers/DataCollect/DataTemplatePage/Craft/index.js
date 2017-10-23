import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import TextField from 'components/Form/TextField'
import { Breadcrumb, Card, Row, Col } from 'antd';
import FindbackField from 'components/Form/FindbackField'

export class CraftModal extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }
    componentDidMount() {
        // pubsub.publish('orderRepealModal-table-11.laterData',{})
    }
    componentWillUnmount() {
    }
    componentWillReceiveProps(nextProps) {
    }
    render() {
        return (
            <form>
                <Row>
                    <Col span={12}>
                        <Field config={{
                            enabled: true,
                            id: "parentGidRefBusiGroupName",
                            label: "工艺路线",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            form: "cratfFrom",
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码",

                            tableInfo: {
                                id: "parentGidRefBusiGroupNameFindBackTable",
                                size: "small",
                                rowKey: "gid",
                                width:"1000",
                                tableTitle: "工艺路线",
                                columns: [
                                    { title: '物料编码', width: 100, dataIndex: 'materialInfoCode', key: '1' },
                                    { title: '物料名称', width: 100, dataIndex: 'materialInfoName', key: '2' },
                                    { title: '规格', width: 50, dataIndex: 'spec', key: '3' },
                                    { title: '型号', dataIndex: 'model', key: '4', width: 50 },
                                    { title: '工艺路线编码', dataIndex: 'routeLineCode', key: '5', width: 150 },
                                    { title: '工艺路线名称', dataIndex: 'routeLineName', key: '6', width: 150 },
                                    { title: '数量', dataIndex: 'outputNum', key: '7', width: 50 },
                                    { title: '节拍', dataIndex: 'rhythm', key: '8', width: 50 },
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    url: '/ime/mdRouteLine/query.action',
                                }
                            },
                            pageId: 'parentGidRefBusiGroupNameFindBackTablePage',
                            displayField: "routeLineName",
                            valueField: {
                                "from": "routeLineName",
                                "to": "parentGidRef.routeLineName"
                            },
                            associatedFields: [
                                {
                                    "from": "gid",
                                    "to": "parentGid"
                                },
                            ]
                        }} component={FindbackField} name="parentGidRef.routeLineName" />
                    </Col>
                </Row>
                <Row>
                    <Col span={ 24 }>
                        <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "500px" }} bodyStyle={{ padding: "15px" }}>
                            <AppTable name="gx010101" config={{
                                "id": "gx010101",
                                "name": "gx010101",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "mdRouteOperationGid",//主键
                                "onLoadData": true,//初始化是否加载数据
                                "tableTitle": "工序信息",//表头信息
                                "width": 1500,//表格宽度
                                "showSerial": true,//是否显示序号
                                "editType": false,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": true,//是否分页
                                "isSearch": true,//是否显示模糊查询
                                "columns": [
                                    { title: '工序编码', width: 100, dataIndex: 'mdDefOperationCode', key: '1' },
                                    { title: '工序名称', width: 80, dataIndex: 'mdDefOperationName', key: '2' },
                                    { title: '工序类型', width: 50, dataIndex: 'mdDefOperationTypeName', key: '3' },
                                    { title: '工作中心', dataIndex: 'mdFactoryWorkCenterName', key: '4', width: 80 },
                                    { title: '产线', dataIndex: 'mdFactoryLineName', key: '5', width: 80 },
                                    { title: '工作单元', dataIndex: 'mdFactoryWorkUnitName', key: '6', width: 80 },
                                    { title: '工位', dataIndex: 'mdFactoryStationName', key: '7', width: 80 },
                                    { title: '加工方式', dataIndex: 'processingModeName', key: '8', width: 50 },
                                    { title: '检验工序', dataIndex: 'processTest', key: '9', width: 50 ,columnsType:{"type":"replace","text":{1:"是",0:"否"}}},
                                    { title: '派工单产生', dataIndex: 'worksheetGenarationModeName', key: '10', width: 80 },
                                    { title: '报工方式', dataIndex: 'businessModeName', key: '11', width: 70 }

                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    pager:true,
                                    url: '/ime/mdDefOperation/query.action'
                                },
                                subscribes: [
                                    {
                                        event:'parentGidRefBusiGroupName.onChange',
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "parentGidRefBusiGroupName", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "gx010101.loadData",
                                                        eventPayloadExpression:`
                                                                console.log("asdasdasdasd")
                                                                console.log(eventPayload.gid)

                                                               let condition = eventPayload.gid;

                                                             let formValue = [];
                                                             formValue.push(condition);

                                                             let dataSource= {
                                                                  type: "api",
                                                                  method: "POST",
                                                                  mode:"dataContext",
                                                                  url: "/ime/mdRouteLine/findDtoById.action?id="+condition
                                                                };

                                                                resolveDataSourceCallback(
                                                                    {
                                                                        dataSource:dataSource,eventPayload:formValue,dataContext:formValue
                                                                    },
                                                                  function(res){
                                                                    console.log(me)
                                                                    me.setState({dataSource:res.data.routeOperationQueryList})
                                                                    me.setState({count:res.data.routeOperationQueryList.length})
                                                                  },
                                                                  function(){
                                                                  }
                                                                )

                                                               /*let params = {
                                                              "query": {
                                                                "query": [
                                                                   {
                                                                        "left":"(",
                                                                        "field":"routeLineGid",
                                                                        "type":"eq",
                                                                        "value":condition,
                                                                        "right":")",
                                                                        "operator":"and"
                                                                   }
                                                                 ],
                                                                 "sorted":"gid asc"
                                                              }
                                                            }
                                                            callback({eventPayload:params})*/
                                                            `
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }} />


                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={20}>
                        {/*取消按钮*/}
                        <AppButton config={{
                            id: "orderRepealModal-btn-3",
                            title: "取消",
                            type:"default",
                            size:"large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "orderRepealModal-btn-3.click",
                                    pubs:[{
                                        event: "selectCraft.onCancel",
                                    }]
                                }
                            ]
                        }} />

                        {/*确定按钮*/}
                        <AppButton config={{
                            id: "orderRepealModal-btn-2",
                            title: "确认分配",
                            type:"primary",
                            size:"large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "orderRepealModal-btn-2.click",
                                    behaviors: [
                                        {
                                            type: "fetch",
                                            id: "gx010101", //要从哪个组件获取数据
                                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                                            successPubs: [  //获取数据完成后要发送的事件
                                                {
                                                    //event: "dic.loadData",
                                                    eventPayloadExpression:`
                                                                resolveFetch({fetch:{id:"DataTemplatePage",data:"@@formValues"}}).then(function (value) {
                                                                    let dcTemplateGidVal = value.templateGid[0].gid;//模板GID
                                                                    //eventPayload = [{mdRouteOperationGid:"5A3BB80468091428E0550AAA0000001"},{mdRouteOperationGid:"5A3BB80468091428E05500BBB0000001"}]
                                                                    console.log("aaaaaaaaavvvvvvvvv")
                                                                    for(var i=0;i < eventPayload.length;i++){
                                                                       let craftGidVal = eventPayload[i].mdRouteOperationGid;//工艺GID111
                                                                       let formValue = {dcTemplateGid:dcTemplateGidVal,craftGid:craftGidVal}



                                                                           let dataSource= {
                                                                              type: "api",
                                                                              method: "POST",
                                                                              url: "/sm/dcDataTemplateCraft/add.action"
                                                                            };

                                                                            resolveDataSourceCallback(
                                                                                {
                                                                                    dataSource:dataSource,eventPayload:formValue,dataContext:formValue
                                                                                },
                                                                              function(res){
                                                                               // me.setState({dataSource:res.data})
                                                                              },
                                                                              function(){
                                                                              }
                                                                            )

                                                                    }
                                                                    pubsub.publish("@@message.success","保存成功");
                                                                })



                                                            `
                                                },
                                                {
                                                    event: "selectCraft.onCancel",
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]

                        }} />


                    </Col>
                </Row>
            </form>
        );
    }
}

CraftModal.propTypes = {

};

export default  reduxForm({
    form: "CraftModal",
})(CraftModal);

