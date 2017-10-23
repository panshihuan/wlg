import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from '../../../components/AppTable';
import DropdownButton from '../../../components/DropdownButton';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import Detail from './Detail'

export class RolePage extends React.PureComponent {
    constructor(props) {
        super(props);




        pubsub.subscribe("RoleTable.onSelectedRows",(name,data)=>{
            //console.log("onSelectedRows",data)
            if(data.length > 1){
                pubsub.publish("RoleModifyBtn.enabled",false)
                pubsub.publish("RoleAuthorizeBtn.enabled",false)
                pubsub.publish("RoleDeleteBtn.enabled",true)
            }else if(data.length == 1){
                pubsub.publish("RoleModifyBtn.enabled",true)
                pubsub.publish("RoleAuthorizeBtn.enabled",true)
                pubsub.publish("RoleDeleteBtn.enabled",true)
            }else {
                pubsub.publish("@@message.error","请先创建,或者选择一行!")
            }
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
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>角色管理</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={14} xs={24}>
                            <AppButton config={{
                                id: "RoleCreateBtn",
                                title: "新增角色",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "RoleCreateBtn.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "role/create"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "RoleModifyBtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"RoleTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "RoleModifyBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "RoleModifyBtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "RoleTable", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        mode: "payload&&eventPayload",
                                                        payload: {
                                                            url: "role/modify"
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
                                id: "RoleDeleteBtn",
                                title: "删除",
                                type:"primary",
                                size:"large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"RoleTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "RoleDeleteBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "RoleTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "RoleDeleteBtn.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "RoleDeleteBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/role/deleteByIds",
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
                                                        event: "RoleTable.loadData"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <span className="ant-divider" />
                            <AppButton config={{
                                id: "RoleAuthorizeBtn",
                                title: "授权",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"RoleTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "RoleAuthorizeBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "RoleAuthorizeBtn.click",
                                        pubs:[
                                            {
                                                event:"DetailModal.openModal"
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
                            { title: '角色编码', width: 100, dataIndex: 'roleCode', key: '1' },
                            { title: '角色名称', width: 100, dataIndex: 'roleName', key: '2' },

                        ],
                        rowOperationItem: [
                            {
                                id: "RoleTableDeleteLinkBtn",
                                type: "linkButton",
                                title: "删除",
                                subscribes: [
                                    {
                                        event: "RoleTableDeleteLinkBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    paramsInQueryString: true,//参数拼在url后面
                                                    url: "/sm/role/delete",
                                                    payloadMapping: [{
                                                        from: "gid",
                                                        to: "id"
                                                    }]
                                                },
                                                successPubs: [
                                                    {
                                                        outside: true,
                                                        event: "RoleTable.loadData"
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
                            url: '/sm/role/query.action'
                        }
                    }} />
                </Card>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "DetailModal", // id，必填*
                    pageId: "DetailModal", // 指定是哪个page调用modal，必填*
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
                    <Detail/>
                </ModalContainer>
            </div>
            
            
        );
    }
}

RolePage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(RolePage);
