/*
*
* Manage Rule
* 维护日历规则页面
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import pubsub from 'pubsub-js'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable'
import AppTable from 'components/AppTable';
import AppButton from "components/AppButton"
import TreeField from 'components/Form/TreeField';
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import ModalContainer from 'components/ModalContainer'

import CalendarRuleCreateModal from './CalendarRuleCreateModal'
import CalendarRuleModifyModal from './CalendarRuleModifyModal'
import TextField from 'components/Form/TextField';
import FindbackField from 'components/Form/FindbackField';
import SelectField from 'components/Form/SelectField'
import SwitchField from 'components/Form/SwitchField'

export class ManageRulePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    id = "";

    constructor(props) {
        super(props);
        debugger

        let modifyId = this.props.location.state[0].gid;
        this.id = modifyId;
        console.log(this.id)

    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>日历</Breadcrumb.Item>
                    <Breadcrumb.Item>日历规则</Breadcrumb.Item>
                </Breadcrumb>
                <Row>
                    <Card bordered={true}
                          style={{
                              width: "100%",
                              marginRight: "20px",
                              marginTop: "20px",
                              minHeight: "20px",
                              "backgroundColor": "rgba(247, 247, 247, 1)"
                          }}
                          bodyStyle={{padding: "15px"}}>

                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "CalendarRuleCreateBtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "CalendarRuleCreateBtn.click",
                                        pubs: [
                                            {
                                                event: "CalendarRuleCreateModal.openModal",
                                            }
                                        ]
                                    }
                                ]
                            }}/>
                            <AppButton config={{
                                id: "CalendarRuleModifyBtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "CalendarRuleModifyBtn.click",
                                        pubs: [
                                            {
                                                event: "CalendarRuleModifyModal.openModal",
                                            }
                                        ]
                                    }, {
                                        event:"CalendarRuleTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "CalendarRuleModifyBtn.enabled",
                                                payload:true
                                            }
                                        ]
                                    },
                                    {
                                        event:"CalendarRuleTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "CalendarRuleModifyBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                ]
                            }}/>
                            <AppButton config={{
                                id: "CalendarRuleCancelBtn",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "CalendarRuleCancelBtn.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "/calendar"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}/>
                        </Col>
                    </Card>
                </Row>

                <Row>
                    <Card bordered={true}>
                        <AppTable name="CalendarRuleTable" config={{

                            "id": "CalendarRuleTable",
                            "name": "CalendarRuleTable",
                            "type": "radio",//表格单选复选类型
                            "size": "default",//表格尺寸
                            "rowKey": "gid",//主键
                            "onLoadData": true,//初始化是否加载数据
                            "tableTitle": "日历规则列表",//表头信息
                            "width": 900,//表格宽度
                            "showSerial": true,//是否显示序号
                            "editType": true,//是否增加编辑列
                            "page": 1,//当前页
                            "pageSize": 10,//一页多少条
                            "isPager": true,//是否分页
                            "isSearch": true,//是否显示模糊查询
                            "columns": [
                                {title: '规则编码', width: 100, dataIndex: 'ruleCode', key: '1'},
                                {title: '规则名称', width: 100, dataIndex: 'ruleName', key: '2'},
                                {title: '工作日', width: 100, dataIndex: 'isWorkday', key: '3'}

                            ],
                            rowOperationItem: [
                                {
                                    id: "CalendarRuleTableDeleteLinkBtn",
                                    type: "linkButton",
                                    title: "删除",
                                    subscribes: [
                                        {
                                            event: "CalendarRuleTableDeleteLinkBtn.click",
                                            behaviors: [
                                                {
                                                    type: "request",
                                                    dataSource: {
                                                        type: "api",
                                                        method: "POST",
                                                        paramsInQueryString: true,//参数拼在url后面
                                                        url: "/sm/calendarRule/delete",
                                                        payloadMapping: [{
                                                            from: "gid",
                                                            to: "id"
                                                        }]
                                                    },
                                                    successPubs: [
                                                        {
                                                            outside: true,
                                                            event: "CalendarRuleTable.loadData"
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
                                url: '/sm/calendarRule/query.action',
                                mode: "payload",
                                payload: {
                                    "query": {
                                        "query": [
                                            {
                                                "field": "smCalendarGid",
                                                "type": "eq",
                                                "value": this.id
                                            }
                                        ]
                                    }
                                }
                            }
                        }}/>
                    </Card>
                </Row>

                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "CalendarRuleCreateModal", // id，必填*
                    pageId: "CalendarRuleCreateModal", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    //title: "", // title，不传则不显示title
                    closable: true, // 是否显示右上角关闭按钮，默认不显示
                    width: "70%", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: {top: 120}, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >
                    <CalendarRuleCreateModal {...this.props}/>
                </ModalContainer>

                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "CalendarRuleModifyModal", // id，必填*
                    pageId: "CalendarRuleModifyModal", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    //title: "", // title，不传则不显示title
                    closable: true, // 是否显示右上角关闭按钮，默认不显示
                    width: "70%", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: {top: 120}, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >
                    <CalendarRuleModifyModal {...this.props}/>
                </ModalContainer>
            </div>
        );
    }
}

ManageRulePage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(ManageRulePage);
