import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col} from 'antd';
import pubsub from 'pubsub-js'
import {Link} from 'react-router';

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
import FindbackField from 'components/Form/FindbackField'
import ModalContainer from 'components/ModalContainer'
import AppTable from 'components/AppTable';

export class QualityStandardPage extends React.PureComponent {
    constructor(props) {
        super(props);

        pubsub.subscribe("qualityStandardTable.onSelectedRows", (name, data) => {
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
        pubsub.subscribe("qualityStandardTable.onSelectedRowsClear", (name, data) => {

            pubsub.publish("modifyBtn.enabled", false);
            pubsub.publish("delBtn.enabled", false);

        })
    }


    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>质量</Breadcrumb.Item>
                    <Breadcrumb.Item>质检标准</Breadcrumb.Item>
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
                                                    url: "imeQualityStandard/create"
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
                                                id: "qualityStandardTable", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        mode: "payload&&eventPayload",
                                                        payload: {
                                                            url: "imeQualityStandard/modify"
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
                                                id: "qualityStandardTable", //要从哪个组件获取数据
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
                                                                                        url: "/ime/imeQcQualityStandard/deleteByIds.action"
                                                                                    };

                                                                                    let onSuccess = function(response){
                                                                                        if(response.success){
                                                                                            pubsub.publish("@@message.success","操作成功");
                                                                                            //页面刷新
                                                                                            pubsub.publish("qualityStandardTable.loadData");
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
                    <AppTable name="qualityStandardTable" config={{
                        "id": "qualityStandardTable",
                        "name": "qualityStandardTable",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": true,//初始化是否加载数据
                        "tableTitle": "质检标准信息",//表头信息
                        "width": 700,//表格宽度
                        "showSerial": true,//是否显示序号
                        "editType": false,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 10,//一页多少条
                        "isPager": true,//是否分页
                        "isSearch": false,//是否显示模糊查询
                        "columns": [
                            {title: '质检标准编码', width: 100, dataIndex: 'code', key: '1'},
                            {title: '物料编码', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '2'},
                            {title: '物料名称', width: 100, dataIndex: 'productGidRef.materialGidRef.name', key: '3'},
                            {title: '规格', width: 50, dataIndex: 'productGidRef.materialGidRef.spec', key: '4'},
                            {title: '型号', width: 50, dataIndex: 'productGidRef.materialGidRef.model', key: '5'},
                            {
                                title: '单位',
                                width: 50,
                                dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name',
                                key: '6'
                            },
                            {title: '质检方式', width: 100, dataIndex: 'qualityWayGidRef.name', key: '7'},
                            {title: '工艺路线', width: 100, dataIndex: 'productGidRef.routePathRef.name', key: '8'}
                        ],
                        subscribes: [],
                        dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/ime/imeQcQualityStandard/query.action'
                        }
                    }}/>
                </Card>
            </div>
        );
    }
}


QualityStandardPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(QualityStandardPage);
