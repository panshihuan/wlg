import React, { PropTypes } from 'react';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import NavTreeField from 'components/NavTree'
import uuid from 'uuid/v4'
import TreeField from 'components/Form/TreeField'

export class RoleUserModal extends React.PureComponent {

    constructor(props) {
        super(props);
        debugger
        this.id = this.props.roleGid
        console.log("roleGid",this.id)


    }

    componentWillMount() {
    }
    componentDidMount() {


    }
    componentWillUnmount() {
    }
    componentWillReceiveProps(nextProps) {
    }
    render() {
        return (
            <div>
                <Card bordered={true}>
                    <AppTable name="UnAssociatedUserTable" config={{
                        "id": "UnAssociatedUserTable",
                        "name": "UnAssociatedUserTable",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": false,//初始化是否加载数据
                        "tableTitle": "未关联用户列表",//表头信息
                        "width": 900,//表格宽度
                        "showSerial": true,//是否显示序号
                        "editType": false,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 10,//一页多少条
                        "isPager": true,//是否分页
                        "isSearch": true,//是否显示模糊查询
                        "columns": [
                            { title: '用户编号', width: 100, dataIndex: 'userCode', key: '1' },
                            { title: '用户名称', width: 100, dataIndex: 'userName', key: '2' },

                        ],
                        subscribes:[
                            {
                                event:'UnAssociatedUserTable.onTableTodoAny',
                                behaviors: [
                                    {
                                        type: "fetch",
                                        id: "RoleUserTable", //要从哪个组件获取数据
                                        data: "state",//要从哪个组件的什么属性获取数据
                                        successPubs: [  //获取数据完成后要发送的事件
                                            {
                                                eventPayloadExpression:`
                                                        let data = eventPayload.dataSource
                                                        console.log(data)
                                                        let ids = []
                                                        for(var i = 0; i<data.length;i++){
                                                            var gid = data[i].smUserGid
                                                               ids.push(gid)
                                                          }
                                                          console.log('ids:',ids)
                                                          var condition=  {
                                                                "query": {
                                                                    "query": [
                                                                        {
                                                                            "field": "gid",
                                                                            "type": "NOIN",
                                                                            "value": ids.toString()
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        console.log('condition:',condition)
                                                        callback({eventPayload:condition})
                                                    `,
                                                event:"UnAssociatedUserTable.loadData",
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/sm/user/query.action',
                            subscribes:[
                                {
                                    event: "UnAssociatedUserTable.onSelectedRows",
                                    pubs: [
                                        {
                                            event: "UnAssociatedUserTable.expression",
                                            meta:{
                                                expression:`
                                                  console.log("me",me)
                                                  let selectedRowsKey = [];
                                                   let rows =me.selectedRows||[];
                                                  for(var i = 0; i<rows.length;i++){
                                                    selectedRowsKey.push(rows[i]["gid"]);
                                                  }
                                                   //传递给"新增"按钮的信息
                                                  pubsub.publish("UserConfirmBtn.dataContext",{
                                                      eventPayload:selectedRowsKey
                                                  });
                                            `
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }} />
                </Card>

                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>


                        <Col span={14} xs={24} offset={20}>
                            <AppButton config={{
                                id: "UserConfirmBtn",
                                title: "确认",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "UnAssociatedUserTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "UserConfirmBtn.enabled",
                                                payload: true
                                            }
                                        ]
                                    },
                                    {
                                        event: "UnAssociatedUserTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "UserConfirmBtn.enabled",
                                                payload: false
                                            }
                                        ]
                                    },
                                    {
                                        event: "UnAssociatedUserTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "UserConfirmBtn.dataContext"
                                            }
                                        ]
                                    }, {
                                        event: "UserConfirmBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/userRole/addList.action",
                                                    bodyExpression: `
                                                            let id = "${this.id}"
                                                            console.log("id",id)
                                                            resolveFetch({
                                                                    fetch:{
                                                                    id:"UserConfirmBtn",
                                                                    data:"dataContext"
                                                                    }
                                                              }).then(function (data) {
                                                                    console.log("date",data)
                                                                    callback([{smRoleGid:id,smUserGid:data[0].gid}])
                                                              })

                                                    `//rows[0]["gid"]
                                                },

                                                successPubs: [
                                                    {
                                                        event: "@@message.success",
                                                        payload: "操作成功"
                                                    },
                                                    {
                                                        event: "RoleUserTable.loadData"
                                                    },
                                                    {
                                                        event: "roleUserModal.onCancel"
                                                    }
                                                ],
                                                errorPubs: [
                                                    {
                                                        event: "@@message.error",
                                                        payload: "操作失败"
                                                    },
                                                    {
                                                        event: "roleUserModal.onCancel"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>

                            <AppButton config={{
                                id: "RoleUserAdd-Cancel",
                                title: "取消",
                                type:"default",
                                size:"large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "RoleUserAdd-Cancel.click",
                                        pubs:[{
                                            event: "roleUserModal.onCancel",
                                        }]
                                    }
                                ]
                            }} />
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}



RoleUserModal.propTypes = {

};

export  default  RoleUserModal;