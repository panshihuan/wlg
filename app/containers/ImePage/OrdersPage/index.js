import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from '../../../components/AppTable';
import DropdownButton from '../../../components/DropdownButton';
import AppButton from 'components/AppButton';
import ExcelComponent from 'components/Form/UploadField';
import ModalContainer from 'components/ModalContainer'
import OrderArrangeModal from './orderArrangeModal'
import OrderSplitModal from './orderSplitModal'
import OrderMergeModal from './orderMergeModal'
import OrderRepealModal from './orderRepealModal'



export class ImePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderSpit: ''
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    pubsub.subscribe(`orderSplitModal_1.onClick`, (e, d) => {

    })
    pubsub.subscribe(`pageIdxxx0000.openModal`, (e, payload) => {
      this.setState({ orderSpit: payload })
    })
    pubsub.subscribe(`orderSplitModal-tree-1.onCheck`, (e, payload) => {
      console.log('checked:::', payload.checkedKeys)
    })
  }

  componentWillUnmount() {
      pubsub.unsubscribe(`btnSubmit.click`)
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>生产管理</Breadcrumb.Item>
          <Breadcrumb.Item>生产订单</Breadcrumb.Item>
        </Breadcrumb>
        <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
          bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
          <Row>
            <Col span={20} xs={24}>
              <AppButton config={{
                id: "1",
                title: "创建",
                type: "primary",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "1.click",
                    pubs: [
                        {
                          event: "1.expression",//在某个组件上执行表达式
                          meta: {
                            expression: `
                              let dataSource= {
                                type: 'api',
                                method: 'post',
                                url: '/users/addUser',
                              };

                              let parms={
                                name:"xyz6",
                                age:6
                              }

                               resolveDataSourceCallback({dataSource:dataSource,eventPayload:parms},function(ddd){
                                    console.log('ddd:::',ddd)
                                },function(e){
                                  console.log('error:::',e)
                                })

                            `
                          }
                        }
                    ]

                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "2",
                title: "修改",
                type: "primary",
                size: "large",
                visible: true,
                enabled: false,
                subscribes: [
                  {
                        event:"1234567890.onSelectedRows",
                        pubs: [
                          {
                            event: "2.enabled",
                            payload:true
                          }
                        ]
                      },
                      {
                        event:"1234567890.onSelectedRowsClear",
                        pubs: [
                          {
                            event: "2.enabled",
                            payload:false
                          }
                        ]
                      },
                  {
                    event: "2.click",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "1234567890", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            mode: "payload&&eventPayload",
                            payload: {
                              url: "imeOrder/modify"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                    id: "3",
                    title: "删除",
                    type:"primary",
                    size:"large",
                    visible: true,
                    enabled: false,
                    subscribes: [
                      {
                        event:"1234567890.onSelectedRows",
                        pubs: [
                          {
                            event: "3.enabled",
                            payload:true
                          }
                        ]
                      },
                      {
                        event:"1234567890.onSelectedRowsClear",
                        pubs: [
                          {
                            event: "3.enabled",
                            payload:false
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
                             url: "/ime/imePlanOrder/delete.action",
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
                              payload:'删除成功!'
                          },
                             {
                              event: "1234567890.loadData"
                             }
                           ],
                           errorPubs: [
                               {
                                   event: "@@message.error",
                                   payload:'删除失败!'
                               }
                           ]
                         }
                       ]
                      }
                    ]
                  }}>
                  </AppButton>
              <span className="ant-divider" />
              <DropdownButton config={{
                    id: 'orderSplitModal_1',
                    name: '分批',
                    enabled: true,
                    type:"default",
                    size:"large",
                      subscribes: [
                          {
                              event: "orderSplitModal_1.onClick",
                              pubs:[
                                  {
                                      eventPayloadExpression:`
                                        if(eventPayload=="0"){
                                            pubsub.publish("pageIdxxx0000.openModal")
                                        }else if(eventPayload=="1"){
                                            pubsub.publish("pageIdxxx1.openModal")
                                        }else if(eventPayload=="2"){
                                            pubsub.publish("pageIdxxx2.openModal")
                                        }
                                      `
                                  }
                              ]
                          },
                          {
                              event:'1234567890.onSelectedRows',
                              behaviors:[
                                  {
                                      type:'fetch',
                                      id:'1234567890',
                                      data:'selectedRows',
                                      successPubs: [
                                          {
                                              event:'orderSplitModal_1.itemEnabled',
                                              eventPayloadExpression:`
                                              if(eventPayload.length>=2){
                                                callback([{key:"2",enabled:true},{key:"0",enabled:true}])
                                              }else{
                                                callback([{key:"2",enabled:false},{key:"0",enabled:true}])
                                              }


                                              `
                                          }
                                      ]
                                  }
                              ],
                          },
                          {
                            event:'1234567890.onSelectedRowsClear',
                            behaviors:[
                                {
                                    type:'fetch',
                                    id:'1234567890',
                                    data:'selectedRows',
                                    successPubs: [
                                        {
                                            event:'orderSplitModal_1.itemEnabled',
                                            eventPayloadExpression:`
                                                callback([{key:"2",enabled:false},{key:"0",enabled:false}])
                                            `
                                        }
                                    ]
                                }
                            ],
                        }
                      ],
                    dataSource: {
                        type: 'customValue',
                        values: [
                            {key: "0", name: "订单分批" ,"enabled":false},
                            {key: "1", name: "撤销分批"},
                            {key: "2", name: "订单合批","enabled":false},
                        ]

                    },
                    displayField: "name",
                    valueField: "id"
                  }} name="orderSplitModal_1"></DropdownButton>

              <AppButton config={{
                id: "orderArrangeModal_1",
                title: "编排",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "orderArrangeModal_1.click",
                    pubs: [
                      {
                        event: "pageIdxxx3.openModal",
                      }
                    ]
                  }
                ],
              }}>
              </AppButton>

              <DropdownButton config={{
                id: 'orderMergeModal_1',
                name: '下发',
                type: "default",
                size: "large",
                enabled: true,
                dataSource: {
                  type: 'customValue',
                  values: [
                    { key: "0", name: "下发" },
                    { key: "1", name: "撤销下发" },
                  ]

                },
                  subscribes: [
                    {
                      event: "orderMergeModal_1.onClick",
                      pubs:[
                          {
                              eventPayloadExpression:`
                                if(eventPayload=="0"){
                                    pubsub.publish("orderMergeModal_90.openModal")
                                }else if(eventPayload=="1"){
                                    pubsub.publish("orderCanelMergeModal_100.openModal")
                                }
                              `
                          }
                      ]
                  },
                      {
                          event: "orderMergeModal_90.onOk",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource:{
                                              type:'api',
                                              method:'post',
                                              url:'/ime/imePlanOrder/planOrderPublish.action',
                                              paramsInQueryString:false,//参数拼在url后面
                                              bodyExpression:`
                                                if(dataContext != undefined){
                                                  callback({"id":dataContext[0].gid})
                                                }
                                              `
                                          },
                                          successPubs: [
                                              {
                                                  event: "@@message.success",
                                                  eventPayloadExpression:`
                                                  callback("下发成功");
                                              `
                                              },
                                              {
                                                  event: "1234567890.loadData",
                                              }

                                          ],
                                          errorPubs:[
                                            {
                                              event: "@@message.error",
                                              eventPayloadExpression:`
                                              callback(eventPayload)
                                          `
                                            }
                                          ]
                                      }

                          ],

                      },
                      {
                        event: "orderCanelMergeModal_100.onOk",
                        behaviors: [
                            {
                                type: "request",
                                dataSource:{
                                    type:'api',
                                    method:'post',
                                    url:'/ime/imePlanOrder/planOrderCancel.action',
                                    paramsInQueryString:false,//参数拼在url后面
                                    payloadMapping:[{
                                        from: "dataContext",
                                        to: "@@Array",
                                        key: "gid",
                                    }]
                                },
                                successPubs: [
                                    {
                                      event: "@@message.success",
                                      eventPayloadExpression:`
                                      callback("撤销下发成功");
                                      `
                                    },
                                    {
                                        event: "1234567890.loadData",
                                    }

                                ],
                                errorPubs:[
                                  {
                                    event: "@@message.error",
                                    eventPayloadExpression:`
                                    callback(eventPayload)
                                `
                                  }
                                ]
                            }

                ],

                      },
                      {
                        event: "orderMergeModal_90.onCancel"
                    },
                      {
                        event: "orderCanelMergeModal_100.onCancel"
                      },
                      {
                          event: "1234567890.onSelectedRowsClear",
                          pubs: [
                              {
                                event:'orderMergeModal_1.itemEnabled',
                                eventPayloadExpression:`
                                callback([{key:"0",enabled:false},{key:"1",enabled:false}])
                                `
                              }
                          ],
                      },

                      {
                          event: "1234567890.onSelectedRows",
                          pubs: [
                              {
                                event:'orderMergeModal_1.itemEnabled',
                                eventPayloadExpression:`
                                if(eventPayload.length==1){
                                  callback([{key:"0",enabled:true},{key:"1",enabled:true}])
                                }else{
                                  callback([{key:"0",enabled:false},{key:"1",enabled:true}])
                                }
                                
                                `
                              },
                          ],
                      }

                  ],
                displayField: "name",
                valueField: "id"
              }} name="orderMergeModal_1"></DropdownButton>

              <AppButton config={{
                id: "preview_btn",
                title: "预览",
                size: "large",
                visible: true,
                enabled: false,
                subscribes: [
                  {
                    event: "preview_btn.click",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "1234567890", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            mode: "payload&&eventPayload",
                            payload: {
                              url: "imeOrder/preview"
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    event:"1234567890.onSelectedRows",
                    pubs: [
                      {
                        event: "preview_btn.enabled",
                        eventPayloadExpression:`
                            if(eventPayload != undefined){
                              if(eventPayload.length == 1){
                                callback(true)
                              }else{
                                callback(false)
                              }
                            }
                        `
                      }
                    ]
                  },
                  {
                    event:"1234567890.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "preview_btn.enabled",
                        payload:false
                      }
                    ]
                  }
                ],
              }}>
              </AppButton>

                <ExcelComponent config={{
                    id:'upload-2',
                    typeFile:'else',
                    title:'导入',
                    requestUrl:'/ime/imePlanOrder/importPlanOrderList.action',
                    requestName:'file',
                    headers:'',
                    subscribes:[
                        {
                            event:'upload-2.onChange',
                            pubs:[
                                {
                                    event:'upload-2.expression',
                                    meta:{
                                        expression:`
                                        console.log(data.eventPayload)
                                if(data.eventPayload.success){
                                    pubsub.publish('@@message.success',"导入成功!")
                                    pubsub.publish('1234567890.loadData')
                                }else{
                                    let res=data.eventPayload;
                                    if(/\|/.test(res)){
                                        let result=res.split('|')
                                        pubsub.publish('@@notification.error',result)
                                    }else{
                                        pubsub.publish('@@message.error','导入失败!')
                                    }

                                }

                              `
                                    }
                                }
                            ]
                        }
                    ]
                }}>
                </ExcelComponent>


            </Col>
          </Row>
        </Card>
        <Card bordered={true}>


          <AppTable name="1234567890" config={{
            "id": "1234567890",
            "name": "1234567890",
            "type": "checkbox",//表格单选复选类型
            "size": "default",//表格尺寸
            "rowKey": "gid",//主键
            "onLoadData": true,//初始化是否加载数据
            "tableTitle": "订单信息",//表头信息
            "width": 1500,//表格宽度
            "showSerial": true,//是否显示序号
            "editType": true,//是否增加编辑列
            "page": 1,//当前页
            "pageSize": 10,//一页多少条
            "isPager": true,//是否分页
            "isSearch": true,//是否显示模糊查询
            "conditions":[{"dataIndex":"code"},{"dataIndex":"productGidRef.materialGidRef.code"}],
            "columns": [
              { title: '订单编号', width: 100, dataIndex: 'code', key: '1' },
              { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '2' },
              { title: '产品名称', width: 150, dataIndex: 'productGidRef.materialGidRef.name', key: '3' },
              { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '4', width: 150 },
              { title: '计划数量', dataIndex: 'planQty', key: '5', width: 100 },
              { title: '本批数量', dataIndex: 'actualQty', key: '6', width: 100 },
              { title: '计划开始日期', dataIndex: 'planBeginTime', key: '7', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
              { title: '交付日期', dataIndex: 'deliverTime', key: '8', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
              { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '9', width: 150 },
              { title: '订单顺序', dataIndex: 'orderSeq', key: '10', width: 100 },
              { title: '工艺路线', dataIndex: 'productGidRef.routePathRef.name', key: '11', width: 100 },
              { title: '订单类型', dataIndex: 'planOrderTypeGid', key: '12', width: 100 },
              { title: '订单状态', dataIndex: 'orderStatusGid', key: '13', width: 100 },
              { title: '订单BOM状态', dataIndex: 'bomStatusGid', key: '14', width: 100 },
              { title: '订单进程', dataIndex: 'processStatus', key: '15', width: 100 },
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
                          paramsInQueryString: false,//参数拼在url后面
                          url: "/ime/imePlanOrder/delete.action",
                          payloadMapping:[{
                            from: "dataContext",
                            to: "@@Array",
                            key: "gid"
                        }]
                        },
                        successPubs: [
                          {
                            outside:true,
                            event: "@@message.success",
                            payload:'删除成功!'
                        },
                        {
                            outside:true,
                            event: "1234567890.loadData",
                        }
                        ],
                        errorPubs: [
                            {
                                event: "@@message.error",
                                payload:'删除失败!'
                            }
                        ]
                      }
                    ]
                  },


                ]
              }
            ],
              subscribes:[
                  {
                      event:'1234567890.onSelectedRows',
                      pubs:[
                          {
                              event:'orderMergeModal_1.dataContext'
                          }
                      ]
                  },
                  {
                    event:'1234567890.onSelectedRowsClear',
                    pubs:[
                        {
                            event:'orderMergeModal_1.dataContext'
                        }
                    ]
                }
              ],
            dataSource: {
            type: 'api',
              method: 'post',
              pager:true,
              url: '/ime/imePlanOrder/query.action'
            }
          }} />
        </Card>


          <ModalContainer config={{
              visible: false, // 是否可见，必填*
              enabled: true, // 是否启用，必填*
              id: "pageIdxxx0000", // id，必填*
              pageId: "pageIdxxx0000", // 指定是哪个page调用modal，必填*
              type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
              title: "订单分批", // title，不传则不显示title
              closable: true, // 是否显示右上角关闭按钮，默认不显示
              width: "80%", // 宽度，默认520px
              okText: "确定", // ok按钮文字，默认 确定
              cancelText: "取消", // cancel按钮文字，默认 取消
              style: {top: 120}, // style样式
              wrapClassName: "wcd-center", // class样式
              hasFooter: false, // 是否有footer，默认 true
              maskClosable: true, // 点击蒙层是否允许关闭，默认 true
          }}
          >
              <OrderSplitModal config={{
                  id:'OrderSplitModal-secend-config'
              }}>

              </OrderSplitModal>
          </ModalContainer>
          <ModalContainer config={{
              visible: false, // 是否可见，必填*
              enabled: true, // 是否启用，必填*
              id: "pageIdxxx1", // id，必填*
              pageId: "pageIdxxx1", // 指定是哪个page调用modal，必填*
              type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
              title: "撤销分批", // title，不传则不显示title
              closable: true, // 是否显示右上角关闭按钮，默认不显示
              width: "80%", // 宽度，默认520px
              okText: "确定", // ok按钮文字，默认 确定
              cancelText: "取消", // cancel按钮文字，默认 取消
              style: {top: 120}, // style样式
              wrapClassName: "wcd-center", // class样式
              hasFooter: false, // 是否有footer，默认 true
              maskClosable: true, // 点击蒙层是否允许关闭，默认 true
          }}
          >
              <OrderRepealModal/>
          </ModalContainer>
          <ModalContainer config={{
              visible: false, // 是否可见，必填*
              enabled: true, // 是否启用，必填*
              id: "pageIdxxx2", // id，必填*
              pageId: "pageIdxxx2", // 指定是哪个page调用modal，必填*
              type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
              title: "订单合批", // title，不传则不显示title
              closable: true, // 是否显示右上角关闭按钮，默认不显示
              width: "80%", // 宽度，默认520px
              okText: "确定", // ok按钮文字，默认 确定
              cancelText: "取消", // cancel按钮文字，默认 取消
              style: {top: 120}, // style样式
              wrapClassName: "wcd-center", // class样式
              hasFooter: false, // 是否有footer，默认 true
              maskClosable: true, // 点击蒙层是否允许关闭，默认 true
          }}
          >
              <OrderMergeModal/>
          </ModalContainer>
          <ModalContainer config={{
              visible: false, // 是否可见，必填*
              enabled: true, // 是否启用，必填*
              id: "orderArrange", // id，必填*
              pageId: "pageIdxxx3", // 指定是哪个page调用modal，必填*
              type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
              title: "订单编排", // title，不传则不显示title
              closable: true, // 是否显示右上角关闭按钮，默认不显示
              width: "80%", // 宽度，默认520px
              okText: "确定", // ok按钮文字，默认 确定
              cancelText: "取消", // cancel按钮文字，默认 取消
              style: {top: 120}, // style样式
              wrapClassName: "wcd-center", // class样式
              hasFooter: false, // 是否有footer，默认 true
              maskClosable: true, // 点击蒙层是否允许关闭，默认 true
          }}
          >
              <OrderArrangeModal/>
          </ModalContainer>
          <ModalContainer config={{
            visible: false, // 是否可见，必填*
            enabled: true, // 是否启用，必填*
            id: "orderMergeModal_90", // id，必填*
            pageId: "orderMergeModal_90", // 指定是哪个page调用modal，必填*
            type: "confirm", // 默认modal模式，即modal容器，也可选 info success error warning confirm
            title: "订单下发", // title，不传则不显示title
            content: (
              <div>
              <p>下发后将生成生产工单，是否确认？</p>
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
          </ModalContainer>
          <ModalContainer config={{
            visible: false, // 是否可见，必填*
            enabled: true, // 是否启用，必填*
            id: "orderCanelMergeModal_100", // id，必填*
            pageId: "orderCanelMergeModal_100", // 指定是哪个page调用modal，必填*
            type: "confirm", // 默认modal模式，即modal容器，也可选 info success error warning confirm
            title: "订单撤销下发", // title，不传则不显示title
            content: (
              <div>
              <p>是否将订单撤销下发？</p>
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
          </ModalContainer>
      </div>
    );
  }
}

ImePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(ImePage);
