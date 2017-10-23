/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import request from 'utils/request'
import AppButton from 'components/AppButton'
import Helmet from 'react-helmet';
import {Button, DatePicker, Input, Breadcrumb, Row, Col, Table} from 'antd'
import Immutable from 'immutable'
import {Link} from 'react-router'
import pubsub from 'pubsub-js'
import {fromJS} from 'immutable'
import TextField from 'components/Form/TextField'
import TextAreaField from 'components/Form/TextAreaField'
import DateField from 'components/Form/DateField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import TableField from 'components/Form/TableField'
import AutoCompleteField from '../../components/Form/AutoCompleteField'
import DropdownButton from 'components/DropdownButton'
import CheckBoxField from '../../components/Form/CheckBoxField'
import RadiosField from '../../components/Form/RadiosField'
import NavTreeField from '../../components/NavTree'
import ModalContainer from 'components/ModalContainer'
import TreeSelectField from 'components/Form/TreeSelectField'
import TimeField from 'components/Form/TimeField'
import AppTable from 'components/AppTable';

import {reduxForm, Field, FieldArray} from 'redux-form/immutable'

const validate = values => {
  const errors = {}
  if (!values.get('userName')) {
    errors.userName = 'Required'
  }
  if (!values.get('flag')) {
    errors.flag = 'Required'
  }
  if (!values.get('search')) {
    errors.search = 'Required'
  }
  if (!values.get('leavedMessage')) {
    errors.leavedMessage = "必填项!"
  }
  return errors
}


class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)

    this.state = {
      name: "",
      list: []
    }


      let arr = [
          {name:111,age:222},
          {name:111,age:222},
      ]

      let unique = function(arr,attr){
          let result;
          for(let x=0,len=attr.length;x<len;x++){
              let hashTable = {};
              let data = [];

              for(let i=0,l=arr.length;i<l;i++){
                  if(!hashTable[arr[i][attr[x]]]){
                      hashTable[arr[i][attr[x]]] = true;
                      data.push(arr[i][attr[x]]);
                  }
              }

              if(data.length!=1){
                  result=false;
                  break;
              }else {
                  result=true;
              }
          }

          return result
      };

      console.log('aaaa:::::',unique(arr,["name","age"]))

    let modifyData = {
      findback:"sdsdsd",
      tableFiled121223:[
        {text:46,gid:1},
        {text:45,gid:2},
        {text:45,gid:3},
      ]
    }

    pubsub.publish("@@form.init", { id: "testForm", data: Immutable.fromJS(modifyData) })

  }

  componentDidMount() {
    pubsub.subscribe("a", (eventName, payload) => {
      // console.log("1111");
    })
    pubsub.subscribe(`123.onChange`, (e, d) => {
      console.log(d)
    })
    pubsub.subscribe(`switch.onChange`, (e, d) => {
      console.log(e, d)
    })
    pubsub.subscribe(`date.onChange`, (e, d) => {
      console.log(e, d)
    })
    pubsub.publish("a", {a: 1})
    pubsub.subscribe(`zhy123456.onChange`, (e, d) => {
      console.log(d)
    })
    pubsub.subscribe(`zhy654321.onChange`, (e, d) => {
      console.log(d)
    })
    pubsub.subscribe(`textAreaField123.onChange`, (e, d) => {
      console.log(d);
    })
    pubsub.subscribe(`dropdown.onClick`, (e, d) => {
      console.log(d);
    })
  }

  componentWillUnmount() {
    pubsub.unsubscribe("a")
    pubsub.unsubscribe(`switch.onChange`)
    pubsub.unsubscribe(`dskjskjdfjkadsjkf.onChange`)
    pubsub.unsubscribe(`1234567890.onChange`)
    pubsub.unsubscribe(`zhy123456.onChange`)
    pubsub.unsubscribe(`zhy654321.onChange`)
    pubsub.unsubscribe(`textAreaField123.onChange`)
  }


  render() {
    //console.log(this.props.submitting)
    const plainOptions = [{gid: '1', value: 'Apple'}, {gid: '2', value: 'Pear'}, {gid: '3', value: 'Orange'}];
    const data = [{gid: "zxcvbnm", value: "全选"}];
    return (
      <div>
        <Helmet
          title="DeviceStatus"
          meta={[
            {name: 'description', content: 'Description of DeviceStatus'},
          ]}
        />
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>页面一</Breadcrumb.Item>
        </Breadcrumb>

        <AppButton config={{
          id: "btn55555",
          title: "增行btn",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "btn55555.click",
              pubs: [
                {
                  event: "tableFiled23434.addRow",
                  eventPayloadExpression:`
                    callback({text:45})
                  `
                }
              ]
            }
          ]
        }}
        />
        <AppButton config={{
          id: "editBtn6664444",
          title: "当前行为不可编辑New",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "tableFiled23434.onSelectedRows",
              pubs: [
                {
                  event: "editBtn6664444.dataContext"
                }
              ]
            },
            {
              event: "editBtn6664444.click",
              behaviors:[
                {
                  type:"fetch",
                  id: "editBtn6664444", //要从哪个组件获取数据
                  data: "dataContext",//要从哪个组件的什么属性获取数据
                  successPubs: [  //获取数据完成后要发送的事件
                    {
                      event: "tableFiled23434.disableRow"
                    }
                  ]
                }
              ]
            }
          ]
        }}
        />

        <AppButton config={{
          id: "editBtn666",
          title: "当前行为可编辑New",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "tableFiled23434.onSelectedRows",
              pubs: [
                {
                  event: "editBtn666.dataContext"
                }
              ]
            },
            {
              event: "editBtn666.click",
              behaviors:[
                {
                  type:"fetch",
                  id: "editBtn666", //要从哪个组件获取数据
                  data: "dataContext",//要从哪个组件的什么属性获取数据
                  successPubs: [  //获取数据完成后要发送的事件
                    {
                      event: "tableFiled23434.enableRow"
                    }
                  ]
                }
              ]
            }
          ]
        }}
        />
        <AppButton config={{
          id: "controlCol666",
          title: "控制当前列",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "controlCol666.click",
              pubs: [
                {
                  event: "tableFiled23434.activateCol",
                  payload:{
                    cols:["switch"],
                    type: false
                  }
                }
              ]
            }
          ]
        }}
        />

        <AppButton config={{
          id: "controlCol666Enabled",
          title: "控制当前列可编辑New",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "controlCol666Enabled.click",
              pubs: [
                {
                  event: "tableFiled23434.enableCol",
                  payload:["tableSelectFiled2","tableFiled2"]
                }
              ]
            }
          ]
        }}
        />
        <AppButton config={{
          id: "controlCol666Disabled",
          title: "控制当前列不可编辑New",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "controlCol666Disabled.click",
              pubs: [
                {
                  event: "tableFiled23434.disableCol",
                  payload:["tableSelectFiled2","tableFiled2"]

                }
              ]
            }
          ]
        }}
        />
        <AppButton config={{
          id: "controlColVisible",
          title: "控制当前列可显示",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "controlColVisible.click",
              pubs: [
                {
                  event: "tableFiled23434.visibleCol",
                  payload:["tableFiled1","tableFiled2"]
                }
              ]
            }
          ]
        }}
        />
        <AppButton config={{
          id: "controlColInvisible",
          title: "控制当前列不可显示",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "controlColInvisible.click",
              pubs: [
                {
                  event: "tableFiled23434.InvisibleCol",
                  payload:["tableFiled1","tableFiled2"]
                }
              ]
            }
          ]
        }}
        />
        <AppButton config={{
          id: "editAll666new",
          title: "所有可编辑New",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "editAll666new.click",
              pubs: [
                {
                  event: "tableFiled23434.enableAll"
                }
              ]
            }
          ]
        }}
        />
        <AppButton config={{
          id: "editAll666NewDisa",
          title: "所有不可编辑New",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "editAll666NewDisa.click",
              pubs: [
                {
                  event: "tableFiled23434.disableAll"
                }
              ]
            }
          ]
        }}
        />

        <AppButton config={{
          id: "editAll666",
          title: "所有可编辑",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "editAll666.click",
              pubs: [
                {
                  event: "tableFiled23434.activateAll",
                  payload:true
                }
              ]
            }
          ]
        }}
        />
        <AppButton config={{
          id: "unEditAll666",
          title: "所有不可编辑",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "unEditAll666.click",
              pubs: [
                {
                  event: "tableFiled23434.activateAll",
                  payload:false
                }
              ]
            }
          ]
        }}
        />
        <AppButton config={{
          id: "selectBtn55555",
          title: "获取选中值",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "selectBtn55555.click",
              behaviors:[
                {
                  type:"fetch",
                  id: "tableFiled23434", //要从哪个组件获取数据
                  data: "selectedRows",//要从哪个组件的什么属性获取数据
                  successPubs: [  //获取数据完成后要发送的事件
                    {
                    event: "@@message.success",
                    eventPayloadExpression: `
                    console.log("eventPayload1",eventPayload)
                    callback("成功消息")
                    `,
                  }
                  ]
                }
              ]
            }
          ]
        }}
        />
        <AppButton config={{
          id: "clearAll666",
          title: "清除选中",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "clearAll666.click",
              pubs: [
                {
                  event: "tableFiled23434.clearSelect"
                }
              ]
            }
          ]
        }}
        />
        <FieldArray name="tableFiled121223" config={{
          "id": "tableFiled23434",
          "name": "tableFiled121223",
          "form":"testForm",
          "mode":"new",
          "rowKey": "id",
          "addButton": false, //是否显示默认增行按钮
          "showSelect":true, //是否显示选择框
          "type":"radio", //表格单选（radio）复选（checkbox）类型
          "unEditable":true, //初始化是否都不可编辑
          "showRowDeleteButton": true,  //是否显示操作列
          "columns": [
            {
              "id": "tableFiled1",
              "type": "switchField",
              "title": "开关",
              "name": "switch",
              "checkedChildren": "是",
              "unCheckedChildren": "否",
            },
            {
              "id": "tableFiled2",
              "type": "textField",
              "title": "文本框",
              "name": "text",
              subscribes: [
                {
                  event: "tableFiled2.onChange",
                  pubs: [
                    {
                      eventPayloadExpression:`
                      if(eventPayload>45)
                      {
                               callback(true)
                      }
                      else

                      {
                      callback(false)
                      }
                      `,
                      event:"tableFiled1.enabled",
                    }
                  ]
                },
                {
                  event: "tableFiled2.initValue",
                  pubs: [
                    {
                      eventPayloadExpression:`
                      if(eventPayload>45)
                      {
                               callback(true)
                      }
                      else

                      {
                      callback(false)
                      }
                      `,
                      event:"tableFiled1.enabled",
                    }
                  ]
                }
              ]
            },
            {
              "id": "tableSelectFiled1",
              "type": "selectField",
              "enabled":true,
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
              id: 'tableTreeSelect',
              type: 'treeSelectField',
              title: "下拉树",
              name: "tableTreeSelect",
              treeCheckStrictly:true, //是否节点选择完全受控
              treeCheckable: false,  //是否显示CheckBox(多选)
              showSearch:true,  //是否在下拉中显示搜索框(单选)
              dropdownMatchSelectWidth:false,  //下拉菜单和选择器是否同宽
              dataSource: {
                type: "api",
                method: "POST",
                url: '/ime/mdMrlSelRule/findMrlSelRuleTree.action'
              },
              displayField:"name",
              valueField:"id"
            },
            {
              "id": "tableFiled3",
              "type": "dateField",
              "title": "日期",
              "name": "date",
              "showTime":false //是否显示时分秒
            },
            {
              "id": "tableFiled4",
              "type": "autoCompleteField",
              "title": "自动完成",
              "name": "autoComplete",
              dataSource: {
                type: 'api',
                method: 'get',
                url: '/api/ddd.json'
              },
              displayField: "name",
              valueField: "id"
            },
            {
              "id": "tableFiled6",
              "type": "InputNumberField",
              "title": "数字框",
              "name": "inputNumber",
              "size":"large",  //尺寸大小:large、small
              "min":1,        //最小、大值
              "max":undefined,
              "formatter":'rmb',   //百分比%：percent；货币￥：rmb（ 格式化数字，以展示具有具体含义的数据）
              "step":undefined,  //小数位数: 0.01保留2位有效数值
            },
            {
              "id": "tableFiled7",
              "type": "uploadField",
              "typeFile":'else',  //img为图片；else为所有类型的文件
              "title": "上传",
              "name": "upload",
            },
            {
              "id": "tableFiled8",
              "type": "findbackField",
              "title": "参照",
              "name": "findback",
              "form":"testForm",
              dataSource: {
                type: 'api',
                method: 'POST',
                url: '/api/findback.json'
              },
              tableInfo: {
                id:"tableId55544444",
                size:"small",
                rowKey:"gid",
                tableTitle:"人员信息",
                showSerial:true,  //序号
                columns:[
                  {title: 'Full Name', width: 100, dataIndex: 'name', key: '1'},
                  {title: 'Age', width: 100, dataIndex: 'age', key: '2'},
                  {title: 'Column 1', dataIndex: 'address', key: '3', width: 150},
                  {title: 'Column 2', dataIndex: 'address', key: '4', width: 150},
                  {title: 'Column 3', dataIndex: 'address', key: '5', width: 150},
                  {title: 'Column 4', dataIndex: 'address', key: '6', width: 150},
                  {title: 'Column 5', dataIndex: 'address', key: '7', width: 150},
                  {title: 'Column 6', dataIndex: 'address', key: '8', width: 150},
                  {title: 'Column 7', dataIndex: 'address', key: '9', width: 150},
                  {title: 'Column 8', dataIndex: 'address', key: '10', width: 150}
                ],
                dataSource: {
                  type: 'api',
                  method: 'post',
                  url: '/api/table.json',
                  payload: {name: "ewueiwue"}
                }
              },
              pageId:'tableFiled8',
              displayField: "address",
              valueField: {
                "from": "gid",
                "to": "findBack"
              },
              associatedFields: [
                {
                  "from": "name",
                  "to": "name"
                },
                {
                  "from": "address",
                  "to": "address"
                }
              ]
            },
            {
              "id": "tableFiled9",
              "type": "textField",
              "title": "参照带回(姓名)",
              "name": "name",
              "enabled":false,
              subscribes:[
                {
                  event:"tableFiled8.onChange",
                  pubs:[
                    {
                      event:"tableFiled9.expression",
                      meta: {
                        expression: `
                          console.log(23432)
                        `
                      }
                    }
                  ]
                }

              ]
            }
          ],
          rowOperationItem: [
            {
              id: "testDelBtn",
              type: "linkButton",
              title: "删除",
              subscribes: [
                {
                  event: "testDelBtn.click",
                  behaviors: [
                    {
                      type: "request",
                      dataSource: {
                        type: "api",
                        method: "POST",
                        url: "/api/ddd.json",
                        payloadMapping: [{
                          from: "gid",
                          to: "id"
                        }]
                      },
                      successPubs: [
                        {
                          event: "1.enabled",
                          payload: false
                        }
                      ]


                    }
                  ]
                }
              ]
            }
          ]
        }} component={TableField}/>
        {/*日期*/}
        <Field config={{
          id: 'date',
          label: "日期",
          showTime: true, //是否显示时分秒
          showRequiredStar: true,  //是否显示必填星号
        }} name="date" component={DateField}/>
        <Field config={{
          id: 'treeSelectDemo',
          label: "下拉树",
          showRequiredStar: true,  //是否显示必填星号
          treeCheckStrictly:true, //是否节点选择完全受控
          treeCheckable: false,  //是否显示CheckBox(多选)
          showSearch:true,  //是否在下拉中显示搜索框(单选)
          dropdownMatchSelectWidth:true,  //下拉菜单和选择器是否同宽
          dataSource: {
            type: "api",
            method: "POST",
            url: '/ime/mdMrlSelRule/findMrlSelRuleTree.action'
          },
          displayField:"name",
          valueField:"id"
        }} name="TreeSelectDate" component={TreeSelectField}/>
        <Field config={{
          id: 'timeSelectDemo',
          label: "时间选择",
          showRequiredStar: true,  //是否显示必填星号
          form:"testForm",
          enabled:true,
          format:"HH:mm:ss" //展示时间的格式
        }} name="timeSelectDemo" component={TimeField}/>
        <Field config={{
          enabled: true,
          id: "findBack66ooo",
          label: "参照",
          form:"testForm",
          showRequiredStar: true,  //是否显示必填星号
          labelSpan: 4,   //标签栅格比例（0-24）
          wrapperSpan: 4,  //输入框栅格比例（0-24）
          width: 600,  //弹窗的宽度
          style: {top:50},  //弹窗样式
          title: "弹窗名称",
          // formMode:'edit',
          dataSource: {
            type: 'api',
            method: 'POST',
            url: '/api/findback.json',
            payloadMapping:[{
              from:"eventPayload",
              to:"id"
            }]
          },
          tableInfo: {
            id:"tableId555",
            size:"small",
            rowKey:"gid",
            tableTitle:"人员信息",
            showSerial:true,  //序号
            columns:[
              {title: 'Full Name', width: 100, dataIndex: 'name', key: '1'},
              {title: 'Age', width: 100, dataIndex: 'age', key: '2'},
              {title: 'Column 1', dataIndex: 'address', key: '3', width: 150},
              {title: 'Column 2', dataIndex: 'address', key: '4', width: 150},
              {title: 'Column 3', dataIndex: 'address', key: '5', width: 150},
              {title: 'Column 4', dataIndex: 'address', key: '6', width: 150},
              {title: 'Column 5', dataIndex: 'address', key: '7', width: 150},
              {title: 'Column 6', dataIndex: 'address', key: '8', width: 150},
              {title: 'Column 7', dataIndex: 'address', key: '9', width: 150},
              {title: 'Column 8', dataIndex: 'address', key: '10', width: 150}
            ],
            dataSource: {
              type: 'api',
              method: 'post',
              url: '/api/table.json',
              payload: {name: "ewueiwue"}
            }
          },
          pageId:'findBack66ooo56565656',
          displayField: "address",
          valueField: {
            "from": "gid",
            "to": "findBack"
          },
          associatedFields: [
            {
              "from": "name",
              "to": "name"
            },
            {
              "from": "age",
              "to": "age1"
            }
          ]
        }} name="findback" component={FindbackField}/>
        <Field config={{
          id: "name",
          label: "姓名",  //标签名称
          labelSpan: 4,   //标签栅格比例（0-24）
          wrapperSpan: 4,  //输入框栅格比例（0-24）
          showRequiredStar: true,  //是否显示必填星号
          "enabled":false
        }} name="name" component={TextField}/>
        <Field config={{
          id: "age1",
          label: "年龄",  //标签名称
          labelSpan: 4,   //标签栅格比例（0-24）
          wrapperSpan: 4,  //输入框栅格比例（0-24）
          showRequiredStar: true,  //是否显示必填星号
          "enabled":false
        }} name="age1" component={TextField}/>
        <Table/>

        <DropdownButton config={{
          id: 'dropdown',
          name: 'dropdown',
          enabled: true,
          dataSource: {
            type: 'api',
            method: 'get',
            url: '/api/ddd.json'
          },
          displayField: "name",
          valueField: "id"
        }} name="drop"></DropdownButton>

        <AppButton config={{
          id: "1",
          title: "测试1",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "1.click",
              pubs: [
                {
                  event: "2.enabled",
                  payload: false
                }
              ]
            }
          ]
        }}>
        </AppButton>
        <Field config={{
          enabled: true,
          id: "zhy123456",
          label: "种类复选",
          dataSource: {
            type: "api",
            method: "get",
            url: "/api/ddd.json",
          },
          displayField: "name",
          valueField: "id",
          labelSpan: 3,
          wrapperSpan: 21
        }} name="flag" component={CheckBoxField}/>
        <Field config={{
          enabled: true,
          id: "zhy654321",
          label: "种类单选",
          dataSource: {
            type: "api",
            method: "get",
            url: "/api/ddd.json",
          },
          displayField: "name",
          valueField: "id",
          labelSpan: 3,
          wrapperSpan: 21
        }} name="flagr" component={RadiosField}/>

        <AppButton config={{
          id: "2",
          title: "测试2",
          subscribes: [
            {
              event: "2.click",
              behaviors: [
                {
                  type: "request",
                  dataSource: {
                    type: "api",
                    method: "get",
                    url: "/api/ddd.json",
                  },
                  successPubs: [
                    {
                      event: "1.enabled",
                      payload: false
                    }
                  ]
                }
              ]
            }
          ]
        }}>
        </AppButton>

        <Field config={{
          visible: true,  //是否可见
          enabled: true,  //是否启用
          id: "123",
          label: "测试1",  //标签名称
          labelSpan: 8,   //标签栅格比例（0-24）
          wrapperSpan: 16,  //输入框栅格比例（0-24）
          showRequiredStar: true,  //是否显示必填星号
          hasFeedback: false  //验证失败时是否显示feedback图案
        }} name="userName" component={TextField}/>

        <Field label="测试2" config={{}} name="userName2" component={TextField}/>

        <Field config={{
          id:'navTree-1',
          title:'NavTree',
            dataSource:{
                type: "customValue",
                values: [
                    {key: "1", value: "苹果"},
                    {key: "2", value: "桃子"}
                ]
            },
            subscribes:[
                {
                    event:'navTree-1.didMount',
                    behaviors:[
                        {
                            type:'fetch',
                            id:'1234567890',
                            data:'selectedRows',
                            successPubs:[
                                {
                                    event:'navTree-1.setData',
                                }
                            ]
                        }
                    ]
                }
            ],

        }} name="NavTree" component={NavTreeField}/>

        <Button loading={this.props.submitting} onClick={this.props.handleSubmit((values) => {
        })}>提交</Button>
        <Field config={{
          id: 'switch',
          checkedChildren: 1,
          unCheckedChildren: 0,
          isNumber:true,
        }} component={SwitchField} name="switchdemo"/>
        <Field config={{
          id: "dataSourceApi",
          enabled: true,
          visible: true,
          label: "sdsds",
          dataSource: {
            type: "api",
            method: "get",
            url: "/api/ddd.json",
            payloadMapping: [{
              from: "id",
              to: "code"
            }]
          },
          placeholder: "请输入查找选项",
          displayField: "name",
          valueField: "id",
          labelSpan: 8,   //标签栅格比例（0-24）
          wrapperSpan: 16,  //输入框栅格比例（0-24）
          showRequiredStar: true,  //是否显示必填星号
          hasFeedback: false  //验证失败时是否显示feedback图案
        }} name="dataSourceApi" component={AutoCompleteField}/>


        <Field config={{
          id: "dataSourceCustomValue",
          enabled: true,
          visible: true,
          label: "sdsds",
          dataSource: {
            type: "customValue",
            values: [
              {key: "1", value: "苹果"},
              {key: "2", value: "桃子"}
            ]
          },
          placeholder: "请输入查找选项",
          displayField: "value",
          valueField: "key",
          labelSpan: 8,   //标签栅格比例（0-24）
          wrapperSpan: 16,  //输入框栅格比例（0-24）
          showRequiredStar: true,  //是否显示必填星号
          hasFeedback: false  //验证失败时是否显示feedback图案
        }} name="dataSourceCustomValue" component={AutoCompleteField}/>


        <Field config={{
          id: "dataSourceDict",
          enabled: true,
          visible: true,
          label: "sdsds",
          dataSource: {
            type: "dictionary",
            payload: {code: "dssdsdsd"}
          },
          placeholder: "请输入查找选项",
          displayField: "name",
          valueField: "code",
          labelSpan: 8,   //标签栅格比例（0-24）
          wrapperSpan: 16,  //输入框栅格比例（0-24）
          showRequiredStar: true,  //是否显示必填星号
          hasFeedback: false  //验证失败时是否显示feedback图案
        }} name="dataSourceDict" component={AutoCompleteField}/>

        <Field config={{
          id: "dataSourceDict2",
          enabled: true,
          visible: true,
          label: "sdsds",
          dataSource: {
            type: "dictionary",
            payload: {code: "dssdsdsd"}
          },
          placeholder: "请输入查找选项",
          displayField: "name",
          valueField: "code",
          labelSpan: 8,   //标签栅格比例（0-24）
          wrapperSpan: 16,  //输入框栅格比例（0-24）
          showRequiredStar: true,  //是否显示必填星号
          hasFeedback: false  //验证失败时是否显示feedback图案
        }} name="dataSourceDict2" component={AutoCompleteField}/>

        <Field config={{
          id: "dataSourceDict3",
          enabled: true,
          visible: true,
          label: "sdsds",
          dataSource: {
            type: "dictionary",
            payload: {code: "dssdsdsd"}
          },
          placeholder: "请输入查找选项",
          displayField: "name",
          valueField: "code",
          labelSpan: 8,   //标签栅格比例（0-24）
          wrapperSpan: 16,  //输入框栅格比例（0-24）
          showRequiredStar: true,  //是否显示必填星号
          hasFeedback: false  //验证失败时是否显示feedback图案
        }} name="dataSourceDict3" component={AutoCompleteField}/>

        <Button loading={this.props.submitting} onClick={this.props.handleSubmit((values) => {


        })}>提交</Button>
        <Field config={{
          visible: true,  //是否可见
          enabled: true,  //是否启用
          id: "textAreaField123",
          label: "留言区详细内容",  //标签名称
          labelSpan: 24,   //标签栅格比例（0-24）
          wrapperSpan: 24,  //输入框栅格比例（0-24）
          showRequiredStar: true,  //是否显示必填星号
          hasFeedback: true,  //验证失败时是否显示feedback图案
          minRows: 2, // 最小行数
          maxRows: 6,  // 最大非滚动行数
          maxWords: 20
        }} name="leavedMessage" component={TextAreaField}/>

        <Button onClick={(e) => {
          pubsub.publish(`pageIdxxx.openModal`, e);
        }}>开启modal</Button>
        <h2>&nbsp;</h2>

        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "modal123", // id，必填*
          pageId: "pageIdxxx", // 指定是哪个page调用modal，必填*
          type: "confirm", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          title: "测试title", // title，不传则不显示title
          content: (
            <div>
              <p>some messages...some messages...</p>
              <p>some messages...some messages...</p>
            </div>
          ), // 非modal模式使用
          closable: true, // 是否显示右上角关闭按钮，默认不显示
          width: 500, // 宽度，默认520px
          okText: "确定按钮", // ok按钮文字，默认 确定
          cancelText: "取消按钮", // cancel按钮文字，默认 取消
          style: {top: 120}, // style样式
          wrapClassName: "wcd-center", // class样式
          hasFooter: true, // 是否有footer，默认 true
          maskClosable: false, // 点击蒙层是否允许关闭，默认 true
        }}
        >
          <p>type不传或传modal,默认是modal框容器，也可以选择info success error warning confirm模式</p>
          <p>content是info success error warning confirm模式的内容，在modal模式下没有意义</p>
          <p>style，wrapClassName，hasFooter，maskClosable是modal模式参数，在其他模式下没有意义</p>
          <p>方法有：openModal,onOk,onCancel,afterClose；其中afterClose是modal模式专属方法</p>
          <p>这里可以是自定义的html</p>
          <p>当然也可以进行组件嵌套</p>
        </ModalContainer>
      </div>
    );
  }
}

export default reduxForm({
  form: "testForm",
  validate
})(HomePage)
