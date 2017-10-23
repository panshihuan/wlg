import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col, Tabs } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import Immutable from 'immutable'

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
  const reg = new RegExp("^[0-9]*$")
  
if (!reg.test(values.get('materialNumber'))) {
    errors.planQty = '请输入数字'
  }
return errors
}

export class DetailSplitPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderSpit: ''
    }
    resolveFetch({fetch:{id:'addOkziwulk',data:'dataContext'}}).then(function(res){
      pubsub.publish("@@form.init",{ id: "detailSplit",data:Immutable.fromJS(res)})
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
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
        <Row>
        <Col span={8}>
          <Field config={{
            id: "codewulioa",
            label: "物料编号",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            showRequiredStar: true,  //是否显示必填星号
            enabled:false,
            placeholder: "请输入编码"
          }} component={TextField} name="materialGidRef.code" />
        </Col>
        <Col span={8}>
          <Field config={{
            id: "gNamwuliao",
            label: "物料名称",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            enabled:false,
            showRequiredStar: true,  //是否显示必填星号
            placeholder: "根据产品编码带出"
          }} component={TextField} name="materialGidRef.name" />
        </Col>
        <Col span={8}>
          <Field config={{
            id: "guigeit1",
            label: "规格",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            enabled:false,
            showRequiredStar: true,  //是否显示必填星号
            placeholder: "根据产品编码带出"
          }} component={TextField} name="materialGidRef.spec" />
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Field config={{
            id: "cxinghaoioa",
            label: "型号",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            enabled:false,
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "请输入编码"
          }} component={TextField} name="materialGidRef.model" />
        </Col>
        <Col span={8}>
          <Field config={{
            id: "gNamdanweiliao",
            label: "计量单位",  //标签名称
            enabled:false,
            labelSpan: 8,   //标签栅格比例（0-24）
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "根据产品编码带出"
          }} component={TextField} name="materialGidRef.measurementUnitGidRef.name" />
        </Col>
        <Col span={8}>
          <Field config={{
            id: "guwuliaoshuliangt1",
            label: "物料数量(分子)",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "根据产品编码带出",
          }} component={TextField} name="materialNumber" />
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <Field config={{
            id: "cxinchanpioa",
            label: "产品数量(分母)",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            enabled:false,
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "请输入编码",
            subscribes:[
              {
                event:"guwuliaoshuliangt1.onChange",
                pubs:[
                  {
                    event:"cxinchanpioa.expression",
                    meta:{
                      expression:`
                        let updata = parseInt(data.eventPayload)
                        let downData = parseInt(me.props.input.value)
                        let planData = updata/downData
                        pubsub.publish("@@form.change",{id:"detailSplit",name:"planQty",value:planData})
                      `
                    }
                  }
                ]
              }
            ]
          }} component={TextField} name="productNumber" />
        </Col>
        <Col span={8}>
          <Field config={{
            id: "gNamjihualiao",
            label: "计划用量",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            enabled:false,
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "=分子/分母"
          }} component={TextField} name="planQty" />
        </Col>
        <Col span={8}>
          <Field config={{
            id: "guwudingdana",
            label: "订单用量",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            enabled:false,
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "计划数量＊本批数量"
          }} component={TextField} name="orderQty" />
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <Field config={{
            id: "cxilingliaonpioa",
            label: "领料方式",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            enabled:false,
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "请输入编码",
            dataSource: {
            type: "api",
            method: "post",
            url: "/sm/dictionaryEnumValue/query.action",
            mode: "payload",
            payload: {
              "query": {
                "query": [
                  { "field": "smDictionaryEnumGid", "type": "eq", "value": "56272988A1791D58E156200100000001" }
                ],
                "sorted": "seq"
              }
            }
          },
          displayField: "val",
          valueField: "gid"
          }} component={SelectField} name="pickingTypeGid" />
        </Col>
        <Col span={8}>
          <Field config={{
            id: "gcangkuualiao",
            label: "来源仓库",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            enabled:false,
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "根据产品编码带出",
            tableInfo: {
            id: "tapdjbdv35svaiyuan",
            size: "small",
            rowKey: "gid",
            width: "500",
            tableTitle: "来源仓库",
            form:"detailSplit",
            showSerial: true,  //序号
            columns: [
              { title: '仓库编码', width: 100, dataIndex: 'warehouseCode', key: '1' },
              { title: '仓库编码名称', width: 150, dataIndex: 'warehouseName', key: '2' },
            ],
            dataSource: {
              type: 'api',
              method: 'post',
              url: '/ime/mdWarehouse/query.action',
            }
          },
          pageId: 'tableFdlaiyuccccan',
          displayField: "warehouseName",
          valueField: {
            "from": "warehouseName",
            "to": "wareHouseGidRef.warehouseName"
          },
          associatedFields: [
              {
            "from": "gid",
            "to": "wareHouseGid"
          },
          ]
          }} component={FindbackField} name="wareHouseGidRef.warehouseName" />
        </Col>
        <Col span={8}>
          <Field config={{
            id: "gugongxuana",
            label: "工序",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "根据产品编码带出",
            form:"detailSplit",
            subscribes: [
            {
                event:"tapdffe4ongxuvgfdds.onTableTodoAny",
                pubs:[
                  {
                    event:"tapdffe4ongxuvgfdds.expression",
                    meta: {

                expression:`
                resolveFetch({fetch:{id:'modify',data:'@@formValues'}}).then(function(da){
                  if(!da.productGidRef){
                    da.productGidRef = {}
                  }
                  if(da.productGidRef.routePath){
                    let payload = {id:da.productGidRef.routePath}
                    let dataSource = {
                    type: 'api',
                    method: 'post',
                    paramsInQueryString:true,
                    url: '/ime/mdRouteLine/findById.action',
                  }
                  resolveDataSourceCallback({dataSource:dataSource,eventPayload:payload},function(res){
                    pubsub.publish(me.props.config.id+'.setData',{eventPayload:res.data.mdRouteOperationDTOs})
                  })
                  }
                })
                `
                    }
                  }
                  
                ]
              }
          ],
          tableInfo: {
            id: "tapdffe4ongxuvgfdds",
            size: "small",
            rowKey: "gid",
            width: "500",
            tableTitle: "工序",
            onLoadData: false,
            showSerial: true,  //序号
            columns: [
              { title: '工序编码', width: 100, dataIndex: 'code', key: '1' },
              { title: '工序名称', width: 150, dataIndex: 'name', key: '2' },
            ],
          },
          pageId: 'tableFgongxuodoodd',
          displayField: "name",
          valueField: {
            "from": "name",
            "to": "mdRouteOperationName"
          },
          associatedFields: [
             {
            "from": "gid",
            "to": "mdRouteOperationGid"
          },{
            "from": "code",
            "to": "mdRouteOperationCode"
          },
          ]
          }} component={FindbackField} name="mdRouteOperationName" />
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <Field config={{
            enabled: true,
            id: "gongweihduhua",
            label: "工位",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "请输入编码",
            form:"detailSplit",
            subscribes:[
            {
              event:"dsfffdkooodds.onTableTodoAny",
              behaviors: [
                {
                  type: "fetch",
                  id: "modify", //要从哪个组件获取数据
                  data: "@@formValues",//要从哪个组件的什么属性获取数据
                  successPubs: [  //获取数据完成后要发送的事件
                    {
                      event: "dsfffdkooodds.loadData",
                      eventPayloadExpression:`
                      let payload ={}
                      if(eventPayload.productionLineGid){
                        payload = {
                            "query": {
                              "query": [
                                {
                                  "field": "workUnitGidRef.factoryLineGid", "type": "eq", "value": eventPayload.productionLineGid
                                }
                              ],
                              "sorted": "gid asc"
                            }
                          }
                      }else{
                        payload = {
                            "query": {
                              "query": [
                                {
                                  "field": "workUnitGidRef.factoryLineGidRef.workCenterGid", "type": "eq", "value": "23"
                                }
                              ],
                              "sorted": "gid asc"
                            }
                          }
                      }
                         callback(payload)
                      `
                    }
                  ]
                }
              ],
            }
          ],
          tableInfo: {
            id: "dsfffdkooodds",
            size: "small",
            rowKey: "gid",
            width: "500",
            tableTitle: "工位",
            showSerial: true,  //序号
            onLoadData:false,
            columns: [
              { title: '工位编码', width: 100, dataIndex: 'stationCode', key: '1' },
              { title: '工位名称', width: 150, dataIndex: 'stationName', key: '2' },
            ],
            dataSource: {
              type: 'api',
              method: 'post',
              mode:"payload&&eventPayload",
              url: '/ime/mdFactoryWorkStation/query.action',
            }
          },
          pageId: 'tablegongweiodoodd',
          displayField: "stationName",
          valueField: {
            "from": "stationName",
            "to": "factoryStationGidRef.stationName"
          },
          associatedFields: [
            {
            "from": "gid",
            "to": "factoryStationGid"
          },
          ]
          }} component={FindbackField} name="factoryStationGidRef.stationName" />
        </Col>
        <Col span={8}>
          <Field config={{
            id: "gcluxiangyaliao",
            label: "工艺路线",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            showRequiredStar:true,
            enabled:false,
            placeholder: "根据产品编码带出",
            form:"detailSplit",
            enabled:false,
          tableInfo: {
            id: "tapdjbanededeeds",
            size: "small",
            rowKey: "gid",
            tableTitle: "工艺路线",
            width: "500",
            showSerial: true,  //序号
            columns: [
              { title: '工艺路线编码', width: 100, dataIndex: 'routeLineCode', key: '1' },
              { title: '工艺路线名称', width: 150, dataIndex: 'routeLineName', key: '2' },
            ],
            dataSource: {
              type: 'api',
              method: 'post',
              url: '/ime/mdRouteLine/query.action',
            }
          },
          pageId: 'tablegongyiluxiandoodd',
          displayField: "routeLineName",
          valueField: {
            "from": "routeLineName",
            "to": "technicsGidRef.name"
          },
          associatedFields: [
            {
            "from": "gid",
            "to": "technicsGid"
          },
          ],
          }} component={FindbackField} name="technicsGidRef.name" />
        </Col>
        <Col span={8}>
          <Field config={{
            enabled: false,
            id: "guzhuisuouana",
            label: "追溯",  //标签名称
            labelSpan: 8,   //标签栅格比例（0-24）
            wrapperSpan: 16,  //输入框栅格比例（0-24）
            placeholder: "根据产品编码带出",
            dataSource: {
            type: "api",
            method: "post",
            url: "/sm/dictionaryEnumValue/query.action",
            mode: "payload",
            payload: {
              "query": {
                "query": [
                  { "field": "smDictionaryEnumGid", "type": "eq", "value": "56272988A1791D58E156000000000001" }
                ],
                "sorted": "seq"
              }
            }
          },
          displayField: "val",
          valueField: "gid"
          }} component={SelectField} name="reviewGid" />
        </Col>
      </Row>
          <Row>
            <Col span={4} offset={20}>
              <AppButton config={{
                id: "DichaifendOk",
                title: "拆分",
                type: "primary",
                size: "large",
                visible: true,
                subscribes: [/*
                  {
                    event:"@@form.init",
                    pubs:[
                      {
                        event:"DichaifendOk.dataContext"
                      },{
                        event:"DichaifendOk.expression",
                        meta:{
                          expression:`
                          let index 
                          resolveFetch({fetch:{id:'tafnjnjdkkdllooeop30jsodojw4jh777frr',data:'dataContext'}}).then(function(res){
                            index = res
                          })
                          resolveFetch({fetch:{id:'detail',data:'@@formValues'}}).then(function(res){
                            res.imePlanOrderDetailDTOs.splice(index,1)
                            me.payload = res.imePlanOrderDetailDTOs
                          })
                          `
                        }
                      }
                      
                    ]
              },*/
                  {
                    event:"DichaifendOk.click",
                    behaviors:[
                      {
                        type:"fetch",
                        id:"tafnjnjjsodojw4jh777frredwschhj4",
                        data:"selectedRows",
                        successPubs:[
                          {
                            event:"DichaifendOk.expression",
                            meta:{
                          expression:`
                              let datal = data
                              const reg = new RegExp("^[0-9]*$")
                              resolveFetch({fetch:{id:'detailSplit',data:'@@formValues'}}).then(function(resd){
                            if(!resd.factoryStationGidRef){
                              resd.factoryStationGidRef = {}
                            }
                            if(!data.eventPayload.factoryStationGidRef){
                              data.eventPayload.factoryStationGidRef = {}
                            }
                            if(!reg.test(resd.materialNumber)){
                              pubsub.publish("@@message.error","只能输入数字")
                            }else if(parseInt(data.eventPayload.materialNumber) == parseInt(resd.materialNumber) || parseInt(data.eventPayload.materialNumber) < parseInt(resd.materialNumber)){
                              pubsub.publish("@@message.error","输入的数量必须小于拆分前的数量,请重新输入")
                            }else if(data.eventPayload.mdRouteOperationName !== resd.mdRouteOperationName || data.eventPayload.factoryStationGidRef.stationName !== resd.factoryStationGidRef.stationName){
                                let newNum = parseInt(data.eventPayload.materialNumber) - parseInt(resd.materialNumber)
                                let saveData = data.eventPayload
                                saveData.materialNumber = newNum 
                                let index 
                                let resda = resd
                          resolveFetch({fetch:{id:'tafnjnjjsodojw4jh777frredwschhj4',data:'dataContext'}}).then(function(res){
                            index = res
                          })
                          resolveFetch({fetch:{id:'modify',data:'@@formValues'}}).then(function(res){
                            const actualQty = res.actualQty
                            res.imePlanOrderDetailDTOs.splice(index,1)
                            res.imePlanOrderDetailDTOs.push(saveData)
                            delete resd.gid
                            res.imePlanOrderDetailDTOs.push(resd)
                            for(var i=0;i<res.imePlanOrderDetailDTOs.length;i++){
                              res.imePlanOrderDetailDTOs[i].planQty = parseInt(res.imePlanOrderDetailDTOs[i].materialNumber) / parseInt(res.imePlanOrderDetailDTOs[i].productNumber)
                              res.imePlanOrderDetailDTOs[i].orderQty = parseInt(res.imePlanOrderDetailDTOs[i].planQty) * parseInt(actualQty)
                            }
                            pubsub.publish("@@form.change", { id: "modify",name:"imePlanOrderDetailDTOs" ,value: fromJS(res.imePlanOrderDetailDTOs) })
                            pubsub.publish("pageeeeffgg.onCancel")
                          })
                            }else{
                              pubsub.publish("@@message.error","请至少修改工位和工序中的一项")
                            }
                          })
                       
                          `
                            }
                          }
                        ]
                      }
                    ],
                  }
                ]
              }} />
              <AppButton config={{
                id: "DisRequioCancel",
                title: "取消",
                type: "default",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "DisRequioCancel.click",
                    pubs: [
                      {
                        event: "pageeeeffgg.onCancel",
                      },
                    ]
                  }
                ]
              }} />
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}

DetailSplitPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};



export default reduxForm({
  form: "detailSplit",
  validate,
})(DetailSplitPage);
