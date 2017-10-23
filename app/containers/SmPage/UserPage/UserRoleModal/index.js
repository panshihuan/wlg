import React, {PropTypes} from 'react';
import {Breadcrumb, Card, Row, Col} from 'antd';
import Immutable from 'immutable'
import pubsub from 'pubsub-js'
import AppButton from 'components/AppButton';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import TextField from 'components/Form/TextField'
import AppTable from 'components/AppTable';
import {resolveFetch} from "../../../../utils/componentUtil";
import RoleListModal from '../RoleListModal'
import ModalContainer from 'components/ModalContainer'



export class UserRoleModal extends React.PureComponent {

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
                <Card bordered={true}
                      style={{"marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px"}}
                      bodyStyle={{
                          "paddingTop": "10px",
                          "paddingBottom": "10px",
                          "paddingLeft": "25px",
                          "paddingRight": "25px"
                      }}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                form: "userForm ",
                                enabled: false,
                                id: "userCode",
                                label: "用戶编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入编码"
                            }} component={TextField} name="userCode"/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                form: "userForm",
                                id: "userName",
                                label: "用戶名称",
                                placeholder: "请输入名称",
                                showRequiredStar: true,
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="userName"/>
                        </Col>
                    </Row>
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
                        <Col span={6}>
                            <AppButton config={{
                                id: "UserRoleCreateBtn",
                                title: "新增",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "UserRoleCreateBtn.click",
                                        pubs: [
                                            {
                                                event: "RoleListModal.openModal"
                                            }
                                        ]
                                        /* behaviors: [
                                             {
                                                 type: "fetch",
                                                 id: "UserTable", //要从哪个组件获取数据
                                                 data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                 successPubs: [  //获取数据完成后要发送的事件
                                                     {
                                                         event: "@@navigator.push",
                                                         mode: "payload&&eventPayload",
                                                         payload: {
                                                             url: "user/userRoleMoal"
                                                         }
                                                     }
                                                 ]
                                             }
                                         ]*/
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "UserDeleteBtn",
                                title: "删除",
                                type:"primary",
                                size:"large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"RoleTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "UserDeleteBtn.enabled",
                                                payload:true
                                            }
                                        ]
                                    },
                                    {
                                        event:"RoleTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "UserDeleteBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "RoleTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "UserDeleteBtn.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "UserDeleteBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/userRole/deleteByIds",
                                                    paramsInQueryString:false,//参数拼在url后面
                                                    payloadMapping:[{
                                                        from: "dataContext",
                                                        to: "@@Array",
                                                        key: "gid",
                                                        // paramKey:"id"
                                                    }]
                                                },
                                                successPubs: [
                                                    {
                                                        event: "UserRoleCreateBtn.enabled",
                                                        payload: true

                                                    },
                                                    {
                                                        event: "RoleTable.loadData",

                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                        </Col>
                    </Row>
                </Card>
                <Card bordered={true}>
                    <AppTable name="RoleTable" config={{
                        "id": "RoleTable",
                        "name": "RoleTable",
                        "type": "checkbox",//表格单选复选类型
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
                            {title: '角色编码', width: 100, dataIndex: 'smRoleGidRef.roleCode', key: '1'},
                            {title: '角色名称', width: 100, dataIndex: 'smRoleGidRef.roleName', key: '2'},

                        ],
                        subscribes: [

                            {
                                event: 'RoleTable.onTableTodoAny',
                               /* behaviors: [
                                    {
                                        type: "fetch",
                                        id: "UserTable", //要从哪个组件获取数据
                                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                                        successPubs: [  //获取数据完成后要发送的事件
                                            {
                                                eventPayloadExpression: `
                                                            console.log(eventPayload)
                                                          var condition=  {
                                                                "query": {
                                                                    "query": [
                                                                        {
                                                                            "field": "smUserGid",
                                                                            "type": "eq",
                                                                            "value": eventPayload[0]["gid"]
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        console.log('condition:',condition)
                                                        callback({eventPayload:condition})
                                                    `,
                                                event: "RoleTable.loadData",
                                            }
                                        ]
                                    }
                                ]*/
                            }
                            ],

                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    url: '/sm/userRole/query.action',
                                    bodyExpression: `
                            resolveFetch({ fetch: {
                            id: "UserTable",
                             data: "selectedRows"
                           }}).then(function (data) {
                            var condition=  {
                                                                "query": {
                                                                    "query": [
                                                                        {
                                                                            "field": "smUserGid",
                                                                            "type": "eq",
                                                                            "value": data[0]["gid"]
                                                                        }
                                                                    ]
                                                                }
                                                            }

                                callback(condition)
                              })
                               `

                                }
                            }
                    } />
                </Card>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "RoleListModal", // id，必填*
                    pageId: "RoleListModal", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "角色列表", // title，不传则不显示title
                    closable: true, // 是否显示右上角关闭按钮，默认不显示
                    width: "80%", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: {top: 120}, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >
                    <RoleListModal/>
                </ModalContainer>
            </div>
        );
    }
}


export default reduxForm({
    form: "userForm",
})(UserRoleModal);