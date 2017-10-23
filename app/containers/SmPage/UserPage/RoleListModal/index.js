import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col} from 'antd';
import Immutable from 'immutable'
import pubsub from 'pubsub-js'
import {Link} from 'react-router';
import AppButton from 'components/AppButton';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import TextField from 'components/Form/TextField'
import AppTable from 'components/AppTable';
import {resolveFetch} from "../../../../utils/componentUtil";

export class RoleListModal extends React.PureComponent {

    constructor(props) {
        super(props);
        resolveFetch({
            fetch: {
                id: "UserTable",
                data: "selectedRows"
            }
        }).then(function (rows) {

            pubsub.publish("@@form.init", {id: "userForm", data: Immutable.fromJS(rows[0])})
        })
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
                    <AppTable name="RoleListTable" config={{
                        "id": "RoleListTable",
                        "name": "RoleListTable",
                        "type": "radio",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": true,//初始化是否加载数据
                        "tableTitle": "角色列表",//表头信息
                        "width": 900,//表格宽度
                        "showSerial": true,//是否显示序号
                        "editType": true,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 10,//一页多少条
                        "isPager": true,//是否分页
                        "isSearch": true,//是否显示模糊查询
                        "columns": [
                            { title: '角色编码', width: 100, dataIndex: 'roleCode', key: '1' },
                            { title: '角色名称', width: 100, dataIndex: 'roleName', key: '2' },

                        ],
                        dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/sm/role/query.action',
                            bodyExpression:`
                             resolveFetch({ fetch: {
                            id: "RoleTable",
                             data: "state"
                           }}).then(function (data) {
                           console.log(data)
                           let roids='';
                          for(var i = 0; i<data.dataSource.length;i++){
                               roids+=data.dataSource[i]["smRoleGid"]+',';
                            }
                             console.log(roids)
                            var condition=  {
                                                                "query": {
                                                                    "query": [
                                                                        {
                                                                             "field": "gid",
                                                                             "type": "NOIN",
                                                                             "value": roids
                                                                        }
                                                                    ]
                                                                }
                                                            }

                                callback(condition)
                              })
                            `
                        },
                        subscribes: [
                            {
                                event: "RoleListTable.onSelectedRows",
                                pubs: [
                                    {
                                        event: "RoleListTable.expression",
                                        meta:{
                                            expression:`
                                  console.log(me)
                                  let selectedRowsKey = [];
                                   let rows =me.selectedRows||[];
                                  for(var i = 0; i<rows.length;i++){
                                    selectedRowsKey.push(rows[i]["gid"]);
                                  }
                                   //传递给"新增"按钮的信息
                              pubsub.publish("UserRoleConfirmBtn.dataContext",{
                                  eventPayload:selectedRowsKey
                              });
                            `
                                        }
                                    }
                                ]
                            }
                        ]
                    }} />
                        </Card>
                <Card bordered={true}
                      style={{"marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px"}}
                      bodyStyle={{
                          "paddingTop": "10px",
                          "paddingBottom": "10px",
                          "paddingLeft": "25px",
                          "paddingRight": "25px"
                      }}>
                    <Row>
                        <Col span={6} offset={20}>
                            <AppButton config={{
                                id: "UserRoleConfirmBtn",
                                title: "确认",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"RoleListTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "UserRoleConfirmBtn.enabled",
                                                payload:true
                                            }
                                        ]
                                    },
                                    {
                                        event:"RoleListTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "UserRoleConfirmBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "UserRoleConfirmBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/userRole/addList",
                                                    /*paramsInQueryString:false,//参数拼在url后面
                                                    payloadMapping:[{
                                                        from: "dataContext",
                                                        to: "@@Array",
                                                        key: "gid",
                                                        // paramKey:"id"
                                                    }]*/
                                                    bodyExpression:`
                                        var ids = []
                                        resolveFetch({fetch:{id:"UserRoleConfirmBtn",data:"dataContext"}}).then(function (data) {
                                           console.log(data)


                                        resolveFetch({fetch:{id:"UserTable",data:"selectedRows"}}).then(function (rows) {
                                          console.log(rows)
                                          callback([{smUserGid:rows[0]["gid"],smRoleGid:data[0]}])

                                        })
                                      })
                        `,
                                                },
                                                successPubs: [
                                                    {
                                                        event: "RoleTable.loadData"
                                                    },

                                                    {
                                                        event: "RoleListModal.onCancel"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "UserRoleCancelBtn",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "UserRoleCancelBtn.click",
                                        pubs:[
                                            {
                                                event: "RoleListModal.onCancel"
                                            }
                                        ]
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


export default RoleListModal;