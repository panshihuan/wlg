import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col ,Tabs} from 'antd';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from "components/AppButton"
import ModalContainer from 'components/ModalContainer'
import StaffAdd from './staffAdd'
import DeviceAdd from './deviceAdd'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'

const TabPane = Tabs.TabPane;

export class DispatchOrderAllotModal extends React.PureComponent {
  constructor(props) {
    super(props);

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
        <Tabs>
          <TabPane tab="人员/班组" key="1">
            <Row>
              <Col span={6} offset={20}>
                <AppButton config={{
                  id: "AllotModal-staff-add",
                  title: "增加",
                  type:"primary",
                  size:"large",
                  visible: true,
                  enabled: true,
                  subscribes: [
                    {
                      event:"AllotModal-staff-add.click",
                      pubs:[
                        {
                          event:"dispatchAllot-modal-staff.openModal"
                        }
                      ]
                    }
                  ]

                }} />
                <AppButton config={{
                  id: "AllotModal-staff-del",
                  title: "删除",
                  type:"default",
                  size:"large",
                  visible: true,
                  enabled: false,
                  subscribes: [
                    {
                      event:"AllotModal-table-staff.onSelectedRows",
                      pubs:[
                        {
                          event:"AllotModal-staff-del.enabled",
                          payload:true
                        },
                        {
                          event:"AllotModal-staff-del.dataContext"
                        }
                      ]
                    },
                    {
                      event:"AllotModal-table-staff.onSelectedRowsClear",
                      pubs:[
                        {
                          event:"AllotModal-staff-del.enabled",
                          payload:false
                        }
                      ]
                    },
                    {
                      event:"AllotModal-staff-del.click",
                      behaviors: [
                        {
                          type: "request",
                          dataSource: {
                            type: "api",
                            method: 'post',
                            url: '/ime/imeTrackOrder/deleteTeamPersonByOrderGids.action',
                            mode:"dataContext",
                            bodyExpression:`
                              var ids = []
                              var gids = []
                              resolveFetch({fetch:{id:"dispatchOrder-btn-4",data:"dataContext"}}).then(function (data) {
                                for(var m=0;m<data.length;m++){
                                  ids.push(data[m]["gid"])
                                }
                                for(var n=0;n<dataContext.length;n++){
                                  gids.push(dataContext[n]["gid"])
                                }
                                callback({trackOrderGids:ids,gids:gids})
                              })
                            `,
                          },
                          successPubs: [  //获取数据完成后要发送的事件
                            {
                              event: "@@message.success",
                              payload: "删除成功"
                            },
                            {
                              event: "AllotModal-staff-del.success"
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
                }} />
              </Col>
            </Row>
            <AppTable name="dispatchOrder" config={{
              "id": "AllotModal-table-staff",
              "name": "AllotModal-table-staff",
              "type": "checkbox",//表格单选复选类型
              "size": "default",//表格尺寸
              "rowKey": "gid",//主键
              "onLoadData": false,//初始化是否加载数据
              "tableTitle": "",//表头信息
              "width": 100,//表格宽度
              "showSerial": true,//是否显示序号
              "editType": false,//是否增加编辑列
              "page": 1,//当前页
              "pageSize": 10,//一页多少条
              "isPager": true,//是否分页
              "isSearch": false,//是否显示模糊查询
              "columns": [
                { title: '班组编号', width: 100, dataIndex: 'mdTeamInfoGidRef.code', key: '1' },
                { title: '班组名称', width: 100, dataIndex: 'mdTeamInfoGidRef.name', key: '2' },
                { title: '人员编号', width: 100, dataIndex: 'smPersonnelGidRef.personnelCode', key: '3' },
                { title: '人员名称', dataIndex: 'smPersonnelGidRef.personnelName', key: '4', width: 100 },
                { title: '人员分类', dataIndex: 'smPersonnelTypePostGidRef.personnelTypeName', key: '5', width: 100 },
                { title: '业务单元', dataIndex: 'smBusiUnitGidRef.busiUnitName', key: '6', width: 100 },
                { title: '部门', dataIndex: 'smDepartmentGidRef.name', key: '7', width: 100 }
              ],
              dataSource: {
                type: 'api',
                method: 'post',
                mode:"eventPayload",
                pager:true,
                url: '/ime/imeTrackOrder/findCommonTeamPersonByOrderGids.action',
                payloadMapping:[
                  {
                    to:"@@Array",
                    key:'gid'
                  }
                ]
              },
              subscribes:[
                {
                  event:"AllotModal-table-staff.onTableTodoAny",
                  behaviors: [
                    {
                      type: "fetch",
                      id: "dispatchOrder-btn-4", //要从哪个组件获取数据
                      data: "dataContext",//要从哪个组件的什么属性获取数据
                      successPubs: [  //获取数据完成后要发送的事件
                        {
                          event:"AllotModal-table-staff.loadData",
                        }
                      ]
                    }
                  ]
                },
                {
                  event:"AllotModal-staff-del.success",
                  behaviors: [
                    {
                      type: "fetch",
                      id: "dispatchOrder-btn-4", //要从哪个组件获取数据
                      data: "dataContext",//要从哪个组件的什么属性获取数据
                      successPubs: [  //获取数据完成后要发送的事件
                        {
                          event:"AllotModal-table-staff.loadData",
                        }
                      ]
                    }
                  ]
                },
                {
                  event:"dispatchAllot-modal-staff.onSuccessCancel",
                  behaviors: [
                    {
                      type: "fetch",
                      id: "dispatchOrder-btn-4", //要从哪个组件获取数据
                      data: "dataContext",//要从哪个组件的什么属性获取数据
                      successPubs: [  //获取数据完成后要发送的事件
                        {
                          event:"AllotModal-table-staff.loadData",
                        }
                      ]
                    }
                  ]
                }
              ]
            }} />
            <ModalContainer config={{
              visible: false, // 是否可见，必填*
              enabled: true, // 是否启用，必填*
              id: "dispatchAllot-modal-staff", // id，必填*
              pageId: "dispatchAllot-modal-staff", // 指定是哪个page调用modal，必填*
              type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
              title: "分配人员/班组", // title，不传则不显示title
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
              <StaffAdd/>
            </ModalContainer>
          </TabPane>
          <TabPane tab="设备" key="2">
            <Row>
              <Col span={6} offset={20}>
                <AppButton config={{
                  id: "AllotModal-device-add",
                  title: "增加",
                  type:"primary",
                  size:"large",
                  visible: true,
                  enabled: false,
                  subscribes: [
                    {
                      event:"AllotModal-device-add.click",
                      pubs:[
                        {
                          event:"dispatchAllot-modal-device.openModal"
                        }
                      ]
                    },
                    {
                      event:"AllotModal-table-device.onTableLoaded",
                      pubs: [
                        {
                          event: "AllotModal-device-add.enabled",
                          payload:true
                        },
                        {
                          event: "AllotModal-device-add.dataContext"
                        }
                      ]
                    },
                  ]
                }} />
                <AppButton config={{
                  id: "AllotModal-device-del",
                  title: "删除",
                  type:"default",
                  size:"large",
                  visible: true,
                  enabled: true,
                  subscribes: [
                    {
                      event:"AllotModal-table-device.onSelectedRows",
                      pubs:[
                        {
                          event:"AllotModal-device-del.enabled",
                          payload:true
                        },
                        {
                          event:"AllotModal-device-del.dataContext"
                        }
                      ]
                    },
                    {
                      event:"AllotModal-table-device.onSelectedRowsClear",
                      pubs:[
                        {
                          event:"AllotModal-device-del.enabled",
                          payload:false
                        }
                      ]
                    },
                    {
                      event:"AllotModal-device-del.click",
                      behaviors: [
                        {
                          type: "request",
                          dataSource: {
                            type: "api",
                            method: 'post',
                            url: '/ime/imeTrackOrder/removeCommonEquipmentInfo.action',
                            mode:"dataContext",
                            bodyExpression:`
                              var ids = []
                              var gids = []
                              resolveFetch({fetch:{id:"dispatchOrder-btn-4",data:"dataContext"}}).then(function (data) {
                                for(var m=0;m<data.length;m++){
                                  ids.push(data[m]["gid"])
                                }
                                for(var n=0;n<dataContext.length;n++){
                                  gids.push(dataContext[n]["mdEquipmentGid"])
                                }
                                callback({trackGid:ids,equipmentGid:gids})
                              })
                            `,
                          },
                          successPubs: [  //获取数据完成后要发送的事件
                            {
                              event: "@@message.success",
                              payload: "删除成功"
                            },
                            {
                              event: "AllotModal-device-del.success"
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
                }} />
              </Col>
            </Row>
              <AppTable name="dispatchOrder" config={{
                "id": "AllotModal-table-device",
                "name": "AllotModal-table-device",
                "type": "checkbox",//表格单选复选类型
                "size": "default",//表格尺寸
                "rowKey": "gid",//主键
                "onLoadData": false,//初始化是否加载数据
                "tableTitle": "",//表头信息
                "width": 100,//表格宽度
                "showSerial": true,//是否显示序号
                "editType": false,//是否增加编辑列
                "page": 1,//当前页
                "pageSize": 10,//一页多少条
                "isPager": true,//是否分页
                "isSearch": false,//是否显示模糊查询
                "columns": [
                  { title: '设备编码', width: 100, dataIndex: 'mdEquipmentGidRef.code', key: '1' },
                  { title: '设备名称', width: 100, dataIndex: 'mdEquipmentGidRef.name', key: '2' },
                  { title: '设备型号', width: 100, dataIndex: 'mdEquipmentGidRef.model', key: '3' },
                  { title: '设备规格', dataIndex: 'mdEquipmentGidRef.spec', key: '4', width: 100 },
                  { title: '设备类型', dataIndex: 'mdEquipmentGidRef.mdEquipmentTypeGidRef.name', key: '5', width: 100 },
                  { title: '计量单位', dataIndex: 'mdEquipmentGidRef.mdMeasurementUnitGidRef.name', key: '6', width: 100 },
                  { title: '设备状态', dataIndex: 'mdEquipmentGidRef.status', key: '7', width: 100 },
                  { title: '设备序列号', dataIndex: 'mdEquipmentGidRef.serialNo', key: '8', width: 100 }
                ],
                dataSource: {
                  type: 'api',
                  method: 'post',
                  mode:"eventPayload",
                  url: '/ime/imeTrackOrder/findCommonEquipmentByTrackOrderGids.action',
                  payloadMapping:[
                    {
                      to:"@@Array",
                      key:'gid'
                    }
                  ]
                },
                subscribes:[
                  {
                    event:"AllotModal-table-device.onTableTodoAny",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "dispatchOrder-btn-4", //要从哪个组件获取数据
                        data: "dataContext",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event:"AllotModal-table-device.loadData",
                          }
                        ]
                      }
                    ]
                  },
                  {
                    event:"AllotModal-device-del.success",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "dispatchOrder-btn-4", //要从哪个组件获取数据
                        data: "dataContext",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event:"AllotModal-table-device.loadData",
                          }
                        ]
                      }
                    ]
                  },
                  {
                    event:"dispatchAllot-modal-device.onSuccessCancel",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "dispatchOrder-btn-4", //要从哪个组件获取数据
                        data: "dataContext",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event:"AllotModal-table-device.loadData",
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}
              />
              <ModalContainer config={{
                visible: false, // 是否可见，必填*
                enabled: true, // 是否启用，必填*
                id: "dispatchAllot-modal-device", // id，必填*
                pageId: "dispatchAllot-modal-device", // 指定是哪个page调用modal，必填*
                type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                title: "分配设备", // title，不传则不显示title
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
                <DeviceAdd/>
              </ModalContainer>
          </TabPane>
        </Tabs>

        <Row>
          <Col span={3} offset={22}>
            <AppButton config={{
              id: "AllotModal-btn-1",
              title: "取消",
              type:"default",
              size:"large",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: "AllotModal-btn-1.click",
                  pubs:[{
                    event: "dispatchOrder-modal-allot.onCancel",
                  }]
                }
              ]
            }} />
          </Col>
        </Row>

      </div>
    );
  }
}

DispatchOrderAllotModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(DispatchOrderAllotModal);
