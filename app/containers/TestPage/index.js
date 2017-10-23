import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb} from 'antd';
import pubsub from 'pubsub-js'
import {Link} from 'react-router';
import AppTable from '../../components/AppTable';
import AppButton from 'components/AppButton'

export class TestPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  componentDidMount() {
    pubsub.subscribe(`1234567890.onSelectedRows`, (e, d) => {
      console.log(d)
    })
  }

  componentWillUnmount() {
    pubsub.unsubscribe('1234567890.onSelectRows')
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>ayaan</Breadcrumb.Item>
        </Breadcrumb>
        <AppTable name="1234567890" config={{
          "id": "1234567890",
          "name": "1234567890",
          "type": "checkbox",//表格单选复选类型
          "size": "default",//表格尺寸
          "rowKey": "gid",//主键
          "onLoadData": false,//初始化是否加载数据
          "tableTitle": "人员信息",//表头信息
          "editType": true,
          "showSerial":false,
          "isPager": false,//是否分页
          "isUpdown": true,//是否显示需要上下移的按钮
          "isSelectable":true,
          "isSearch": true,
          "columns": [
            {title: '姓名', width: 150, dataIndex: 'name', key: '1'},
            {title: '年龄', width: 150, dataIndex: 'age', key: '2'},
            {title: '地址', dataIndex: 'address', key: '3', width: 150,columnsType:{"type":"link","url":"/uploadPage",expression:`console.log(eventPayload,"1231321");let param ={a:123}; callback(param);`}},
            {title: '性别', dataIndex: 'isFlag', key: '4', width: 150,columnsType:{"type":"replace","text":{true:"男",false:"女"}}},
            {title: 'Column 3', dataIndex: 'name', key: '5', width: 150},
            {title: 'Column 4', dataIndex: 'name', key: '6', width: 150},
            {title: 'Column 5', dataIndex: 'name', key: '7', width: 150},
            {title: 'Column 6', dataIndex: 'name', key: '8', width: 150},
            {title: 'Column 7', dataIndex: 'name', key: '9', width: 150},
            {title: 'Column 8', dataIndex: 'name', key: '10', width: 150,columnsType:{"type":"date","format":"yyyy-MM-dd"}},//错误时间的转换
            {title: '时间', dataIndex: 'date', key: '11', width: 150, columnsType:{"type":"date","format":"yyyy-MM-dd"}}//正确时间转换
          ],
          rowOperationItem: [
            {
              id: "23456789009865",
              type: "linkButton",
              title: "删除",
              subscribes: [
                {
                  event: "23456789009865.click",

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
            },
            {
              id: "asdasdasdasdasdasd",
              type: "linkButton",
              title: "新增",
              subscribes: [
                {
                  event: "asdasdasdasdasdasd.click",
                }
              ]
            }
          ],
          dataSource: {
            type: 'api',
            method: 'post',
            mode: "payload",//参数存在的位置
            url: '/api/table.json',
            payload: {name: "ewueiwue"}
          },
          subscribes:[
            {
              event:"1234567890.onClickRow",
              behaviors: [
                {
                  type: "request",
                  dataSource: {
                    type: "api",
                    method: "POST",
                    url: "/api/ddd.json",
                    bodyExpression:`
                      console.log(eventPayload);
                      callback(eventPayload);
                    `
                  },
                }
              ]
            }
          ]
        }}/>
        <AppButton config={{
          id: "7777777",
          title: "显示表格数据",
          type: "primary",
          size: "large",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event:"7777777.click",
              pubs: [
                {
                  event: "1234567890.expression",//在某个组件上执行表达式
                  meta: {
                    expression: `
                    console.log(me.state.dataSource); 
                    `
                  }
                }
              ]
            }
          ]
        }}>
        </AppButton>
        <AppButton config={{
          id: "3",
          title: "测试参数",
          type: "primary",
          size: "large",
          visible: true,
          enabled: false,
          subscribes: [
            {
              event: "1234567890.onSelectedRows",
              pubs: [
                {
                  event: "3.enabled",
                  payload: true
                }
              ]
            },
            {
              event: "1234567890.onSelectedRowsClear",
              pubs: [
                {
                  event: "3.enabled",
                  payload: false
                }
              ]
            },
            {
              event: "1234567890.onSelectedRows",
              pubs: [
                {
                  event: "3.dataContext"
                }
              ]
            },
            {
              event: "3.click",
              behaviors: [
                {
                  type: "request",
                  dataSource: {
                    type: "api",
                    method: "POST",
                    url: "/ime/imePlanOrder/delete",
                    paramsInQueryString: true,//参数拼在url后面
                    mode: "dataContext",
                    toParamType: '@@Array',//api接口请求出去的参数类型
                    paramKey: "id",//参数名
                    payloadMapping: [{
                      from: "gid",
                      to: "id"
                    },
                      {
                        from: "code",
                        to: "code1"
                      }]
                  },
                  successPubs: [
                    {
                      event: "1234567890.loadData"
                    }
                  ]
                }
              ]
            }
          ]
        }}>
        </AppButton>
        <AppButton config={{
          id: "1",
          title: "测试加载数据",
          visible: true,
          enabled: true,
          subscribes: [
            {
              event: "1.click",
              pubs: [
                {
                  event: "1234567890.loadData"
                }
              ]
            }
          ]
        }}>
        </AppButton>

        <AppButton config={{
          id: "1dkjdksjksdkj233",
          title: "删除",
          subscribes: [
            {
              event: "1234567890.onSelectedRows",
              pubs: [
                {
                  event: "1dkjdksjksdkj233.dataContext"
                }
              ]
            },
            {
              event: "1dkjdksjksdkj233.click",

              behaviors: [
                {
                  type: "request",
                  dataSource: {
                    type: "api",
                    method: "POST",
                    url: "/api/ddd.json",
                    payloadMapping: [
                      {
                        from: "dataContext",
                        to: "@@Array",
                        key: "gid"
                      }
                    ]
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
        <AppButton config={{
          id: "FetchBehaviorDemo",
          title: "获取行为案例",
          subscribes: [
            {
              event: "FetchBehaviorDemo.click",
              behaviors: [
                {
                  type: "fetch",
                  id: "1234567890", //要从哪个组件获取数据
                  data: "selectedRows",//要从哪个组件的什么属性获取数据
                  successPubs: [  //获取数据完成后要发送的事件
                    {
                      event: "1.enabled"
                    }
                  ]
                }
              ]
            }
          ]
        }}>
        </AppButton>
        <AppButton config={{
          id: "setDataDemo",
          title: "设置表数据",
          subscribes: [
            {
              event: "setDataDemo.click",
              behaviors: [
                {
                  type: "fetch",
                  id: "1234567890", //要从哪个组件获取数据
                  data: "selectedRows",//要从哪个组件的什么属性获取数据
                  successPubs: [  //获取数据完成后要发送的事件
                    {
                      event: "1234567890.setData"
                    }
                  ]
                }
              ]
            }
          ]
        }}>
        </AppButton>

        <AppButton config={{
          id: "expressionDemo",
          title: "自定义表达式",
          subscribes: [
            {
              event: "1234567890.onSelectedRows",

              pubs: [
                {
                  event: "expressionDemo.expression",//在某个组件上执行表达式
                  meta: {
                    expression: `
                    console.log(me); //me是expressionDemo组件的引用
                    console.log(data) //data表示事件带过来的数据
                    console.log(_.find)
                    `
                  }
                }
              ]
            }
          ]
        }}>
        </AppButton>

        <AppButton config={{
          id: "1dkjdksjksdkj2333",
          title: "bodyExpression",
          subscribes: [
            {
              event: "1234567890.onSelectedRows",
              pubs: [
                {
                  event: "1dkjdksjksdkj2333.dataContext"
                }
              ]
            },
            {
              event: "1dkjdksjksdkj2333.click",
              pubs: [
                {
                  //用来自定义事件传递的eventPayload
                  eventPayloadExpression: `
                    console.log("dataContext1",dataContext)
                    console.log("eventPayload1",eventPayload)
                    callback("成功消息")
                    `,
                  event: "@@message.success",
                }
              ],


              behaviors: [
                {
                  type: "request",
                  dataSource: {
                    type: "api",
                    method: "POST",
                    payload: {
                      a: 1
                    },
                    url: "/api/ddd.json",
                    bodyExpression: `
                    console.log("dataContext",dataContext)
                      console.log("eventPayload",eventPayload)
                         console.log("dataSource",dataSource)
                    callback({isdsdsd:dataContext,dd:dataSource.payload})

                    `
                  },
                  successPubs: [
                    {

                      event: "1.enabled",
                      eventPayloadExpression: `
                    console.log("dataContext2",dataContext)
                    console.log("eventPayload2",eventPayload)
                    callback(false)
                    `,
                    }
                  ]


                }
              ]
            }
          ]
        }}>
        </AppButton>


        <AppTable name="0987654321" config={{
          "id": "0987654321",
          "name": "0987654321",
          "type": "checkbox",//表格单选复选类型
          "size": "default",//表格尺寸
          "rowKey": "gid",//主键
          "onLoadData": false,//初始化是否加载数据
          "tableTitle": "订单信息",//表头信息
          "width": 200,
          "showSerial": true,
          "editType": true,
          "page": 1,//当前页
          "pageSize": 10,//一页多少条
          "isPager": true,//是否分页
          "columns": [
            {title: '订单类型', dataIndex: 'planOrderTypeGid', key: '12', width: 100}
          ],
          rowOperationItem: [
            {
              id: "23456789009865",
              type: "linkButton",
              title: "删除",
              subscribes: [
                {
                  event: "23456789009865.click",

                  /* behaviors: [
                    {
                      type: "request",
                      dataSource: {
                        type: "api",
                        method: "POST",
                        url: "/api/ddd.json",
                        payloadMapping:[{
                          from:"gid",
                          to:"id"
                        }]
                      },
                      successPubs: [
                        {
                          event: "1.enabled",
                          payload: false
                        }
                      ]
                    }
                  ] */
                }
              ]
            }
          ],
          dataSource: {
            type: 'api',
            method: 'post',
            mode: "payload",
            url: '/ime/imePlanOrder/query.action'
          }
        }}/>
        <span>-----------------------------------表格传参数的四种情况---------------------------------------</span>
        <AppTable name="0987654321" config={{
          "id": "0987654321",
          "name": "0987654321",
          "type": "checkbox",//表格单选复选类型
          "size": "default",//表格尺寸
          "rowKey": "gid",//主键
          "onLoadData": true,//初始化是否加载数据
          "tableTitle": "测试表格",//表头信息
          "width": 200,
          "showSerial": true,
          "editType": true,
          "page": 1,//当前页
          "pageSize": 10,//一页多少条
          "isPager": true,//是否分页
          "columns": [
            {title: '姓名', width: 150, dataIndex: 'name', key: '1'},
            {title: '年龄', width: 150, dataIndex: 'age', key: '2'},
            {title: '地址', dataIndex: 'address', key: '3', width: 150,columnsType:{"type":"link","url":"/uploadPage"}},
            {title: '性别', dataIndex: 'isFlag', key: '4', width: 150,columnsType:{"type":"replace","text":{true:"男",false:"女"}}},
            {title: '时间', dataIndex: 'date', key: '11', width: 150, columnsType:{"type":"date","format":"yyyy-MM-dd"}}//正确时间转换
          ],
          dataSource: {
            type: 'api',
            method: 'post',
            url: '/api/table.json',
            pager:true,
            isQuery:true,
            payload: {
              "query": {
                "query": [
                  {
                    "field": "deliveryType", "type": "eq", "value": "ANT"
                  }
                ],
              }
            }
          }
        }}/>
      </div>
    );
  }
}

TestPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(TestPage);
