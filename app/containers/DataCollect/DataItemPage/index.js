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

const validate = values => {
    const errors = {}
    if (!values.get('busiGroupCode')) {
        errors.busiGroupCode = '必填项'
    }
    return errors
}

export class DataItemPage extends React.PureComponent {

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
                    <Breadcrumb.Item>采集项</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={12}>
                            <AppButton config={{
                                id: "itemcrebtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "itemcrebtn.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "dataItemcreate"
                                                }
                                            }

                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "itemmodibtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "itemmodibtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "item", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        mode: "payload&&eventPayload",
                                                        payload: {
                                                            url: "dataItemmodify"
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                        /*pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "dataItemmodify"
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
                                                id: "item", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@message.success",
                                                        eventPayloadExpression: `
                                                                console.log(eventPayload[0]);
                                                               let dataSource = {
                                                                    type: 'api',
                                                                    method: 'post',
                                                                    url: '/sm/dcDataItem/delete.action?id='+eventPayload[0].gid,
                                                                }

                                                                resolveDataSource({
                                                                    dataSource: dataSource
                                                                }).then(function (response) {
                                                                        pubsub.publish("item.loadData");

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
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 24 }>
                            <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                                <AppTable name="item" config={{
                                    "id": "item",
                                    "name": "item",
                                    "type": "checkbox",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": true,//初始化是否加载数据
                                    "tableTitle": "采集项",//表头信息
                                    "width": 600,//表格宽度
                                    "showSerial": true,//是否显示序号
                                    "editType": false,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "columns": [
                                        { title: '采集项编码', width: 150, dataIndex: 'dcItemCode', key: '1' },
                                        { title: '采集项名称', width: 150, dataIndex: 'dcItemName', key: '2' },
                                        { title: '采集项类型', width: 150, dataIndex: 'dcItemTypeGid', key: '3' }
                                    ],
                                    subscribes: [
                                        {
                                            event:'item.onSelectedRows',
                                            pubs:[
                                                {
                                                    event:'itemdelbtn.dataContext'
                                                }
                                            ]
                                        },
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/sm/dcDataItem/query.action'
                                    }
                                }} />


                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}



DataItemPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
    form: "DataItemPage",
    validate,
})(DataItemPage)