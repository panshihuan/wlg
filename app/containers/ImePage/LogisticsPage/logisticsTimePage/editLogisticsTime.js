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
  const reg = new RegExp("^[0-9]*$")

  if (!values.get('code')) {
    errors.code = '必填项'
  }
  if (!values.get('name')) {
    errors.name = '必填项'
  }
  if (!values.get('timeBasis')) {
    errors.timeBasis = '必填项'
  }
  if(!values.get('advanceDayNum') || !reg.test(values.get('advanceDayNum'))){
    errors.advanceDayNum="请输入有效数字"
  }
  if (!values.get('assignTime')) {
    errors.assignTime = '必填项'
  }

  return errors
}

export class EditLogisticsTime extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    let modifyId = this.props.location.state[0].gid
    let modifyData = this.props.location.state[0]
    let dataSource = {
      mode: "payload",
      type: "api",
      method: "POST",
      url: "/ime/mdMrlTimeProgram/findById.action",
      payload: {
        id: modifyId
      }
    }

    resolveDataSource({dataSource}).then(function (data) {
      modifyData = data.data;
      pubsub.publish("@@form.init", {id: "editLogisticsTimeForm", data: Immutable.fromJS(modifyData)})
    });
  }

  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>业务建模</Breadcrumb.Item>
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>物料时间方案</Breadcrumb.Item>
          <Breadcrumb.Item>编辑</Breadcrumb.Item>
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
                          url: "/ime/mdMrlTimeProgram/modify.action",
                          withForm: "editLogisticsTimeForm",
                        },
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            payload: {
                              url: "/imeLogisticsTime"
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
                          url: "/imeLogisticsTime"
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
                form: "editLogisticsTimeForm",
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请输入ID"
              }} component={TextField} name="gid"/>
              <Field config={{
                enabled: true,
                id: "code",
                label: "时间方案编号",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                form: "editLogisticsTimeForm",
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请输入时间方案编号"
              }} component={TextField} name="code"/>
            </Col>
            <Col span={12}>
              <Field config={{
                id: "name",
                label: "时间方案名称",  //标签名称
                form: "editLogisticsTimeForm",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请输入时间方案名称"
              }} component={TextField} name="name"/>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Field config={{
                enabled: true,
                id: "timeBasis",
                label: "时间依据",  //标签名称
                form: "editLogisticsTimeForm",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请输入时间依据",
                dataSource:{
                  type: "api",
                  method:"post",
                  url:"/ime/mdMrlTimeProgram/getMrlTimeBasisCombox.action"
                },
                "displayField": "value",
                "valueField": "id",
              }} component={SelectField} name="timeBasis"/>
            </Col>
            <Col span={12}>
              <Field config={{
                enabled: true,
                id: "advanceDayNum",
                label: "提前天数",  //标签名称
                form: "editLogisticsTimeForm",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请选择提前天数",
              }} component={TextField} name="advanceDayNum"/>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Field config={{
                enabled: true,
                id: "assignTime",
                label: "指定时间",  //标签名称
                form: "editLogisticsTimeForm",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请输入指定时间",
              }} component={DateField} name="assignTime"/>
            </Col>
            <Col span={12}>

            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

EditLogisticsTime.propTypes = {
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

let editLogisticsTimeForm = reduxForm({
  form: "editLogisticsTimeForm",
  validate
})(EditLogisticsTime)

export default connect(mapStateToProps, mapDispatchToProps)(editLogisticsTimeForm)