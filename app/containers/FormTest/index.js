/*
 *
 * FormTest
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'antd';
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

import TestFormCss from './style'

import { reduxForm, Field, FieldArray } from 'redux-form/immutable';


const validate = values => {
  const errors = {}
  const regName = /^[a-zA-Z0-9_-]{4,16}$/
  if (!values.get('userName')) {
    errors.userName = '必填项'
  }
  if (!regName.test(values.get('userName'))) {
    errors.userName = '用户名不合法'
  }
  if (!values.get('sex')) {
    errors.sex = '必填项'
  }
  if (!values.get('search')) {
    errors.search = '必填项'
  }
  if (!values.get('like')) {
    errors.like = '必填项'
  }
  if (!values.get('date')) {
    errors.date = '必填项'
  }
  if (!values.get('message')) {
    errors.message = '必填项'
  }
  if (!values.get('switch')) {
    errors.switch = '必填项'
  }
  return errors
}

export class FormTest extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <TestFormCss>
        <div className="title">Form表单</div>
        <div className="from">
          <Row>
            <Col span={12}>
              <Field config={{
                visible: true,  //是否可见
                enabled: true,  //是否启用
                id: "uname",
                label: "用户名",  //标签名称
                labelSpan: 4,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                hasFeedback: false  //验证失败时是否显示feedback图案
              }} name="userName" component={TextField} />
            </Col>
          </Row>
         
           
          <Row>
            <Col span={12}>
              <Field config={{
                visible: true,  //是否可见
                enabled: true,  //是否启用
                id: "search",
                label: "搜索",  //标签名称
                dataSource: {
                  type: "customValue",
                  values: [
                    { key: "1", value: "苹果" },
                    { key: "2", value: "桃子" },
                    { key: "3", value: "香蕉" },
                    { key: "4", value: "梨子" },
                    { key: "5", value: "葡萄" }
                  ]
                },
                displayField: "value",
                valueField: "key",
                labelSpan: 4,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                hasFeedback: false  //验证失败时是否显示feedback图案
              }} name="search" component={AutoCompleteField} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Field config={{
                visible: true,  //是否可见
                enabled: true,  //是否启用
                id: "date1",
                label: "选择日期",  //标签名称
                labelSpan: 4,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                hasFeedback: false  //验证失败时是否显示feedback图案
              }} name="date" component={DateField} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Field config={{
                visible: true,  //是否可见
                enabled: true,  //是否启用
                id: "message",
                label: "留言",  //标签名称
                labelSpan: 4,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                hasFeedback: false  //验证失败时是否显示feedback图案
              }} name="message" component={TextAreaField} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Field config={{
                visible: true,  //是否可见
                enabled: true,  //是否启用
                id: "switch",
                label: "开关",  //标签名称
                checkedChildren: "开",
                unCheckedChildren: "关",
                defaultChecked: false,
                labelSpan: 4,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                hasFeedback: false  //验证失败时是否显示feedback图案
              }} name="switch" component={SwitchField} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FieldArray name="subMaterial" config={{
                "id": "subMaterial",
                "name": "subMaterial",
                "rowKey": "id",
                "columns": [
                  {
                    "id": "tableFiled1",
                    "type": "switchField",
                    "title": "开关",
                    "name": "switch"
                  },
                  {
                    "id": "tableFiled2",
                    "type": "textField",
                    "title": "文本框",
                    "name": "text"
                  },
                  {
                    "id": "tableSelectFiled1",
                    "type": "selectField",
                    "title": "下拉",
                    "name": "select1",
                    dataSource: {
                      type: "api",
                      method: "POST",
                      url: "/api/ddd.json",

                    },
                    subscribes: [
                      {
                        event: "tableSelectFiled1.onChange",
                        pubs: [
                          {
                            event: "tableSelectFiled2.loadData"
                          }
                        ]
                      }
                    ],
                    displayField: "name",
                    valueField: "id"
                  },
                  {
                    "id": "tableSelectFiled2",
                    "type": "selectField",
                    "title": "下拉",
                    "name": "select2",
                    loadDataOnLoad: false,
                    dataSource: {
                      type: "api",
                      method: "POST",
                      url: "/api/ddd.json",
                      payloadMapping: [{
                        from: "eventPayload",
                        to: "id"
                      }]
                    },
                    displayField: "name",
                    valueField: "id"
                  },
                  {
                    "id": "tableFiled3",
                    "type": "dateField",
                    "title": "日期",
                    "name": "date"
                  },
                  {
                    "id": "tableFiled4",
                    "type": "autoCompleteField",
                    "title": "自动完成",
                    "name": "autoComplete",
                    dataSource: {
                      type: 'api',
                      method: 'get',
                      url: 'api/ddd.json'
                    },
                    displayField: "name",
                    valueField: "id"
                  },
                  {
                    "id": "tableFiled6",
                    "type": "InputNumberField",
                    "title": "数字框",
                    "name": "inputNumber",
                    "size": "large",  //尺寸大小:large、small
                    "min": 1,        //最小、大值
                    "max": undefined,
                    "formatter": 'rmb',   //百分比%：percent；货币￥：rmb（ 格式化数字，以展示具有具体含义的数据）
                    "step": undefined,  //小数位数: 0.01保留2位有效数值
                  },
                  {
                    "id": "tableFiled7",
                    "type": "uploadField",
                    "typeFile": 'else',  //img为图片；else为所有类型的文件
                    "title": "上传",
                    "name": "upload",
                    "size": "small",  //尺寸大小:large、small
                  },
                  {
                    "id": "tableFiled5",
                    "type": "textAreaField",
                    "title": "多行文本",
                    "name": "textArea"
                  }
                ]
              }} component={TableField} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Button className="from-btn" loading={this.props.submitting} onClick={this.props.handleSubmit((values) => {
                console.log(values.toJS())

              })}>提交</Button>
            </Col>
          </Row>
        </div>
      </TestFormCss>
    );
  }
}

FormTest.propTypes = {};

const reduxFormTest = reduxForm({
  form: "testForm",
  validate
})(FormTest)

export default reduxFormTest;
