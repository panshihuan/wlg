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
import DicAddModal from './dicAdd'
import DicModifyModal from './dicModify'
import DicValueAddModal from './dicValueAdd'
import DicValueModifyModal from './dicValueModify'

const validate = values => {
    const errors = {}
    if (!values.get('busiGroupCode')) {
        errors.busiGroupCode = '必填项'
    }
    return errors
}

export class SchemePage extends React.PureComponent {

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
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>字典管理</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={12}>
                            <AppButton config={{
                                id: "diccrebtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "diccrebtn.click",
                                        pubs: [
                                            {
                                                event: "addDicPage.openModal",
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "dicmodibtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "dicmodibtn.click",
                                        pubs: [
                                            {
                                                event: "modifyDicPage.openModal",
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "dicdelbtn",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event:'dicdelbtn.click',
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "dic", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "dic.loadData",
                                                        eventPayloadExpression:`
                                                                console.log(1233123123213112312)
                                                                var condition = eventPayload[0].gid;

                                                             let formValue = [];
                                                             formValue.push(condition);

                                                             let dataSource= {
                                                                  type: "api",
                                                                  method: "POST",
                                                                  mode:"dataContext",
                                                                  url: "/sm/dictionaryEnum/deleteByIds"
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
                                                            `
                                                    },
                                                    {
                                                        event: "dic.loadData",
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                        </Col>

                        <Col span={8}>
                            <AppButton config={{
                                id: "dicvaluecrebtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "dicvaluecrebtn.click",
                                        pubs: [
                                            {
                                                event: "addDicValuePage.openModal",
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "dicvaluemodibtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "dicvaluemodibtn.click",
                                        pubs: [
                                            {
                                                event: "modifyDicValuePage.openModal",
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "dicvaluedelbtn",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event:'dicvaluedelbtn.click',
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "dicvalue", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "dicvalue.expression",
                                                        eventPayloadExpression:`

                                                                 let formValue = [];
                                                                 for(var i =0;i < eventPayload.length;i++){
                                                                    formValue.push(eventPayload[i].gid);
                                                                 }


                                                                 let dataSource= {
                                                                      type: "api",
                                                                      method: "POST",
                                                                      mode:"dataContext",
                                                                      url: "/sm/dictionaryEnumValue/deleteByIds"
                                                                    };

                                                                    resolveDataSourceCallback(
                                                                        {
                                                                            dataSource:dataSource,eventPayload:formValue,dataContext:formValue
                                                                        },
                                                                      function(res){

                                                                      },
                                                                      function(){
                                                                      }
                                                                    )

                                                                `
                                                    }
                                                ]
                                            },
                                            {
                                                type: "fetch",
                                                id: "dic", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    ,
                                                    {
                                                        event: "dicvalue.loadData",
                                                        eventPayloadExpression:`
                                                                    let condition = eventPayload[0].gid;

                                                                   let params = {
                                                                  "query": {
                                                                    "query": [
                                                                       {
                                                                            "left":"(",
                                                                            "field":"smDictionaryEnumGid",
                                                                            "type":"eq",
                                                                            "value":condition,
                                                                            "right":")",
                                                                            "operator":"and"
                                                                       }
                                                                     ],
                                                                     "sorted":"gid asc"
                                                                  }
                                                                }
                                                                callback({eventPayload:params})
                                                                `
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
                    <Row>
                        <Col span={ 12 }>
                            <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                                <AppTable name="dic" config={{
                                    "id": "dic",
                                    "name": "dic",
                                    "type": "radio",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": true,//初始化是否加载数据
                                    "tableTitle": "字典",//表头信息
                                    "width": 600,//表格宽度
                                    "showSerial": false,//是否显示序号
                                    "editType": false,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "columns": [
                                        { title: '字典', width: 150, dataIndex: 'code', key: '1' },
                                        { title: '字典名称', width: 150, dataIndex: 'name', key: '2' },
                                       /* { title: '说明', width: 150, dataIndex: 'description', key: '3' },
                                        { title: 'ID', width: 150, dataIndex: 'gid', key: '4' }*/
                                    ],
                                    subscribes: [

                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/sm/dictionaryEnum/query.action'
                                    }
                                }} />


                            </Card>
                        </Col>
                        <Col span={ 12 }>
                            <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                                <AppTable name="dicvalue" config={{
                                    "id": "dicvalue",
                                    "name": "dicvalue",
                                    "type": "checkbox",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": false,//初始化是否加载数据
                                    "tableTitle": "字典值",//表头信息
                                    "width": 600,//表格宽度
                                    "showSerial": false,//是否显示序号
                                    "editType": false,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "columns": [
                                        { title: '字典值编号', width: 150, dataIndex: 'code', key: '1' },
                                        { title: '字典值名称', width: 150, dataIndex: 'val', key: '2' },
                                        /*{ title: '说明11', width: 150, dataIndex: 'description', key: '3' },
                                        { title: '管理失效时间', width: 150, dataIndex: 'endTime', key: '4' }*/
                                    ],
                                    dataSource:{
                                        type: "api",
                                        method: "POST",
                                        url: "/sm/dictionaryEnumValue/query"
                                    },
                                    subscribes: [
                                        {
                                            event:'dic.onSelectedRows',
                                            behaviors: [
                                                {
                                                    type: "fetch",
                                                    id: "dic", //要从哪个组件获取数据
                                                    data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "dicvalue.loadData",
                                                            eventPayloadExpression:`
                                                                let condition = eventPayload[0].gid;

                                                               let params = {
                                                              "query": {
                                                                "query": [
                                                                   {
                                                                        "left":"(",
                                                                        "field":"smDictionaryEnumGid",
                                                                        "type":"eq",
                                                                        "value":condition,
                                                                        "right":")",
                                                                        "operator":"and"
                                                                   }
                                                                 ],
                                                                 "sorted":"gid asc"
                                                              }
                                                            }
                                                            callback({eventPayload:params})
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

                    </Row>
                </Card>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "addDicPage", // id，必填*
                    pageId: "addDicPage", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "新增字典", // title，不传则不显示title
                    closable: true, // 是否显示右上角关闭按钮，默认不显示
                    width: "50%", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: {top: 120}, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >
                    <DicAddModal/>
                </ModalContainer>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "modifyDicPage", // id，必填*
                    pageId: "modifyDicPage", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "修改字典", // title，不传则不显示title
                    closable: true, // 是否显示右上角关闭按钮，默认不显示
                    width: "50%", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: {top: 120}, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >
                    <DicModifyModal/>
                </ModalContainer>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "addDicValuePage", // id，必填*
                    pageId: "addDicValuePage", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "新增字典值", // title，不传则不显示title
                    closable: true, // 是否显示右上角关闭按钮，默认不显示
                    width: "50%", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: {top: 120}, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >
                    <DicValueAddModal/>
                </ModalContainer>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "modifyDicValuePage", // id，必填*
                    pageId: "modifyDicValuePage", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "修改字典值", // title，不传则不显示title
                    closable: true, // 是否显示右上角关闭按钮，默认不显示
                    width: "50%", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: {top: 120}, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >
                    <DicValueModifyModal/>
                </ModalContainer>
            </div>
        );
    }
}



SchemePage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
    form: "SchemePage",
    validate,
})(SchemePage)