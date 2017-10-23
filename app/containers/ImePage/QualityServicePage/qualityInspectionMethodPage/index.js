import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import pubsub from 'pubsub-js'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable'
import AppTable from 'components/AppTable';
import AppButton from "components/AppButton"
import TreeField from 'components/Form/TreeField';
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import TableField from 'components/Form/TableField'


const validate = values => {
    const errors = {}
    /*const reg = new RegExp("^[0-9]*$")


    if (!values.get('code')) {
        errors.code = '必填项'
    }
    if (!values.get('planEndTime')) {
        errors.planEndTime = '必填项'
    }
    if (!values.get('planBeginTime')) {
        errors.planBeginTime = '必填项'
    }
    if (!values.get('planQty')) {
        errors.planQty = '必填项'
    }
    if (!reg.test(values.get('planQty'))) {
        errors.planQty = '请输入数字'
    }

    if(values.get('planEndTime')&&values.get('planBeginTime')){
        var endTime = new Date(values.get('planEndTime').replace(/-/,"/"))
        var beginTime = new Date(values.get('planBeginTime').replace(/-/,"/"))
        console.log(!(endTime>beginTime))
        if(!(endTime>beginTime)){
            console.log(1)
            errors.planEndTime = "计划开始时间必须小于计划完成时间"
            errors.planBeginTime = "计划开始时间必须小于计划完成时间"
        }
    }

    if (!values.getIn(['workCenterGidRef','workCenterName'])) {
        errors.workCenterGidRef={}
        errors.workCenterGidRef.workCenterName = '必填项'
    }

    if (!values.getIn(['productGidRef','materialGidRef','code'])) {
        errors.productGidRef={}
        errors.productGidRef.materialGidRef={}
        errors.productGidRef.materialGidRef.code = '必填项'
    }
*/

    let vv= values.toJS();

    if (!vv.QualityWayTable || !vv.QualityWayTable.length) {
        //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.QualityWayTable.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.name) {
                memberErrors.name = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }

        })
        if (membersArrayErrors.length) {
            errors.QualityWayTable = membersArrayErrors
        }
    }
    return errors
}
const asyncValidate = values => {

    resolveFetch({
        fetch: {
            id: "QualityWayTable",
            data: "onSelectedRows"
        }
    }).then(function (data) {

    })


    let dataSource = {
        mode: "dataContext",
        type: "api",
        method: "POST",
        url: "/sm/checkUnique/check.action",
    }
    let className = "com.neusoft.ime.qc.imeQcQualityWay.dto.QualityWayDTO"
    let fieldNames = "code,delete";
    //console.log("values",values)

    let fieldValues = values.get('code') + ",0";
    return new Promise(resolve => resolveDataSource({
        dataSource,
        dataContext: {gid: "", className: className, fieldNames: fieldNames, fieldValues, fieldValues}
    }).then(function (res) {
        resolve(res)
    })).then(function (res) {
        if (!res.data) {
            throw {code: "该编码已存在,请重新填写"}
        }
    })
}

export class qualityInspectionMethodPage extends React.PureComponent {
    constructor() {
        super()
        this.init()
        pubsub.subscribe("QualityWayTable.refresh",()=>{
            this.init()
        })

        pubsub.subscribe("QualityWayTable.onSelectedRows",(name,data)=>{
            console.log("rows",data.length)

            if(data.length < 1){
                pubsub.publish("QualityWayModifyBtn.enabled", false);
                pubsub.publish("QualityWaySaveBtn.visible", false);
                pubsub.publish("QualityWayDeleteBtn.enabled", false);
                pubsub.publish("QualityWayTable.activateAll", false);
            }else{
                pubsub.publish("QualityWayModifyBtn.enabled", true);
                pubsub.publish("QualityWayDeleteBtn.enabled", true   );
            }
        })

    }

    componentDidMount() {

    }

    init() {
        let formData = {}
        //查询calendarRuleDetail 列表初始化表单
        let dataSource = {
            type: 'api',
            method: 'post',
            mode: "payload",
            url: '/ime/imeQcQualityWay/query.action'
        }

        resolveDataSource({
            dataSource: dataSource
        }).then(function (response) {

            if (response.success) {
                formData.QualityWayTable = response.data
                console.log("formData",formData)
                pubsub.publish("@@form.init", {id: "QualityWayForm", data: Immutable.fromJS(formData)})
            } else {
                pubsub.publish("@@message.error", "检具表初始化失败!");
            }
        }.bind(this))
    }


    render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>业务建模</Breadcrumb.Item>
          <Breadcrumb.Item>质量</Breadcrumb.Item>
          <Breadcrumb.Item>质检方式</Breadcrumb.Item>
        </Breadcrumb>

        <div className="wrapper">
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
                    id: "QualityWayCreateBtn",
                    title: "创建",
                    type: "primary",
                    size: "large",
                    visible: true,
                    enabled: true,
                    subscribes: [
                        {
                            event: "QualityWayCreateBtn.click",
                            pubs: [
                                {
                                    event: "QualityWayTable.addRow",
                                    eventPayloadExpression:`
                                    let code
                                   let dataSource = {
                                        type: 'api',
                                        method: 'post',
                                        url: '/sm/codeRule/generateCode.action?ruleCode=QS'
                                    }

                                   let onSuccess = function(response){
                                       if (response.success) {
                                             code = response.data;
                                             console.log("code",code)
                                             callback({code:code})
                                        } else {
                                            pubsub.publish("@@message.error", "初始化获取编码失败!");
                                        }
                                    }

                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:null,dataContext:null},onSuccess);

                                                          `
                                },{
                                    event: "QualityWaySaveBtn.visible",
                                    payload: true
                                }
                            ]
                        }
                    ]
                }}/>
                <AppButton config={{
                    id: "QualityWayModifyBtn",
                    title: "修改",
                    type: "primary",
                    size: "large",
                    visible: true,
                    enabled: false,
                    subscribes: [
                        {
                            event: "QualityWayTable.onSelectedRows",
                            pubs: [
                                {
                                    event: "QualityWayModifyBtn.dataContext"
                                }
                            ]
                        },
                        {
                            event: "QualityWayModifyBtn.click",
                            behaviors:[
                                {
                                    type:"fetch",
                                    id: "QualityWayModifyBtn", //要从哪个组件获取数据
                                    data: "dataContext",//要从哪个组件的什么属性获取数据
                                    successPubs: [  //获取数据完成后要发送的事件
                                        {
                                            event: "QualityWayTable.activateRow"
                                        },{
                                            event:"QualityWaySaveBtn.visible",
                                            payload: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }}/>
                <AppButton config={{
                    id: "QualityWaySaveBtn",
                    title: "保存",
                    type: "primary",
                    size: "large",
                    visible: false,
                    enabled: true,
                    subscribes: [
                        {
                            event: "QualityWaySaveBtn.click",
                            behaviors:[
                                {
                                    type:"fetch",
                                    id: "QualityWayTable", //要从哪个组件获取数据
                                    data: "selectedRows",//要从哪个组件的什么属性获取数据
                                    successPubs: [  //获取数据完成后要发送的事件
                                        {
                                            event: "@@message.success",
                                            eventPayloadExpression: `
                                            let array = []
                                            if(eventPayload.length > 0 ){
                                                 for(let index = 0; index < eventPayload.length;index++ ){
                                                    if(typeof (eventPayload[index]) != 'undefined'){
                                                        array.push(eventPayload[index])
                                                    }
                                                }

                                                let dataSource = {
                                                    type: 'api',
                                                    method: 'post',
                                                    mode:"dataContext",
                                                    url: '/ime/imeQcQualityWay/save.action',

                                                }

                                                let onSuccess = function(response){
                                                       if (response.success) {
                                                            pubsub.publish("@@message.success", "保存成功!");
                                                            pubsub.publish("QualityWayModifyBtn.enabled", false);
                                                            pubsub.publish("QualityWaySaveBtn.visible", false);
                                                            pubsub.publish("QualityWayDeleteBtn.enabled", false);
                                                            pubsub.publish("QualityWayTable.clearSelect");
                                                            //activateAll

                                                            pubsub.publish("QualityWayTable.refresh")
                                                            pubsub.publish("QualityWayTable.activateAll", false);
                                                        } else {
                                                            pubsub.publish("@@message.error", response.data);
                                                        }
                                                    }
                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:array,dataContext:array},onSuccess);

                                            }else{
                                                pubsub.publish("@@message.error", "请选择要保存的行!");
                                            }


                    `,
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }}/>
                <AppButton config={{
                    id: "QualityWayDeleteBtn",
                    title: "删除",
                    type: "primary",
                    size: "large",
                    visible: true,
                    enabled: false,
                    subscribes: [
                        {
                            event: "QualityWayDeleteBtn.click",
                            behaviors:[
                                {
                                    type:"fetch",
                                    id: "QualityWayTable", //要从哪个组件获取数据
                                    data: "selectedRows",//要从哪个组件的什么属性获取数据
                                    successPubs: [  //获取数据完成后要发送的事件
                                        {
                                            event: "@@message.success",
                                            eventPayloadExpression: `
                                            console.log("eventPayload1",eventPayload)

                                            let ids = []
                                             for(let index = 0; index < eventPayload.length;index++ ){
                                                if(typeof (eventPayload[index]) != 'undefined'){
                                                    if(typeof (eventPayload[index].gid) != 'undefined'){
                                                        ids.push(eventPayload[index].gid)
                                                    }
                                                }
                                            }

                                            let dataSource = {
                                                type: 'api',
                                                method: 'post',
                                                mode:"dataContext",
                                                url: '/ime/imeQcQualityWay/deleteByIds.action',

                                            }


                                            let onSuccess = function(response){
                                                 if (response.success) {
                                                    pubsub.publish("@@message.success", "删除成功!");
                                                    pubsub.publish("QualityWayTable.refresh")
                                                    pubsub.publish("QualityWayModifyBtn.enabled", false);
                                                    pubsub.publish("QualityWaySaveBtn.visible", false);
                                                    pubsub.publish("QualityWayDeleteBtn.enabled", false);
                                                    pubsub.publish("QualityWayTable.activateAll", false);
                                                } else {
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
              <FieldArray name="QualityWayTable" config={{
                  "id": "QualityWayTable",
                  "name": "QualityWayTable",
                  "form": "QualityWayForm",
                  "rowKey": "gid",
                  "addButton": false, //是否显示默认增行按钮
                  "showSelect": true, //是否显示选择框
                  "type": "checkbox", //表格单选（radio）复选（checkbox）类型
                  "unEditable": true, //初始化是否都不可编辑
                  "showRowDeleteButton": true,  //是否显示操作列
                  "columns": [
                      {
                          "id": "code",
                          "type": "textField",
                          "title": "质检方式编码",
                          "name": "code",
                          "enabled":false
                      }, {
                          "id": "name",
                          "type": "textField",
                          "title": "质检方式名称",
                          "name": "name",
                      }, {
                          "id": "description",
                          "type": "textField",
                          "title": "质检方式描述",
                          "name": "description",
                      }
                  ]
              }} component={TableField}/>
            </Card>

          </Row>
        </div>
      </div>
    );
  }
}

qualityInspectionMethodPage.propTypes = {
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
            debugger
        }
    };
}
let Form =  reduxForm({
    form: "QualityWayForm",
    validate,
    asyncValidate
})(qualityInspectionMethodPage)




export default connect(mapStateToProps, mapDispatchToProps)(Form);
