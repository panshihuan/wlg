/**
 * 质检项目
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';

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
import AppTable from 'components/AppTable'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'

export class qualityInspectionItemsPage extends React.PureComponent {

    constructor(props) {

    super(props);

      pubsub.subscribe("CheckItemTable.onSelectedRows",(name,data)=>{
        //console.log("onSelectedRows",data)
        if(data.length > 1){
            pubsub.publish("CheckItemModifyBtn.enabled",false)
            pubsub.publish("CheckItemDeleteBtn.enabled",true)
        }else if(data.length == 1){
            pubsub.publish("CheckItemModifyBtn.enabled",true)
            pubsub.publish("CheckItemDeleteBtn.enabled",true)
        }else {
            pubsub.publish("@@message.error","请先创建,或者选择一行!")
        }
    })
        pubsub.subscribe("CheckItemTable.onSelectedRowsClear",()=>{
            pubsub.publish("CheckItemModifyBtn.enabled",false)
            pubsub.publish("CheckItemDeleteBtn.enabled",false)
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
          <Breadcrumb.Item>业务建模</Breadcrumb.Item>
          <Breadcrumb.Item>质量</Breadcrumb.Item>
          <Breadcrumb.Item>质检项目</Breadcrumb.Item>
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
                  id: "CheckItemCreateBtn",
                  title: "创建",
                  type: "primary",
                  size: "large",
                  visible: true,
                  enabled: true,
                  subscribes: [
                      {
                          event: "CheckItemCreateBtn.click",
                          pubs: [
                              {
                                  event: "@@navigator.push",
                                  payload: {
                                      url: "imeQualityInspectionItems/create"
                                  }
                              }
                          ]
                      }
                  ]
              }}/>
              <AppButton config={{
                  id: "CheckItemModifyBtn",
                  title: "修改",
                  type: "primary",
                  size: "large",
                  visible: true,
                  enabled: false,
                  subscribes: [
                      {
                          event: "CheckItemModifyBtn.click",
                          behaviors: [
                              {
                                  type: "fetch",
                                  id: "CheckItemTable", //要从哪个组件获取数据
                                  data: "selectedRows",//要从哪个组件的什么属性获取数据
                                  successPubs: [  //获取数据完成后要发送的事件
                                      {
                                          event: "@@navigator.push",
                                          mode: "payload&&eventPayload",
                                          payload: {
                                              url: "imeQualityInspectionItems/modify"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
              }}/>
              <AppButton config={{
                  id: "CheckItemDeleteBtn",
                  title: "删除",
                  type: "primary",
                  size: "large",
                  visible: true,
                  enabled: false,
                  subscribes: [
                      {
                          event: "CheckItemDeleteBtn.click",
                          behaviors:[
                              {
                                  type:"fetch",
                                  id: "CheckItemTable", //要从哪个组件获取数据
                                  data: "selectedRows",//要从哪个组件的什么属性获取数据
                                  successPubs: [  //获取数据完成后要发送的事件
                                      {
                                          event: "@@message.success",
                                          eventPayloadExpression: `
                                                //console.log("eventPayload1",eventPayload)

                                                let ids = []
                                                for(let index = 0; index < eventPayload.length;index++ ){
                                                //console.log("index",eventPayload[index])
                                                    ids.push(eventPayload[index].gid)
                                                }

                                                let dataSource = {
                                                    type: "api",
                                                    method: "POST",
                                                    mode:"dataContext",
                                                    url: "/ime/imeQcQualityCheckitem/deleteByIds.action",
                                                 }

                                                 let onSuccess = function(response){
                                                    if (response.success) {
                                                        pubsub.publish("@@message.success", "删除成功!");
                                                        pubsub.publish("CheckItemTable.loadData")
                                                    }else{
                                                        pubsub.publish("@@message.error", "删除失败!");
                                                    }
                                                }

                                                resolveDataSourceCallback({dataSource:dataSource,eventPayload:null,dataContext:ids},onSuccess);
                    `,
                                      }
                                  ]
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
            <AppTable name="CheckItemTable" config={{
                "id": "CheckItemTable",
                "name": "CheckItemTable",
                "type": "checkbox",//表格单选复选类型
                "size": "default",//表格尺寸
                "rowKey": "gid",//主键
                "onLoadData": true,//初始化是否加载数据
                "tableTitle": "质检项目列表",//表头信息
                "width": 900,//表格宽度
                "showSerial": true,//是否显示序号
                "editType": false,//是否增加编辑列
                "page": 1,//当前页
                "pageSize": 10,//一页多少条
                "isPager": true,//是否分页
                "isSearch": true,//是否显示模糊查询
                "columns": [
                    { title: '检验项目编码', width: 100, dataIndex: 'code', key: '1' },
                    { title: '检验项目名称', width: 100, dataIndex: 'name', key: '2' },
                    { title: '检验项目类型', width: 100, dataIndex: 'type', key: '3' },
                    { title: '工艺编码', width: 100, dataIndex: 'mdDefOperationGidRef.code', key: '4' },
                    { title: '工序名称', width: 100, dataIndex: 'mdDefOperationGidRef.name', key: '5' },

                ],
                // subscribes:[
                //     {
                //         event:'CheckItemTable.onSelectedRows',
                //         pubs:[
                //             {
                //                 event:''
                //             }
                //         ]
                //     }
                // ],
                dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/imeQcQualityCheckitem/query.action'
                }
            }} />
          </Card>

        </Row>
      </div>
    );
  }
}

qualityInspectionItemsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(qualityInspectionItemsPage);
