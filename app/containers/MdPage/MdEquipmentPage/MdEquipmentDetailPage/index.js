/*
 *
 * MdEquipmentDetailPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb , Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import AppButton from "components/AppButton";
import TextField from 'components/Form/TextField';
import RadiosField from 'components/Form/RadiosField';
import AutoCompleteField from 'components/Form/AutoCompleteField';
import CheckBoxField from 'components/Form/CheckBoxField';
import DateField from 'components/Form/DateField';
import InputNumberField from 'components/Form/InputNumberField';
import SelectField from 'components/Form/SelectField';
import SwitchField from 'components/Form/SwitchField';
import TableField from 'components/Form/TableField';
import TextAreaField from 'components/Form/TextAreaField';
import UploadField from 'components/Form/UploadField';
import FindbackField from 'components/Form/FindbackField';
import pubsub from 'pubsub-js';
import Immutable from 'immutable';
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil';
import { reduxForm, Field, FieldArray } from 'redux-form/immutable';
import request from 'utils/request';
import TreeSelectField from 'components/Form/TreeSelectField';

const TabPane = Tabs.TabPane;

const validate = values => {
    const errors = {}
    if (!values.get('code')) {
        errors.code = '必填项'
    }
    if (!values.get('mdEquipmentTypeGidRef.name')) {
        errors["mdEquipmentTypeGidRef.name"] = '必填项'
    }if (!values.get('mdMeasurementUnitGidRef.name')) {
        errors["mdMeasurementUnitGidRef.name"] = '必填项'
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

    let className = "com.neusoft.ime.md.mdEquipment.dto.MdEquipmentDTO";
    let fieldNames = "code,delete";
    let fieldValues = values.get('code') + ",0";
    let gid = (values.get('gid')!=undefined && values.get('gid')!='')?values.get('gid'):''

    console.log(values.get('gid'))

    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:gid,  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {
        resolve(res)
    })).then(function (res) {
        if (!res.data) {
            throw {code:'已存在!'};
        }
    })
}

export class MdEquipmentDetailPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        debugger;

        // pubsub.subscribe(`equipmentSpareDetail.refresh`,(eventName,payload)=>{
        //     resolveFetch({fetch:{id:"equipmentForm",data:"@@formValues"}}).then(function(data) {
        //         console.log(data)
        //         if(data.gid!='' && data.gid!=undefined){
        //             let dataSource = {
        //                 mode: "dataContext",
        //                 type: "api",
        //                 method: "POST",
        //                 url: "/ime/mdEquipment/findById.action?id="+data.gid,
        //             }
        //             resolveDataSource({ dataSource, dataContext: {} }).then(function (data) {
        //                 // let row = {};
        //                 // row.mdEquipmentChildDetailDTOs = data.data.mdEquipmentChildDetailDTOs;
        //                 // row.mdEquipmentSpareDetailDTOs = data.data.mdEquipmentSpareDetailDTOs;
        //                 pubsub.publish("@@form.init", { id: "equipmentForm", data: Immutable.fromJS(data.data) })
        //             })
        //         }else{
        //
        //         }
        //     })
        // })

        if(this.props.location.state[0]!=undefined){
            let row = this.props.location.state[0];
            let modifyId = row.gid;
            let dataSource = {
                mode: "dataContext",
                type: "api",
                method: "POST",
                url: "/ime/mdEquipment/findById.action?id="+modifyId,
            }
            resolveDataSource({ dataSource, dataContext: {} }).then(function (data) {
                row.mdEquipmentChildDetailDTOs = data.data.mdEquipmentChildDetailDTOs;
                row.mdEquipmentSpareDetailDTOs = data.data.mdEquipmentSpareDetailDTOs;
                pubsub.publish("@@form.init", { id: "equipmentForm", data: Immutable.fromJS(row) })
            })
        }else{
            let data = {}
            data.mdEquipmentTypeGid = this.props.location.state.id
            data["mdEquipmentTypeGidRef.name"] = this.props.location.state.text
            pubsub.publish("@@form.init", { id: "equipmentForm", data: Immutable.fromJS(data) })
        }
    }

    render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>业务建模</Breadcrumb.Item>
              <Breadcrumb.Item>设备</Breadcrumb.Item>
              <Breadcrumb.Item>设备详情</Breadcrumb.Item>
          </Breadcrumb>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <Col>
                      <AppButton config={{
                          id: "saveBtn",
                          title: "保存",
                          visible: true,
                          enabled: true,
                          type: "primary",
                          subscribes: [
                              {
                                  event: "saveBtn.click",
                                  pubs: [
                                      {
                                          event: "saveBtn.expression",
                                          meta: {
                                              expression: `
                                                 resolveFetch({fetch:{id:"equipmentForm",data:"@@formValues"}}).then(function(data){
                                                    console.log(data);
                                                    if(data.gid!=undefined){
                                                        let dataSource = {
                                                            mode: "dataContext",
                                                            type: "api",
                                                            method: "POST",
                                                            url: "/ime/mdEquipment/modify.action?id="+data.gid
                                                        }
                                                        resolveDataSourceCallback({dataSource:dataSource, dataContext: data },
                                                            function(res){
                                                                if(res.success){
                                                                    pubsub.publish("@@message.success", "修改成功");
                                                                    pubsub.publish("@@navigator.push", {url: "/mdEquipmentPage"});
                                                                }else{
                                                                    pubsub.publish("@@message.error",response.data);
                                                                }
                                                        }, function(e){
                                                                console.log(e);
                                                                pubsub.publish("@@message.error",修改失败);
                                                                // pubsub.publish("@@navigator.push", {url: "/mdEquipmentPage"});
                                                        });
                                                    }else{
                                                        let dataSource = {
                                                            mode: "dataContext",
                                                            type: "api",
                                                            method: "POST",
                                                            url: "/ime/mdEquipment/add.action"
                                                        }
                                                        resolveDataSourceCallback({ dataSource:dataSource, dataContext: data },
                                                            function(res){
                                                                if(res.success){
                                                                    console.log(res);
                                                                    pubsub.publish("@@message.success", "创建成功");
                                                                    pubsub.publish("@@navigator.push", {url: "/mdEquipmentPage"});
                                                                }else{
                                                                    pubsub.publish("@@message.error",res.data);
                                                                }

                                                            },
                                                            function(e){
                                                                console.log(e);
                                                                pubsub.publish("@@message.error", "创建失败");
                                                        });
                                                    }
                                                 })
                                              `
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}/>
                      <AppButton config={{
                          id: "cancelBtn",
                          title: "取消",
                          visible: true,
                          enabled: true,
                          type: "primary",
                          subscribes: [
                              {
                                  event: "cancelBtn.click",
                                  pubs: [
                                      {
                                          event: "@@navigator.push",
                                          payload: {
                                              url: "/mdEquipmentPage"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}/>
                  </Col>
              </Row>
          </Card>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "code",
                          label: "设备编号",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: true,  //是否显示必填星号
                          placeholder: "请输入",
                          form:"equipmentForm"
                      }} component={TextField} name="code" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "name",
                          label: "设备名称",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: false,  //是否显示必填星号
                          placeholder: "请输入设备名称",
                          form:"equipmentForm"
                      }} component={TextField} name="name" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "model",
                          label: "设备型号",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: false,  //是否显示必填星号
                          placeholder: "请输入设备型号",
                          form:"equipmentForm"
                      }} component={TextField} name="model" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "spec",
                          label: "规格",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: false,  //是否显示必填星号
                          placeholder: "请输入规格",
                          form:"equipmentForm"
                      }} component={TextField} name="spec" />
                  </Col>
              </Row>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          id: 'mdEquipmentTypeGid',
                          label: "设备分类名称",
                          showRequiredStar: true,  //是否显示必填星号
                          treeCheckStrictly:true, //是否节点选择完全受控
                          treeCheckable: false,  //是否显示CheckBox(多选)
                          showSearch:true,  //是否在下拉中显示搜索框(单选)
                          dropdownMatchSelectWidth:true,  //下拉菜单和选择器是否同宽
                          dataSource: {
                              type: "api",
                              method: "POST",
                              url: '/ime/mdEquipmentType/getEquipmentTypeTree.action'
                          },
                          displayField:"text",
                          valueField:"id"
                      }} name="mdEquipmentTypeGid" component={TreeSelectField}/>
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "mdMeasurementUnitGidRef.name",
                          label: "计量单位",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: true,  //是否显示必填星号
                          placeholder: "请输入计量单位",
                          form:"equipmentForm",
                          tableInfo: {
                              id: "measurementUnitRef",
                              size: "small",
                              rowKey: "gid",
                              width:"500",
                              tableTitle: "计量单位参照",
                              columns: [
                                  { title: '计量单位编码', dataIndex: 'code', key: '1', width: 100 },
                                  { title: '计量单位名称', dataIndex: 'name', key: '2', width: 100 },
                                  { title: '英文名称', dataIndex: 'englishName', key: '3', width: 100 },
                                  { title: '计量分类', dataIndex: 'type', key: '4', width: 1000 },
                                  { title: '换算系数', dataIndex: 'conversionFactor', key: '5', width: 100 },
                                  { title: '小数位数', dataIndex: 'decimalDigit', key: '6', width: 100 }
                              ],
                              dataSource: {
                                  type: 'api',
                                  method: 'POST',
                                  url: '/ime/mdMeasurementUnit/query.action',
                              }
                          },
                          pageId: 'measurementUnitRef',
                          displayField: "name",
                          valueField: {
                              "from": "name",
                              "to": "mdMeasurementUnitGidRef.name"
                          },
                          associatedFields: [
                              {
                                  "from": "gid",
                                  "to": "mdMeasurementUnitGid"
                              },
                              {
                                  "from": "code",
                                  "to": "mdMeasurementUnitGidRef.code"
                              }
                          ]
                      }} component={FindbackField} name="mdMeasurementUnitGidRef.name" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "serialNo",
                          label: "设备序列号",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: false,  //是否显示必填星号
                          placeholder: "请输入设备序列号",
                          form:"equipmentForm"
                      }} component={TextField} name="serialNo" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "status",
                          label: "设备状态",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: false,  //是否显示必填星号
                          placeholder: "请输入设备状态",
                          form:"equipmentForm",
                          dataSource: {
                              type: "api",
                              method: "POST",
                              url: "/sm/dictionaryEnumValue/query.action",
                              mode: "payload",
                              payload: {
                                  "query":{
                                      "query":[
                                          {"field":"smDictionaryEnumGid","type":"eq","value":"56B2214945384BE1E055000000000001"}
                                      ],
                                      "sorted":"seq"
                                  }
                              }
                          },
                          displayField: "val",
                          valueField: "gid"
                      }} component={SelectField} name="status" />
                  </Col>
              </Row>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "remark",
                          label: "备注说明",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: false,  //是否显示必填星号
                          placeholder: "请输入备注说明",
                          form:"equipmentForm"
                      }} component={TextField} name="remark" />
                  </Col>
              </Row>
          </Card>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
              <Tabs defaultActiveKey="1">
                  <TabPane tab="子设备" key="1">
                      <Row>
                          <Col span={24}>
                              <FieldArray name="mdEquipmentChildDetailDTOs" config={{
                                  id: "childEquipment",
                                  name: "childEquipment",
                                  rowKey: "gid",
                                  form:"equipmentForm",
                                  showRowDeleteButton: true,  //是否显示操作列
                                  columns: [
                                      {
                                          id: "childMdEquipmentGidRef.code",
                                          type: "findbackField",
                                          title: "子设备编号",
                                          form: "equipmentForm",
                                          name: "childMdEquipmentGidRef.code",
                                          tableInfo: {
                                              id: "childEquipmentRef",
                                              size: "small",
                                              rowKey: "gid",
                                              width: "500",
                                              tableTitle: "设备参照",
                                              showSerial: true,  //序号
                                              columns: [
                                                  { title: '子设备编码', width: 100, dataIndex: 'code', key: '1' },
                                                  { title: '子设备名称', width: 100, dataIndex: 'name', key: '2' },
                                                  { title: '子设备型号', width: 100, dataIndex: 'model', key: '3' },
                                                  { title: '子设备规格', width: 100, dataIndex: 'spec', key: '4' },
                                                  { title: '子设备分类', width: 100, dataIndex: 'mdEquipmentTypeGidRef.name', key: '5' },
                                                  { title: '计量单位', width: 100, dataIndex: 'mdMeasurementUnitGidRef.name', key: '6' },
                                                  { title: '子设备序列号', width: 100, dataIndex: 'serialNo', key: '7' },
                                                  { title: '子设备状态', width: 100, dataIndex: 'status', key: '8' },
                                                  { title: '备注', width: 100, dataIndex: 'remark', key: '9' }
                                              ],
                                              dataSource: {
                                                  type: 'api',
                                                  method: 'POST',
                                                  url: '/ime/mdEquipment/query.action',
                                              }
                                          },
                                          pageId: 'childEquipmentRef',
                                          displayField: "code",
                                          valueField: {
                                              "from": "code",
                                              "to": "childMdEquipmentGidRef.code"
                                          },
                                          associatedFields: [
                                              {
                                                  "from": "gid",
                                                  "to": "childMdEquipmentGid"
                                              },
                                              {
                                                  "from": "name",
                                                  "to": "childMdEquipmentGidRef.name"
                                              }, {
                                                  "from": "model",
                                                  "to": "childMdEquipmentGidRef.model"
                                              }, {
                                                  "from": "spec",
                                                  "to": "childMdEquipmentGidRef.spec"
                                              }, {
                                                  "from": "mdEquipmentTypeGidRef.name",
                                                  "to": "childMdEquipmentGidRef.mdEquipmentTypeGidRef.name"
                                              }, {
                                                  "from": "mdMeasurementUnitGidRef.name",
                                                  "to": "childMdEquipmentGidRef.mdMeasurementUnitGidRef.name"
                                              },{
                                                  "from": "serialNo",
                                                  "to": "childMdEquipmentGidRef.serialNo"
                                              },{
                                                  "from": "status",
                                                  "to": "childMdEquipmentGidRef.status"
                                              },{
                                                  "from": "remark",
                                                  "to": "childMdEquipmentGidRef.remark"
                                              }
                                          ]
                                      }
                                      ,{
                                          "id": "childMdEquipmentGidRef.name",
                                          "type": "textField",
                                          "title": "子设备名称",
                                          "name": "childMdEquipmentGidRef.name",
                                          "enabled": false
                                      }, {
                                          "id": "childMdEquipmentGidRef.model",
                                          "type": "textField",
                                          "title": "子设备型号",
                                          "name": "childMdEquipmentGidRef.model",
                                          "enabled": false
                                      },{
                                          "id": "childMdEquipmentGidRef.spec",
                                          "type": "textField",
                                          "title": "子设备规格",
                                          "name": "childMdEquipmentGidRef.spec",
                                          "enabled": false
                                      }, {
                                          "id": "childMdEquipmentGidRef.mdEquipmentTypeGidRef.name",
                                          "type": "textField",
                                          "title": "子设备分类",
                                          "name": "childMdEquipmentGidRef.mdEquipmentTypeGidRef.name",
                                          "enabled": false
                                      }, {
                                          "id": "childMdEquipmentGidRef.mdMeasurementUnitGidRef.name",
                                          "title": "计量单位",
                                          "type": "textField",
                                          "name": "childMdEquipmentGidRef.mdMeasurementUnitGidRef.name",
                                          "enabled": false
                                      }, {
                                          "id": "childMdEquipmentGidRef.status",
                                          "title": "子设备状态",
                                          "type": "textField",
                                          "name": "childMdEquipmentGidRef.status",
                                          "enabled": false
                                      }, {
                                          "id": "childMdEquipmentGidRef.serialNo",
                                          "title": "子设备序列号",
                                          "type": "textField",
                                          "name": "childMdEquipmentGidRef.serialNo",
                                          "enabled": false
                                      }, {
                                          "id": "childMdEquipmentGidRef.remark",
                                          "title": "备注说明",
                                          "type": "textField",
                                          "name": "childMdEquipmentGidRef.remark"
                                      }
                                  ]
                              }} component={TableField} />
                          </Col>
                      </Row>
                  </TabPane>
                  <TabPane tab="备件信息" key="2">
                      <Row>
                          <Col span={24}>
                              <FieldArray name="mdEquipmentSpareDetailDTOs" config={{
                                  id: "equipmentSpareDetail",
                                  name: "equipmentSpareDetail",
                                  rowKey: "gid",
                                  form:"equipmentForm",
                                  showRowDeleteButton: true,  //是否显示操作列
                                  columns: [
                                      {
                                          id: "mdMaterielInfoGidRef.code",
                                          type: "findbackField",
                                          title: "备件编码",
                                          form: "equipmentForm",
                                          name: "mdMaterielInfoGidRef.code",
                                          tableInfo: {
                                              id: "equipmentSpareDetailRef",
                                              size: "small",
                                              rowKey: "gid",
                                              width: "500",
                                              tableTitle: "备件参照",
                                              showSerial: true,  //序号
                                              columns: [
                                                  { title: '备件编码', width: 100, dataIndex: 'code', key: '1' },
                                                  { title: '备件名称', width: 100, dataIndex: 'name', key: '2' }
                                              ],
                                              dataSource: {
                                                  type: 'api',
                                                  method: 'POST',
                                                  url: '/ime/mdMaterielInfo/query.action',
                                              }
                                          },
                                          pageId: 'equipmentSpareDetailRef',
                                          displayField: "code",
                                          valueField: {
                                              "from": "code",
                                              "to": "mdMaterielInfoGidRef.code"
                                          },
                                          associatedFields: [
                                              {
                                                  "from":"gid",
                                                  "to":"mdMaterielInfoGid"
                                              },
                                              {
                                                  "from": "name",
                                                  "to": "mdMaterielInfoGidRef.name"
                                              }
                                          ]
                                      }
                                      , {
                                          "id": "mdMaterielInfoGidRef.name",
                                          "type": "textField",
                                          "title": "备件名称",
                                          "name": "mdMaterielInfoGidRef.name",
                                          "enabled": false
                                      }
                                  ]
                              }} component={TableField} />
                          </Col>
                      </Row>
                  </TabPane>
              </Tabs>
          </Card>
      </div>
    );
    }
}


MdEquipmentDetailPage.propTypes = {
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

let mdEquipmentDetailForm = reduxForm({
    form: "equipmentForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['code']
})(MdEquipmentDetailPage)

export default connect(mapStateToProps, mapDispatchToProps)(mdEquipmentDetailForm);
