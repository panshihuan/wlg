import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col, Tabs } from 'antd';
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
import AppTable from 'components/AppTable';
import ModalContainer from 'components/ModalContainer'

import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import request from 'utils/request'

import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

const TabPane = Tabs.TabPane;
const validate = values => {
  const errors = {}
  if (!values.get('code')) {
    errors.code = '必填项'
  }
  return errors
}

export class DisRecordDetailPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderSpit: ''
    }
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
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
          <Row>
            <Col span={8}>
              <Field config={{
                enabled: true,
                id: "record-baogong-code",
                label: "报工单编号",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "自动生成"
              }} component={TextField} name="code" />
            </Col>
            <Col span={8}>
              <Field config={{
                enabled: false,
                id: "record-baogong-code2",
                label: "派工单编号",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "根据报工单编码带出"
              }} component={TextField} name="imeTrackOrderGidRef.code" />
            </Col>
            <Col span={8}>
              <Field config={{
                enabled: false,
                id: "record-baogong-code3",
                label: "操作状态",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据报工状态带出"
              }} component={TextField} name="operationStatus" />
            </Col>

          </Row>
          <Row>
            <Col span={8}>
              <Field config={{
                enabled: false,
                id: "record-baogong-code4",
                label: "开始时间",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "反显开始时间"
              }} component={TextField} name="startDate" />
            </Col>
            <Col span={8}>
              <Field config={{
                enabled: false,
                id: "record-baogong-cocdddde4",
                label: "开始用户",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "自动生成"
              }} component={TextField} name="startPersonGidRef.personnelName" />
            </Col>
            <Col span={8}>
              <Field config={{
                enabled: false,
                id: "record-baogong-code5",
                label: "结束时间",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "自动生成"
              }} component={TextField} name="endDate" />
            </Col>

          </Row>
          <Row>
            <Col span={8}>
              <Field config={{
                enabled: false,
                id: "record-baogong-code6",
                label: "结束用户",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "自动生成"
              }} component={TextField} name="endPersonGidRef.personnelName" />
            </Col>
            <Col span={8}>
              <Field config={{
                enabled: true,
                id: "record-baogong-code7",
                label: "工作单元",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                tableInfo: {
                  id: "tablegdsanyuanjkljkldjd",
                  size: "small",
                  rowKey: "gid",
                  width: "100",
                  tableTitle: "工作单元",
                  columns: [
                    { title: '工作单元编码', width: 100, dataIndex: 'workUnitCode', key: '1' },
                    { title: '工作单元名称', width: 100, dataIndex: 'workUnitName', key: '2' },
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/mdFactoryWorkUnit/query.action',
                  }
                },
                pageId: 'findBafdanyuanff',
                displayField: "workUnitName",
                valueField: {
                  "from": "workUnitName",
                  "to": "mdFactoryWorkUnitGidRef.workUnitName"
                },
                associatedFields: [
                  
                ]
              }} component={FindbackField} name="mdFactoryWorkUnitGidRef.workUnitName" />
            </Col>
            <Col span={8}>
              <Field config={{
                enabled: true,
                id: "record-baogong-code8",
                label: "报工数量",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入数量"
              }} component={TextField} name="orderNumber" />
            </Col>
          </Row>
        </Card>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="报工设备" key="1">
              <Row>
                <Col span={3} offset={22}>
                  <AppButton config={{
                    id: "addshebierdOk",
                    title: "添加设备",
                    type: "primary",
                    ghost: true,
                    size: "large",
                    visible: true,
                    enabled: true,
                    subscribes: [
                      {
                        event:"addshebierdOk.click",
                        pubs:[
                          {
                            event:"pageIdshebeif3444eex.openModal"
                          }
                        ]
                        
                      }
                    ]
                  }} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <AppTable name="imeTrackRecordEquipmentDTOs" config={{
                    "id": "DisRecordndhjkahdudoi902i30",
                    "name": "DisRecord-endjkjoiioi",
                    "type": "checkbox",//表格单选复选类型
                    "size": "default",//表格尺寸
                    "rowKey": "gid",//主键
                    "onLoadData": false,//初始化是否加载数据
                    "width": 900,//表格宽度
                    "showSerial": true,//是否显示序号
                    "editType": true,//是否增加编辑列
                    "page": 1,//当前页
                    "pageSize": 10,//一页多少条
                    "isSearch": true,//是否显示模糊查询
                    "columns": [
                      { title: '设备编码', width: 100, dataIndex: 'code', key: '1' },
                      { title: '设备名称', width: 100, dataIndex: 'name', key: '2' },
                      { title: '设备型号', width: 100, dataIndex: 'model', key: '3' },
                      { title: '设备规格', dataIndex: 'spec', key: '4', width: 100 },
                      { title: '设备类型', dataIndex: 'mdEquipmentTypeGidRef.name', key: '5', width: 100 },
                      { title: '计量单位', dataIndex: 'mdMeasurementUnitGidRef.name', key: '6', width: 100 },
                      { title: '设备状态', dataIndex: 'status', key: '7', width: 100 },
                      { title: '设备序列号', dataIndex: 'serialNo', key: '8', width: 100 },
                    ],
                    subscribes:[
                      {
                        event:"DishebeirdOk2.click",
                        pubs:[
                          {
                            event:"pageIdshebeiyheeffgg.onCancel"
                          }
                        ],
                        behaviors: [
                      {
                        type: "fetch",
                        id: "DishebeirdOk2", //要从哪个组件获取数据
                        data: "dataContext",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "DisRecordndhjkahdudoi902i30.expression",
                             meta: {
                            expression:`
                              pubsub.publish("DisRecordndhjkahdudoi902i30.setData",data)
                              me.dataContext = data
                            `
                             }
                          },
                          
                        ]
                      }
                    ]
                      }
                    ]
                  }} />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
        <Card>
          <Row>
            <Col span={4} offset={20}>
              <AppButton config={{
                id: "DisRectanchukuangordOk",
                title: "确定",
                type: "primary",
                size: "large",
                visible: true,
                enabled: true,
                subscribes:[
                  {
                    event: "DisRectanchukuangordOk.click",
                    behaviors: [
                      {
                        type: "fetch",
                        data:"@@formValues",
                        id:"disRecordDetailPage",
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "DisRectanchukuangordOk.expression",
                             meta: {
                            expression:`
                              resolveFetch({fetch:{id:'DisRecordndhjkahdudoi902i30',data:'dataContext'}}).then(function(res){
                                let dataContext ={};
                                if(res != undefined){
                                  data["eventPayload"].imeTrackRecordEquipmentDTOs = res["eventPayload"]
                                  dataContext = {id:data["eventPayload"].gid,dto:data["eventPayload"]}
                                }else{
                                  data["eventPayload"].imeTrackRecordEquipmentDTOs =[]
                                  dataContext = {id:data["eventPayload"].gid,dto:data["eventPayload"]}
                                }
                                let  dataSource= {
                                type: 'api',
                                method: 'post',
                                mode:"dataContext",
                                url: '/ime/imeTrackRecord/endOwnOrder.action',
                              };
                                resolveDataSourceCallback({dataSource:dataSource,dataContext:dataContext},function(data){
                                  if(data.success){
                                    pubsub.publish('@@message.success',"操作成功")
                                    pubsub.publish("pageIdDisRecordtableeeeeeeffgg.onCancel");
                                    /*resolveFetch({fetch:{id:"DisRecord-table-index",data:"rowRecord"}}).then(function (rowRecord) {
                                      console.log(rowRecord);
                                    })
                                    DisRecordtableindexendhjkahdudoi902i30.loadData*/
                                  }else{
                                    pubsub.publish('@@message.error',"操作失败")
                                  }
                                },function(){})
                              })
                            `
                             }
                          }
                        ],
                      }
                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "DisReeipppoCancel",
                title: "取消",
                type: "default",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "DisReeipppoCancel.click",
                    pubs: [
                      {
                        event: "pageIdDisRecordtableeeeeeeffgg.onCancel",
                      }
                    ]
                  }
                ]
              }} />
            </Col>
          </Row>
        </Card>

        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "pageIdshebeiyheeffgg", // id，必填*
          pageId: "pageIdshebeif3444eex", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          title: "设备信息", // title，不传则不显示title
          width: "80%", // 宽度，默认520px
          okText: "确定", // ok按钮文字，默认 确定
          cancelText: "取消", // cancel按钮文字，默认 取消
          style: { top: 80 }, // style样式
          wrapClassName: "wcd-center", // class样式
          hasFooter: false, // 是否有footer，默认 true
          maskClosable: true, // 点击蒙层是否允许关闭，默认 true
        }}
        >
          <AppTable name="imeTra" config={{
                    "id": "Dizishebeirdndhjkahdudoi902i30",
                    "name": "DisReczishebeikjoiioi",
                    "type": "checkbox",//表格单选复选类型
                    "size": "default",//表格尺寸
                    "rowKey": "gid",//主键
                    "onLoadData": false,//初始化是否加载数据
                    "width": 900,//表格宽度
                    "showSerial": true,//是否显示序号
                    "editType": true,//是否增加编辑列
                    "page": 1,//当前页
                    "isSearch": true,//是否显示模糊查询
                    "columns": [
                      { title: '设备编码', width: 100, dataIndex: 'code', key: '1' },
                      { title: '设备名称', width: 100, dataIndex: 'name', key: '2' },
                      { title: '设备型号', width: 100, dataIndex: 'model', key: '3' },
                      { title: '设备规格', dataIndex: 'spec', key: '4', width: 100 },
                      { title: '设备类型', dataIndex: 'mdEquipmentTypeGidRef.name', key: '5', width: 100 },
                      { title: '计量单位', dataIndex: 'mdMeasurementUnitGidRef.name', key: '6', width: 100 },
                      { title: '设备状态', dataIndex: 'status', key: '7', width: 100 },
                      { title: '设备序列号', dataIndex: 'serialNo', key: '8', width: 100 },
                    ],
                    subscribes:[
                      {
                        event:"Dizishebeirdndhjkahdudoi902i30.onTableTodoAny",
                        pubs:[
                          {
                            event:"Dizishebeirdndhjkahdudoi902i30.expression",
                            meta: {
                            expression:`
                              resolveFetch({fetch:{id:'finishuuuuWrokhhjsjkskso',data:'dataContext'}}).then(function(res){
                                let dataSource= {
                                  type: 'api',
                                  method: 'post',
                                  mode:"dataContext",
                                  url: '/ime/imeTrackOrder/getEquipmentInfoByParams.action'
                                };
                                resolveDataSourceCallback({dataSource:dataSource,dataContext:{trackOrderGid:res[0].imeTrackOrderGid}},function(res){
                                   pubsub.publish("Dizishebeirdndhjkahdudoi902i30.setData",{eventPayload:res.data})
                                },function(er){er})
                              })
                            `
                            }
                          }
                        ]
                      }
                    ]
                  }} />
                   <Row>
            <Col span={4} offset={20}>
              <AppButton config={{
                id: "DishebeirdOk2",
                title: "确定",
                type: "primary",
                size: "large",
                visible: true,
                enabled: false,
                subscribes: [
                 {
                    event: "Dizishebeirdndhjkahdudoi902i30.onSelectedRows",
                    pubs: [
                      {
                        event: "DishebeirdOk2.enabled",
                        payload: true
                      }
                    ]
                  },
                  {
                    event: "Dizishebeirdndhjkahdudoi902i30.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "DishebeirdOk2.enabled",
                        payload: false
                      }
                    ]
                  },
                  {
                    event: "Dizishebeirdndhjkahdudoi902i30.onSelectedRows",
                    pubs: [
                      {
                        event: "DishebeirdOk2.dataContext"
                      }
                    ]
                  },
                ]
              }} />
              <AppButton config={{
                id: "DisshebeiioCancel2",
                title: "取消",
                type: "default",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "DisshebeiioCancel2.click",
                    pubs: [
                      {
                        event: "pageIdshebeiyheeffgg.onCancel",
                      },
                    ]
                  }
                ]
              }} />
            </Col>
          </Row>
        </ModalContainer>
      </div>
    )
  }
}

DisRecordDetailPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};



export default reduxForm({
  form: "disRecordDetailPage",
  validate,
})(DisRecordDetailPage);
