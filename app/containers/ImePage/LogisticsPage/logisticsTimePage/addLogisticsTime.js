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
  const reg = new RegExp("^[0-9]*$")
  let vv= values.toJS();

  if (!vv.addLogisticsTimeGrid || !vv.addLogisticsTimeGrid.length) {
  } else {
    const membersArrayErrors = []
    vv.addLogisticsTimeGrid.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.code) {
        memberErrors.code = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (!member || !member.name) {
        memberErrors.name = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (!member || !member.timeBasis) {
        memberErrors.timeBasis = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (!member || !member.advanceDayNum || !reg.test(member.advanceDayNum)) {
        memberErrors.advanceDayNum = '请输入有效数字'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (!member || !member.assignTime) {
        memberErrors.assignTime = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
    })
    if (membersArrayErrors.length) {
      errors.addLogisticsTimeGrid = membersArrayErrors
    }
  }
  return errors
}

export class AddLogisticsTime extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>业务建模</Breadcrumb.Item>
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>物料时间方案</Breadcrumb.Item>
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
                        event: "addLogisticsTimeGridId.dataContext",
                      },
                      {
                        event: 'rule-save-btn-1.expression',
                        meta: {
                          expression: `
                          resolveFetch({fetch:{id:'addLogisticsTimeForm',data:'@@formValues'}}).then(function(data){
                            if(data && data.addLogisticsTimeGrid && data.addLogisticsTimeGrid.length>0){
                              let dataSource= {
                                type: 'api',
                                method: 'post',
                                mode:"payload",
                                url: '/ime/mdMrlTimeProgram/save.action',
                                payload:  data.addLogisticsTimeGrid
                              };
                              if(!submitValidateForm("addLogisticsTimeForm")){
                                resolveDataSourceCallback({dataSource:dataSource},function(response){
                                  if(response.success) {
                                    pubsub.publish("@@message.success","保存成功");
                                    pubsub.publish("@@navigator.push",{url:"/imeLogisticsTime"})
                                  } else {
                                    pubsub.publish("@@message.error","保存失败");
                                  }
                                },function(e){
                                  console.log(e)
                                })
                              }
                            }else{
                              pubsub.publish("@@message.error","请填写时间方案");
                            }
                          })
                      `
                        }
                      },
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
          <FieldArray name="addLogisticsTimeGrid" config={{
            "id": "addLogisticsTimeGridId",
            "name": "addLogisticsTimeGrid",
            "rowKey": "gid",
            "columns": [{
              "id": "tableFiled1",
              "type": "textField",
              "title": "时间方案编号",
              "form": "addLogisticsTimeForm",
              "name": "code",
              "enabled": true
            }, {
              "id": "tableFiled2",
              "type": "textField",
              "title": "时间方案名称",
              "form": "addLogisticsTimeForm",
              "name": "name",
              "enabled": true
            }, {
              "id": "tableFiled3",
              "type": "selectField",
              "title": "时间依据",
              "form": "addLogisticsTimeForm",
              "name": "timeBasis",
              "enabled": true,
              "dataSource":{
                type: "api",
                method:"post",
                url:"/ime/mdMrlTimeProgram/getMrlTimeBasisCombox.action"
              },
              "displayField": "value",
              "valueField": "id",
            }, {
              "id": "tableFiled4",
              "title": "提前天数",
              "form": "addLogisticsTimeForm",
              "type": "textField",
              "name": "advanceDayNum",
              "enabled": true,
            }, {
              "id": "tableFiled5",
              "type": "dateField",
              "title": "指定时间",
              "form": "addLogisticsTimeForm",
              "name": "assignTime",
              "enabled": true
            }
            ]
          }} component={TableField}/>
        </Card>
      </div>
    );
  }
}

AddLogisticsTime.propTypes = {
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

let addLogisticsTimeForm = reduxForm({
  form: "addLogisticsTimeForm",
  validate
})(AddLogisticsTime)

export default connect(mapStateToProps, mapDispatchToProps)(addLogisticsTimeForm);
