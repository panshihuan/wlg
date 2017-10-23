import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col ,Tabs} from 'antd';
import pubsub from 'pubsub-js'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable'
import AppTable from 'components/AppTable';
import AppButton from "components/AppButton"
import RadiosField from 'components/Form/RadiosField'
import TreeField from 'components/Form/TreeField';
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'

const TabPane = Tabs.TabPane;

const validate = values => {
  const errors = {}
  if (!values.get('StaffAdd-radio')) {
    errors.code = '必填项'
  }
  return errors
}
export class StaffAdd extends React.PureComponent {
  constructor(props) {
    super(props);

  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div>
        <Tabs>
          <TabPane tab="人员/班组" key="1">
            <Row>
              <Col span={10}>
                <form>
                  <Field config={{
                    enabled: true,
                    id: "StaffAdd-radio",
                    label: "",
                    dataSource: {
                      type: "customValue",
                      values: [
                        {key: "team", value: "仅班组"},
                        {key: "person", value: "仅人员"}
                      ]
                    },
                    displayField: "value",
                    valueField: "key",
                    labelSpan: 3,
                    wrapperSpan: 21,
                    subscribes:[
                      {
                        event: "StaffAdd-radio.onChange",
                        pubs: [
                          {
                            event: "StaffAdd-radio.dataContext",
                          },
                          {
                            event: "StaffAdd-radio.expression",
                            meta: {
                              expression: `
                                var str = dataContext == "team"? "班组":"人员";
                                resolveFetch({fetch:{id:"StaffAddTree-left",data:"state"}}).then(function (left) {
                                  //获取左边树选择的数据
                                  let leftCheckedNode = left.checkedInfo
                                  for(var i = 0;i<leftCheckedNode.length;i++){
                                    if(leftCheckedNode[i].name != dataContext){
                                      pubsub.publish('StaffAdd-left.enabled',false)
                                      return
                                    }else{
                                      pubsub.publish('StaffAdd-left.enabled',true)
                                    }
                                  }
                                })
                                resolveFetch({fetch:{id:"StaffAddTree-right",data:"state"}}).then(function (right) {
                                  //获取右边树选择的数据
                                  let rightCheckedNode = right.checkedInfo
                                  for(var i = 0;i<rightCheckedNode.length;i++){
                                    if(rightCheckedNode[i].name != dataContext){
                                      pubsub.publish('StaffAdd-right.enabled',false)
                                      return
                                    }else{
                                      pubsub.publish('StaffAdd-right.enabled',true)
                                    }
                                  }
                                })
                              `
                            }
                          }
                        ]
                      }
                    ]
                  }} name="StaffAdd-radio" component={RadiosField}/>
                </form>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <div style={{marginBottom:"20px"}}>待分配班组/人员</div>
                <Field config={{
                  id: 'StaffAddTree-left',
                  search: true,
                  enabled: true,
                  visible: true,
                  checkable: true,
                  showLine: true,
                  draggable: false,
                  checkStrictly:true,
                  searchBoxWidth: 300,
                  dataSource: {
                    type: "api",
                    method: "POST",
                    url: '/ime/imeTrackOrder/getTeamPersonTree.action',
                    bodyExpression:`
                      var ids = []
                      resolveFetch({fetch:{id:"dispatchOrder-btn-4",data:"dataContext"}}).then(function (data) {
                        for(var m=0;m<data.length;m++){
                          ids.push(data[m]["gid"])
                        }
                        callback({busiGid:'',model:'unassigned',ids:ids})
                      })
                    `,
                  },
                  subscribes:[
                    {
                      event:"StaffAdd-left.click",
                      pubs:[
                        {
                          event: "StaffAddTree-left.expression",
                          meta: {
                            expression: `
                              let leftRoot = _.cloneDeep(me.state.dataSource)
                              let leftTreeNode = leftRoot[0].childs;
                              let checkedNode = _.cloneDeep(me.state.checkedInfo)
                              //获取radio选择数据
                              resolveFetch({fetch:{id:"staffAddForm",data:"@@formValues"}}).then(function (value) {
                                var type = value["StaffAdd-radio"] //班组或者人员
                                var newCheckedNode = []
                                resolveFetch({fetch:{id:"StaffAddTree-right",data:"state"}}).then(function (data) {
                                  //获取右边树的数据
                                  let rightRoot = _.cloneDeep(data.dataSource)
                                  let rightTreeNode
                                  if(data.dataSource[0].childs == null){
                                    rightTreeNode = []
                                  }else{
                                    rightTreeNode = rightRoot[0].childs
                                  }

                                  for(var m = 0;m<checkedNode.length;m++){
                                    let item = checkedNode[m]
                                    if(item.name == type){
                                      if(type == "team"){   //班组增加
                                        item["methodName"] = "onlyTeam"

                                        //左边班组删除
                                        leftTreeNode.splice(leftTreeNode.indexOf(_.find(leftTreeNode,{id:item.id})),1)
                                        if(item.childs && item.childs.length!=0){
                                          for(var j = 0;j<item.childs.length;j++){
                                            item.childs[j]["methodName"] = "onlyTeam"
                                          }
                                        }

                                        //右边班组增加,判断右边树存不存在当前班组
                                        if(_.find(rightTreeNode,{id:item.id})){
                                          let rightIndex = rightTreeNode.indexOf(_.find(rightTreeNode,{id:item.id}))
                                          let rightNode = rightTreeNode[rightIndex]
                                          rightNode["methodName"] = "onlyTeam"
                                          if(item.childs && rightNode.childs){
                                            rightNode.childs = rightNode.childs.concat(item.childs)
                                          }
                                        }else{
                                          console.log("右边增加班组",item)
                                          rightTreeNode.push(item)
                                        }
                                      }else if(type == "person"){  //人员增加
                                        item["methodName"] = "onlyPerson"

                                        //左边人员删除
                                        let leftIndex = leftTreeNode.indexOf(_.find(leftTreeNode,{id:item.pid}))
                                        let leftNode = leftTreeNode[leftIndex]
                                        let leftNodeChilds = leftNode.childs
                                        leftNodeChilds.splice(leftNodeChilds.indexOf(_.find(leftNodeChilds,{id:item.id})),1)

                                        //右边人员增加，判断右边树存不存在人员的上级
                                        if(_.find(rightTreeNode,{id:item.pid})){
                                          let rightIndex = rightTreeNode.indexOf(_.find(rightTreeNode,{id:item.pid}))
                                          let rightNode = rightTreeNode[rightIndex]
                                          rightNode.childs.push(item)
                                        }else{
                                          let rightItem = _.cloneDeep(leftNode)
                                          rightItem.childs = []
                                          rightItem["methodName"] = "onlyPerson"
                                          rightItem.childs.push(item)
                                          console.log("右边增加人员",rightItem)
                                          rightTreeNode.push(rightItem)
                                        }
                                      }
                                      newCheckedNode.push(item)
                                    }
                                  }

                                  //左边树重新渲染
                                  leftRoot[0].childs = leftTreeNode
                                  pubsub.publish('StaffAddTree-left.setTreeData',_.cloneDeep(leftRoot))

                                  //右边树重新渲染
                                  rightRoot[0].childs = rightTreeNode
                                  pubsub.publish('StaffAddTree-right.setTreeData',_.cloneDeep(rightRoot))

                                  pubsub.publish('StaffAdd-left.enabled',false)
                                })
                              })
                            `
                          }
                        }
                      ]
                    }
                  ]
                }} name="tree"  component={ TreeField } />
              </Col>
              <Col style={{paddingTop:"60px"}} span={4}>
                <div>
                  <AppButton config={{
                    id: "StaffAdd-left",
                    title: ">",
                    type:"primary",
                    size:"large",
                    visible: true,
                    enabled: false,
                    subscribes: [
                      {
                        event:"StaffAddTree-left.onCheck",
                        pubs:[
                          {
                            event:"StaffAdd-left.dataContext",
                          },
                          {
                            event:"StaffAdd-left.expression",
                            meta:{
                              expression:`
                                var checkNodes = dataContext.info
                                resolveFetch({fetch:{id:"staffAddForm",data:"@@formValues"}}).then(function (value) {
                                  var type = value["StaffAdd-radio"]
                                  var str = type == "team"? "班组":"人员";
                                  for(var i = 0;i<checkNodes.length;i++){
                                    var item = checkNodes[i]
                                    if(item.name != type){
                                      pubsub.publish('StaffAdd-left.enabled',false)
                                      pubsub.publish('@@message.error','请勾选都为'+str+'的选择框')
                                      return
                                    }else{
                                      pubsub.publish('StaffAdd-left.enabled',true)
                                    }
                                  }
                                })
                              `
                            }
                          }
                        ]
                      },
                      {
                        event:"StaffAddTree-left.onCheckClear",
                        pubs:[
                          {
                            event:"StaffAdd-left.enabled",
                            payload:false
                          }
                        ]
                      }
                    ]

                  }} />
                </div>
                <div style={{marginTop:"20px"}}>
                  <AppButton config={{
                    id: "StaffAdd-right",
                    title: "<",
                    type:"primary",
                    size:"large",
                    visible: true,
                    enabled: false,
                    subscribes: [
                      {
                        event:"StaffAddTree-right.onCheck",
                        pubs:[
                          {
                            event:"StaffAdd-right.dataContext"
                          },
                          {
                            event:"StaffAdd-right.expression",
                            meta:{
                              expression:`
                                var checkNodes = dataContext.info
                                resolveFetch({fetch:{id:"staffAddForm",data:"@@formValues"}}).then(function (value) {
                                  var type = value["StaffAdd-radio"]
                                  var str = type == "team"? "班组":"人员";
                                  for(var i = 0;i<checkNodes.length;i++){
                                    var item = checkNodes[i]
                                    if(item.name != type){
                                      pubsub.publish('StaffAdd-right.enabled',false)
                                      pubsub.publish('@@message.error','请勾选都为'+str+'的选择框')
                                      return
                                    }else{
                                      pubsub.publish('StaffAdd-right.enabled',true)
                                    }
                                  }
                                })
                              `
                            }
                          }
                        ]
                      },
                      {
                        event:"StaffAddTree-right.onCheckClear",
                        pubs:[
                          {
                            event:"StaffAdd-right.enabled",
                            payload:false
                          }
                        ]
                      }
                    ]
                  }} />
                </div>
              </Col>
              <Col span={10}>
                <div style={{marginBottom:"20px"}}>已分配班组/人员</div>
                <Field config={{
                  id: 'StaffAddTree-right',
                  search: true,
                  enabled: true,
                  visible: true,
                  checkable: true,
                  showLine: true,
                  draggable: false,
                  checkStrictly:true,
                  searchBoxWidth: 300,
                  dataSource: {
                    type: "api",
                    method: "POST",
                    url: '/ime/imeTrackOrder/getTeamPersonTree.action',
                    bodyExpression:`
                      var ids = []
                      resolveFetch({fetch:{id:"dispatchOrder-btn-4",data:"dataContext"}}).then(function (data) {
                        for(var m=0;m<data.length;m++){
                          ids.push(data[m]["gid"])
                        }
                        callback({busiGid:'',model:'assigned',ids:ids})
                      })
                    `,
                  },
                  subscribes:[
                    {
                      event:"StaffAdd-right.click",
                      pubs:[
                        {
                          event: "StaffAddTree-right.expression",
                          meta: {
                            expression: `
                              let rightRoot = _.cloneDeep(me.state.dataSource)
                              let rightTreeNode = rightRoot[0].childs;
                              let checkedNode = _.cloneDeep(me.state.checkedInfo)
                              //获取radio选择数据
                              resolveFetch({fetch:{id:"staffAddForm",data:"@@formValues"}}).then(function (value) {
                                var type = value["StaffAdd-radio"] //班组或者人员
                                resolveFetch({fetch:{id:"StaffAddTree-left",data:"state"}}).then(function (data) {
                                  //获取左边树的数据
                                  let leftRoot = _.cloneDeep(data.dataSource)
                                  let leftTreeNode = leftRoot[0].childs

                                  for(var m = 0;m<checkedNode.length;m++){
                                    let item = checkedNode[m]
                                    if(item.name == type){
                                      if(type == "team"){   //班组增加

                                        //右边班组删除
                                        rightTreeNode.splice(rightTreeNode.indexOf(_.find(rightTreeNode,{id:item.id})),1)

                                        //左边班组增加,判断右边树存不存在当前班组
                                        if(_.find(leftTreeNode,{id:item.id})){
                                          let leftIndex = leftTreeNode.indexOf(_.find(leftTreeNode,{id:item.id}))
                                          let leftNode = leftTreeNode[leftIndex]
                                          if(item.childs && leftNode.childs){
                                            leftNode.childs = leftNode.childs.concat(item.childs)
                                          }
                                        }else{
                                          leftTreeNode.push(item)
                                        }
                                      }else if(type == "person"){  //人员增加

                                        //右边人员删除
                                        let rightIndex = rightTreeNode.indexOf(_.find(rightTreeNode,{id:item.pid}))
                                        let rightNode = rightTreeNode[rightIndex]
                                        let rightNodeChilds = rightNode.childs
                                        rightNodeChilds.splice(rightNodeChilds.indexOf(_.find(rightNodeChilds,{id:item.id})),1)

                                        //左边人员增加，判断左边树存不存在人员的上级
                                        if(_.find(leftTreeNode,{id:item.pid})){
                                          let leftIndex = leftTreeNode.indexOf(_.find(leftTreeNode,{id:item.pid}))
                                          let leftNode = leftTreeNode[leftIndex]
                                          leftNode.childs.push(item)
                                        }else{
                                          let leftItem = _.cloneDeep(rightNode)
                                          leftItem.childs = []
                                          leftItem.childs.push(item)
                                          leftTreeNode.push(leftItem)
                                        }
                                      }
                                    }
                                  }

                                  //左边树重新渲染
                                  leftRoot[0].childs = leftTreeNode
                                  pubsub.publish('StaffAddTree-left.setTreeData',_.cloneDeep(leftRoot))

                                  //右边树重新渲染
                                  rightRoot[0].childs = rightTreeNode
                                  pubsub.publish('StaffAddTree-right.setTreeData',_.cloneDeep(rightRoot))

                                  pubsub.publish('StaffAdd-right.enabled',false)
                                })
                              })
                            `
                          }
                        }
                      ]
                    }
                  ]
                }} name="tree"  component={ TreeField } />
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <Row>
          <Col span={6} offset={20}>

            {/*确定按钮*/}
            <AppButton config={{
              id: "StaffAdd-Ok",
              title: "确定",
              type:"primary",
              size:"large",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event:"StaffAdd-Ok.click",
                  behaviors:[
                    {
                      type: "request",
                      dataSource: {
                        type:"api",
                        method:"post",
                        url:"/ime/imeTrackOrder/dispatcherTeamOrPerson.action",
                        withForm:"",
                        bodyExpression:`
                          var ids = []
                          resolveFetch({fetch:{id:"dispatchOrder-btn-4",data:"dataContext"}}).then(function (data) {
                            for(var m=0;m<data.length;m++){
                              ids.push(data[m]["gid"])
                            }
                            resolveFetch({fetch:{id:"StaffAddTree-right",data:"state"}}).then(function (state) {
                              var teamAndPersonTree = state.dataSource[0]
                              callback({trackOrderGids:ids,teamAndPersonTree:teamAndPersonTree})
                            })
                          })
                        `,
                      },
                      successPubs: [  //获取数据完成后要发送的事件
                        {
                          event: "@@message.success",
                          payload: "新增成功"
                        },
                        {
                          event:"dispatchAllot-modal-staff.onCancel"
                        },
                        {
                          event:"dispatchAllot-modal-staff.onSuccessCancel"
                        }
                      ],
                      errorPubs: [
                        {
                          event: "@@message.error",
                          eventPayloadExpression:`
                            if(eventPayload){
                              callback(eventPayload)
                            }else{
                              callback("新增失败")
                            }
                          `
                        }
                      ]
                    }
                  ]
                }
              ]

            }} />
            <AppButton config={{
              id: "StaffAdd-Cancel",
              title: "取消",
              type:"default",
              size:"large",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: "StaffAdd-Cancel.click",
                  pubs:[{
                    event: "dispatchAllot-modal-staff.onCancel",
                  }]
                }
              ]
            }} />
          </Col>
        </Row>

      </div>
    );
  }
}

StaffAdd.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

let StaffAddForm = reduxForm({
  form: "staffAddForm",
  validate,
  initialValues: Immutable.fromJS({ "StaffAdd-radio": "team" })
})(StaffAdd)

export default connect(null, mapDispatchToProps)(StaffAddForm);
