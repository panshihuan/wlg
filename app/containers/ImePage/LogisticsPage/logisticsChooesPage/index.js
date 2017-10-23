import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable'
import {Breadcrumb, Card, Row, Col} from 'antd';
import AppButton from 'components/AppButton';
import TreeField from 'components/Form/TreeField';
import TableField from 'components/Form/TableField'
import TextField from 'components/Form/TextField'
import SwitchField from 'components/Form/SwitchField'

const validate = values => {
  const errors = {}
  if (!values.get('code')) {
    errors.code = '必填项'
  }
  if (!values.get('name')) {
    errors.name = '必填项'
  }
  if (values.get('isDefault') == undefined) {
    errors.isDefault = '必填项'
  }

  let vv= values.toJS();

  if (!vv.mdMrlSelRuleDetailDTOs || !vv.mdMrlSelRuleDetailDTOs.length) {
    //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
  } else {
    let membersArrayErrors = []
    vv.mdMrlSelRuleDetailDTOs.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.ruleField) {
        memberErrors.ruleField = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
    })
    if (membersArrayErrors.length) {
      errors.mdMrlSelRuleDetailDTOs = membersArrayErrors
    }
  }
  return errors
}

export class LogisticsChooesPage extends React.PureComponent {


  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>业务建模</Breadcrumb.Item>
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>物料选择规则</Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
          <Row >
            <Col>
              <AppButton config={{
                id: "chooseAdd",
                title: "新增",
                visible: false,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event:"chooseAdd.click",
                    pubs:[
                      {
                        event:"chooseAdd.visible",
                        payload:false
                      },
                      {
                        event:"chooseEdit.visible",
                        payload:false
                      },
                      {
                        event:"chooseDel.visible",
                        payload:false
                      },
                      {
                        event:"chooseAddSave.visible",
                        payload:true
                      },
                      {
                        event:"chooseCancel.visible",
                        payload:true
                      },
                      {
                        event:"chooseCode.enabled",
                        payload:true
                      },
                      {
                        event:"chooseName.enabled",
                        payload:true
                      },
                      {
                        event:"chooseRule.enabled",
                        payload:true
                      },
                      {
                        event:"chooseAddLine.enabled",
                        payload:true
                      },
                      {
                        event:"logisticsChooseEdit.activateAll",
                        payload:true
                      },
                      {
                        event:"@@form.init",
                        eventPayloadExpression:`
                          callback({id:"logisticsChooesForm",data:{}})
                        `
                      }

                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "chooseEdit",
                title: "修改",
                visible: true,
                enabled: false,
                type: 'primary',
                subscribes: [
                  {
                    event:"chooseEdit.click",
                    pubs:[
                      {
                        event:"chooseAdd.visible",
                        payload:false
                      },
                      {
                        event:"chooseEdit.visible",
                        payload:false
                      },
                      {
                        event:"chooseDel.visible",
                        payload:false
                      },
                      {
                        event:"chooseEditSave.visible",
                        payload:true
                      },
                      {
                        event:"chooseCancel.visible",
                        payload:true
                      },
                      {
                        event:"chooseCode.enabled",
                        payload:true
                      },
                      {
                        event:"chooseName.enabled",
                        payload:true
                      },
                      {
                        event:"chooseRule.enabled",
                        payload:true
                      },
                      {
                        event:"chooseAddLine.enabled",
                        payload:true
                      },
                      {
                        event:"logisticsChooseEdit.activateAll",
                        payload:true
                      },

                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "chooseDel",
                title: "删除",
                visible: false,
                enabled: false,
                type: 'primary',
                subscribes: [
                  {
                    event:"chooseDel.click",
                    behaviors:[
                      {
                        type:"request",
                        dataSource:{
                          type: "api",
                          method: "POST",
                          url:"/ime/mdMrlSelRule/delete.action",
                          bodyExpression:`
                            console.log(dataContext)
                            dataContext && callback({id:dataContext.selectedKeys[0]})
                          `
                        },
                        successPubs:[
                          {
                            event:"@@message.success",
                            eventPayloadExpression: `
                              callback("删除成功")
                            `,
                          },
                          {
                            event:"logisticsChooseTree.loadData",
                          },
                          {
                            event:"@@form.init",
                            eventPayloadExpression:`
                              callback({id:"logisticsChooesForm",data:{}})
                            `
                          }
                        ],
                        errorPubs:[
                          {
                            event:"@@message.error",
                            eventPayloadExpression: `
                              callback("删除失败")
                            `,
                          }
                        ]
                      }
                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "chooseAddSave",
                title: "保存",
                visible: false,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event:"chooseAddSave.click",
                    behaviors:[
                      {
                        type:"request",
                        dataSource:{
                          type: "api",
                          method: "POST",
                          url:"/ime/mdMrlSelRule/add.action",
                          withForm:"logisticsChooesForm"
                        },
                        successPubs:[
                          {
                            event:"@@message.success",
                            eventPayloadExpression: `
                              callback("增加成功")
                            `,
                          },
                          {
                            event:"logisticsChooseTree.loadData",
                          },
                          {
                            event:"@@form.init",
                            eventPayloadExpression:`
                              callback({id:"logisticsChooesForm",data:{}})
                            `
                          },
                          {
                            event:"chooseEdit.visible",
                            payload:true
                          },
                          {
                            event:"chooseDel.visible",
                            payload:false
                          },
                          {
                            event:"chooseAdd.visible",
                            payload:false
                          },
                          {
                            event:"chooseAddSave.visible",
                            payload:false
                          },
                          {
                            event:"chooseCancel.visible",
                            payload:false
                          },
                          {
                            event:"chooseCode.enabled",
                            payload:false
                          },
                          {
                            event:"chooseName.enabled",
                            payload:false
                          },
                          {
                            event:"chooseRule.enabled",
                            payload:false
                          },
                          {
                            event:"chooseAddLine.enabled",
                            payload:false
                          },
                          {
                            event:"logisticsChooseEdit.activateAll",
                            payload:false
                          }
                        ],
                        errorPubs:[
                          {
                            event:"@@message.error",
                            eventPayloadExpression: `
                              callback("增加失败")
                            `,
                          }
                        ]
                      }
                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "chooseEditSave",
                title: "保存",
                visible: false,
                enabled: true,
                type: 'primary',
                subscribes: [{
                  event:"chooseEditSave.click",
                  behaviors:[
                    {
                      type:"request",
                      dataSource:{
                        type: "api",
                        method: "POST",
                        url:"/ime/mdMrlSelRule/modify.action",
                        bodyExpression:`
                        if(!submitValidateForm("logisticsChooesForm")){
                          resolveFetch({fetch:{id:"logisticsChooesForm",data:"@@formValues"}}).then(function (data) {
                            if(!data.mdMrlSelRuleDetailDTOs || data.mdMrlSelRuleDetailDTOs.length == 0){
                              pubsub.publish("@@message.error","请填写规则字段")
                            }else{
                              callback(data)
                            }
                          })
                        }
                        `
                      },
                      successPubs:[
                        {
                          event:"@@message.success",
                          eventPayloadExpression: `
                              callback("编辑成功")
                            `,
                        },
                        {
                          event:"logisticsChooseTree.loadData",
                        },
                        {
                          event:"chooseEdit.visible",
                          payload:true
                        },
                        {
                          event:"chooseDel.visible",
                          payload:false
                        },
                        {
                          event:"chooseAdd.visible",
                          payload:false
                        },
                        {
                          event:"chooseEditSave.visible",
                          payload:false
                        },
                        {
                          event:"chooseCancel.visible",
                          payload:false
                        },
                        {
                          event:"chooseCode.enabled",
                          payload:false
                        },
                        {
                          event:"chooseName.enabled",
                          payload:false
                        },
                        {
                          event:"chooseRule.enabled",
                          payload:false
                        },
                        {
                          event:"chooseAddLine.enabled",
                          payload:false
                        },
                        {
                          event:"logisticsChooseEdit.activateAll",
                          payload:false
                        }
                      ],
                      errorPubs:[
                        {
                          event:"@@message.error",
                          eventPayloadExpression: `
                            if(eventPayload){
                              callback(eventPayload)
                            }else{
                              callback("编辑失败")
                            }
                          `,
                        }
                      ]
                    }
                  ]
                }
                ]
              }} />
              <AppButton config={{
                id: "chooseCancel",
                title: "取消",
                visible: false,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event:"chooseCancel.click",
                    pubs:[
                      {
                        event:"chooseAdd.visible",
                        payload:false
                      },
                      {
                        event:"chooseEdit.visible",
                        payload:true
                      },
                      {
                        event:"chooseDel.visible",
                        payload:false
                      },
                      {
                        event:"chooseAddSave.visible",
                        payload:false
                      },
                      {
                        event:"chooseEditSave.visible",
                        payload:false
                      },
                      {
                        event:"chooseCancel.visible",
                        payload:false
                      },
                      {
                        event:"chooseCode.enabled",
                        payload:false
                      },
                      {
                        event:"chooseName.enabled",
                        payload:false
                      },
                      {
                        event:"chooseRule.enabled",
                        payload:false
                      },
                      {
                        event:"chooseAddLine.enabled",
                        payload:false
                      },
                      {
                        event:"logisticsChooseEdit.activateAll",
                        payload:false
                      }
                    ],
                    behaviors:[
                      {
                        type:"request",
                        dataSource:{
                          type:"api",
                          method:"POST",
                          url:"/ime/mdMrlSelRule/findById.action",
                          bodyExpression:`
                            if(dataContext){
                              callback({id:dataContext.selectedKeys[0]})
                            }
                          `
                        },
                        successPubs:[
                          {
                            event:"@@form.init",
                            eventPayloadExpression:`
                              callback({id:"logisticsChooesForm",data:eventPayload})
                            `
                          }
                        ]
                      }
                    ]
                  }
                ]
              }} />
            </Col>
          </Row>
        </Card>

        <Row>
          <Col span={ 5 }>
            <Card bordered={true} style={{ width: "100%",  marginRight: "20px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
              <Field config={{
                id: 'logisticsChooseTree',
                search: false,
                enabled: true,
                visible: true,
                checkable: false,
                showLine: true,
                draggable: false,
                searchBoxWidth: 300,
                dataSource: {
                  type: "api",
                  method: "POST",
                  url: '/ime/mdMrlSelRule/findMrlSelRuleTree.action'
                },
              }} name="tree"  component={ TreeField } />
            </Card>
          </Col>
          <Col span={1}>
          </Col>
          <Col span={ 18 }>
            <Card bordered={true} style={{ marginTop: "20px" }}>
              <Row>
                <Col span="11">
                  <Field config={{
                    id: "chooseCode",
                    label: "规则编码",
                    showRequiredStar: true,  //是否显示必填星号
                    form:"logisticsChooesForm",
                    placeholder: "请输入规则编码",
                    enabled:false
                  }} name="code" component={TextField}/>
                </Col>
                <Col span="11">
                  <Field config={{
                    id: "chooseName",
                    label: "规则名称",
                    form:"logisticsChooesForm",
                    showRequiredStar: true,  //是否显示必填星号
                    placeholder: "请输入规则名称",
                    enabled:false
                  }} name="name" component={TextField}/>
                </Col>
                <Col span="11">
                  <Field config={{
                    id: "chooseRule",
                      label: "是否默认规则",
                    form:"logisticsChooesForm",
                    labelSpan: 8,   //标签栅格比例（0-24）
                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                    showRequiredStar: true,  //是否显示必填星号
                    checkedChildren: "是",
                    unCheckedChildren: "否",
                    isNumber:true,
                    enabled:false,
                    visible:false,
                  }} name="isDefault" component={SwitchField}/>
                </Col>
              </Row>
              <AppButton config={{
                id: "chooseAddLine",
                title: "增行",
                enabled: false,
                type: 'primary',
                subscribes: [
                  {
                    event:"chooseAddLine.click",
                    pubs:[
                      {
                        event:"logisticsChooseEdit.addRow"
                      }
                    ]
                  }
                ]
              }} />
              <FieldArray name="mdMrlSelRuleDetailDTOs" config={{
                "id": "logisticsChooseEdit",
                "name": "logisticsChooseEdit",
                "form":"logisticsChooesForm",
                "addButton": false, //是否显示默认增行按钮
                "showSelect":false, //是否显示选择框
                "type":"radio", //表格单选（radio）复选（checkbox）类型
                "unEditable":true, //初始化是否都不可编辑
                "columns": [
                  {
                    "id": "tableSelectFiled1",
                    "type": "selectField",
                    "enabled":true,
                    "title": "规则字段",
                    "name": "ruleField",
                    dataSource: {
                      type: "api",
                      method: "POST",
                      url: "/ime/mdMrlSelRule/findMrlSelRuleFieldsCombox.action",

                    },
                    displayField: "value",
                    valueField: "id"
                  }
                ],
                subscribes:[
                  {
                    event:"logisticsChooseTree.onSelect",
                    behaviors:[
                      {
                        type:"request",
                        dataSource:{
                          type: 'api',
                          method: 'post',
                          mode:"payload",
                          url: '/ime/mdMrlSelRule/findById.action',
                          bodyExpression:`
                            callback({id:eventPayload.selectedKeys[0]})
                          `
                        },
                        successPubs:[
                          {
                            event:"@@form.init",
                            eventPayloadExpression:`
                              callback({id:"logisticsChooesForm",data:eventPayload});
                            `
                          },
                          {
                            event:"chooseDel.enabled",
                            payload:true
                          },
                          {
                            event:"chooseEdit.enabled",
                            payload:true
                          },
                          {
                            event:"chooseAdd.visible",
                            payload:false
                          },
                          {
                            event:"chooseEdit.visible",
                            payload:true
                          },
                          {
                            event:"chooseDel.visible",
                            payload:false
                          },
                          {
                            event:"chooseAddSave.visible",
                            payload:false
                          },
                          {
                            event:"chooseEditSave.visible",
                            payload:false
                          },
                          {
                            event:"chooseCancel.visible",
                            payload:false
                          },
                          {
                            event:"chooseCode.enabled",
                            payload:false
                          },
                          {
                            event:"chooseName.enabled",
                            payload:false
                          },
                          {
                            event:"chooseRule.enabled",
                            payload:false
                          },
                          {
                            event:"chooseAddLine.enabled",
                            payload:false
                          },
                          {
                            event:"logisticsChooseEdit.activateAll",
                            payload:false
                          }
                        ],
                        errorPubs:[
                          {
                            event:"chooseEdit.enabled",
                            payload:false
                          },
                          {
                            event:"chooseDel.enabled",
                            payload:false
                          },
                          {
                            event:"@@message.error",
                            payload:"当前节点不可编辑"
                          },
                          {
                            event:"@@form.init",
                            eventPayloadExpression:`
                              callback({id:"logisticsChooesForm",data:{}})
                            `
                          }
                        ]
                      }
                    ],
                    pubs:[
                      {
                        event:"chooseDel.dataContext",
                      },
                      {
                        event:"chooseCancel.dataContext",
                      }
                    ]
                  },
                  {
                    event:"logisticsChooseTree.onSelectClear",
                    pubs:[
                      {
                        event:"chooseEdit.enabled",
                        payload:false
                      },
                      {
                        event:"chooseDel.enabled",
                        payload:false
                      },
                      {
                        event:"chooseCancel.dataContext"
                      },
                      {
                        event:"chooseDel.dataContext",
                      },
                      {
                        event:"@@form.init",
                        eventPayloadExpression:`
                          callback({id:"logisticsChooesForm",data:{}})
                        `
                      }
                    ]
                  }
                ]
              }} component={TableField}/>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

LogisticsChooesPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function mapStateToProps(props) {
  return {
    onSubmit:()=>{}
  };
}

let LogisticsChooesPageForm =  reduxForm({
  form: "logisticsChooesForm",
  validate,
})(LogisticsChooesPage)

export default connect(mapStateToProps, mapDispatchToProps)(LogisticsChooesPageForm);

