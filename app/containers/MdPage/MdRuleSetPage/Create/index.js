/*
 *
 * Create
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
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

import ModalContainer from 'components/ModalContainer'
import AppTable from 'components/AppTable';

import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'
const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}

    if (!values.get('code')) {
        errors.code = '必填项'
    }
    if (!values.get('name')) {
        errors.name = '必填项'
    }
    if (!values.get('ruleTypeGid')) {
        errors.ruleTypeGid = '必填项'
    }
    return errors
}
//const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const asyncValidate = values => {
    let dataSource = {
        mode: "dataContext",
        type: "api",
        method: "POST",
        url: "/sm/checkUnique/check.action",
    }
    let className = "com.neusoft.ime.md.mdRuleSet.dto.MdRuleSetDTO";
    let fieldNames = "code,delete";
    let fieldValues = values.get('code') + ",0";

    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:"",  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {
        /*if (!res.data) {
            //console.log(values.get('code') + '已存在!');
            resolve(values.get('code')+ '已存在!')
        }*/
        resolve(res)
    })).then(function (res) {
        if(!res.data){
            throw { code: "已存在" }
        }

    })

}
export class Create extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>规则建模</Breadcrumb.Item>
              <Breadcrumb.Item>规则集</Breadcrumb.Item>
              <Breadcrumb.Item>规则集创建</Breadcrumb.Item>
          </Breadcrumb>
          <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <AppButton config={{
                      id: "formSubmit",
                      title: "保存",
                      visible: true,
                      enabled: true,
                      type: "primary",
                      subscribes: [
                          {
                              event: "formSubmit.click",
                              behaviors: [
                                  {
                                      type: "request",
                                      dataSource: {
                                          type: "api",
                                          method: "POST",
                                          url: "/ime/mdRuleSet/add.action",
                                          withForm: "AddForm",
                                      },
                                      successPubs: [  //获取数据完成后要发送的事件
                                          {
                                              event: "@@navigator.push",
                                              payload: {
                                                  url: "/mdRuleSet"
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
                              ],
                          }
                      ]
                  }}></AppButton>
                  <AppButton config={{
                      id: "formCancel",
                      title: "取消",
                      visible: true,
                      enabled: true,
                      type: "primary",
                      subscribes: [
                          {
                              event: "formCancel.click",
                              pubs: [
                                  {
                                      event: "@@navigator.push",
                                      payload: {
                                          url: "/mdRuleSet"
                                      }
                                  }
                              ]
                          }
                      ]
                  }}>
                  </AppButton>
              </Row>
          </Card>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "code",
                          label: "规则编码",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: true,  //是否显示必填星号
                          placeholder: "请输入编码"
                      }} component={TextField} name="code" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "name",
                          label: "规则名称",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: true,  //是否显示必填星号
                          placeholder: "请输入名称"
                      }} component={TextField} name="name" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "ruleTypeGid",
                          label: "规则类型",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: true,  //是否显示必填星号
                          placeholder: "请选择",
                          dataSource: {
                              type: "api",
                              method: "post",
                              url: "/sm/dictionaryEnumValue/query.action",
                              mode: "payload",
                              payload: {
                                  "query": {
                                      "query": [
                                          { "field": "smDictionaryEnumGid", "type": "eq", "value": "AF6A3E5026D34CBFB261696EF2749893" }
                                      ],
                                      "sorted": "seq"
                                  }
                              },
                          },
                          displayField: "val",
                          valueField: "gid",
                      }} component={SelectField} name="ruleTypeGid" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "ruleEnumGid",
                          label: "对应字典类型",
                          form: "AddForm",
                          showRequiredStar: true,
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          // formMode:'edit',

                          tableInfo: {
                              id: "ruleEnumGidFindBack",
                              size: "small",
                              rowKey: "gid",
                              width: "500",
                              tableTitle: "字典类型",
                              columns: [
                                  { title: '类型编码', width: 200, dataIndex: 'code', key: '1' },
                                  { title: '类型名称', width: 200, dataIndex: 'name', key: '2' },
                              ],
                              dataSource: {
                                  type: 'api',
                                  method: 'post',
                                  url: '/sm/dictionaryEnum/query.action',
                              }
                          },
                          pageId: 'dictionaryEnumFindBackPage',
                          displayField: "name",
                          valueField: {
                              "from": "name",
                              "to": "dictionaryEnumRef.name"
                          },
                          associatedFields: [
                              {
                                  "from": "gid",
                                  "to": "ruleEnumGid"
                              }
                          ],

                      }} name="dictionaryEnumRef.name" component={FindbackField} />
                  </Col>
              </Row>
          </Card>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
              <Tabs defaultActiveKey="1">
                  <TabPane tab="规则明细" key="1">
                      <Row type="flex" justify="space-between">
                          <Col span={2}>
                              <AppButton config={{
                                  id: "detailAdd",
                                  title: "增加",
                                  type: "primary",
                                  size: "small",
                                  visible: true,
                                  enabled: true,
                                  subscribes:[
                                      {
                                          event:"detailAdd.click",
                                          pubs:[
                                              {
                                                  event:"detailTable.addRow"
                                              }
                                          ]
                                      }
                                  ]
                              }}/>
                          </Col>

                      </Row>
                      <Row>
                          <Col span={24}>
                              <FieldArray name="mdRuleSetDetailDTOs" config={{
                                  addButton :false,
                                  "id": "detailTable",
                                  "name": "detailTable",
                                  "rowKey": "id",
                                  type:"radio",
                                  showSelect:true,
                                  form:"AddForm",
                                  "columns": [
                                      {
                                          "id": "ruleFieldDetailCol",
                                          "type": "selectField",
                                          "title": "规则字段",
                                          "name": "ruleFieldGid",
                                          dataSource: {
                                              type: "api",
                                              method: "post",
                                              url: "/sm/dictionaryEnumValue/query.action",
                                              mode: "payload",
                                              payload: {
                                                  "query": {
                                                      "query": [
                                                          { "field": "smDictionaryEnumGid", "type": "eq", "value": "58F65026092B6D4AE055000000000001" }
                                                      ],
                                                      "sorted": "seq"
                                                  }
                                              }
                                          },
                                          displayField: "val",
                                          valueField: "gid"
                                      },
                                      {
                                          "id": "sortTypeDetailCol",
                                          "type": "selectField",
                                          "title": "排序方式",
                                          "name": "sortType",
                                          dataSource: {
                                              type: "api",
                                              method: "post",
                                              url: "/sm/dictionaryEnumValue/query.action",
                                              mode: "payload",
                                              payload: {
                                                  "query": {
                                                      "query": [
                                                          { "field": "smDictionaryEnumGid", "type": "eq", "value": "56B2315955384CF2E055000000000001" }
                                                      ],
                                                      "sorted": "seq"
                                                  }
                                              }
                                          },
                                          displayField: "val",
                                          valueField: "gid"
                                      }
                                  ]
                              }} component={TableField} />
                          </Col>
                      </Row>
                  </TabPane>
              </Tabs>
          </Card>
          <div className="wrapper">

          </div>
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

let AddForm = reduxForm({
    form: "AddForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['code']
})(Create)

export default connect(mapStateToProps, mapDispatchToProps)(AddForm);

