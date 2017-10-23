/*
 *
 * OrderIssueRule
 *
 */

import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Breadcrumb, Card, Row, Col} from 'antd';
import {connect} from 'react-redux';
import Immutable from 'immutable'
import AppButton from 'components/AppButton'
import pubsub from 'pubsub-js'
import AppTable from 'components/AppTable'
import TextField from 'components/Form/TextField'
import RadiosField from 'components/Form/RadiosField'
import AutoCompleteField from 'components/Form/AutoCompleteField'
import CheckBoxField from 'components/Form/CheckBoxField'
import DateField from 'components/Form/DateField'
import InputNumberField from 'components/Form/InputNumberField'
import SelectField from 'components/Form/SelectField'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import SwitchField from 'components/Form/SwitchField'
import TableField from 'components/Form/TableField'
import TextAreaField from 'components/Form/TextAreaField'
import UploadField from 'components/Form/UploadField'
import FindbackField from 'components/Form/FindbackField'

const validate = values => {
  const errors = {}
  if (!values.get('ruleCode')) {
    errors.code = '必填项'
  }
  return errors
}

export class ruleEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    let modifyId = this.props.location.state[0].gid
    let modifyData = this.props.location.state[0]
    let dataSource = {
      mode: "dataContext",
      type: "api",
      method: "POST",
      url: "/ime/imePlanOrderPublishRule/findById.action",
    }

    resolveDataSource({dataSource, dataContext: {id: modifyId}}).then(function (data) {
      modifyData = data.data;

      pubsub.publish("@@form.init", {id: "ruleEditForm", data: Immutable.fromJS(modifyData)})
    });
  }

  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>生产管理</Breadcrumb.Item>
          <Breadcrumb.Item>订单下发规则</Breadcrumb.Item>
          <Breadcrumb.Item>修改</Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{width: "100%", backgroundColor: "#f9f9f9"}} bodyStyle={{padding: "15px"}}>
          <Row>
            <Col>
              <AppButton config={{
                id: "rule-save-btn-1",
                title: "保存",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "rule-save-btn-1.click",
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imePlanOrderPublishRule/modify.action",
                          withForm: "ruleEditForm",
                        },
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            payload: {
                              url: "/orderIssueRule"
                            }
                          }, {
                            event: "@@message.success",
                            payload: "保存成功"
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: "保存失败"
                          }
                        ]
                      }
                    ],
                    pubs: [
                      {
                        /*event: "@@navigator.push",
                        payload: {
                          url: "/imeOrder"
                        },*/

                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "rule-cancel-btn-2",
                title: "取消",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "rule-cancel-btn-2.click",
                    pubs: [

                      {
                        event: "@@navigator.push",
                        payload: {
                          url: "/orderIssueRule"
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
        <Card style={{width: "100%", marginTop: "15px"}} bodyStyle={{padding: "15px"}}>
          <Row>
            <Col span={12}>
              <Field config={{
                visible: false,
                id: "gid",
                label: "gid",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                form: "ruleEditForm",
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请输入ID"
              }} component={TextField} name="gid"/>
              <Field config={{
                enabled: true,
                id: "ruleCode",
                label: "方案编号",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                form: "ruleEditForm",
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请输入方案编号"
              }} component={TextField} name="ruleCode"/>
            </Col>
            <Col span={12}>
              <Field config={{
                id: "ruleName",
                label: "方案名称",  //标签名称
                form: "ruleEditForm",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入方案名称"
              }} component={TextField} name="ruleName"/>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Field config={{
                enabled: true,
                id: "fixedValue",
                label: "固定值",  //标签名称
                form: "ruleEditForm",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入固定值",


              }} component={TextField} name="fixedValue"/>
            </Col>
            <Col span={12}>
              <Field config={{
                id: "isDefault",
                label: "是否默认方案",  //标签名称
                form: "ruleEditForm",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                checkedChildren: "是",
                unCheckedChildren: "否",
              }} component={SwitchField} name="isDefault"/>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

ruleEdit.propTypes = {
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
  }
}

let ruleEditForm = reduxForm({
  form: "ruleEditForm",
  validate
})(ruleEdit)

export default connect(mapStateToProps, mapDispatchToProps)(ruleEditForm)