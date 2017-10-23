import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from '../../../components/AppTable';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import UserRoleModal from './UserRoleModal'

export class UserPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            orderSpit: ''
        }

        pubsub.subscribe("UserTable.onSelectedRows",(name,data)=>{
            console.log("onSelectedRows",data)
            if(data.length > 1){
                pubsub.publish("UserModifyBtn.enabled",false)
                pubsub.publish("UserRoleBtn.enabled",false)
                pubsub.publish("UserDeleteBtn.enabled",true)
                pubsub.publish("UserRepasswordBtn.enabled",true)
            }else if(data.length == 1){
                pubsub.publish("UserModifyBtn.enabled",true)
                pubsub.publish("UserDeleteBtn.enabled",true)
                pubsub.publish("UserRoleBtn.enabled",true)
                pubsub.publish("UserRepasswordBtn.enabled",true)
            }else {
                pubsub.publish("@@message.error","请先创建,或者选择一行!")
            }
        })
    }

    componentWillMount() {

    }

    componentDidMount() {
        pubsub.subscribe(`orderSplitModal_1.onClick`, (e, d) => {

        })
        pubsub.subscribe(`pageIdxxx.openModal`, (e, payload) => {
            this.setState({ orderSpit: payload })
        })
        pubsub.subscribe(`orderSplitModal-tree-1.onCheck`, (e, payload) => {
            console.log('checked:::', payload.checkedKeys)
        })
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={14} xs={24}>
                            <AppButton config={{
                                id: "UserCreateBtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "UserCreateBtn.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "user/create"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "UserModifyBtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"UserTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "UserModifyBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "UserModifyBtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "UserTable", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        mode: "payload&&eventPayload",
                                                        payload: {
                                                            url: "user/modify"
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
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
                                        event:"UserTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "UserDeleteBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "UserTable.onSelectedRows",
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
                                                    url: "/sm/user/deleteByIds",
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
                                                        event: "UserTable.loadData"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            {/*<span className="ant-divider" />*/}
                            <AppButton config={{
                                id: "UserRepasswordBtn",
                                title: "重置密碼",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"UserTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "UserRepasswordBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "UserTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "UserRepasswordBtn.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "UserRepasswordBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/user/resetPasswordByIds",
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
                                                        event: "UserTable.loadData"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "UserRoleBtn",
                                title: "角色分配",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"UserTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "UserRoleBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "UserRoleBtn.click",
                                        pubs: [
                                            {
                                                event: "roleuserxxx1.openModal",
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
                        </Col>
                    </Row>
                </Card>
                <Card bordered={true}>
                    <AppTable name="UserTable" config={{
                        "id": "UserTable",
                        "name": "UserTable",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": true,//初始化是否加载数据
                        "tableTitle": "用户列表",//表头信息
                        "width": 900,//表格宽度
                        "showSerial": true,//是否显示序号
                        "editType": true,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 10,//一页多少条
                        "isPager": true,//是否分页
                        "isSearch": true,//是否显示模糊查询
                        "columns": [
                            { title: '用户编码', width: 100, dataIndex: 'userCode', key: '1' },
                            { title: '用户名称', width: 100, dataIndex: 'userName', key: '2' },

                        ],
                       /* rowOperationItem: [
                            {
                                id: "UserTableDeleteLinkBtn",
                                type: "linkButton",
                                title: "删除",
                                subscribes: [
                                    {
                                        event: "UserTableDeleteLinkBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    paramsInQueryString: true,//参数拼在url后面
                                                    url: "/sm/user/deleteByIds",
                                                    payloadMapping: [{
                                                        from: "gid",
                                                        to: "id"
                                                    }]
                                                },
                                                successPubs: [
                                                    {
                                                        outside: true,
                                                        event: "UserTable.loadData"
                                                    }
                                                ]
                                            }
                                        ]
                                    },


                                ]
                            }
                        ],*/
                       /* subscribes:[
                            {
                                event:'UserTable.onSelectedRows',
                                pubs:[
                                    {
                                        event:'orderMergeModal_1.dataContext'
                                    }
                                ]
                            }
                        ],*/
                        dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/sm/user/query.action'
                        }
                    }} />
                </Card>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "roleuserxxx1", // id，必填*
                    pageId: "roleuserxxx1", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "分配角色", // title，不传则不显示title
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
                    <UserRoleModal/>
                </ModalContainer>
            </div>
        );
    }
}

UserPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(UserPage);
