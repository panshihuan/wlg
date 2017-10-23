import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Breadcrumb, Card, Row, Col} from 'antd';

import AppButton from 'components/AppButton'
import AppTable from 'components/AppTable'
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
import FindbackField from 'components/Form/FindbackField'

export class LogisticsTimePage extends React.PureComponent {
  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>业务建模</Breadcrumb.Item>
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>物料时间方案</Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{width: "100%", backgroundColor: "#f9f9f9"}} bodyStyle={{padding: "15px"}}>
          <Row>
            <Col>
              <AppButton config={{
                id: "logistics-time-add-btn-1",
                title: "创建",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "logistics-time-add-btn-1.click",
                    pubs: [
                      {
                        event: "@@navigator.push",
                        payload: {
                          url: "addLogisticsTime"
                        }
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "logistics-time-edit-btn-2",
                title: "修改",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "logistics-time-edit-btn-2.click",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "logisticsTimeGrid", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            mode: "payload&&eventPayload",
                            payload: {
                              url: "editLogisticsTime"
                            }
                          }
                        ]
                      }
                    ],
                  },

                  {
                    event: "logisticsTimeGrid.onSelectedRows",
                    pubs: [
                      {event: "logistics-time-edit-btn-2.dataContext"},
                      {
                        event: "logistics-time-edit-btn-2.expression",
                        meta: {
                          expression: `
                            if(dataContext && dataContext.length == 1) {
                              pubsub.publish("logistics-time-edit-btn-2.enabled", true);
                            } else {
                              pubsub.publish("logistics-time-edit-btn-2.enabled", false);
                            }
                          `
                        }
                      }
                    ]
                  },

                  {
                    event: "logisticsTimeGrid.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "logistics-time-edit-btn-2.enabled",
                        payload: false
                      }
                    ]
                  },
                  {
                    event: "logistics-time-edit-btn-2.click",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "logisticsTimeGrid", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            mode: "payload&&eventPayload",
                            payload: {
                              url: "editLogisticsTime"
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
                id: "logistics-time-del-btn-3",
                title: "删除",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "logisticsTimeGrid.onSelectedRows",
                    pubs: [
                      {
                        event: "logistics-time-del-btn-3.dataContext"
                      }
                    ]
                  },
                  {
                    event: "logisticsTimeGrid.onSelectedRows",
                    pubs: [
                      {
                        event: "logistics-time-del-btn-3.enabled",
                        payload: true
                      }
                    ]
                  },
                  {
                    event: "logisticsTimeGrid.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "logistics-time-del-btn-3.enabled",

                        //sdfsd
                        payload: false
                      }
                    ]
                  },
                  {
                    event: 'logistics-time-del-btn-3.click',
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "post",
                          url: "/ime/mdMrlTimeProgram/batchDelete.action",
                          payloadMapping: [{
                            from: "dataContext",
                            to: "@@Array",
                            key: 'gid',
                            // paramKey:"ids"
                          }],
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            payload: '删除成功!'
                          },
                          {
                            outside: true,
                            event: "logisticsTimeGrid.loadData"
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
                  }
                ]
              }}>
              </AppButton>
            </Col>
          </Row>
        </Card>
        <Card style={{width: "100%", marginTop: "15px"}} bodyStyle={{padding: "15px"}}>
          <AppTable name="logisticsTimeGrid" config={{
            "id": "logisticsTimeGrid",
            "name": "logisticsTimeGrid",
            "type": "checkbox",//表格单选复选类型
            "size": "default",//表格尺寸
            "rowKey": "gid",//主键
            "onLoadData": true,//初始化是否加载数据
            "tableTitle": "物料时间方案",//表头信息
            "width": 850,//表格宽度
            "showSerial": true,//是否显示序号
            "editType": false,//是否增加编辑列
            "page": 1,//当前页
            "pageSize": 10,//一页多少条
            "isPager": true,//是否分页
            "isSearch": true,//是否显示模糊查询
            "columns": [
              {title: '时间方案编号', width: 150, dataIndex: 'code', key: '1'},
              {title: '时间方案名称', width: 150, dataIndex: 'name', key: '2'},
              {title: '时间依据', dataIndex: 'timeBasis', key: '3', width: 200},
              {title: '提前天数', dataIndex: 'advanceDayNum', key: '4', width: 150},
              {title: '指定时间', dataIndex: 'assignTime', key: '5', width: 200},
            ],
            dataSource: {
              type: 'api',
              method: 'post',
              pager: true,
              url: '/ime/mdMrlTimeProgram/query.action'
            },
          }}/>
        </Card>
      </div>
    );
  }
}

LogisticsTimePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
  form: "logisticsTimeForm",
})(LogisticsTimePage)