/*
 *
 * BusiUnitPage
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col} from 'antd';
import {Link} from 'react-router';
import pubsub from 'pubsub-js'
import AppTable from '../../../components/AppTable';
import DropdownButton from '../../../components/DropdownButton';
import AppButton from 'components/AppButton';


export class BusiUnitPage extends React.PureComponent {
    constructor(props) {
        super(props);

        pubsub.subscribe("busiUnitTable.onSelectedRows", (name, data) => {
            //console.log("rows", data);

            if ((data) && (data.length >= 1)) {
                pubsub.publish("delBtn.enabled", true);
                if (data.length == 1) {
                    pubsub.publish("modifyBtn.enabled", true);
                } else {
                    pubsub.publish("modifyBtn.enabled", false);
                }
            } else if ((data) && (data.length < 1)) {
                pubsub.publish("modifyBtn.enabled", false);
                pubsub.publish("delBtn.enabled", false);
            }
        })
        pubsub.subscribe("busiUnitTable.onSelectedRowsClear", (name, data) => {

            pubsub.publish("modifyBtn.enabled", false);
            pubsub.publish("delBtn.enabled", false);

        })
    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>业务单元</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true}
                      style={{"marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px"}}
                      bodyStyle={{
                          "paddingTop": "10px",
                          "paddingBottom": "10px",
                          "paddingLeft": "25px",
                          "paddingRight": "25px"
                      }}>
                    <Row>
                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "createBtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "createBtn.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "busiUnit/create"
                                                }
                                            }

                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "modifyBtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [

                                    {
                                        event: "modifyBtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "busiUnitTable", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        mode: "payload&&eventPayload",
                                                        payload: {
                                                            url: "busiUnit/modify"
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
                                id: "delBtn",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "delBtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "busiUnitTable", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@message.success",
                                                        eventPayloadExpression: `
                                                                                //console.log("eventPayload2",eventPayload);
                                                                                //callback(eventPayload.length)
                                                                                if(eventPayload.length>0){
                                                                                    let list=new Array();
                                                                                    for(let i=0;i<eventPayload.length;i++){
                                                                                        let dto=eventPayload[i];
                                                                                        if(dto&&dto.gid){
                                                                                            list.push(dto.gid);
                                                                                        }
                                                                                    }
                                                                                    //console.log(list);
                                                                                    let dataSource= {
                                                                                        type: "api",
                                                                                        mode:"dataContext",
                                                                                        method: "POST",
                                                                                        url: "/sm/busiUnit/deleteByIds.action"
                                                                                    };

                                                                                    let onSuccess = function(response){
                                                                                        if(response.success){
                                                                                            pubsub.publish("@@message.success","操作成功");
                                                                                            //页面刷新
                                                                                            pubsub.publish("busiUnitTable.loadData");
                                                                                            }else{
                                                                                            pubsub.publish("@@message.error",response.data);
                                                                                        }
                                                                                    }

                                                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:list,dataContext:list},onSuccess);


                                                                                }else{
                                                                                     pubsub.publish("@@message.error","请勾选记录再删除");
                                                                                }


                                                                                `,
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
                    <AppTable name="busiUnitTable" config={{
                        "id": "busiUnitTable",
                        "name": "busiUnitTable",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": true,//初始化是否加载数据
                        "tableTitle": "业务单元信息",//表头信息
                        "width": 500,//表格宽度
                        "showSerial": true,//是否显示序号
                        "editType": false,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 10,//一页多少条
                        "isPager": true,//是否分页
                        "isSearch": false,//是否显示模糊查询
                        "columns": [
                            {title: '业务单元编号', width: 100, dataIndex: 'busiUnitCode', key: '1'},
                            {title: '业务单元名称', width: 150, dataIndex: 'busiUnitName', key: '2'},
                            {title: '上级业务单元', width: 150, dataIndex: 'parentGidRef.busiUnitName', key: '3'}
                            /*,
                            {title: '创建时间', dataIndex: 'creatTime', key: '4', width: 60},
                            {title: '启用标志', dataIndex: 'active', key: '5', width: 20}*/
                        ],
                        rowOperationItem: [
                            {
                                id: "delBtn",
                                type: "linkButton",
                                title: "删除",
                                "width": 30,
                                subscribes: [
                                    {
                                        event: "delBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    paramsInQueryString: true,//参数拼在url后面
                                                    url: "/sm/busiUnit/delete.action",
                                                    payloadMapping: [{
                                                        from: "gid",
                                                        to: "id"
                                                    }]
                                                },
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@message.success",
                                                        payload: "删除成功"
                                                    },
                                                    {
                                                        event: "busiUnitTable.loadData"
                                                    }
                                                ],
                                                errorPubs: [
                                                    {
                                                        event: "@@message.error",
                                                        payload: "删除失败"
                                                    }
                                                ]

                                            }
                                        ]
                                    },


                                ]
                            }
                        ],
                        subscribes: [],
                        dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/sm/busiUnit/query.action'
                        }
                    }}/>
                </Card>
            </div>
        );
    }
}

BusiUnitPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(BusiUnitPage);
