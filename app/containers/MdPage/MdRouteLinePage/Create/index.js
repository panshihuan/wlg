/*
 *
 * Create
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col,Tabs,Button } from 'antd';
import { Link } from 'react-router';
import AppButton from 'components/AppButton';
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

import TextField from 'components/Form/TextField'
import SelectField from 'components/Form/SelectField'
import TableField from 'components/Form/TableField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import CheckBoxField from 'components/Form/CheckBoxField'
import Immutable from 'immutable'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'

import pubsub from 'pubsub-js';


const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;


const validate = values => {
    const errors = {}
    if (!values.get('routeLineCode')) {
        errors.routeLineCode = '必填项'
    }
    if (!values.get('routeLineName')) {
        errors.routeLineName = '必填项'
    }

    let vv= values.toJS();
    if (!vv.routeOperationQueryList || !vv.routeOperationQueryList.length) {
        //errors.routeOperationQueryList = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.routeOperationQueryList.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.mdDefOperationCode) {
                memberErrors.mdDefOperationCode = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
        })
        if (membersArrayErrors.length) {
            errors.routeOperationQueryList = membersArrayErrors
        }
    }
    if (!vv.routeEquipmentQueryList || !vv.routeEquipmentQueryList.length) {
        //errors.routeEquipmentQueryList = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.routeEquipmentQueryList.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.mdEquipmentCode) {
                memberErrors.mdEquipmentCode = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
        })
        if (membersArrayErrors.length) {
            errors.routeEquipmentQueryList = membersArrayErrors
        }
    }

    if (!vv.routeProductDTOs || !vv.routeProductDTOs.length) {
        //errors.routeProductDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.routeProductDTOs.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.productCode) {
                memberErrors.productCode = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
        })
        if (membersArrayErrors.length) {
            errors.routeProductDTOs = membersArrayErrors
        }
    }
    return errors
}

const asyncValidate = values => {
    let dataSource = {
        mode: "dataContext",
        type: "api",
        method: "POST",
        url: "/sm/checkUnique/check.action",
    }
    let className = "com.neusoft.ime.md.mdRouteLine.dto.MdRouteLineDTO"
    let fieldNames = "code,delete";
    let fieldValues = values.get('routeLineCode') + ",0";
    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:"",  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {
        resolve(res)
    })).then(function (res) {
        if(!res.data){
            throw { routeLineCode: "该编码已存在,请重新填写" }
        }
    })
}


export class Create extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
        pubsub.publish("mdRouteProduceTable01.disableAll");
    }

    render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>业务建模</Breadcrumb.Item>
              <Breadcrumb.Item>工艺</Breadcrumb.Item>
              <Breadcrumb.Item>工艺详情</Breadcrumb.Item>
          </Breadcrumb>
          <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>

              <Row>
                  <Col span={16}>
                      <AppButton config={{
                          id: "gy020001",
                          title: "保存",
                          visible: true,
                          enabled: true,
                          type: "primary",
                          subscribes: [
                              {
                                  event: "gy020001.click",
                                  pubs:[
                                      {
                                          event: "gy020001.expression",
                                          meta:{
                                              expression:`
                                        resolveFetch({fetch:{id:'Create',data:'@@formValues'}}).then(function(data){
                                              if(data){
                                                let val = data.routeLineName
                                                let produces = data.routeProductDTOs
                                                if(produces){
                                                    for(var i=0;i<produces.length;i++){
                                                        produces[i].routePathName = val
                                                    }
                                                }
                                              }
                                              console.log(data)
                                              let dataSource = {
                                                type: "api",
                                                mode:"payload",
                                                method: "POST",
                                                url: "/ime/mdRouteLine/saveList.action",
                                                payload: data
                                              }
                                              let onSuccess = function(response){
                                                if(response.success) {
                                                    pubsub.publish("@@message.success","新增成功");
                                                    pubsub.publish("gy020002.click")
                                                }
                                                  else {
                                                    pubsub.publish("@@message.error","新增失败");
                                                  }
                                              }
                                              if(submitValidateForm("Create")){
                                              }else{
                                                    resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                              }

                                        })
                                            `
                                          }
                                      }
                                  ],
                                  /*  behaviors: [
                                        {
                                            type: "request",
                                            dataSource: {
                                                type: "api",
                                                method: "POST",
                                                url: "/ime/mdRouteLine/saveList.action",
                                                withForm: "Create"

                                            },
                                            successPubs: [  //获取数据完成后要发送的事件
                                                {
                                                    event: "@@navigator.push",
                                                    payload: {
                                                        url: "/mdRouteLine"
                                                    }
                                                }, {
                                                    event: "@@message.success",
                                                    payload: "新增成功"
                                                }
                                            ],
                                            errorPubs: [
                                                {
                                                    event: "@@message.error",
                                                    payload: "新增失败"
                                                }
                                            ]
                                        }
                                    ],*/
                              }
                          ]
                      }}></AppButton>
                      <AppButton config={{
                          id: "gy020002",
                          title: "取消",
                          visible: true,
                          enabled: true,
                          type: "primary",
                          subscribes: [
                              {
                                  event: "gy020002.click",
                                  pubs: [
                                      {
                                          event: "@@navigator.push",
                                          payload: {
                                              url: "/mdRouteLine"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}></AppButton>
                  </Col>

                  <Col span={3} offset={5}>
                      <ButtonGroup className='pull-right'>
                          <Button icon="bars"   type="primary" />
                          <Button icon="appstore"  onClick={() => {
                              pubsub.publish("@@navigator.push", {url: "/modeling/technic"});
                          }}/>
                      </ButtonGroup>
                  </Col>


              </Row>

          </Card>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "routeLineCode",
                          label: "工艺路线编码",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: true,  //是否显示必填星号
                          placeholder: "请输入编码"
                      }} component={TextField} name="routeLineCode" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "routeLineName",
                          label: "工艺路线名称",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: true,  //是否显示必填星号
                          placeholder: "请输入名称",

                      }} component={TextField} name="routeLineName" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "routeLineVersion",
                          label: "工艺路线版本",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "请输入版本",
                      }} component={TextField} name="routeLineVersion" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          id: "routeLineType",
                          label: "工艺路线类型",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "请选择",
                          dataSource: {
                              type: "api",
                              method:"post",
                              url:"/sm/dictionaryEnumValue/query.action",
                              mode:"payload",
                              payload:{
                                  "query":{
                                      "query":[
                                          {"field":"smDictionaryEnumGid","type":"eq","value":"5672E5535B775A23E055000000000001"}
                                      ],
                                      "sorted":"seq"
                                  }
                              },
                          },
                          displayField: "val",
                          valueField: "gid",
                      }} component={SelectField} name="routeLineType" />
                  </Col>
              </Row>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "outputNum",
                          label: "输出数量",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "请输入数量",
                      }} component={TextField} name="outputNum" />
                  </Col>
                  <Col span={5}>
                      <Field config={{
                          enabled: true,
                          id: "rhythm",
                          label: "工艺节拍",  //标签名称
                          labelSpan: 10,   //标签栅格比例（0-24）
                          wrapperSpan: 12,  //输入框栅格比例（0-24）
                          placeholder: "请输入节拍",
                      }} component={TextField} name="rhythm" />
                  </Col>
                  <Col span={1}>
                      <Field config={{
                          id: "timeTypeRhythm",
                          label: "",  //标签名称
                          labelSpan: 4,   //标签栅格比例（0-24）
                          wrapperSpan: 20,  //输入框栅格比例（0-24）
                          dataSource: {
                              type: "api",
                              method:"post",
                              url:"/sm/dictionaryEnumValue/query.action",
                              mode:"payload",
                              payload:{
                                  "query":{
                                      "query":[
                                          {"field":"smDictionaryEnumGid","type":"eq","value":"56354B1899A83E18E055000000000001"}
                                      ],
                                      "sorted":"seq"
                                  }
                              },
                          },
                          displayField: "val",
                          valueField: "gid",
                      }} component={SelectField} name="timeTypeRhythm" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          id: "workModeGid",
                          label: "报工方式",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "请选择",
                          dataSource: {
                              type: "api",
                              method:"post",
                              url:"/sm/dictionaryEnumValue/query.action",
                              mode:"payload",
                              payload:{
                                  "query":{
                                      "query":[
                                          {"field":"smDictionaryEnumGid","type":"eq","value":"5628CF31424726A8E055000000000001"}
                                      ],
                                      "sorted":"seq"
                                  }
                              },
                          },
                          displayField: "val",
                          valueField: "gid",
                      }} component={SelectField} name="workModeGid" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          id: "trackOrderModeGid",
                          label: "派工单产生",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "请选择",
                          dataSource: {
                              type: "api",
                              method:"post",
                              url:"/sm/dictionaryEnumValue/query.action",
                              mode:"payload",
                              payload:{
                                  "query":{
                                      "query":[
                                          {"field":"smDictionaryEnumGid","type":"eq","value":"5628CF31424826A8E055000000000001"}
                                      ],
                                      "sorted":"seq"
                                  }
                              },
                          },
                          displayField: "val",
                          valueField: "gid",
                      }} component={SelectField} name="trackOrderModeGid" />
                  </Col>
              </Row>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "materialInfoCode",
                          label: "产品编码",
                          form:"Create",
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          tableInfo: {
                              id: "tablechanpin0101",
                              size: "small",
                              rowKey: "gid",
                              width:100,
                              tableTitle: "产品",
                              onLoadData: false,
                              columns: [
                                  { title: '产品编码', dataIndex: 'materialGidRef.code', key: '1', width: 100 },
                                  { title: '产品名称', dataIndex: 'materialGidRef.name', key: '2', width: 100 },
                                  { title: '规格', dataIndex: 'materialGidRef.spec', key: '3', width: 50 },
                                  { title: '型号', dataIndex: 'materialGidRef.model', key: '4', width: 50 },
                                  { title: '版本号', dataIndex: 'version', key: '5', width: 50 },
                              ],
                              dataSource: {
                                  type: 'api',
                                  method: 'post',
                                  url: '/ime/mdProductInfo/query.action',
                              }
                          },
                          pageId: 'findBackchanpin0102',
                          displayField: "materialInfoCode",
                          valueField: {
                              "from": "materialGidRef.code",
                              "to": "materialInfoCode"
                          },
                          associatedFields: [
                              {
                                  "from": "gid",
                                  "to": "productInfoGid"
                              },
                              {
                                  "from": "materialGidRef.gid",
                                  "to": "materialInfoGid"
                              },
                              {
                                  "from": "materialGidRef.name",
                                  "to": "materialInfoName"
                              },
                              {
                                  "from": "materialGidRef.spec",
                                  "to": "spec"
                              },
                              {
                                  "from": "materialGidRef.model",
                                  "to": "model"
                              },
                              {
                                  "from": "version",
                                  "to": "productVersion"
                              }
                          ],
                          subscribes: [
                              {
                                  event:"tablechanpin0101.onTableTodoAny",
                                  pubs:[
                                      {
                                          event:"tablechanpin0101.expression",
                                          meta:{
                                              expression:`
                                               let field = "routePath"
                                    let payload = {
                                        "query": {
                                          "query": [
                                            {
                                              "field": field, "type": "null"
                                            }
                                          ],
                                         // "sorted": "gid asc"
                                        },
                                        "pager":{
                                            "page":1,
                                            "pageSize":10
                                        }
                                    }
                                     pubsub.publish(me.props.config.id+'.loadData',{eventPayload:payload})
                                  `
                                          }

                                      }
                                  ],

                              },
                              {
                                  event: "materialInfoCode.onChange",
                                  pubs: [
                                      {
                                          event: "materialInfoCode.expression",//在某个组件上执行表达式
                                          meta: {
                                              expression: `
                                              console.log(1234567890)
                      let dataSource= {type: "api",method: "POST",url: "/ime/mdProductInfo/findById.action?id="+data.eventPayload.gid};
                    resolveDataSource({dataSource:dataSource}).then(function(res){
                      let mdData = {}
                      if(res.data.materialGidRef){
                          mdData.productCode = res.data.materialGidRef.code
                          mdData.productName = res.data.materialGidRef.name
                      }
                      mdData.bomType = res.data.bomType
                      mdData.baseQuantity = res.data.baseQuantity
                      if(res.data.routePathRef){
                          mdData.routePathName = res.data.routePathRef.name
                      }
                      mdData.isVirtual = res.data.isVirtual
                      mdData.productInfoGid = res.data.gid
                      let dataList = []
                      dataList.push(mdData)
                      console.log(dataList)

                      pubsub.publish("@@form.change", { id: "Create",name:"routeProductDTOs" ,value:fromJS(dataList)})
                    });
                    `
                                          }
                                      }
                                  ]
                              }
                          ]
                      }} name="materialInfoCode" component={FindbackField} />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "materialInfoName",
                          label: "产品名称",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                      }} component={TextField} name="materialInfoName" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "spec",
                          label: "规格",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                      }} component={TextField} name="spec" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "model",
                          label: "型号",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                      }} component={TextField} name="model" />
                  </Col>
              </Row>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "productVersion",
                          label: "产品版本",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                      }} component={TextField} name="productVersion" />
                  </Col>

                  <Col span={5}>
                      <Field config={{
                          enabled: true,
                          id: "produceCycle",
                          label: "生产周期",  //标签名称
                          labelSpan: 10,   //标签栅格比例（0-24）
                          wrapperSpan: 12,  //输入框栅格比例（0-24）
                          placeholder: "请输入生产周期"
                      }} component={TextField} name="produceCycle" />
                  </Col>
                  <Col span={1}>
                      <Field config={{
                          id: "timeTypeProduceCycle",
                          label: "",  //标签名称
                          labelSpan: 2,   //标签栅格比例（0-24）
                          wrapperSpan: 22,  //输入框栅格比例（0-24）
                          dataSource: {
                              type: "api",
                              method:"post",
                              url:"/sm/dictionaryEnumValue/query.action",
                              mode:"payload",
                              payload:{
                                  "query":{
                                      "query":[
                                          {"field":"smDictionaryEnumGid","type":"eq","value":"56354B1899A83E18E055000000000001"}
                                      ],
                                      "sorted":"seq"
                                  }
                              },
                          },
                          displayField: "val",
                          valueField: "gid",
                      }} component={SelectField} name="timeTypeProduceCycle" />
                  </Col>
              </Row>
          </Card>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>

              <Tabs defaultActiveKey="1">
                  <TabPane tab="工序" key="1">
                  <Row>
                      <Col span={24}>
                          <FieldArray name="routeOperationQueryList" config={{
                              "id": "mdRouteOperationTable01",
                              "name": "mdRouteOperationTable01",
                              "rowKey": "id",
                              "showSelect":true, //是否显示选择框
                              "columns": [
                                  {
                                      "id": "routeOperationFiled0112",
                                      "type": "textField",
                                      "title": "序号",
                                      "name": "sortNum",
                                      "enabled": false
                                  },
                                  {
                                      "id": "routeOperationFiled0101",
                                      "type": "findbackField",
                                      "title": "工序编码",
                                      "form": "Create",
                                      "name": "mdDefOperationCode",

                                      tableInfo: {
                                          id: "mdDefOperatioinTemp00",
                                          size: "small",
                                          rowKey: "gid",
                                          tableTitle: "信息",
                                          showSerial: true,  //序号
                                          width:1500,
                                          columns: [
                                              { title: '工序编码', width: 150, dataIndex: 'mdDefOperationCode', key: '1' },
                                              { title: '工序名称', width: 80, dataIndex: 'mdDefOperationName', key: '2' },
                                              { title: '工序类型', width: 50, dataIndex: 'mdDefOperationTypeName', key: '3' },
                                              { title: '工作中心', width: 150, dataIndex: 'mdFactoryWorkCenterName', key: '4' },
                                              { title: '产线', width: 150, dataIndex: 'mdFactoryLineName', key: '5' },
                                              { title: '工作单元', width: 150, dataIndex: 'mdFactoryWorkUnitName', key: '6' },
                                              { title: '工位', width: 150, dataIndex: 'mdFactoryStationName', key: '7' },
                                              { title: '加工方式', width: 50, dataIndex: 'processingModeName', key: '8' },
                                              { title: '是否质检', width: 50, dataIndex: 'processTest', key: '9' },
                                              { title: '派工单产生', width: 100, dataIndex: 'worksheetGenarationModeName', key: '10' },
                                              { title: '报工方式', width: 180, dataIndex: 'businessModeName', key: '11' },
                                              { title: '节拍', width: 50, dataIndex: 'rhythm', key: '12' },
                                              { title: '节拍类型', width: 50, dataIndex: 'rhythmTypeName', key: '13' },
                                          ],
                                          dataSource: {
                                              type: 'api',
                                              method: 'post',
                                              url: '/ime/mdDefOperation/query.action'
                                          }
                                      },
                                      pageId: 'routeOperationTable0101',
                                      displayField: "mdDefOperationCode",
                                      valueField: {
                                          "from": "mdDefOperationCode",
                                          "to": "mdDefOperationCode"
                                      },
                                      associatedFields: [
                                          {
                                              "from": "mdDefOperationName",
                                              "to": "mdDefOperationName"
                                          },
                                          {
                                              "from": "mdDefOperationTypeGid",
                                              "to": "mdDefOperationTypeGid"
                                          },
                                          {
                                              "from": "mdFactoryWorkCenterName",
                                              "to": "mdFactoryWorkCenterName"
                                          },
                                          {
                                              "from": "mdFactoryWorkCenterGid",
                                              "to": "mdFactoryWorkCenterGid"
                                          },
                                          {
                                              "from": "mdFactoryLineName",
                                              "to": "mdFactoryLineName"
                                          },
                                          {
                                              "from": "mdFactoryLineGid",
                                              "to": "mdFactoryLineGid"
                                          },
                                          {
                                              "from": "mdFactoryWorkUnitName",
                                              "to": "mdFactoryWorkUnitName"
                                          },
                                          {
                                              "from": "mdFactoryWorkUnitGid",
                                              "to": "mdFactoryWorkUnitGid"
                                          },
                                          {
                                              "from": "mdFactoryStationName",
                                              "to": "mdFactoryStationName"
                                          },
                                          {
                                              "from": "mdFactoryStationGid",
                                              "to": "mdFactoryStationGid"
                                          },
                                          {
                                              "from": "processingModeGid",
                                              "to": "processingModeGid"
                                          },
                                          {
                                              "from": "processTest",
                                              "to": "processTest"
                                          },
                                          {
                                              "from": "worksheetGenarationModeGid",
                                              "to": "worksheetGenarationModeGid"
                                          },
                                          {
                                              "from": "businessModeGid",
                                              "to": "businessModeGid"
                                          },
                                          {
                                              "from": "rhythm",
                                              "to": "rhythm"
                                          },
                                          {
                                              "from": "rhythmTypeGid",
                                              "to": "rhythmTypeGid"
                                          },
                                          {
                                              "from": "mdDefOperationGid",
                                              "to": "mdDefOperationGid"
                                          }
                                      ],
                                      subscribes: [
                                          {
                                              event: "routeOperationFiled0101.onChange",
                                              pubs: [
                                                  {
                                                      event: "routeOperationFiled0101.expression",//在某个组件上执行表达式
                                                      meta: {
                                                          expression: `
                    let dataSource= {type: "api",method: "POST",url: "/ime/mdDefOperation/findDtoById.action?id="+data.eventPayload.gid};
                    resolveDataSource({dataSource:dataSource}).then(function(res){
                      let mdData = res.data.defEquipmentExtList
                      for(var i = 0;i<mdData.length;i++){
                        mdData[i].mdDefOperationCode = res.data.mdDefOperationCode
                        mdData[i].mdDefOperationName = res.data.mdDefOperationName
                        mdData[i].mdDefOperationGid = res.data.mdDefOperationGid
                      }
                       console.log(mdData)
                        resolveFetch({fetch:{id:'Create',data:'@@formValues'}}).then(function(res){
                          if(!res.routeEquipmentQueryList){
                            pubsub.publish("@@form.change", { id: "Create",name:"routeEquipmentQueryList" ,value: fromJS(mdData) })
                          }else{
                              let imeArr = res.routeEquipmentQueryList.concat(mdData)
                              pubsub.publish("@@form.change", { id: "Create",name:"routeEquipmentQueryList" ,value: fromJS(imeArr) })
                          }
                        })

                    });
                                                          `
                                                      }
                                                  }
                                              ]
                                          }
                                      ]
                                  },
                                  {
                                      "id": "routeOperationFiled0102",
                                      "type": "textField",
                                      "title": "工序名称",
                                      "name": "mdDefOperationName",
                                      "enabled": false
                                  },
                                  {
                                      "id": "routeOperationFiled0103",
                                      "type": "selectField",
                                      "title": "工序类型",
                                      "name": "mdDefOperationTypeGid",
                                      "enabled": false,
                                      dataSource: {
                                          type: "api",
                                          method:"post",
                                          url:"/sm/dictionaryEnumValue/query.action",
                                          mode:"payload",
                                          payload:{
                                              "query":{
                                                  "query":[
                                                      {"field":"smDictionaryEnumGid","type":"eq","value":"5627BE1FB43E0FE1E055000000000001"}
                                                  ],
                                                  "sorted":"seq"
                                              }
                                          }
                                      },
                                      displayField: "val",
                                      valueField: "gid"
                                  },
                                  {
                                      "id": "routeOperationFiled0104",
                                      "type": "findbackField",
                                      "title": "工作中心",
                                      "form": "Create",
                                      "name": "mdFactoryWorkCenterName",

                                      tableInfo: {
                                          id: "tableId555jjkdjkljkldjd",
                                          size: "small",
                                          rowKey: "gid",
                                          width:100,
                                          tableTitle: "工作中心",
                                          style:{top:80},
                                          //onLoadData: false,
                                          columns: [
                                              { title: '工作中心编码', width: 200, dataIndex: 'workCenterCode', key: '24567y' },
                                              { title: '工作中心名称', width: 200, dataIndex: 'workCenterName', key: '36yyhhh' },
                                          ],
                                          dataSource: {
                                               type: 'api',
                                              method: 'post',
                                              url: '/ime/mdFactoryWorkCenter/query.action',
                                          }
                                      },
                                      pageId: 'routeOperationTable0102',
                                      displayField: "mdFactoryWorkCenterName",
                                      valueField: {
                                          "from": "workCenterName",
                                          "to": "mdFactoryWorkCenterName"
                                      },
                                      associatedFields: [
                                          {
                                              "from": "gid",
                                              "to": "mdFactoryWorkCenterGid"
                                          }
                                      ]
                                  },
                                  {
                                      "id": "routeOperationFiled0105",
                                      "type": "findbackField",
                                      "title": "产线",
                                      "form": "Create",
                                      "name": "mdFactoryLineName",

                                      subscribes: [
                                          {
                                              event: "routeOperationFiled0104.onChange",
                                              pubs: [
                                                  {
                                                      event: "routeOperationFiled0105.expression",//在某个组件上执行表达式
                                                      meta: {
                                                          expression: `
                                                        //  console.log(123)
                            me.dataContext={gid:data.eventPayload.gid}
                            let val = ""
                            pubsub.publish("@@form.change", { id: "Create", name: me.props.input.name, value: val })
                            let str = me.props.input.name
                            let name = str.substring(0,str.indexOf('.'))+"mdFactoryStationName"
                            let utilName = str.substring(0,str.indexOf('.'))+"mdFactoryWorkUnitName"
                            pubsub.publish("@@form.change", { id: "Create", name: name, value: val })
                            pubsub.publish("@@form.change", { id: "Create", name: utilName, value: val })
                          `
                                                      }
                                                  }
                                              ]
                                          },
                                          {
                                              event: "tableIkkkkdlldgge.onTableTodoAny",
                                              pubs:[

                                                  {
                                                      event:"tableIkkkkdlldgge.loadData",
                                                      eventPayloadExpression:`
                                                      // console.log(eventName)
                                                       let str = eventName
                              let rowId = str.substring(str.indexOf('[')+1,str.indexOf(']'))
                              //console.log(rowId)
                          resolveFetch({fetch:{id:'routeOperationFiled0105['+rowId+']',data:'dataContext'}}).then(function(data){
                               if(!data){
                                    callback()
                                    return
                               }
                               let gid = data.gid
                               console.log(gid)
                                let payload ={}
                                  payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "workCenterGid", "type": "eq", "value": gid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                                callback(payload)
                          })
                                                      `
                                                  }

                                              ],
                                          }
                                      ],
                                      tableInfo: {
                                          id: "tableIkkkkdlldgge",
                                          size: "small",
                                          rowKey: "gid",
                                          width:100,
                                          tableTitle: "产线",
                                          onLoadData: false,
                                          showSerial: true,
                                          columns: [
                                              { title: '产线编码', dataIndex: 'lineCode', key: '9', width: 200 },
                                              { title: '产线名称', dataIndex: 'lineName', key: '10', width: 200 },
                                              { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '3', width: 200 },
                                          ],

                                          dataSource: {
                                              type: 'api',
                                              method: 'post',
                                              mode:"payload&&eventPayload",
                                              url: '/ime/mdFactoryLine/query.action',
                                          }
                                      },
                                      pageId: 'routeOperationTable0103',
                                      displayField: "mdFactoryLineName",
                                      valueField: {
                                          "from": "lineName",
                                          "to": "mdFactoryLineName"
                                      },
                                      associatedFields: [
                                          {
                                              "from": "gid",
                                              "to": "mdFactoryLineGid"
                                          },
                                          {
                                              "from": "workCenterGidRef.workCenterName",
                                              "to": "mdFactoryWorkCenterName"
                                          },
                                          {
                                              "from": "workCenterGidRef.gid",
                                              "to": "mdFactoryWorkCenterGid"
                                          }
                                      ]
                                  },
                                  {
                                      "id": "routeOperationFiled0106",
                                      "type": "findbackField",
                                      "title": "工作单元",
                                      "form": "Create",
                                      "name": "mdFactoryWorkUnitName",
                                      subscribes: [
                                          {
                                              event: "routeOperationFiled0105.onChange",
                                              pubs: [
                                                  {
                                                      event: "routeOperationFiled0106.expression",//在某个组件上执行表达式
                                                      meta: {
                                                          expression: `
                                                        //  console.log(123)
                            me.dataContext={gid:data.eventPayload.gid}
                             let val = ""
                            pubsub.publish("@@form.change", { id: "Create", name: me.props.input.name, value: val })
                            let str = me.props.input.name
                            let name = str.substring(0,str.indexOf('.'))+"mdFactoryStationName"
                            pubsub.publish("@@form.change", { id: "Create", name: name, value: val })
                          `
                                                      }
                                                  }
                                              ]
                                          },
                                          {
                                              event: "tableIkwkkdlldgge.onTableTodoAny",
                                              pubs:[

                                                  {
                                                      event:"tableIkwkkdlldgge.loadData",
                                                      eventPayloadExpression:`
                                                      // console.log(eventName)
                                                       let str = eventName
                              let rowId = str.substring(str.indexOf('[')+1,str.indexOf(']'))
                              //console.log(rowId)
                          resolveFetch({fetch:{id:'routeOperationFiled0106['+rowId+']',data:'dataContext'}}).then(function(data){
                               if(!data){
                                    callback()
                                    return
                               }
                               let gid = data.gid
                               console.log(gid)
                                let payload ={}
                                  payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "factoryLineGid", "type": "eq", "value": gid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                                callback(payload)
                          })
                                                      `
                                                  }

                                              ],
                                          }
                                      ],
                                      tableInfo: {
                                          id: "tableIkwkkdlldgge",
                                          size: "small",
                                          rowKey: "gid",
                                          width:100,
                                          onLoadData: false,
                                          tableTitle: "工作单元",
                                          columns: [
                                              { title: '工作单元编码', dataIndex: 'workUnitCode', key: '9', width: 200 },
                                              { title: '工作单元名称', dataIndex: 'workUnitName', key: '10', width: 200 },
                                              { title: '产线名称', dataIndex: 'factoryLineGidRef.lineName', key: '3', width: 200 },
                                          ],
                                          dataSource: {
                                              type: 'api',
                                              method: 'post',
                                              url: '/ime/mdFactoryWorkUnit/query.action',
                                          }
                                      },
                                      pageId: 'routeOperationTable0104',
                                      displayField: "mdFactoryWorkUnitName",
                                      valueField: {
                                          "from": "workUnitName",
                                          "to": "mdFactoryWorkUnitName"
                                      },
                                      associatedFields: [
                                          {
                                              "from": "gid",
                                              "to": "mdFactoryWorkUnitGid"
                                          },
                                          {
                                              "from": "factoryLineGidRef.lineName",
                                              "to": "mdFactoryLineName"
                                          },
                                          {
                                              "from": "factoryLineGidRef.gid",
                                              "to": "mdFactoryLineGid"
                                          },
                                          {
                                              "from": "factoryLineGidRef.workCenterGidRef.gid",
                                              "to": "mdFactoryWorkCenterGid"
                                          },
                                          {
                                              "from": "factoryLineGidRef.workCenterGidRef.workCenterName",
                                              "to": "mdFactoryWorkCenterName"
                                          }
                                      ]
                                  },
                                  {
                                      "id": "routeOperationFiled0107",
                                      "type": "findbackField",
                                      "title": "工位",
                                      "form": "Create",
                                      "name": "mdFactoryStationName",
                                      subscribes: [
                                          {
                                              event: "routeOperationFiled0106.onChange",
                                              pubs: [
                                                  {
                                                      event: "routeOperationFiled0107.expression",//在某个组件上执行表达式
                                                      meta: {
                                                          expression: `
                                                         // console.log(123)
                            me.dataContext={gid:data.eventPayload.gid}
                             let val = ""
                            pubsub.publish("@@form.change", { id: "Create", name: me.props.input.name, value: val })
                          `
                                                      }
                                                  }
                                              ]
                                          },
                                          {
                                              event: "tableIkwkvdlldgge.onTableTodoAny",
                                              pubs:[

                                                  {
                                                      event:"tableIkwkvdlldgge.loadData",
                                                      eventPayloadExpression:`
                                                     //  console.log(eventName)
                                                       let str = eventName
                              let rowId = str.substring(str.indexOf('[')+1,str.indexOf(']'))
                              //console.log(rowId)
                          resolveFetch({fetch:{id:'routeOperationFiled0107['+rowId+']',data:'dataContext'}}).then(function(data){
                               if(!data){
                                    callback()
                                    return
                               }
                               let gid = data.gid
                               console.log(gid)
                                let payload ={}
                                  payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "workUnitGid", "type": "eq", "value": gid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                                callback(payload)
                          })
                                                      `
                                                  }

                                              ],
                                          }
                                      ],
                                      tableInfo: {
                                          id: "tableIkwkvdlldgge",
                                          size: "small",
                                          rowKey: "gid",
                                          width:100,
                                          onLoadData: false,
                                          tableTitle: "工位",
                                          columns: [
                                              { title: '工位编码', dataIndex: 'stationCode', key: '9', width: 200 },
                                              { title: '工位名称', dataIndex: 'stationName', key: '10', width: 200 },
                                              { title: '工作单元名称', dataIndex: 'workUnitGidRef.workUnitName', key: '3', width: 200 },
                                          ],
                                          dataSource: {
                                              type: 'api',
                                              method: 'post',
                                              url: '/ime/mdFactoryWorkStation/query.action',
                                          }
                                      },
                                      pageId: 'routeOperationTable0105',
                                      displayField: "mdFactoryStationName",
                                      valueField: {
                                          "from": "stationName",
                                          "to": "mdFactoryStationName"
                                      },
                                      associatedFields: [
                                          {
                                              "from": "gid",
                                              "to": "mdFactoryStationGid"
                                          },
                                          {
                                              "from": "workUnitGidRef.workUnitName",
                                              "to": "mdFactoryWorkUnitName"
                                          },
                                          {
                                              "from": "workUnitGidRef.gid",
                                              "to": "mdFactoryWorkUnitGid"
                                          },
                                          {
                                              "from": "workUnitGidRef.factoryLineGidRef.gid",
                                              "to": "mdFactoryLineGid"
                                          },
                                          {
                                              "from": "workUnitGidRef.factoryLineGidRef.lineName",
                                              "to": "mdFactoryLineName"
                                          },
                                          {
                                              "from": "workUnitGidRef.factoryLineGidRef.workCenterGidRef.gid",
                                              "to": "mdFactoryWorkCenterGid"
                                          },
                                          {
                                              "from": "workUnitGidRef.factoryLineGidRef.workCenterGidRef.workCenterName",
                                              "to": "mdFactoryWorkCenterName"
                                          }
                                      ]
                                  },
                                  {
                                      "id": "routeOperationFiled0108",
                                      "type": "selectField",
                                      "title": "加工方式",
                                      "name": "processingModeGid",
                                      dataSource: {
                                          type: "api",
                                          method:"post",
                                          url:"/sm/dictionaryEnumValue/query.action",
                                          mode:"payload",
                                          payload:{
                                              "query":{
                                                  "query":[
                                                      {"field":"smDictionaryEnumGid","type":"eq","value":"5627BE1FB43F0FE1E055000000000001"}
                                                  ],
                                                  "sorted":"seq"
                                              }
                                          }
                                      },
                                      displayField: "val",
                                      valueField: "gid"
                                  },
                                  {
                                      "id": "routeOperationFiled0109",
                                      "type": "switchField",
                                      "title": "是否质检",
                                      "name": "processTest",
                                      "isNumber": true,
                                      "checkedChildren":"是",
                                      "unCheckedChildren":"否"
                                  },
                                  {
                                      "id": "routeOperationFiled0110",
                                      "type": "selectField",
                                      "title": "派工单产生",
                                      "name": "worksheetGenarationModeGid",
                                      dataSource: {
                                          type: "api",
                                          method:"post",
                                          url:"/sm/dictionaryEnumValue/query.action",
                                          mode:"payload",
                                          payload:{
                                              "query":{
                                                  "query":[
                                                      {"field":"smDictionaryEnumGid","type":"eq","value":"5628CF31424826A8E055000000000001"}
                                                  ],
                                                  "sorted":"seq"
                                              }
                                          }
                                      },
                                      displayField: "val",
                                      valueField: "gid"
                                  },
                                  {
                                      "id": "routeOperationFiled0111",
                                      "type": "selectField",
                                      "title": "报工方式",
                                      "name": "businessModeGid",
                                      dataSource: {
                                          type: "api",
                                          method:"post",
                                          url:"/sm/dictionaryEnumValue/query.action",
                                          mode:"payload",
                                          payload:{
                                              "query":{
                                                  "query":[
                                                      {"field":"smDictionaryEnumGid","type":"eq","value":"5628CF31424726A8E055000000000001"}
                                                  ],
                                                  "sorted":"seq"
                                              }
                                          }
                                      },
                                      displayField: "val",
                                      valueField: "gid"
                                  },
                                  {
                                      "id": "routeOperationFiled0113",
                                      "type": "textField",
                                      "title": "节拍",
                                      "name": "rhythm",
                                      "enabled": true
                                  },
                                  {
                                      "id": "routeOperationFiled0114",
                                      "type": "selectField",
                                      "title": "节拍类型",
                                      "name": "rhythmTypeGid",
                                      dataSource: {
                                          type: "api",
                                          method:"post",
                                          url:"/sm/dictionaryEnumValue/query.action",
                                          mode:"payload",
                                          payload:{
                                              "query":{
                                                  "query":[
                                                      {"field":"smDictionaryEnumGid","type":"eq","value":"56354B1899A83E18E055000000000001"}
                                                  ],
                                                  "sorted":"seq"
                                              }
                                          }
                                      },
                                      displayField: "val",
                                      valueField: "gid"
                                  },
                              ]
                          }}component={TableField}/>

                      </Col>
                  </Row>
                  </TabPane>
                  <TabPane tab="设备" key="2">
                      <Row>
                          <Col span={24}>
                              <FieldArray name="routeEquipmentQueryList" config={{
                                  "id": "mdRouteEquipmentTable01",
                                  "name": "mdRouteEquipmentTable01",
                                  "rowKey": "id",
                                  "showSelect":true, //是否显示选择框
                                  "columns": [
                                      {
                                          "id": "sbTabSelectFiled01",
                                          "type": "selectField",
                                          "title": "需求方式",
                                          "name": "demandModeGid",
                                          dataSource: {
                                              type: "api",
                                              method:"post",
                                              url:"/sm/dictionaryEnumValue/query.action",
                                              mode:"payload",
                                              payload:{
                                                  "query":{
                                                      "query":[
                                                          {"field":"smDictionaryEnumGid","type":"eq","value":"56E9CDAAE31B53F5E055000000000001"}
                                                      ],
                                                      "sorted":"seq"
                                                  }
                                              }
                                          },
                                          displayField: "val",
                                          valueField: "gid"
                                      },
                                      {
                                          "id": "sbTabSelectFiled02",
                                          "type": "selectField",
                                          "title": "需求规则",
                                          "name": "demandRuleGid",
                                          dataSource: {
                                              type: "api",
                                              method:"post",
                                              url:"/sm/dictionaryEnumValue/query.action",
                                              mode:"payload",
                                              payload:{
                                                  "query":{
                                                      "query":[
                                                          {"field":"smDictionaryEnumGid","type":"eq","value":"56E9CDAAE31C53F5E055000000000001"}
                                                      ],
                                                      "sorted":"seq"
                                                  }
                                              }
                                          },
                                          displayField: "val",
                                          valueField: "gid"
                                      },
                                      {
                                          "id": "sbTabFindbackField01",
                                          "type": "findbackField",
                                          "title": "设备编码",
                                          "form": "Create",
                                          "name": "mdEquipmentCode",

                                          tableInfo: {
                                              id: "tapdjbdvchaskjcnda",
                                              size: "small",
                                              rowKey: "gid",
                                              tableTitle: "设备信息",
                                              showSerial: true,  //序号
                                              width:100,
                                              columns: [
                                                  { title: '设备编码', width: 150, dataIndex: 'code', key: '1' },
                                                  { title: '设备名称', width: 150, dataIndex: 'name', key: '2' },
                                                  { title: '设备类型', width: 150, dataIndex: 'mdEquipmentTypeGidRef.name', key: '3' },
                                              ],
                                              dataSource: {
                                                  type: 'api',
                                                  method: 'post',
                                                  url: '/ime/mdEquipment/query.action'
                                              }
                                          },
                                          pageId: 'tableFijoshahhfkae',
                                          displayField: "mdEquipmentCode",
                                          valueField: {
                                              "from": "code",
                                              "to": "mdEquipmentCode"
                                          },
                                          associatedFields: [
                                              {
                                                  "from": "name",
                                                  "to": "mdEquipmentName"
                                              },
                                              {
                                                  "from": "mdEquipmentTypeGidRef.name",
                                                  "to": "mdEquipmentType"
                                              },
                                              {
                                                  "from": "gid",
                                                  "to": "mdEquipmentGid"
                                              }
                                          ]
                                      },
                                      {
                                          "id": "sbTabTextFiled01",
                                          "type": "textField",
                                          "title": "设备名称",
                                          "name": "mdEquipmentName",
                                          "enabled": false
                                      },
                                      {
                                          "id": "sbTabTextFiled02",
                                          "type": "textField",
                                          "title": "设备类型",
                                          "name": "mdEquipmentType",
                                          "enabled": false
                                      },
                                      {
                                          "id": "sbTabFindbackField15",
                                          "type": "findbackField",
                                          "title": "工序编码",
                                          "form": "Create",
                                          "name": "mdDefOperationCode",

                                          tableInfo: {
                                              id: "tapdjbdvchaskjcnda",
                                              size: "small",
                                              rowKey: "gid",
                                              tableTitle: "工序信息",
                                              showSerial: true,  //序号
                                              //onLoadData: false,
                                              width:100,
                                              columns: [
                                                  { title: '工序编码', width: 150, dataIndex: 'mdDefOperationCode', key: '1' },
                                                  { title: '工序名称', width: 150, dataIndex: 'mdDefOperationName', key: '2' },
                                              ],
                                              dataSource: {
                                                  type: 'api',
                                                  method: 'post',
                                                  url: '/ime/mdDefOperation/query.action',
                                                  bodyExpression:`
                                  resolveFetch({fetch:{id:'Create',data:'@@formValues'}}).then(function(data){
                                    let operationDtos = data.routeOperationQueryList
                                    let gids = ''
                                    if(operationDtos){
                                        for(var i=0;i<operationDtos.length;i++){
                                            if(operationDtos[i].mdDefOperationGid){
                                                 gids += operationDtos[i].mdDefOperationGid + ","
                                            }
                                        }
                                    }
                                    console.log(gids)
                                    callback({
                                        "query": {
                                          "query": [
                                            {
                                              "field": "mdDefOperationGid", "type": "in","value": gids.substring(0, gids.lastIndexOf(","))
                                            }
                                          ],
                                         // "sorted": "gid asc"
                                        },
                                        "pager":{
                                            "page":1,
                                            "pageSize":10
                                        }
                                    })
                                  })
                                  `
                                              }
                                          },
                                          pageId: 'tableFijoshahhjvsjoe',
                                          displayField: "mdDefOperationCode",
                                          valueField: {
                                              "from": "mdDefOperationCode",
                                              "to": "mdDefOperationCode"
                                          },
                                          associatedFields: [
                                              {
                                                  "from": "mdDefOperationName",
                                                  "to": "mdDefOperationName"
                                              },
                                              {
                                                  "from": "mdDefOperationGid",
                                                  "to": "mdDefOperationGid"
                                              }
                                          ],
                                      },

                                      {
                                          "id": "sbTabTextFiled16",
                                          "type": "textField",
                                          "title": "工序名称",
                                          "name": "mdDefOperationName",
                                          "enabled": false
                                      },
                                      {
                                          "id": "sbTabTextFiled03",
                                          "type": "textField",
                                          "title": "设备数量",
                                          "name": "equipmentNumber",
                                          "enabled": true
                                      },
                                      {
                                          "id": "sbTabFindbackField012",
                                          "type": "findbackField",
                                          "title": "设备日历",
                                          "form": "Create",
                                          "name": "equipmentCalendarName",

                                          tableInfo: {
                                              id: "tapdjicdjijiaknda",
                                              size: "small",
                                              rowKey: "gid",
                                              tableTitle: "日历信息",
                                              showSerial: true,  //序号
                                              width:100,
                                              columns: [
                                                  { title: '日历编码', width: 200, dataIndex: 'calendarCode', key: '1' },
                                                  { title: '日历名称', width: 200, dataIndex: 'calendarName', key: '2' },

                                              ],
                                              dataSource: {
                                                  type: 'api',
                                                  method: 'post',
                                                  url: '/sm/calendar/query.action'
                                              }
                                          },
                                          pageId: 'tableFijoshkahkkae',
                                          displayField: "equipmentCalendarName",
                                          valueField: {
                                              "from": "calendarName",
                                              "to": "equipmentCalendarName"
                                          },
                                          associatedFields: [
                                              {
                                                  "from": "gid",
                                                  "to": "equipmentCalendarGid"
                                              }
                                          ]
                                      },
                                      {
                                          "id": "sbTabTextFiled04",
                                          "type": "textField",
                                          "title": "设备产能",
                                          "name": "equipmentCapacity",
                                          "enabled": true
                                      },
                                      {
                                          "id": "sbTabTextFiled05",
                                          "type": "textField",
                                          "title": "加工批量",
                                          "name": "processBatch",
                                          "enabled": true
                                      },
                                      {
                                          "id": "sbTabTextFiled06",
                                          "type": "textField",
                                          "title": "有效工作时间",
                                          "name": "effectiveWorkingTime",
                                          "enabled": true
                                      }
                                  ]
                              }}component={TableField}/>

                          </Col>
                      </Row>
                  </TabPane>
                  <TabPane tab="共享产品" key="3">
                      <Row>
                          <Col span={1}>
                              <AppButton config={{
                                  id: "productAdd",
                                  title: "增加",
                                  //type: "primary",
                                  size: "default",
                                  visible: true,
                                  enabled: true,
                                  subscribes: [
                                      {
                                          event: "productAdd.click",
                                          pubs: [
                                              {
                                                  event: "productAdd.expression",
                                                  meta: {
                                                      expression: `
                                      resolveFetch({fetch:{id:'Create',data:'@@formValues'}}).then(function(data){
                                        if(data && data.materialInfoCode){
                                            pubsub.publish("mdRouteProduceTable01.addRow");
                                        }else{
                                            pubsub.publish("@@message.error","请先添加产品信息！");
                                        }
                                      })
                                                  `
                                                  }
                                              }
                                          ]
                                      }
                                  ]
                              }}/>
                          </Col>
                      </Row>
                      <Row>
                          <Col span={24}>
                              <FieldArray name="routeProductDTOs" config={{
                                  addButton: false,
                                  "id": "mdRouteProduceTable01",
                                  "name": "mdRouteProduceTable01",
                                  "rowKey": "id",
                                  "form":"Create",
                                  "showSelect":true, //是否显示选择框
                                  "unEditable":true, //初始化是否都不可编辑
                                  "showRowDeleteButton": true,
                                  "columns": [
                                      {
                                          "id": "routeProduceField0101",
                                          "type": "findbackField",
                                          "title": "产品编码",
                                          "form": "Create",
                                          "name": "productCode",

                                          tableInfo: {
                                              id: "tablechanpin0102",
                                              size: "small",
                                              rowKey: "gid",
                                              width:100,
                                              tableTitle: "产品",
                                              //onLoadData: false,
                                              columns: [
                                                  { title: '产品编码', dataIndex: 'materialGidRef.code', key: '1', width: 100 },
                                                  { title: '产品名称', dataIndex: 'materialGidRef.name', key: '2', width: 100 },
                                                  { title: 'bom类型', dataIndex: 'bomType', key: '3', width: 50 },
                                                  { title: '基本数量', dataIndex: 'baseQuantity', key: '4', width: 50 },
                                                  { title: '工艺路线', dataIndex: 'routePathRef.name', key: '5', width: 50 },
                                                  { title: '虚拟件', dataIndex: 'isVirtual', key: '6', width: 50 ,columnsType:{"type":"replace","text":{true:"是",false:"否"}}},
                                              ],
                                              dataSource: {
                                                  type: 'api',
                                                  method: 'post',
                                                  url: '/ime/mdProductInfo/query.action',
                                                  bodyExpression:`
                                  resolveFetch({fetch:{id:'Create',data:'@@formValues'}}).then(function(data){
                                    let gids = ''
                                    let productGids = data.routeProductDTOs
                                    //console.log(productGids)
                                    if(productGids){
                                        for(var i=0;i<productGids.length;i++){
                                            if(productGids[i].productInfoGid){
                                                 gids += productGids[i].productInfoGid + ","
                                            }
                                        }
                                    }
                                    //console.log(gids)
                                    let field = "routePath"
                                    callback({
                                        "query": {
                                          "query": [
                                            {
                                              "field": field, "type": "null" ,"operator":"and"
                                            },
                                            {
                                              "field": "gid", "type": "noin","value": gids.substring(0, gids.lastIndexOf(","))
                                            }
                                          ],
                                         // "sorted": "gid asc"
                                        },
                                        "pager":{
                                            "page":1,
                                            "pageSize":10
                                        }
                                    })
                                  })
                                  `
                                              }
                                          },
                                          pageId: 'routeProduceTable0101',
                                          displayField: "productCode",
                                          valueField: {
                                              "from": "materialGidRef.code",
                                              "to": "productCode"
                                          },
                                          associatedFields: [
                                              {
                                                  "from": "gid",
                                                  "to": "productInfoGid"
                                              },
                                              {
                                                  "from": "materialGidRef.name",
                                                  "to": "productName"
                                              },
                                              {
                                                  "from": "mdEquipmentTypeGidRef.name",
                                                  "to": "mdEquipmentType"
                                              },
                                              {
                                                  "from": "bomType",
                                                  "to": "bomType"
                                              },
                                              {
                                                  "from": "baseQuantity",
                                                  "to": "baseQuantity"
                                              },
                                              {
                                                  "from": "routePathRef.name",
                                                  "to": "routePathName"
                                              },
                                              {
                                                  "from": "isVirtual",
                                                  "to": "isVirtual"
                                              }

                                          ],
                                      },
                                      {
                                          "id": "routeProduceField0102",
                                          "type": "textField",
                                          "title": "产品名称",
                                          "enabled": false,
                                          "name": "productName",
                                          "enabled": false
                                      },
                                      {
                                          "id": "routeProduceField0103",
                                          "type": "selectField",
                                          "title": "bom类型",
                                          "enabled": false,
                                          "name": "bomType",
                                          dataSource: {
                                              type: "api",
                                              method:"post",
                                              url:"/sm/dictionaryEnumValue/query.action",
                                              mode:"payload",
                                              payload:{
                                                  "query":{
                                                      "query":[
                                                          {"field":"smDictionaryEnumGid","type":"eq","value":"56272988A1761D58E055000000000001"}
                                                      ],
                                                      "sorted":"seq"
                                                  }
                                              }
                                          },
                                          displayField: "val",
                                          valueField: "gid"
                                      },
                                      {
                                          "id": "routeProduceField0104",
                                          "type": "textField",
                                          "title": "基本数量",
                                          "name": "baseQuantity",
                                          "enabled": false
                                      },
                                      {
                                          "id": "routeProduceField0105",
                                          "type": "findbackField",
                                          "title": "工艺路线",
                                          "form": "Create",
                                          "enabled": false,
                                          "name": "routePathName",

                                          tableInfo: {
                                              id: "tablechanpin0103",
                                              size: "small",
                                              rowKey: "gid",
                                              tableTitle: "工艺路线信息",
                                              showSerial: true,  //序号
                                              width:100,
                                              columns: [
                                                  { title: '工艺路线编码', width: 200, dataIndex: 'routeLineCode', key: '1' },
                                                  { title: '工艺路线名称', width: 200, dataIndex: 'routeLineName', key: '2' },

                                              ],
                                              dataSource: {
                                                  type: 'api',
                                                  method: 'post',
                                                  url: '/ime/mdRouteLine/query.action'
                                              }
                                          },
                                          pageId: 'routeProduceTable0102',
                                          displayField: "routePathName",
                                          valueField: {
                                              "from": "routeLineName",
                                              "to": "routePathName"
                                          },
                                          associatedFields: [
                                              {
                                                  "from": "gid",
                                                  "to": "routePathGid"
                                              }
                                          ],

                                      },
                                      {
                                          "id": "routeProduceField0106",
                                          "type": "switchField",
                                          "title": "虚拟件",
                                          "name": "isVirtual",
                                          "checkedChildren":"是",
                                          "unCheckedChildren":"否",
                                          "enabled": false
                                      }

                                  ],
                                 /* rowOperationItem: [
                                      {
                                          id: "productDelBtn",
                                          type: "linkButton",
                                          title: "删除",
                                          subscribes: [
                                              {
                                                  event: "productDelBtn.click",
                                                  pubs:[
                                                      {
                                                          event:"productDelBtn.expression",
                                                          meta:{
                                                              expression:`
                                                              let data = me.eventPayload
                                                              console.log(data)

                                                              `
                                                          }
                                                      }
                                                  ]
                                                  /!*behaviors: [
                                                      {
                                                          type: "request",
                                                          dataSource: {
                                                              type: "api",
                                                              method: "POST",
                                                              url: "/api/ddd.json",
                                                              payloadMapping: [{
                                                                  from: "gid",
                                                                  to: "id"
                                                              }]
                                                          },
                                                          successPubs: [
                                                              {
                                                                  event: "1.enabled",
                                                                  payload: false
                                                              }
                                                          ]


                                                      }
                                                  ]*!/
                                              }
                                          ]

                                      }
                                  ]*/
                              }}component={TableField}/>

                          </Col>
                      </Row>
                  </TabPane>
              </Tabs>

          </Card>

      </div>
    );
  }
}
Create.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

function mapStateToProps(props) {
    return {
        onSubmit:()=>{debugger}
    };
}

let CreateForm =  reduxForm({
    form: "Create",
    validate,
    asyncValidate,
    asyncBlurFields: ['routeLineCode']
})(Create)
export default connect(mapStateToProps, mapDispatchToProps)(CreateForm);
