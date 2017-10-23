import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'
import { fromJS } from "immutable"

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
import AppTable from 'components/AppTable';
import FindbackField from 'components/Form/FindbackField'
import ModalContainer from 'components/ModalContainer'

import RoleMenuModal from './roleMenuModal'
import RoleUserModal from './roleUserModal'
import RoleBusiGroupModal from './roleBusiGroupModal'

import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

const TabPane = Tabs.TabPane;

export  class Detail extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
        this.state={
            roleGid:""
        }
        this.roleGid= ""
        console.log(this.props.state)

        resolveFetch({
            fetch: {
                id: "RoleTable",
                data: "selectedRows"
            }
        }).then(function (rows) {
            this.setState({
                roleGid : rows[0].gid
            })
            // console.log("roleGid1",this.roleGid)
            //pubsub.publish("@@form.init", {id: "Form", data: Immutable.fromJS(rows[0])})
        }.bind(this))


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

               {/* <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                form: "Form",
                                enabled: false,
                                id: "roleCode",
                                label: "角色编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                            }} component={TextField} name="roleCode" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                form: "Form",
                                id: "roleName",
                                label: "角色名称",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="roleName" />
                        </Col>
                    </Row>
                </Card>*/}

                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="已分配功能" key="1">
                            <Row>
                                <Col span={14} xs={24}>
                                    <AppButton config={{
                                        id: "associatedMenuBtn",
                                        title: "关联菜单",
                                        type: "primary",
                                        size: "large",
                                        visible: true,
                                        enabled: true,
                                        subscribes: [
                                            {
                                                event: "associatedMenuBtn.click",
                                                pubs: [
                                                    {
                                                        event: "roleMenuModal.openModal",
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                    }>
                                    </AppButton>
                                </Col>
                            </Row>
                            <Card bordered={true}>
                                <AppTable name="RoleMenuTable" config={{
                                    "id": "RoleMenuTable",
                                    "name": "RoleMenuTable",
                                    "type": "checkbox",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "id",//主键
                                    "onLoadData": true,//初始化是否加载数据
                                    "tableTitle": "已分配功能列表",//表头信息
                                    "width": 900,//表格宽度
                                    "showSerial": true,//是否显示序号
                                    "editType": true,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "isSelectable":false,
                                    "columns": [
                                        { title: '菜单名称', width: 100, dataIndex: 'text', key: '1' },
                                        { title: '授权时间', width: 100, dataIndex: 'date', key: '2' },

                                    ],

                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/sm/roleMenu/getListTreeForRole.action',
                                        bodyExpression: `
                                        resolveFetch({ fetch: {
                                             id: "RoleTable",
                                             data: "selectedRows"
                                        }}).then(function (data) {
                                             let id = data[0].gid

                                            callback(id)
                                       })
                               `
                                    }
                                }} />
                            </Card>
                        </TabPane>

                        <TabPane tab="已关联用户" key="2">
                            <Row>
                                <Col span={14} xs={24}>
                                    <AppButton config={{
                                        id: "associatedUserBtn",
                                        title: "关联用户",
                                        type: "primary",
                                        size: "large",
                                        visible: true,
                                        enabled: true,
                                        subscribes: [
                                            {
                                                event: "associatedUserBtn.click",
                                                pubs: [
                                                    {
                                                        event: "roleUserModal.openModal",
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                    }>
                                    </AppButton>
                                </Col>
                            </Row>
                            <Card bordered={true}>
                                <AppTable name="RoleUserTable" config={{
                                    "id": "RoleUserTable",
                                    "name": "RoleUserTable",
                                    "type": "checkbox",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": true,//初始化是否加载数据
                                    "tableTitle": "已关联用户列表",//表头信息
                                    "width": 900,//表格宽度
                                    "showSerial": true,//是否显示序号
                                    "editType": true,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "isSelectable":false,
                                    "columns": [
                                        { title: '用户编号', width: 100, dataIndex: 'smUserGidRef.userCode', key: '1' },
                                        { title: '用户名称', width: 100, dataIndex: 'smUserGidRef.userName', key: '2' },

                                    ],

                                    rowOperationItem: [
                                        {
                                            id: "RoleUserTableDeleteLinkBtn",
                                            type: "linkButton",
                                            title: "删除",
                                            subscribes: [
                                                {
                                                    event: "RoleUserTableDeleteLinkBtn.click",
                                                    behaviors: [
                                                        {
                                                            type: "request",
                                                            dataSource: {
                                                                type: "api",
                                                                method: "POST",
                                                                paramsInQueryString: true,//参数拼在url后面
                                                                url: "/sm/userRole/delete",
                                                                payloadMapping: [{
                                                                    from: "gid",
                                                                    to: "id"
                                                                }]
                                                            },
                                                            successPubs: [
                                                                {
                                                                    outside: true,
                                                                    event: "RoleUserTable.loadData"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },


                                            ]
                                        }
                                    ],

                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/sm/userRole/query.action',
                                        bodyExpression: `
                                        resolveFetch({ fetch: {
                                             id: "RoleTable",
                                             data: "selectedRows"
                                        }}).then(function (data) {
                                            var condition= {
                                                "query": {
                                                    "query": [
                                                        {
                                                            "field": "smRoleGid",
                                                            "type": "eq",
                                                            "value": data[0].gid
                                                        }
                                                    ]
                                                }
                                            }

                                            callback(condition)
                                       })
                               `
                                    }
                                }} />
                            </Card>
                        </TabPane>
                       {/* <TabPane tab="已分配组织" key="3">
                            <Row>
                                <Col span={14} xs={24}>
                                    <AppButton config={{
                                        id: "associatedBusiGroupBtn",
                                        title: "关联组织",
                                        type: "primary",
                                        size: "large",
                                        visible: true,
                                        enabled: true,
                                        subscribes: [
                                            {
                                                event: "associatedBusiGroupBtn.click",
                                                pubs: [
                                                    {
                                                        event: "roleBusiGroupModal.openModal",
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                    }>
                                    </AppButton>
                                </Col>
                            </Row>
                            <Card bordered={true}>
                                <AppTable name="RoleBusiUnitTable" config={{
                                    "id": "RoleBusiUnitTable",
                                    "name": "RoleBusiUnitTable",
                                    "type": "checkbox",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "id",//主键
                                    "onLoadData": true,//初始化是否加载数据
                                    "tableTitle": "已分配组织列表",//表头信息
                                    "width": 900,//表格宽度
                                    "showSerial": true,//是否显示序号
                                    "editType": true,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "isSelectable":false,
                                    "columns": [
                                        { title: '组织编号', width: 100, dataIndex: 'code', key: '1' },
                                        { title: '组织名称', width: 100, dataIndex: 'text', key: '2' },

                                    ],

                                    rowOperationItem: [
                                        {
                                            id: "RoleBusiUnitTableDeleteLinkBtn",
                                            type: "linkButton",
                                            title: "删除",
                                            subscribes: [
                                                {
                                                    event: "RoleBusiUnitTableDeleteLinkBtn.click",
                                                    behaviors: [
                                                        {
                                                            type: "request",
                                                            dataSource: {
                                                                type: "api",
                                                                method: "POST",
                                                                paramsInQueryString: true,//参数拼在url后面
                                                                url: "/sm/busiUnitRole/delete",
                                                                payloadMapping: [{
                                                                    from: "gid",
                                                                    to: "id"
                                                                }]
                                                            },
                                                            successPubs: [
                                                                {
                                                                    outside: true,
                                                                    event: "RoleBusiUnitTable.loadData"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },


                                            ]
                                        }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/sm/busiUnitRole/getListTreeForRole.action',
                                        bodyExpression: `
                                        resolveFetch({ fetch: {
                                             id: "RoleTable",
                                             data: "selectedRows"
                                        }}).then(function (data) {
                                             let id = data[0].gid

                                            callback(id)
                                       })
                               `
                                    }
                                }} />
                            </Card>
                        </TabPane>*/}
                    </Tabs>
                </Card>

                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={14} xs={24} offset={20}>
                            <AppButton config={{
                                id: "confirmBtn",
                                title: "确认",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "confirmBtn.click",
                                        pubs: [
                                            {
                                                event: "DetailModal.onCancel",
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "returnBtn",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "returnBtn.click",
                                        pubs: [
                                            {
                                                event: "DetailModal.onCancel",
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                        </Col>
                    </Row>
                </Card>

                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "roleMenuModal", // id，必填*
                    pageId: "roleMenuModal", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "关联菜单", // title，不传则不显示title
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
                    <RoleMenuModal roleGid={this.state.roleGid}/>
                </ModalContainer>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "roleUserModal", // id，必填*
                    pageId: "roleUserModal", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "关联用户", // title，不传则不显示title
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
                    <RoleUserModal roleGid={this.state.roleGid}/>
                </ModalContainer>

                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "roleBusiGroupModal", // id，必填*
                    pageId: "roleBusiGroupModal", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "关联组织", // title，不传则不显示title
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
                    <RoleBusiGroupModal roleGid={this.state.roleGid}/>
                </ModalContainer>
            </div>
        );
    }
}


Detail.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}




let DetailForm = reduxForm({
    form: "Form"
})(Detail)

export default connect(null, mapDispatchToProps)(DetailForm);
