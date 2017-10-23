import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import {Row, Col} from 'antd'

export class GroupManageModal extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }
  componentDidMount() {
        // pubsub.publish('orderRepealModal-table-11.laterData',{})
  }
  componentWillUnmount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  render() {
    return (
      <form>
          <Row>
              <Col span="24">
                  <AppTable name="orderRepealModal-table-11" config={{
                      "id":"orderRepealModal-table-11",
                      "name":"orderRepealModal-table-11",
                      "type":"checkbox",//表格单选复选类型
                      "size":"default",//表格尺寸
                      "rowKey": "gid",//主键
                      "onLoadData":true,//初始化是否加载数据
                      "width": 500,//表格宽度
                      "showSerial":false,
                      "editType":false,
                      "isSearch":false,
                      "columns":[
                          { title: '用户编码', width: 120, dataIndex: 'userCode', key: '1' },
                          { title: '用户名称', width: 120, dataIndex: 'userName', key: '2' },
                          { title: '用户id', width: 140, dataIndex: 'gid', key: '3'},
                      ],
                      dataSource: {
                          type: 'api',
                          method: 'post',
                          url: '/sm/user/query.action'
                      },
                      subscribes:[

                          {
                              event:'orderRepealModal-table-11.onSelectedRows',
                              pubs:[
                                  {
                                      event:'orderRepealModal-btn-2.dataContext'
                                  }
                              ],
                              /*behaviors:[
                                  {
                                      type:'fetch',
                                      id:'orderRepealModal-table-11',
                                      data:'selectedRows',
                                      successPubs:[
                                          {
                                              event:'orderRepealModal-btn-2.dataContext',

                                          }
                                      ]
                                  }
                              ]*/
                          }

                      ]

                  }}/>
              </Col>
          </Row>
          <br/>
          <Row>
              <Col span={6} offset={20}>
                  {/*取消按钮*/}
                  <AppButton config={{
                      id: "orderRepealModal-btn-3",
                      title: "取消",
                      type:"default",
                      size:"large",
                      visible: true,
                      enabled: true,
                      subscribes: [
                          {
                              event: "orderRepealModal-btn-3.click",
                              pubs:[{
                                  event: "addGroupManagePage.onCancel",
                              }]
                          }
                      ]
                  }} />

                  {/*确定按钮*/}
                  <AppButton config={{
                      id: "orderRepealModal-btn-2",
                      title: "确定",
                      type:"primary",
                      size:"large",
                      visible: true,
                      enabled: true,
                      subscribes: [
                          {
                              event: "orderRepealModal-btn-2.click",
                              pubs:[
                                  {
                                      event: "busigroup.expression",
                                      meta: {
                                          expression: `
                                            resolveFetch({fetch:{id:"orderRepealModal-btn-2",data:"dataContext"}}).then(function (value) {
                                                smUserGids = value;

                                                 resolveFetch({fetch:{id:"BusiGroupPage",data:"@@formValues"}}).then(function (value) {
                                                           /*  console.log("11111111111 "+value.hiddenpara)
                                                              console.log("22222222222 "+smUserGids[0].gid)*/
                                                         selectedBusiGroupId = value.hiddenpara;
                                                        console.log(value);
                                                         let dataRel = [];

                                                        for(var i=0; i<smUserGids.length; i++){
                                                            var obj = {smBusiGroupGid:selectedBusiGroupId,smUserGid:smUserGids[i].gid};
                                                            dataRel.push(obj);

                                                        }

                                                        let dataSource= {
                                                          type: "api",
                                                          method: "POST",
                                                          url: "/sm/busiGroupUser/addList.action",
                                                          mode:"dataContext"
                                                        }
                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:dataRel},
                                                          function(res){
                                                            pubsub.publish('@@message.success',"新增成功！")
                                                                    //刷新表格
                                                                    let params = {
                                                                      "query": {
                                                                        "query": [
                                                                           {
                                                                                "left":"(",
                                                                                "field":"smBusiGroupGid",
                                                                                "type":"eq",
                                                                                "value":selectedBusiGroupId,
                                                                                "right":")",
                                                                                "operator":"and"
                                                                           }
                                                                         ],
                                                                         "sorted":"gid asc"
                                                                      }
                                                                    }

                                                                    let dataSource= {
                                                                      type: "api",
                                                                      method: "POST",
                                                                      url: "/sm/busiGroupUser/query"
                                                                    };

                                                                    resolveDataSourceCallback(
                                                                        {
                                                                            dataSource:dataSource,eventPayload:{},dataContext:params
                                                                        },
                                                                      function(res){
                                                                        me.setState({dataSource:res.data})
                                                                      },
                                                                      function(){
                                                                      }
                                                                    )
                                                          },
                                                          function(){
                                                          }
                                                        )

                                                  })
                                              });

                                          `
                                      }
                                  },
                                  {
                                      event:'addGroupManagePage.onCancel'
                                  }
                              ]
                              /*behaviors: [
                                  {
                                      type: "request",
                                      dataSource:{
                                          type:'api',
                                          method:'POST',
                                          url:'/sm/busiGroupUser/addList.action',
                                          paramsInQueryString:false,//参数拼在url后面
                                          payloadMapping:[{
                                              from: "dataContext",
                                              to: "@@Array",
                                              key: "gid"
                                          }]
                                      },
                                      successPubs: [
                                          {
                                              event: "@@message.success",
                                              payload:'新增成功!'
                                          },
                                         {
                                              event: "addGroupManagePage.onCancel",
                                          },
                                          {
                                              event: "busigroup.loadData",
                                          }

                                      ],
                                      errorPubs: [
                                          {
                                              event: "@@message.error",
                                              payload:'新增失败!'
                                          }
                                      ]
                                  }
                              ]*/
                          }
                      ]

                  }} />


              </Col>
          </Row>
      </form>
    );
  }
}

GroupManageModal.propTypes = {

};

export default  reduxForm({
    form: "groupManageModal",
})(GroupManageModal);

