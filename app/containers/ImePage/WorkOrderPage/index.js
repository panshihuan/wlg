import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from '../../../components/AppTable';
import DropdownButton from '../../../components/DropdownButton';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import WorkOrderArrangeModal from './workOrderArrangeModal'
import WorkOrderSplitModal from './workOrderSplitModal'//分批
import WorkOrderMergeModal from './workOrderMergeModal'//合批
import WorkOrderRepealModal from './workOrderRepealModal'//撤销分批
import ExcelComponent from 'components/Form/UploadField';

export class WorkOrderPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderSpit: ''
    }
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
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>生产管理</Breadcrumb.Item>
          <Breadcrumb.Item>生产工单</Breadcrumb.Item>
        </Breadcrumb>
        <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
          bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
          <Row>
            <Col span={14} xs={24}>
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
                        event: "@@navigator.push",
                        payload: {
                          url: "imeWorkOrder/detail"
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
                enabled: true,
                subscribes: [
                  {
                        event:"zxcvbnmasdfgh.onSelectedRows",
                        behaviors:[
                          {
                              type:'fetch',
                              id:'zxcvbnmasdfgh',
                              data:'selectedRows',
                              successPubs: [
                                  {
                                      event:'2.enabled',
                                      eventPayloadExpression:`
                                      if(eventPayload.length>=2){
                                        callback(false)
                                      }else{
                                        callback(true)
                                      }
                                      `
                                  }
                              ]
                          }
                        ]
                      },
                      {
                        event:"zxcvbnmasdfgh.onSelectedRowsClear",
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
                        id: "zxcvbnmasdfgh", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            mode: "payload&&eventPayload",
                            payload: {
                              url: "imeWorkOrder/modify"
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
                        event:"zxcvbnmasdfgh.onSelectedRows",
                        pubs: [
                          {
                            event: "3.enabled",
                            payload:true
                          }
                        ]
                      },
                      {
                        event:"zxcvbnmasdfgh.onSelectedRowsClear",
                        pubs: [
                          {
                            event: "3.enabled",
                            payload:false
                          }
                        ]
                      },
                      {
                        event: "zxcvbnmasdfgh.onSelectedRows",
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
                             url: "/ime/imeWorkOrder/delete.action",
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
                              event: "zxcvbnmasdfgh.loadData",
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
                    id: 'workOrderSplitModal_1',
                    name: '分批',
                    enabled: true,
                    type:"default",
                    size:"large",
                      subscribes: [
                          {
                              event: "workOrderSplitModal_1.onClick",
                              pubs:[
                                {
                                    eventPayloadExpression:`
                                      if(eventPayload=="0"){
                                          pubsub.publish("split01.openModal")
                                      }else if(eventPayload=="1"){
                                          pubsub.publish("repeal01.openModal")
                                      }else if(eventPayload=="2"){
                                          pubsub.publish("merge01.openModal")
                                      }
                                    `
                                }
                            ]
                          },
                          {
                              event:'zxcvbnmasdfgh.onSelectedRows',
                              behaviors:[
                                  {
                                      type:'fetch',
                                      id:'zxcvbnmasdfgh',
                                      data:'selectedRows',
                                      successPubs: [
                                          {
                                              event:'workOrderSplitModal_1.itemEnabled',
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
                            event:'zxcvbnmasdfgh.onSelectedRowsClear',
                            behaviors:[
                                {
                                    type:'fetch',
                                    id:'zxcvbnmasdfgh',
                                    data:'selectedRows',
                                    successPubs: [
                                        {
                                            event:'workOrderSplitModal_1.itemEnabled',
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
                            {key: "0", name: "工单分批","enabled":false},
                            {key: "1", name: "撤销分批"},
                            {key: "2", name: "工单合批","enabled":false},
                        ]

                    },
                    displayField: "name",
                    valueField: "id"
                  }} name="drop"></DropdownButton>

              <AppButton config={{
                id: "workOrderArrangeModal_1",
                title: "编排",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "workOrderArrangeModal_1.click",
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
                id: 'workOrderIssued',
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
                      event: "zxcvbnmasdfgh.onSelectedRows",
                      pubs: [
                        {
                          event: "workOrderIssued.dataContext"
                        }
                      ]
                    },
                    {
                      event: "workOrderIssued.onClick",
                      pubs:[
                          {
                              eventPayloadExpression:`
                                if(eventPayload=="0"){
                                    pubsub.publish("workOrderMergeModal_90.openModal")
                                }else if(eventPayload=="1"){
                                    pubsub.publish("workOrderCanelMergeModal_100.openModal")
                                }
                              `
                          }
                      ]
                  },
                      {
                          event: "workOrderMergeModal_90.onOk",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource:{
                                              type:'api',
                                              method:'post',
                                              url:'/ime/imeWorkOrder/workOrderPublish.action',
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
                                                  event: "zxcvbnmasdfgh.loadData",
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
                        event: "workOrderCanelMergeModal_100.onOk",
                        behaviors: [
                            {
                                type: "request",
                                dataSource:{
                                    type:'api',
                                    method:'post',
                                    url:'/ime/imeWorkOrder/workOrderCancel.action',
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
                                        event: "zxcvbnmasdfgh.loadData",
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
                        event: "workOrderwMergeModal_90.onCancel"
                    },
                      {
                        event: "workOrderCanelMergeModal_100.onCancel"
                      },
                      {
                          event: "zxcvbnmasdfgh.onSelectedRowsClear",
                          pubs: [
                              {
                                event:'workOrderIssued.itemEnabled',
                                eventPayloadExpression:`
                                callback([{key:"0",enabled:false},{key:"1",enabled:false}])
                                `
                              }
                          ],
                      },

                      {
                          event: "zxcvbnmasdfgh.onSelectedRows",
                          pubs: [
                              {
                                event:'workOrderIssued.itemEnabled',
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
              }} name="drop"></DropdownButton>
              <AppButton config={{
                id: "gongdanshu",
                title: "工单树",
                type:"primary",
                size:"large",
                visible: true,
                enabled: false,
                subscribes: [
                  {
                    event:"zxcvbnmasdfgh.onSelectedRows",
                    pubs: [
                      {
                        event: "gongdanshu.enabled",
                        payload:true
                      }
                    ]
                  },
                  {
                    event:"zxcvbnmasdfgh.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "gongdanshu.enabled",
                        payload:false
                      }
                    ]
                  },
                  {
                    event: "zxcvbnmasdfgh.onSelectedRows",
                    pubs: [
                      {
                        event: "gongdanshu.dataContext"
                      }
                    ]
                  },
                  {
                    event: "gongdanshu.click",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "zxcvbnmasdfgh", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            mode: "payload&&eventPayload",
                            payload: {
                              url: "imeWorkOrder/workOrderTree"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
                <ExcelComponent config={{
                    id:'upload-2',
                    typeFile:'else',
                    title:'导入',
                    requestUrl:'/ime/imeWorkOrder/importWorkOrderList.action',
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
                                    pubsub.publish('zxcvbnmasdfgh.loadData')
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
          <AppTable name="zxcvbnmasdfgh" config={{
            "id": "zxcvbnmasdfgh",
            "name": "zxcvbnmasdfgh",
            "type": "checkbox",//表格单选复选类型
            "size": "default",//表格尺寸
            "rowKey": "gid",//主键
            "onLoadData": true,//初始化是否加载数据
            "tableTitle": "工单信息",//表头信息
            "width": 1800,//表格宽度
            "showSerial": true,//是否显示序号
            "editType": true,//是否增加编辑列
            "page": 1,//当前页
            "pageSize": 10,//一页多少条
            "isPager": true,//是否分页
            "conditions":[{"dataIndex":"code"},{"dataIndex":"planOrderGidRef.code"}],
            "isSearch": true,//是否显示模糊查询
            "columns": [
              { title: '来源订单', width: 100, dataIndex: 'planOrderGidRef.code', key: '1' },
              { title: '工单编号', width: 100, dataIndex: 'code', key: '2' },
              { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '3' },
              { title: '产品名称', dataIndex: 'productGidRef.materialGidRef.name', key: '4', width: 100 },
              { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '5', width: 100 },
              { title: '计划数量', dataIndex: 'planQty', key: '6', width: 100 },
              { title: '本批数量', dataIndex: 'actualQty', key: '7', width: 100 },
              { title: '计划开始日期', dataIndex: 'workOrderBeginTime', key: '8', width: 100 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
              { title: '交付日期', dataIndex: 'deliverTime', key: '9', width: 100 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
              { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '10', width: 100 },
              { title: '产线', dataIndex: 'productionLineGidRef.lineName', key: '11', width: 100 },
              { title: '工单顺序', dataIndex: 'workOrderSeq', key: '12', width: 100 },
              { title: '工艺路线', dataIndex: 'routeGidRef.name', key: '13', width: 100 },
              { title: '工单类型', dataIndex: 'workOrderTypeGid', key: '14', width: 100 },
              { title: '工单状态', dataIndex: 'workOrderStatusGid', key: '15', width: 100 },
              { title: '工单BOM状态', dataIndex: 'workOrderBomStatusGid', key: '16', width: 100 }
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
                          url: "/ime/imeWorkOrder/delete.action",
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
                            event: "zxcvbnmasdfgh.loadData",
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
              }
            ],
            dataSource: {
              type: 'api',
              method: 'post',
              pager:true,
              url: '/ime/imeWorkOrder/query.action'
            }
          }} />
        </Card>

        <ModalContainer config={{
            visible: false, // 是否可见，必填*
            enabled: true, // 是否启用，必填*
            id: "workOrderArrange", // id，必填*
            pageId: "pageIdxxx3", // 指定是哪个page调用modal，必填*
            type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
            title: "工单编排", // title，不传则不显示title
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
            <WorkOrderArrangeModal/>
        </ModalContainer>
        
        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "workOrderSplit", // id，必填*
          pageId: "split01", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          title: "工单分批", // title，不传则不显示title
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
          <WorkOrderSplitModal/>
      </ModalContainer>

      <ModalContainer config={{
        visible: false, // 是否可见，必填*
        enabled: true, // 是否启用，必填*
        id: "workOrderRepeal", // id，必填*
        pageId: "repeal01", // 指定是哪个page调用modal，必填*
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
        <WorkOrderRepealModal/>
    </ModalContainer>
    <ModalContainer config={{
      visible: false, // 是否可见，必填*
      enabled: true, // 是否启用，必填*
      id: "workOrderMerge", // id，必填*
      pageId: "merge01", // 指定是哪个page调用modal，必填*
      type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
      title: "工单合批", // title，不传则不显示title
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
      <WorkOrderMergeModal/>
    </ModalContainer>
    <ModalContainer config={{
      visible: false, // 是否可见，必填*
      enabled: true, // 是否启用，必填*
      id: "workOrderMergeModal_90", // id，必填*
      pageId: "workOrderMergeModal_90", // 指定是哪个page调用modal，必填*
      type: "confirm", // 默认modal模式，即modal容器，也可选 info success error warning confirm
      title: "工单下发", // title，不传则不显示title
      content: (
        <div>
        <p>下发后将生成生产派工单，是否确认？</p>
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
      id: "workOrderCanelMergeModal_100", // id，必填*
      pageId: "workOrderCanelMergeModal_100", // 指定是哪个page调用modal，必填*
      type: "confirm", // 默认modal模式，即modal容器，也可选 info success error warning confirm
      title: "工单撤销下发", // title，不传则不显示title
      content: (
        <div>
        <p>是否将工单撤销下发？</p>
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

WorkOrderPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(WorkOrderPage);
