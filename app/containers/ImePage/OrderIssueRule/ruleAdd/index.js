/*
 *
 * OrderIssueRule
 *
 */

import React, {PropTypes} from 'react';
import Immutable from 'immutable'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Breadcrumb, Card, Row, Col} from 'antd';
import {connect} from 'react-redux';
import AppButton from 'components/AppButton'
import AppTable from 'components/AppTable'
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
import FindbackField from 'components/Form/FindbackField'

const validate = values => {
  const errors = {}
  if (!values.get('ruleCode')) {
    errors.code = '必填项'
  }
  return errors
}

export class ruleAdd extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>生产管理</Breadcrumb.Item>
          <Breadcrumb.Item>订单下发规则</Breadcrumb.Item>
          <Breadcrumb.Item>创建</Breadcrumb.Item>
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
                    pubs: [
                      {
                        event: "ruleAddGridId.dataContext",
                      },
                      {
                        event: 'rule-save-btn-1.expression',
                        meta: {
                          expression: `
                          resolveFetch({fetch:{id:'orderIssueRuleForm',data:'@@formValues'}}).then(function(data){
                            console.log(data);
                              let dataSource= {
                                type: 'api',
                                method: 'post',
                                mode:"payload",
                                url: '/ime/imePlanOrderPublishRule/savePlanOrderPublishRuleList.action',
                                payload: data.ruleAddGrid
                              };

                            resolveDataSourceCallback({dataSource:dataSource},function(response){
                              if(response.success) {
                                pubsub.publish("@@message.success","保存成功");
                                pubsub.publish("@@navigator.push",{url:"/orderIssueRule"})
                              } else {
                                pubsub.publish("@@message.error","保存失败");
                              }
                            },function(e){
                              console.log(e)
                            })
                          })
                      `
                        }
                      },
                    ]
                  }


                  /*{
                    event: "rule-save-btn-1.click",
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imePlanOrderPublishRule/savePlanOrderPublishRuleList.action",
                          withForm: "orderIssueRuleForm",
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
                    // pubs: [
                    //   {
                    //     event: 'rule-save-btn-1.expression',
                    //     expression: `
                    //       console.log(data);
                    //     `
                    //
                    //   }
                    // ]
                  }*/
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
            <Col span={16}>
              <FieldArray name="ruleAddGrid" config={{
                "id": "ruleAddGridId",
                "name": "ruleAddGrid",
                "rowKey": "gid",
                "columns": [{
                  "id": "tableFiled1",
                  "type": "textField",
                  "title": "方案编号",
                  "form": "orderIssueRuleForm",
                  "name": "ruleCode",
                  "enabled": true
                }, {
                  "id": "tableFiled2",
                  "type": "textField",
                  "title": "方案名称",
                  "form": "orderIssueRuleForm",
                  "name": "ruleName",
                  "enabled": true
                }, {
                  "id": "tableFiled3",
                  "type": "textField",
                  "title": "固定值",
                  "form": "orderIssueRuleForm",
                  "name": "fixedValue",
                  "enabled": true
                }, {
                  "id": "tableFiled4",
                  "title": "是否默认方案",
                  "form": "orderIssueRuleForm",
                  "type": "selectField",
                  "name": "isDefault",
                  "enabled": true,
                  dataSource: {
                    type: "customValue",
                    method: "get",
                    values: [
                      {code: '1', name: '是'},
                      {code: '0', name: '否'}
                    ]
                  },
                  displayField: "name",
                  valueField: "code",
                }
                ]
              }} component={TableField}/>
            </Col>


          </Row>


        </Card>
      </div>
    );
  }
}

ruleAdd.propTypes = {
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

let orderIssueRuleForm = reduxForm({
  form: "orderIssueRuleForm",
  // validate
})(ruleAdd)

export default connect(mapStateToProps, mapDispatchToProps)(orderIssueRuleForm);
