import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Row, Card, Col, Tabs} from 'antd';
import pubsub from 'pubsub-js'
import _ from "lodash"

import CoreComponent from 'components/CoreComponent'
import AppButton from "components/AppButton"
import TextField from 'components/Form/TextField'
import TableField from 'components/Form/TableField'
import FindbackField from 'components/Form/FindbackField'

import {resolveDataSource, publishEvents, resolveFetch, resolveDataSourceCallback} from 'utils/componentUtil';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
const TabPane = Tabs.TabPane;
let aa=undefined
const validate = values => {
  debugger
  const errors = {}
  let vv = values.toJS();
  if (!values.getIn(['smBusiUnitGidRef', 'busiUnitCode'])) {
    errors.smBusiUnitGidRef = {}
    errors.smBusiUnitGidRef.busiUnitCode = "必填项"
  }

  //工作中心
  if (!vv.factoryWorkCenterList || !vv.factoryWorkCenterList.length) {
  } else {
    const membersArrayErrors = []
    vv.factoryWorkCenterList.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.workCenterCode) {
        memberErrors.workCenterCode = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (member.workCenterCode) {
        const curArr = _.filter(vv.factoryWorkCenterList, {workCenterCode: member.workCenterCode})
        if(curArr.length>1){
          memberErrors.workCenterCode = '已存在'
          membersArrayErrors[memberIndex] = memberErrors
        }
      }
      if (!member || !member.workCenterName) {
        memberErrors.workCenterName = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (member.workCenterName) {
        const curArr = _.filter(vv.factoryWorkCenterList, {workCenterName: member.workCenterName})
        if(curArr.length>1){
          memberErrors.workCenterName = '已存在'
          membersArrayErrors[memberIndex] = memberErrors
        }
      }
    })
    if (membersArrayErrors.length) {
      errors.factoryWorkCenterList = membersArrayErrors
    }
  }
  //产线
  if (!vv.factoryLineList || !vv.factoryLineList.length) {
  } else {
    const membersArrayErrors = []
    vv.factoryLineList.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.lineCode) {
        memberErrors.lineCode = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (member.lineCode) {
        const curArr = _.filter(vv.factoryLineList, {lineCode: member.lineCode})
        const index = _.findIndex(aa.factoryLineList, {lineCode: member.lineCode})
        if(curArr.length>1 || index != -1){
          memberErrors.lineCode = '已存在'
          membersArrayErrors[memberIndex] = memberErrors
        }
      }
      if (!member || !member.lineName) {
        memberErrors.lineName = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (member.lineName) {
        const curArr = _.filter(vv.factoryLineList, {lineName: member.lineName})
        const index = _.findIndex(aa.factoryLineList, {lineName: member.lineName})
        if(curArr.length>1 || index != -1){
          memberErrors.lineName = '已存在'
          membersArrayErrors[memberIndex] = memberErrors
        }
      }
      if (!member || !member.workCenterGidRef || !member.workCenterGidRef.workCenterName) {
        memberErrors.workCenterGidRef = {}
        memberErrors.workCenterGidRef.workCenterName = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
    })
    if (membersArrayErrors.length) {
      errors.factoryLineList = membersArrayErrors
    }
  }
  //工作单元
  if (!vv.factoryWorkUnitList || !vv.factoryWorkUnitList.length) {
  } else {
    const membersArrayErrors = []
    vv.factoryWorkUnitList.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.workUnitCode) {
        memberErrors.workUnitCode = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (member.workUnitCode) {
        const curArr = _.filter(vv.factoryLineList, {workUnitCode: member.workUnitCode})
        const index = _.findIndex(aa.factoryLineList, {workUnitCode: member.workUnitCode})
        if(curArr.length>1 || index != -1){
          memberErrors.workUnitCode = '已存在'
          membersArrayErrors[memberIndex] = memberErrors
        }
      }
      if (!member || !member.workUnitName) {
        memberErrors.workUnitName = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (member.workUnitName) {
        const curArr = _.filter(vv.factoryLineList, {workUnitName: member.workUnitName})
        const index = _.findIndex(aa.factoryLineList, {workUnitName: member.workUnitName})
        if(curArr.length>1 || index != -1){
          memberErrors.workUnitName = '已存在'
          membersArrayErrors[memberIndex] = memberErrors
        }
      }
      if (!member || !member.lineGidRef || !member.lineGidRef.lineName) {
        memberErrors.lineGidRef = {}
        memberErrors.lineGidRef.lineName = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
    })
    if (membersArrayErrors.length) {
      errors.factoryWorkUnitList = membersArrayErrors
    }
  }
  //工位
  if (!vv.factoryWorkStationList || !vv.factoryWorkStationList.length) {
  } else {
    const membersArrayErrors = []
    vv.factoryWorkStationList.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.stationCode) {
        memberErrors.stationCode = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (member.stationCode) {
        const curArr = _.filter(vv.factoryLineList, {stationCode: member.stationCode})
        const index = _.findIndex(aa.factoryLineList, {stationCode: member.stationCode})
        if(curArr.length>1 || index != -1){
          memberErrors.stationCode = '已存在'
          membersArrayErrors[memberIndex] = memberErrors
        }
      }
      if (!member || !member.stationName) {
        memberErrors.stationName = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (member.stationName) {
        const curArr = _.filter(vv.factoryLineList, {stationName: member.stationName})
        const index = _.findIndex(aa.factoryLineList, {stationName: member.stationName})
        if(curArr.length>1 || index != -1){
          memberErrors.stationName = '已存在'
          membersArrayErrors[memberIndex] = memberErrors
        }
      }
      if (!member || !member.workUnitGidRef || !member.workUnitGidRef.workUnitName) {
        memberErrors.workUnitGidRef = {}
        memberErrors.workUnitGidRef.workUnitName = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
    })
    if (membersArrayErrors.length) {
      errors.factoryWorkStationList = membersArrayErrors
    }
  }
  return errors
}

const uniqueFun = () =>{

}

class Create extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe("factoryWorkCenterList.onSelect")
    pubsub.unsubscribe("factoryLineList.onSelectedRows")
    pubsub.unsubscribe("factoryWorkUnitList.onSelectedRows")
    aa=undefined
  }

  componentDidMount() {
    this.factoryWorkCenterList = []  //工作中心
    this.factoryLineList = []  //产线
    this.factoryWorkUnitList = []  //工作单元
    this.factoryWorkStationList = []  //工位
    let _this = this
    aa=this;

    //工作中心切换
    pubsub.subscribe("factoryWorkCenterList.onSelectedRows", () => {
      resolveFetch({fetch: {id: 'Create', data: '@@formValues'}}).then(function (value) {
        resolveFetch({fetch: {id: 'factoryWorkCenterList', data: 'selectedRows'}}).then(function (row) {
          let workCenterRefId = row && row['workCenterRefId']

          //产线
          value.factoryLineList = _.cloneDeep(
            this.refreshList("lineRefId", "factoryLineList", value.factoryLineList, workCenterRefId, "workCenterRefId")
          )
          //工作单元
          value.factoryWorkUnitList = _.cloneDeep(
            this.refreshList("workUnitRefId", "factoryWorkUnitList", value.factoryWorkUnitList, workCenterRefId, "workCenterRefId")
          )
          //工位
          value.factoryWorkStationList = _.cloneDeep(
            this.refreshList("workStationRefId", "factoryWorkStationList", value.factoryWorkStationList, workCenterRefId, "workCenterRefId")
          )
          pubsub.publish("@@form.init", {id: "Create", data: value})
          pubsub.publish("factoryLineList.clearSelect")
          pubsub.publish("factoryWorkUnitList.clearSelect")
          pubsub.publish("factoryWorkStationList.clearSelect")
        }.bind(this))
      }.bind(this))
    })

    //产线切换
    pubsub.subscribe("factoryLineList.onSelectedRows", () => {
      resolveFetch({fetch: {id: 'Create', data: '@@formValues'}}).then(function (value) {
        resolveFetch({fetch: {id: 'factoryLineList', data: 'selectedRows'}}).then(function (row) {
          let lineRefId = row && row['lineRefId']

          //工作单元
          value.factoryWorkUnitList = _.cloneDeep(
            this.refreshList("workUnitRefId", "factoryWorkUnitList", value.factoryWorkUnitList, lineRefId, "lineRefId")
          )
          //工位
          value.factoryWorkStationList = _.cloneDeep(
            this.refreshList("workStationRefId", "factoryWorkStationList", value.factoryWorkStationList, lineRefId, "lineRefId")
          )
          pubsub.publish("@@form.init", {id: "Create", data: value})
          pubsub.publish("factoryWorkUnitList.clearSelect")
          pubsub.publish("factoryWorkStationList.clearSelect")
        }.bind(this))
      }.bind(this))
    })

    //工作单元切换
    pubsub.subscribe("factoryWorkUnitList.onSelectedRows", () => {
      resolveFetch({fetch: {id: 'Create', data: '@@formValues'}}).then(function (value) {
        resolveFetch({fetch: {id: 'factoryWorkUnitList', data: 'selectedRows'}}).then(function (row) {
          let workUnitRefId = row && row['workUnitRefId']

          //工位
          value.factoryWorkStationList = _.cloneDeep(
            this.refreshList("workStationRefId", "factoryWorkStationList", value.factoryWorkStationList, workUnitRefId, "workUnitRefId")
          )
          pubsub.publish("@@form.init", {id: "Create", data: value})
          pubsub.publish("factoryWorkStationList.clearSelect")
        }.bind(this))
      }.bind(this))
    })

    //工作中心删除
    pubsub.subscribe("factoryWorkCenterList.onDelete", (eventName,delLine) => {
      resolveFetch({fetch: {id: 'Create', data: '@@formValues'}}).then(function (value) {
        //产线
        _this.deleteLine(delLine,"workCenterRefId",_this.factoryLineList)
        _this.deleteLine(delLine,"workCenterRefId",value.factoryLineList)
        //工作单元
        _this.deleteLine(delLine,"workCenterRefId",_this.factoryWorkUnitList)
        _this.deleteLine(delLine,"workCenterRefId",value.factoryWorkUnitList)
        //工位
        _this.deleteLine(delLine,"workCenterRefId",_this.factoryWorkStationList)
        _this.deleteLine(delLine,"workCenterRefId",value.factoryWorkStationList)
        pubsub.publish("@@form.init", {id: "Create", data: value})
      })
    })

    //产线删除
    pubsub.subscribe("factoryLineList.onDelete", (eventName,delLine) => {
      resolveFetch({fetch: {id: 'Create', data: '@@formValues'}}).then(function (value) {
        //产线
        _this.deleteLine(delLine,"lineRefId",_this.factoryLineList)
        //工作单元
        _this.deleteLine(delLine,"lineRefId",_this.factoryWorkUnitList)
        _this.deleteLine(delLine,"lineRefId",value.factoryWorkUnitList)
        //工位
        _this.deleteLine(delLine,"lineRefId",_this.factoryWorkStationList)
        _this.deleteLine(delLine,"lineRefId",value.factoryWorkStationList)
        pubsub.publish("@@form.init", {id: "Create", data: value})
      })
    })

    //工作单元删除
    pubsub.subscribe("factoryWorkUnitList.onDelete", (eventName,delLine) => {
      resolveFetch({fetch: {id: 'Create', data: '@@formValues'}}).then(function (value) {
        //工作单元
        _this.deleteLine(delLine,"workUnitRefId",_this.factoryWorkUnitList)
        //工位
        _this.deleteLine(delLine,"workUnitRefId",_this.factoryWorkStationList)
        _this.deleteLine(delLine,"workUnitRefId",value.factoryWorkStationList)
        pubsub.publish("@@form.init", {id: "Create", data: value})
      })
    })

    //工位删除
    pubsub.subscribe("factoryWorkStationList.onDelete", (eventName,delLine) => {
      resolveFetch({fetch: {id: 'Create', data: '@@formValues'}}).then(function (value) {
        //工位
        _this.deleteLine(delLine,"workStationRefId",_this.factoryWorkStationList)
        pubsub.publish("@@form.init", {id: "Create", data: value})
      })
    })
  }

  //删除
  deleteLine = (delLine,idName,list) =>{
    let id = delLine[idName]
    let newList = _.cloneDeep(list)
    newList.map((item)=>{
      if(item[idName] === id){
        let index = _.findIndex(list,{[idName]:id})
        list.splice(index,1)
      }
    })
  }

  //将当前tab里的数据存到全局变量
  translateList = (refIdName, list, current) => {
    let currentLine = _.cloneDeep(current)
    let _this = this

    currentLine.map((item) => {
      let oldItem = _.find(_this[list], {[refIdName]: item[refIdName]})
      if (oldItem) {
        let index = _this[list].indexOf(oldItem)
        _this[list].splice(index, 1)
      }
    })
    _this[list] = _this[list].concat(currentLine)
  }

  refreshList = (refIdName, list, current, id, idName) =>{
    let newLine = []
    let _this = this

    this.translateList(refIdName, list, current)

    _this[list].map(item => {
      if (item[idName] === id) {
        newLine.push(item)
      }
    })
    return newLine
  }

  getCurRefId = (eventName, list, ref) => {
    resolveFetch({fetch: {id: list}}).then(function (res) {
      resolveFetch({fetch: {id: "Create", data: "@@formValues"}}).then(function (value) {
        let id = eventName.substring(eventName.indexOf("["), eventName.indexOf("]")).replace("[", "")
        let index = res.rowIds.indexOf(id)
        let name = eventName.substring(0, eventName.indexOf("["))
        let nameArr = name.split("_")
        let workCenterRefId = value[list][index][nameArr[1]]

        ref.dataContext = workCenterRefId
      })
    })
  }

  //编码和名称修改
  setValues = (eventName, curList, nextList, editValue) => {
    resolveFetch({fetch: {id: curList}}).then(function (res) {
      resolveFetch({fetch: {id: "Create", data: "@@formValues"}}).then(function (value) {
        let id = eventName.substring(eventName.indexOf("["), eventName.indexOf("]")).replace("[", "")
        let name = eventName.substring(0, eventName.indexOf("["))
        let nameArr = name.split("_")
        let index = res.rowIds.indexOf(id)
        let list = value[curList]
        let workCenterRefId = list[index][`${nameArr[0]}RefId`]

        this[nextList] = this.translateInputValue(this[nextList], workCenterRefId, editValue, name)
        value[nextList] = this.translateInputValue(value[nextList], workCenterRefId, editValue, name)
        pubsub.publish("@@form.init", {id: "Create", data: value})
      }.bind(this))
    }.bind(this))
  }

  //change
  translateInputValue = (list, workCenterRefId, value, name) => {
    let nameArr = name.split("_")
    list && list.map(item => {
      if (item[`${nameArr[0]}RefId`] === workCenterRefId) {
        item[`${nameArr[0]}GidRef`][`${nameArr[0]}${nameArr[1]}`] = value
      }
    })
    return _.cloneDeep(list)
  }

  translateReferValue = (list, name, dataContext, value) => {
    list && list.map(item => {
      if (item[name] === dataContext) {
        item[name] = value
      }
    })
    return list
  }

  getAllValue = () =>{
    resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (value) {
      let factoryWorkCenterList = _.cloneDeep(value.factoryWorkCenterList)
      //产线
      this.translateList("lineRefId", "factoryLineList", value.factoryLineList)
      //工作单元
      this.translateList("workUnitRefId", "factoryWorkUnitList", value.factoryWorkUnitList)
      //工位
      this.translateList("workStationRefId", "factoryWorkStationList", value.factoryWorkStationList)

      this.factoryLineList.map((line)=>{
        let workCenterRefId = line["workCenterRefId"]
        let index = _.findIndex(factoryWorkCenterList,{workCenterRefId:workCenterRefId})
        line["factoryWorkUnitList"] = []
        factoryWorkCenterList[index]["factoryLineList"].push(line)
      })

      this.factoryWorkUnitList.map((workUnit)=>{
        let workCenterRefId = workUnit["workCenterRefId"]
        let lineRefId = workUnit["lineRefId"]
        let workCenterIndex = _.findIndex(factoryWorkCenterList,{workCenterRefId:workCenterRefId})
        let lineIndex = _.findIndex(factoryWorkCenterList[workCenterIndex]["factoryLineList"],{lineRefId:lineRefId})
        workUnit["factoryWorkStationList"] = []
        if(workCenterIndex !== -1 && lineIndex !== -1){
          factoryWorkCenterList[workCenterIndex]["factoryLineList"][lineIndex]["factoryWorkUnitList"].push(workUnit)
        }
      })

      this.factoryWorkStationList.map((workStation)=>{
        let workCenterRefId = workStation["workCenterRefId"]
        let lineRefId = workStation["lineRefId"]
        let workUnitRefId = workStation["workUnitRefId"]
        let workCenterIndex = _.findIndex(factoryWorkCenterList,{workCenterRefId:workCenterRefId})
        let lineIndex = _.findIndex(factoryWorkCenterList[workCenterIndex]["factoryLineList"],{lineRefId:lineRefId})
        let workUnitIndex = _.findIndex(factoryWorkCenterList[workCenterIndex]["factoryLineList"][lineIndex]["factoryWorkUnitList"],{workUnitRefId:workUnitRefId})
        if(workCenterIndex !== -1 && lineIndex !== -1 && workUnitIndex !== -1) {
          factoryWorkCenterList[workCenterIndex]["factoryLineList"][lineIndex]["factoryWorkUnitList"][workUnitIndex]["factoryWorkStationList"].push(workStation)
        }
      })

      console.log(factoryWorkCenterList)
    }.bind(this))
  }

  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>业务建模</Breadcrumb.Item>
          <Breadcrumb.Item>工厂</Breadcrumb.Item>
          <Breadcrumb.Item>工厂详情</Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{width: "100%", backgroundColor: "#f9f9f9"}} bodyStyle={{padding: "15px"}}>
          <Row>
            <Col>
              <AppButton config={{
                id: "factorySaveBtn1",
                title: "保存",
                visible: true,
                enabled: true,
                type: "primary",
                subscribes: [
                  {
                    event: 'factorySaveBtn1.click',
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/mdFactoryInfo/saveFactoryInfoList.action",
                          bodyExpression: `
                            if(!submitValidateForm("Create")){
                              resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                page.getAllValue()
                              })
                            }
                          `
                        },
                        successPubs: [
                          {
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
                    ]
                  }
                ]
              }}/>
              <AppButton config={{
                id: "factoryCancel1",
                title: "取消",
                visible: true,
                enabled: true,
                type: "primary",
                subscribes: [
                  {
                    event: "factoryCancel1.click",
                    pubs: [
                      {
                        event: "@@navigator.push",
                        payload: {
                          url: "/MdFactory"
                        }
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
            </Col>
          </Row>
        </Card>

        <Card style={{width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px"}} bodyStyle={{padding: "15px"}}>
          <Row>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "factoryCode",
                label: "工厂编码",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请输入",
                form: "Create",
                tableInfo: {
                  id: "factoryTable-busiUnit",
                  size: "small",
                  rowKey: "gid",
                  tableTitle: "业务单元信息",
                  width: "500px",
                  columns: [
                    {title: '业务单元编码', width: 100, dataIndex: 'busiUnitCode', key: '1'},
                    {title: '业务单元名称', width: 150, dataIndex: 'busiUnitName', key: '2'},
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'POST',
                    url: '/ime/mdFactoryInfo/queryFactoryInfoList.action',
                  }
                },

                pageId: 'smBusiUnitGidRef.busiUnitCode',
                displayField: "smBusiUnitGidRef.busiUnitCode",
                valueField: {
                  "from": "busiUnitCode",
                  "to": "smBusiUnitGidRef.busiUnitCode",
                },
                associatedFields: [
                  {
                    "from": "busiUnitName",
                    "to": "smBusiUnitGidRef.busiUnitName"
                  },
                  {
                    "from": "gid",
                    "to": "smBusiUnitGid"
                  }
                ],
                subscribes: [
                  {
                    event: "factoryCode.onChange",
                    pubs: [
                      {
                        event: "@@form.init",
                        eventPayloadExpression: `
                          resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (value) {
                            if(value){
                              value.factoryWorkCenterList=[]
                              value.factoryLineList=[]
                              value.factoryWorkUnitList=[]
                              value.factoryWorkStationList=[]
                              callback({id:"Create",data:value})
                            }
                          })
                        `
                      },
                      {
                        event: "workCenterAdd.enabled",
                        payload: true
                      },
                      {
                        event: "workCenterAdd.dataContext",
                      }
                    ]
                  }
                ]
              }} component={FindbackField} name="smBusiUnitGidRef.busiUnitCode"/>
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "smBusiUnitGidRef.busiUnitName",
                label: "工厂名称",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请输入"
              }} component={TextField} name="smBusiUnitGidRef.busiUnitName"/>
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "workCenterNumber",
                label: "工作中心数量",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: false,  //是否显示必填星号
                placeholder: "请输入"
              }} component={TextField} name="workCenterNumber"/>
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "workNuitNumber",
                label: "工作单元数量",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: false,  //是否显示必填星号
                placeholder: "请输入"
              }} component={TextField} name="workNuitNumber"/>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "stationNumber",
                label: "工位数量",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: false,  //是否显示必填星号
                placeholder: "请输入"
              }} component={TextField} name="stationNumber"/>
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "lineNumber",
                label: "产线数量",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: false,  //是否显示必填星号
                placeholder: "请输入"
              }} component={TextField} name="lineNumber"/>
            </Col>
          </Row>
        </Card>

        <Card style={{width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px"}} bodyStyle={{padding: "15px"}}>
          <Tabs onTabClick={this.onTabClick} defaultActiveKey="1">
            <TabPane tab="工作中心" key="1">
              <Row>
                <Col span={24}>
                  <AppButton config={{
                    id: "workCenterAdd",
                    title: "增加",
                    type: "primary",
                    size: "small",
                    visible: true,
                    enabled: false,
                    subscribes: [
                      {
                        event: "workCenterAdd.click",
                        pubs: [
                          {
                            event: "factoryWorkCenterList.addRow",
                            eventPayloadExpression: `
                              callback({
                                workCenterRefId:uuidV4(),
                                smBusiUnitGidRef:{
                                  busiUnitName:dataContext.busiUnitName
                                },
                                smBusiUnitGid:dataContext.gid,
                                factoryLineList: []
                              })
                            `
                          }
                        ]
                      },

                    ]
                  }}/>
                  <FieldArray name="factoryWorkCenterList" config={{
                    addButton: false,
                    "id": "factoryWorkCenterList",
                    "rowKey": "id",
                    "showSelect": true,
                    "form": "Create",
                    "columns": [
                      {
                        "id": "workCenter_Code",
                        "type": "textField",
                        "title": "工作中心编码",
                        "name": "workCenterCode",
                        "enabled": true,
                        subscribes: [
                          {
                            event: "workCenter_Code.onChange",
                            pubs: [
                              {
                                event: "workCenter_Code.aaa",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                    page.setValues(eventName,"factoryWorkCenterList","factoryLineList",eventPayload)
                                  })
                                `
                              }
                            ]
                          }
                        ]
                      }
                      , {
                        "id": "workCenter_Name",
                        "type": "textField",
                        "title": "工作中心名称",
                        "name": "workCenterName",
                        "enabled": true,
                        subscribes: [
                          {
                            event: "workCenter_Name.onChange",
                            pubs: [
                              {
                                event: "workCenter_Name.aaa",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                    page.setValues(eventName,"factoryWorkCenterList","factoryLineList",eventPayload)
                                  })
                                `
                              }
                            ]
                          }
                        ]
                      }, {
                        "id": "their-factory",
                        "type": "textField",
                        "title": "所属工厂",
                        "name": "smBusiUnitGidRef.busiUnitName",
                        "enabled": false,
                      }, {
                        "id": "work-calendarName",
                        "type": "findbackField",
                        "title": "工作日历",
                        "name": "smCalendarGidRef.calendarName",
                        "enabled": true,
                        "form": "Create",
                        tableInfo: {
                          id: "calendarTable00",
                          size: "small",
                          rowKey: "gid",
                          width: "500px",
                          tableTitle: "工作日历",
                          showSerial: true,  //序号
                          columns: [
                            {title: '工作日历编码', width: 100, dataIndex: 'calendarCode', key: '1'},
                            {title: '工作日历名称', width: 150, dataIndex: 'calendarName', key: '2'},
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/sm/calendar/query.action',
                          }
                        },

                        pageId: 'table002',
                        displayField: "smCalendarGidRef.calendarName",
                        valueField: {
                          "from": "calendarName",
                          "to": "smCalendarGidRef.calendarName"
                        },
                        associatedFields: [
                          {
                            "from": "gid",
                            "to": "smCalendarGid"
                          }
                        ]
                      }, {
                        "id": "remarks01",
                        "title": "备注",
                        "type": "textField",
                        "name": "remarks",
                        "enabled": true
                      }
                    ]
                  }} component={TableField}/>
                </Col>
              </Row>
            </TabPane>

            <TabPane forceRender={true} tab="产线" key="2">
              <Row>
                <Col span={24}>
                  <AppButton config={{
                    id: "productLineAdd",
                    title: "增加",
                    type: "primary",
                    size: "small",
                    visible: true,
                    enabled: true,
                    subscribes: [
                      {
                        event: "productLineAdd.click",
                        behaviors: [
                          {
                            type: "fetch",
                            id: "factoryWorkCenterList", //要从哪个组件获取数据
                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                            successPubs: [  //获取数据完成后要发送的事件
                              {
                                event: "factoryLineList.addRow",
                                eventPayloadExpression: `
                                  let gid = uuidV4()
                                  if(eventPayload && eventPayload.workCenterName && eventPayload.workCenterCode){
                                    callback({
                                      lineRefId:gid,
                                      workCenterRefId:eventPayload.workCenterRefId,
                                      workCenterGidRef:{
                                        workCenterName:eventPayload.workCenterName,
                                        workCenterCode:eventPayload.workCenterCode
                                      },
                                      factoryWorkUnitList:[]
                                    })
                                  }else{
                                    callback({lineRefId:gid})
                                  }
                                `
                              }
                            ]
                          }
                        ]
                      },
                    ]
                  }}/>
                  <FieldArray name="factoryLineList" config={{
                    addButton: false,
                    "id": "factoryLineList",
                    "rowKey": "gid",
                    "showSelect": true,
                    "form": "Create",
                    "columns": [
                      {
                        "id": "line_Code",
                        "type": "textField",
                        "title": "产线编码",
                        "name": "lineCode",
                        "enabled": true,
                        subscribes: [
                          {
                            event: "line_Code.onChange",
                            pubs: [
                              {
                                event: "line_Code.aaa",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                    page.setValues(eventName,"factoryLineList","factoryWorkUnitList",eventPayload)
                                  })
                                `
                              }
                            ]
                          }
                        ]
                      }, {
                        "id": "line_Name",
                        "type": "textField",
                        "title": "产线名称",
                        "name": "lineName",
                        "enabled": true,
                        subscribes: [
                          {
                            event: "line_Name.onChange",
                            pubs: [
                              {
                                event: "line_Name.aaa",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                    page.setValues(eventName,"factoryLineList","factoryWorkUnitList",eventPayload)
                                  })
                                `
                              }
                            ]
                          }
                        ]
                      }, {
                        "id": "belong_workCenterRefId",
                        "type": "findbackField",
                        "title": "所属工作中心",
                        "name": "workCenterGidRef.workCenterName",
                        "enabled": true,
                        form: "Create",
                        pageId: 'table008',
                        tableInfo: {
                          id: "work-smbusiUnitsub",
                          size: "small",
                          rowKey: "workCenterRefId",
                          width: "500px",
                          tableTitle: "所属工作中心",
                          showSerial: true,  //序号
                          onLoadData: false,
                          columns: [
                            {title: '工作中心编码', width: 100, dataIndex: 'workCenterCode', key: '1'},
                            {title: '工作中心名称', width: 150, dataIndex: 'workCenterName', key: '2'},
                            {title: '工作日历', width: 150, dataIndex: 'smCalendarGidRef.calendarName', key: '3'},
                          ],
                        },
                        subscribes: [
                          {
                            event: "belong_workCenterRefId.findClick",
                            pubs: [
                              {
                                event: "belong_workCenterRefId.bbb",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                    page.getCurRefId(eventName,"factoryLineList",me)
                                  })
                                `
                              }
                            ]
                          },
                          {
                            event: "belong_workCenterRefId.onChange",
                            pubs: [
                              {
                                event: "belong_workCenterRefId.aaa",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                    resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (value) {
                                      let newRefId = eventPayload["workCenterRefId"]
                                      if(newRefId != dataContext){
                                        page.factoryWorkUnitList = page.translateReferValue(page.factoryWorkUnitList,"workCenterRefId",dataContext,newRefId)
                                        value.factoryWorkUnitList = page.translateReferValue(value.factoryWorkUnitList,"workCenterRefId",dataContext,newRefId)
                                        page.factoryWorkStationList = page.translateReferValue(page.factoryWorkStationList,"workCenterRefId",dataContext,newRefId)
                                        value.factoryWorkStationList = page.translateReferValue(value.factoryWorkStationList,"workCenterRefId",dataContext,newRefId)
                                        pubsub.publish("@@form.init", {id: "Create", data: value})
                                      }
                                      console.log(eventName,eventPayload,dataContext)
                                    })
                                  })
                                `
                              }
                            ]
                          },
                          {
                            event: "work-smbusiUnitsub.onTableTodoAny",
                            pubs: [
                              {
                                event: "work-smbusiUnitsub.setData",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (data) {
                                    let newArray = []
                                    if(data.factoryWorkCenterList){
                                      for(let i=0;i<data.factoryWorkCenterList.length;i++){
                                        let item = data.factoryWorkCenterList[i]
                                        if(item.workCenterCode && item.workCenterName){
                                          newArray.push(item)
                                        }
                                      }
                                    }
                                    callback({eventPayload:newArray})
                                  })
                                `
                              }
                            ]
                          }
                        ],
                        displayField: "workCenterGidRef.workCenterName",
                        valueField: {
                          "from": "workCenterName",
                          "to": "workCenterGidRef.workCenterName"
                        },
                        associatedFields: [
                          {
                            "from": "workCenterRefId",
                            "to": "workCenterRefId"
                          },
                          {
                            "from": "workCenterCode",
                            "to": "workCenterGidRef.workCenterCode"
                          },
                          {
                            "from": "smCalendarGidRef.calendarName",
                            "to": "smCalendarGidRef.calendarName"
                          },
                          {
                            "from": "smCalendarGid",
                            "to": "smCalendarGid"
                          },
                        ]
                      }, {
                        "id": "lineType-name",
                        "type": "selectField",
                        "title": "产线类型",
                        "name": "lineType",
                        "enabled": true,
                        dataSource: {
                          type: "api",
                          method: "post",
                          url: "/sm/dictionaryEnumValue/query.action",
                          mode: "payload",
                          payload: {
                            "query": {
                              "query": [
                                {
                                  "field": "smDictionaryEnumGid",
                                  "type": "eq",
                                  "value": "56350D1ED4843DB2E055000000000001"
                                }
                              ],
                              "sorted": "seq"
                            }
                          }
                        },
                        displayField: "val",
                        valueField: "gid"

                      }, {
                        "id": "work-calendarName02",
                        "title": "工作日历",
                        "type": "findbackField",
                        "name": "smCalendarGidRef.calendarName",
                        "enabled": true,
                        "form": "Create",
                        tableInfo: {
                          id: "calendarTable01",
                          size: "small",
                          rowKey: "gid",
                          width: "500px",
                          tableTitle: "工作日历",
                          showSerial: true,  //序号
                          columns: [
                            {title: '工作日历编码', width: 100, dataIndex: 'calendarCode', key: '1'},
                            {title: '工作日历名称', width: 150, dataIndex: 'calendarName', key: '2'},
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/sm/calendar/query.action',
                          }
                        },
                        pageId: 'table002',
                        displayField: "smCalendarGidRef.calendarName",
                        valueField: {
                          "from": "calendarName",
                          "to": "smCalendarGidRef.calendarName"
                        },
                        associatedFields: [
                          {
                            "from": "gid",
                            "to": "smCalendarGid"
                          },
                        ]
                      },
                      {
                        "id": "remarks003",
                        "title": "备注",
                        "type": "textField",
                        "name": "remarks",
                        "enabled": true
                      }
                    ]
                  }} component={TableField}/>
                </Col>
              </Row>
            </TabPane>


            <TabPane forceRender={true} tab="工作单元" key="3">
              <Row>
                <Col span={24}>
                  <AppButton config={{
                    id: "workUnitAdd",
                    title: "增加",
                    type: "primary",
                    size: "small",
                    visible: true,
                    enabled: true,
                    subscribes: [
                      {
                        event: "workUnitAdd.click",
                        behaviors: [
                          {
                            type: "fetch",
                            id: "factoryLineList", //要从哪个组件获取数据
                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                            successPubs: [  //获取数据完成后要发送的事件
                              {
                                event: "factoryWorkUnitList.addRow",
                                eventPayloadExpression: `
                                  let gid = uuidV4()
                                  if(eventPayload && eventPayload.lineName && eventPayload.lineCode){
                                    callback({
                                      workUnitRefId:gid,
                                      workCenterRefId:eventPayload.workCenterRefId,
                                      lineRefId:eventPayload.lineRefId,
                                      lineGidRef:{
                                        lineName:eventPayload.lineName,
                                        lineCode:eventPayload.lineCode
                                      },
                                      factoryWorkStationList:[]
                                    })
                                  }else{
                                    callback({workUnitRefId:gid})
                                  }
                                 `
                              }
                            ]
                          }
                        ]
                      },
                    ]
                  }}/>
                  <FieldArray name="factoryWorkUnitList" config={{
                    addButton: false,
                    "id": "factoryWorkUnitList",
                    "rowKey": "id",
                    "showSelect": true,
                    "form": "Create",
                    "columns": [
                      {
                        "id": "workUnit_Code",
                        "type": "textField",
                        "title": "工作单元编码",
                        "name": "workUnitCode",
                        "enabled": true,
                        subscribes: [
                          {
                            event: "workUnit_Code.onChange",
                            pubs: [
                              {
                                event: "workUnit_Code.aaa",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                    page.setValues(eventName,"factoryWorkUnitList","factoryWorkStationList",eventPayload)
                                  })
                                `
                              }
                            ]
                          }
                        ]
                      }
                      , {
                        "id": "workUnit_Name",
                        "type": "textField",
                        "title": "工作单元名称",
                        "name": "workUnitName",
                        "enabled": true,
                        subscribes: [
                          {
                            event: "workUnit_Name.onChange",
                            pubs: [
                              {
                                event: "workUnit_Name.aaa",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                    page.setValues(eventName,"factoryWorkUnitList","factoryWorkStationList",eventPayload)
                                  })
                                `
                              }
                            ]
                          }
                        ]
                      }, {
                        "id": "belong_lineRefId",
                        "type": "findbackField",
                        "title": "所属产线",
                        "name": "lineGidRef.lineName",
                        "enabled": true,
                        form: "Create",
                        tableInfo: {
                          id: "factory_line",
                          size: "small",
                          rowKey: "lineRefId",
                          width: "500px",
                          tableTitle: "所属产线",
                          showSerial: true,  //序号
                          onLoadData: false,
                          columns: [
                            {title: '产线编码', width: 100, dataIndex: 'lineCode', key: '1'},
                            {title: '产线名称', width: 150, dataIndex: 'lineName', key: '2'},
                            {title: '工作日历', width: 150, dataIndex: 'smCalendarGidRef.calendarName', key: '3'},
                          ],
                        },
                        subscribes: [
                          {
                            event: "belong_lineRefId.findClick",
                            pubs: [
                              {
                                event: "belong_lineRefId.bbb",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                    page.getCurRefId(eventName,"factoryWorkUnitList",me)
                                  })
                                `
                              }
                            ]
                          },
                          {
                            event: "belong_lineRefId.onChange",
                            pubs: [
                              {
                                event: "belong_lineRefId.aaa",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"NewCreate"}}).then(function (page) {
                                    resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (value) {
                                      let newRefId = eventPayload["lineRefId"]
                                      if(newRefId != dataContext){
                                        page.factoryWorkStationList = page.translateReferValue(page.factoryWorkStationList,"lineRefId",dataContext,newRefId)
                                        value.factoryWorkStationList = page.translateReferValue(value.factoryWorkStationList,"lineRefId",dataContext,newRefId)
                                        pubsub.publish("@@form.init", {id: "Create", data: value})
                                      }
                                      console.log(eventName,eventPayload,dataContext)
                                    })
                                  })

                                `
                              }
                            ]
                          },
                          {
                            event: "factory_line.onTableTodoAny",
                            pubs: [
                              {
                                event: "factory_line.setData",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (data) {
                                    let newArray = []
                                    if(data.factoryLineList){
                                      for(let i=0;i<data.factoryLineList.length;i++){
                                        let item = data.factoryLineList[i]
                                        if(item.lineCode && item.lineName){
                                          newArray.push(item)
                                        }
                                      }
                                    }
                                    callback({eventPayload:newArray})
                                  })
                                `
                              }
                            ]
                          }
                        ],
                        pageId: 'table009',
                        displayField: "lineGidRef.lineName",
                        valueField: {
                          "from": "lineName",
                          "to": "lineGidRef.lineName"
                        },
                        associatedFields: [
                          {
                            "from": "workCenterRefId",
                            "to": "workCenterRefId"
                          },
                          {
                            "from": "lineRefId",
                            "to": "lineRefId"
                          },
                          {
                            "from": "lineCode",
                            "to": "lineGidRef.lineCode"
                          },
                          {
                            "from": "smCalendarGidRef.calendarName",
                            "to": "smCalendarGidRef.calendarName"
                          },
                          {
                            "from": "smCalendarGid",
                            "to": "smCalendarGid"
                          },
                        ]
                      }, {
                        "id": "tableFiled3",
                        "type": "findbackField",
                        "title": "工作日历",
                        "name": "smCalendarGidRef.calendarName",
                        "enabled": true,
                        "form": "Create",
                        tableInfo: {
                          id: "calendarTable02",
                          size: "small",
                          rowKey: "gid",
                          width: "500px",
                          tableTitle: "工作日历",
                          showSerial: true,  //序号
                          columns: [
                            {title: '工作日历编码', width: 100, dataIndex: 'calendarCode', key: '1'},
                            {title: '工作日历名称', width: 150, dataIndex: 'calendarName', key: '2'},
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/sm/calendar/query.action',
                          }
                        },
                        pageId: 'table002',
                        displayField: "smCalendarGidRef.calendarName",
                        valueField: {
                          "from": "calendarName",
                          "to": "smCalendarGidRef.calendarName"
                        },
                        associatedFields: [
                          {
                            "from": "gid",
                            "to": "smCalendarGid"
                          },
                        ]
                      }, {
                        "id": "tableFiled4",
                        "title": "备注",
                        "type": "textField",
                        "name": "remarks",
                        "enabled": true
                      }
                    ]
                  }} component={TableField}/>
                </Col>
              </Row>

            </TabPane>

            <TabPane forceRender={true} tab="工位" key="4">
              <Row>
                <Col span={24}>
                  <AppButton config={{
                    id: "workStationAdd",
                    title: "增加",
                    type: "primary",
                    size: "small",
                    visible: true,
                    enabled: true,
                    subscribes: [
                      {
                        event: "workStationAdd.click",
                        behaviors: [
                          {
                            type: "fetch",
                            id: "factoryWorkUnitList", //要从哪个组件获取数据
                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                            successPubs: [  //获取数据完成后要发送的事件
                              {
                                event: "factoryWorkStationList.addRow",
                                eventPayloadExpression: `
                                  let gid = uuidV4()
                                  if(eventPayload && eventPayload.workUnitName && eventPayload.workUnitCode){
                                    callback({
                                      workStationRefId:gid,
                                      workCenterRefId:eventPayload.workCenterRefId,
                                      lineRefId:eventPayload.lineRefId,
                                      workUnitRefId:eventPayload.workUnitRefId,
                                      workUnitGidRef:{
                                        workUnitName:eventPayload.workUnitName,
                                        workUnitCode:eventPayload.workUnitCode
                                      }
                                    })
                                  }else{
                                    callback({workStationRefId:gid})
                                  }
                                `
                              }
                            ]
                          }
                        ]
                      },
                    ]

                  }}/>
                  <FieldArray name="factoryWorkStationList" config={{
                    addButton: false,
                    "id": "factoryWorkStationList",
                    "rowKey": "id",
                    "showSelect": true,
                    "form": "Create",
                    "columns": [
                      {
                        "id": "tableFiled0",
                        "type": "textField",
                        "title": "工位编码",
                        "name": "stationCode",
                        "enabled": true
                      }
                      , {
                        "id": "tableFiled1",
                        "type": "textField",
                        "title": "工位名称",
                        "name": "stationName",
                        "enabled": true
                      }, {
                        "id": "tableFiled2",
                        "type": "findbackField",
                        "title": "所属工作单元",
                        "name": "workUnitGidRef.workUnitName",
                        "enabled": true,
                        "form": "Create",
                        tableInfo: {
                          id: "table109",
                          size: "small",
                          rowKey: "workUnitRefId",
                          width: "500px",
                          tableTitle: "所属工作单元",
                          showSerial: true,  //序号
                          onLoadData: false,
                          columns: [
                            {title: '工作单元编码', width: 100, dataIndex: 'workUnitCode', key: '1'},
                            {title: '工作单元名称', width: 150, dataIndex: 'workUnitName', key: '2'},
                            {title: '工作日历', width: 150, dataIndex: 'smCalendarGidRef.calendarName', key: '3'},
                          ],
                        },
                        subscribes: [
                          {
                            event: "table109.onTableTodoAny",
                            pubs: [
                              {
                                event: "table109.setData",
                                eventPayloadExpression: `
                                  resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (data) {
                                    let newArray = []
                                    if(data.factoryWorkUnitList){
                                      for(let i=0;i<data.factoryWorkUnitList.length;i++){
                                        let item = data.factoryWorkUnitList[i]
                                        if(item.workUnitCode && item.workUnitName){
                                          newArray.push(item)
                                        }
                                      }
                                      callback({eventPayload:newArray})
                                    }
                                  })
                                `
                              }
                            ]
                          }
                        ],
                        pageId: 'table063',
                        displayField: "workUnitGidRef.workUnitName",
                        valueField: {
                          "from": "workUnitName",
                          "to": "workUnitGidRef.workUnitName"
                        },
                        associatedFields: [
                          {
                            "from": "workCenterRefId",
                            "to": "workCenterRefId"
                          },
                          {
                            "from": "lineRefId",
                            "to": "lineRefId"
                          },
                          {
                            "from": "workUnitRefId",
                            "to": "workUnitRefId"
                          },
                          {
                            "from": "workUnitCode",
                            "to": "workUnitGidRef.workUnitCode"
                          },
                          {
                            "from": "smCalendarGidRef.calendarName",
                            "to": "smCalendarGidRef.calendarName"
                          },
                          {
                            "from": "smCalendarGid",
                            "to": "smCalendarGid"
                          },
                        ]
                      }, {
                        "id": "tableFiled3",
                        "type": "findbackField",
                        "title": "工作日历",
                        "name": "smCalendarGidRef.calendarName",
                        "enabled": true,
                        "form": "Create",
                        tableInfo: {
                          id: "calendarTable03",
                          size: "small",
                          rowKey: "gid",
                          width: "500px",
                          tableTitle: "工作日历",
                          showSerial: true,  //序号
                          columns: [
                            {title: '工作日历编码', width: 100, dataIndex: 'calendarCode', key: '1'},
                            {title: '工作日历名称', width: 150, dataIndex: 'calendarName', key: '2'},
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/sm/calendar/query.action',
                          }
                        },
                        pageId: 'table002',
                        displayField: "smCalendarGidRef.calendarName",
                        valueField: {
                          "from": "calendarName",
                          "to": "smCalendarGidRef.calendarName"
                        },
                        associatedFields: [
                          {
                            "from": "gid",
                            "to": "smCalendarGid"
                          },
                        ]
                      }, {
                        "id": "tableFiled4",
                        "title": "备注",
                        "type": "textField",
                        "name": "remarks",
                        "enabled": true
                      }
                    ]
                  }} component={TableField}/>
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
    onSubmit: () => {
    }
  };
}

let CreateForm = reduxForm({
  form: "Create",
  config: {id: "NewCreate"},
  validate,
})(Create)

export default connect(mapStateToProps, mapDispatchToProps)(CreateForm);