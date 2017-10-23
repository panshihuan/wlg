import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppTable from '../../../components/AppTable';
import DropdownButton from '../../../components/DropdownButton';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import TreeField from '../../../components/Form/TreeField';
import AutoCompleteField from '../../../components/Form/AutoCompleteField';

import TextField from 'components/Form/TextField'
import DateField from 'components/Form/DateField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import TextAreaField from 'components/Form/TextAreaField'
import CraftModal from './Craft'

const validate = values => {
    const errors = {}
    if (!values.get('busiGroupCode')) {
        errors.busiGroupCode = '必填项'
    }
    return errors
}

export class DataTemplatePage extends React.PureComponent {

    //构造
    constructor(props) {
        super(props);

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
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>采集模板1</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={12}>
                            <AppButton config={{
                                id: "templatecrebtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "templatecrebtn.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "dataTemplateCreate"
                                                }
                                            }

                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "templatemodibtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "templatemodibtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "template", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        mode: "payload&&eventPayload",
                                                        payload: {
                                                            url: "dataTemplateModify"
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                        /*pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "dataTemplateModify"
                                                }
                                            }

                                        ]*/
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "itemdelbtn",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "itemdelbtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "template", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@message.success",
                                                        eventPayloadExpression: `
                                                                console.log(eventPayload[0]);
                                                               let dataSource = {
                                                                    type: 'api',
                                                                    method: 'post',
                                                                    url: '/sm/dcDataTemplate/delete.action?id='+eventPayload[0].gid,
                                                                }

                                                                resolveDataSource({
                                                                    dataSource: dataSource
                                                                }).then(function (response) {
                                                                        pubsub.publish("template.loadData");

                                                                }.bind(this))
                                                            `
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "selectCraftBtn",
                                title: "分配",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "selectCraftBtn.click",
                                        pubs: [
                                            {
                                                event:"template.expression",
                                                meta: {
                                                    expression:`
                                                           resolveFetch({fetch:{id:"DataTemplatePage",data:"@@formValues"}}).then(function (value) {
                                                                console.log("kkk")
                                                                console.log(value)
                                                                if(value == undefined){
                                                                     pubsub.publish('@@message.error',"请选择模板！")
                                                                } else if( value.templateGid.length > 1){
                                                                    pubsub.publish('@@message.error',"只能选择一个模板添加到工序！")
                                                                } else{
                                                                    pubsub.publish('selectCraft.openModal');
                                                                }
                                                          })
                                                    `
                                                }
                                            }
                                        ]
                                       /* pubs: [
                                            {
                                                event: "selectCraft.openModal",
                                            }
                                        ]*/
                                    }
                                ]
                            }}>
                            </AppButton>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 24 }>
                            <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                                <AppTable name="template" config={{
                                    "id": "template",
                                    "name": "template",
                                    "type": "checkbox",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": true,//初始化是否加载数据
                                    "tableTitle": "采集模板",//表头信息
                                    "width": 600,//表格宽度
                                    "showSerial": true,//是否显示序号
                                    "editType": false,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "columns": [
                                        { title: '采集模板编码', width: 150, dataIndex: 'dcTemplateCode', key: '1' },
                                        { title: '采集模板名称', width: 150, dataIndex: 'dcTemplateName', key: '2' },
                                        {title: '模板结构', width: 150, dataIndex: 'templateStructureGid', key: '3'},
                                        { title: '采集项数', width: 150, dataIndex: 'collectCount', key: '4' },
                                        { title: '适用对象', width: 150, dataIndex: 'dcAdapaterGid', key: '5' },
                                        { title: '备注', width: 150, dataIndex: 'descript', key: '6' }
                                    ],
                                    subscribes: [
                                        {
                                            event:'template.onSelectedRows',
                                            behaviors:[
                                                {
                                                    type:"fetch",
                                                    id: "template", //要从哪个组件获取数据
                                                    data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event:"@@message.success",
                                                            eventPayloadExpression:`
                                                                console.log("cvbcvbcvb");
                                                                console.log(eventPayload[0].gid);
                                                                pubsub.publish("@@form.change",  { id: "DataTemplatePage",name:"templateGid" ,value: eventPayload })
                                                            `
                                                        }

                                                    ]
                                                }
                                            ]

                                        }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/sm/dcDataTemplate/query.action'
                                    }
                                }} />


                            </Card>
                        </Col>
                    </Row>
                </Card>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "selectCraft", // id，必填*
                    pageId: "selectCraft", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "选择工序", // title，不传则不显示title
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
                    <CraftModal/>
                </ModalContainer>
            </div>
        );
    }
}



DataTemplatePage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
    form: "DataTemplatePage",
    validate,
})(DataTemplatePage)