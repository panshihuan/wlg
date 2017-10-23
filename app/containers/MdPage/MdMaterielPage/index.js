/*
 *
 * MdMaterielPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import pubsub from 'pubsub-js';
import { Link } from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppTable from '../../../components/AppTable/index';
import DropdownButton from '../../../components/DropdownButton/index';
import {fromJS} from 'immutable'
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer';
import TreeField from '../../../components/Form/TreeField/index';
import AutoCompleteField from '../../../components/Form/AutoCompleteField/index';
import TableField from 'components/Form/TableField';
import Immutable from 'immutable';

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

const TabPane = Tabs.TabPane;
export class MdMaterielPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            index:[],
            dataSource:[],
            parms:undefined,
            newDataSource:undefined
        };

    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>物料</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "createMaterielBtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    /*{
                                        event: "createMaterielBtn.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "mdMateriel/materielDetail"
                                                }
                                            }
                                        ]
                                    }*/
                                    {
                                        event: "createMaterielBtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                        id: "materielTypeTree", //要从哪个组件获取数据
                                                        data: "dataContext",//要从哪个组件的什么属性获取数据
                                                        successPubs: [  //获取数据完成后要发送的事件
                                                            {
                                                                event: "@@navigator.push",
                                                                eventPayloadExpression:`
                                                        //console.log(eventPayload);
                                                        //console.log(me);
                                                        callback({url:"mdMateriel/materielDetail",treeData:eventPayload})
                                                        `,
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "modifyMaterielBtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"materielTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: 'materielTable.expression',
                                                meta: {
                                                    expression: `
                                                    //console.log("HHHHHHHHHHHH");
                                                    console.log(data);
                                                    if(data.eventPayload.length>=2){
                                                        pubsub.publish("modifyMaterielBtn.enabled",false);
                                                    }else{
                                                        pubsub.publish("modifyMaterielBtn.enabled",true);
                                                    }
                      `
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        event:"materielTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "modifyMaterielBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "modifyMaterielBtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "materielTable", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        mode: "payload&&eventPayload",
                                                        payload: {
                                                            url: "mdMateriel/modify"
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
                                id: "deleteMaterielBtn",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"materielTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "deleteMaterielBtn.enabled",
                                                payload:true
                                            }
                                        ]
                                    },
                                    {
                                        event:"materielTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "deleteMaterielBtn.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "materielTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "deleteMaterielBtn.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "deleteMaterielBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/mdMaterielInfo/batchDelete.action",
                                                    paramsInQueryString:false,//参数拼在url后面
                                                    payloadMapping:[{
                                                        from: "dataContext",
                                                        to: "@@Array",
                                                        key: "gid"
                                                    }]
                                                },
                                                successPubs: [
                                                    {
                                                        event: "@@message.success",
                                                        payload:'删除成功!'
                                                    },
                                                    {
                                                        event: "materielTable.loadData"
                                                    }
                                                ],
                                                errorPubs: [
                                                    {
                                                        event: "@@message.error",
                                                        payload:'删除失败!'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}/>


                        </Col>
                    </Row>
                </Card>
                <Row>
                    <Col span={ 7 }>
                        <Card bordered={true} style={{ width: "100%", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                            <Row>
                                <Col>
                                    <Field config={{
                                        id: 'materielTypeTree', //组件id //busiGroupTree001
                                        search: false,
                                        enabled: true,
                                        visible: true,
                                        // defaultExpandedKeys: ['0-0-0', '0-0-1'],
                                        // defaultSelectedKeys: ['0-0-0', '0-0-1'],
                                        // defaultCheckedKeys: ['0-0-0', '0-0-1'],
                                        checkable: false, //复选框
                                        showLine: false,
                                        draggable: false, //是否可以拖拽
                                        searchBoxWidth: 300,
                                        dataSource: {
                                            type: "api",
                                            method: "POST",
                                            url: '/ime/mdMaterielType/getTreeData.action'
                                        },

                                    }} name="materielTypeTree"  component={ TreeField } />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={16} >
                        <Card bordered={true} >
                            <Row>
                                  <Card bordered={true} >
                                    <AppTable name="materielTable" config={{
                                    "id": "materielTable",
                                    "name": "materielTable",
                                    "type": "checkbox",//表格单选复选类型 复选:checkbox   单选:radio
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": true,//初始化是否加载数据
                                    //"tableTitle": "",//表头信息
                                    "width": 800,//表格宽度
                                    "showSerial": true,//是否显示序号
                                    "editType": true,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "columns": [
                                        { title: '物料编码', width: 120, dataIndex: 'code', key: '1' },
                                        { title: '物料名称', width: 120, dataIndex: 'name', key: '2' },
                                        { title: '物料分类', width: 120, dataIndex: 'materielTypeGidRef.name', key: '3' },
                                        { title: '规格', width: 100, dataIndex: 'spec', key: '4' },
                                        { title: '型号', dataIndex: 'model', key: '5', width: 100 },
                                        { title: '主单位', dataIndex: 'measurementUnitGidRef.name', key: '6', width: 100 }

                                    ],
                                    rowOperationItem: [
                                        {
                                            id: "deleteMaterielRow",
                                            type: "linkButton",
                                            title: "删除",
                                            subscribes: [
                                                {
                                                    event: "deleteMaterielRow.click",
                                                    behaviors: [
                                                        {
                                                            type: "request",
                                                            dataSource: {
                                                                type: "api",
                                                                method: "POST",
                                                                url: "/ime/mdMaterielInfo/batchDelete.action",
                                                                paramsInQueryString:false,//参数拼在url后面
                                                                payloadMapping:[{
                                                                    from: "dataContext",
                                                                    to: "@@Array",
                                                                    key: "gid"
                                                                }]

                                                            },
                                                            successPubs: [
                                                                {
                                                                    outside:true,
                                                                    event: "@@message.success",
                                                                    payload:'删除成功!'
                                                                },
                                                                {
                                                                    outside:true,
                                                                    event: "materielTable.loadData",
                                                                }
                                                            ],
                                                            errorPubs: [
                                                                {
                                                                    event: "@@message.error",
                                                                    payload:'删除失败!'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },


                                            ]
                                        }
                                    ],
                                subscribes:[
                                    {
                                        event:'materielTypeTree.onSelect',

                                        pubs: [
                                            {

                                                event: "materielTable.expression",//在某个组件上执行表达式
                                                meta: {
                                                    expression: `
                                console.log("happy");
                                let nodeGid = data.eventPayload.selectedKeys["0"];
                                console.log(data.eventPayload.selectNode);
                                console.log(nodeGid);
                                let params = {};
                                if("-1"!=nodeGid){
                                    var query =[{
                                        "field":"materielTypeGid",
                                        "type":"eq",
                                        "value":nodeGid,
                                        "operator":"and"
                                    }];
                                    var params = {
                                      "query":{
                                        "query":query
                                      }
                                    };
                                   pubsub.publish("materielTypeTree.dataContext",{eventPayload:{nodeName:data.eventPayload.selectNode.name,nodeGid:data.eventPayload.selectNode.id}});
                                    }else{
                                    pubsub.publish("materielTypeTree.dataContext",{eventPayload:{}});
                                    }
                                let dataSource= {
                                  type: "api",
                                  mode:"dataContext",
                                  method: "POST",
                                  url: "/ime/mdMaterielInfo/query.action"
                                };
                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},
                                  function(res){
                                    me.setState({dataSource:res.data});
                                  }
                                )
                       `
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        event:'materielTypeTree.onSelect',
                                        pubs: [
                                            {
                                                event: "createMaterielBtn.enabled",
                                                payload:true
                                            }
                                        ]
                                    }
                                ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        pager:true,
                                        url: '/ime/mdMaterielInfo/query.action'
                                    }
                                }} />
                                </Card>
                            </Row>
                        </Card>
                    </Col>
                </Row>

            </div>
    );
  }
}

MdMaterielPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
export default reduxForm({
    form: "MdMaterielPage",
    validate,
})(MdMaterielPage)
