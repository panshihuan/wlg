import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppTable from '../../../components/AppTable';
import TreeField from '../../../components/Form/TreeField';
import AutoCompleteField from '../../../components/Form/AutoCompleteField';
import FindbackField from '../../../components/Form/FindbackField';
import DropdownButton from '../../../components/DropdownButton';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import DispatchOrderCreateModal from './dispatchOrderCreateModal'
import DispatchOrderAllotModal from './dispatchOrderAllotModal'
import DispatchOrderModal from './dispatchOrderModal';
import {
    resolveDataSource,
    publishEvents,
    resolveFetch,
    resolveDataSourceCallback,
    submitValidateForm
} from 'utils/componentUtil'

export class DispatchPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderSpit: ''
    }

      console.log('9999999:::',this.props.location)
      if(this.props.location.state&&this.props.location.state.bigGid){
          let parms= {"query":
              {
                  "query":[
                      {
                          "field":this.props.location.state.bigKey,
                          "type":"eq",
                          "value":this.props.location.state.bigGid,
                          "operator":"and"
                      }
                  ]
              },
              "pager":{
                  "page":1,
                  "pageSize":10
              }
          }
          let dataSource={
              type:'api',
              method:'post',
              url:'/ime/imeTrackOrder/query.action'
          }
          resolveDataSource({dataSource:dataSource,eventPayload:parms}).then(function(data){
              pubsub.publish('dispatchOrder.setData',data)
          })

      }

  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {
    console.log(11111111)

  }



  render() {
    return (
      <div>
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>生产管理</Breadcrumb.Item>
        <Breadcrumb.Item>生产派工单</Breadcrumb.Item>
      </Breadcrumb>
          <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
            <Row >
              <Col>
                <DropdownButton config={{
                  id: 'dispatchOrder-dropDown-1',
                  name: '创建',
                  enabled: true,
                  type: 'primary',
                  dataSource: {
                      type: 'customValue',
                      values: [
                          {key: "0", name: "直接创建","enabled":false},
                          {key: "1", name: "参照生成"},
                      ]

                  },
                    subscribes:[
                        {
                            event:'dispatchOrder-dropDown-1.onClick',
                            pubs:[
                                {
                                    iif:'1',
                                    event:'dispatchOrder-modal-1.openModal'
                                }
                            ]
                        }
                    ],
                  displayField: "name",
                  valueField: "id"
                }} name="drop"></DropdownButton>
                <AppButton config={{
                  id: "dispatchOrder-btn-2",
                  title: "修改",
                  visible: true,
                  enabled: false,
                  type: 'primary',
                    subscribes: [
                        {
                            event:"dispatchOrder.onSelectedRows",
                            pubs: [
                                {
                                    event: "dispatchOrder-btn-2.enabled",
                                    payload:true
                                }
                            ]
                        },
                        {
                            event:"dispatchOrder.onSelectedRowsClear",
                            pubs: [
                                {
                                    event: "dispatchOrder-btn-2.enabled",
                                    payload:false
                                }
                            ]
                        },
                        {
                            event: "dispatchOrder-btn-2.click",
                            behaviors: [
                                {

                                    type: "fetch",
                                    id: "dispatchOrder", //要从哪个组件获取数据
                                    data: "selectedRows",//要从哪个组件的什么属性获取数据
                                    successPubs: [  //获取数据完成后要发送的事件
                                        {
                                            event: "@@navigator.push",
                                            eventPayloadExpression:`
                                              resolveFetch({fetch:{id:'dispatchOrderTree-1'}}).then(function(pd){

                                                if(pd.selectNode){
                                                    localStorage.setItem('AEMG-SARP-001',Object.values(pd.selectNode.nodeMap)[0])
                                                }

                                                let arr;
                                                if(pd.selectNode){
                                                    arr=pd.selectNode.nodeMap
                                                }else{
                                                    arr=localStorage.getItem('AEMG-SARP-001')
                                                }
                                                let gid=Object.values(arr)[0]
                                                let keys=Object.keys(arr)[0]

                                                let obj={
                                                  url:'imeDispatch/detail',
                                                  bigGid:gid,
                                                  bigKey:keys
                                                }
                                                let o=Object.assign(eventPayload[0],obj)
                                                callback(o)

                                              })

                                            `,
                                            // mode: "payload&&eventPayload",
                                            // payload: {
                                            //     url: "imeDispatch/detail"
                                            // }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }}>
                </AppButton>
              <div style={{ height: "20px", borderLeft: "2px solid #ccc" ,display: "inline-block",margin: "0 10px"}}></div>
              <AppButton config={{
                id: "dispatchOrder-btn-3",
                title: "生产派工",
                visible: true,
                enabled: false,
                ghost:true,
                type: "primary",
                subscribes: [

                  {
                    event:"dispatchOrder.onSelectedRows",
                    pubs: [
                      {
                        event: "dispatchOrder-btn-3.enabled",
                        payload:true
                      },
                      {
                        event: "dispatchOrder-btn-3.dataContext"
                      },
                      {
                        event: "dispatchOrder-btn-3.expression",
                        meta: {
                          expression: `
                            (function(){
                              let length = dataContext.length
                              let gid = dataContext[0]["operationGid"]
                              if(length>1){
                                for(var i=0;i<length;i++){
                                  if(dataContext[i]["operationGid"] != gid){
                                    console.log(dataContext[i]["operationGid"])
                                    pubsub.publish('dispatchOrder-btn-3.enabled',false)
                                    return
                                  }else{
                                    pubsub.publish('dispatchOrder-btn-3.enabled',true)
                                  }
                                }
                              }
                            })()
                          `
                        }
                      }
                    ]
                  },
                  {
                    event:"dispatchOrder.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "dispatchOrder-btn-3.enabled",
                        payload:false
                      }
                    ]
                  },
                  {
                    event: "dispatchOrder-btn-3.click",
                    pubs:[
                      {
                        event:"pro-dispatch-modal-page.openModal"
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "dispatchOrder-btn-4",
                title: "资源分配",
                visible: true,
                enabled: false,
                ghost:true,
                type: "primary",
                subscribes: [
                  {
                    event:"dispatchOrder.onSelectedRows",
                    pubs: [
                      {
                        event: "dispatchOrder-btn-4.enabled",
                        payload:true
                      },
                      {
                        event: "dispatchOrder-btn-4.dataContext"
                      }
                    ]
                  },
                  {
                    event:"dispatchOrder.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "dispatchOrder-btn-4.enabled",
                        payload:false
                      }
                    ]
                  },
                  {
                    event: "dispatchOrder-btn-4.click",
                    pubs:[
                      {
                        event:"dispatchOrder-modal-allot.openModal"
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              </Col>
            </Row>
          </Card>

            <Row>
              <Col span={ 7 }>
                <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "700px" }} bodyStyle={{ padding: "15px" }}>
                  <Field config={{
                    id: 'dispatchOrderTree-1',
                    search: false,
                    enabled: true,
                    visible: true,
                    // defaultExpandedKeys: ['0-0-0', '0-0-1'],
                    // defaultSelectedKeys: ['0-0-0', '0-0-1'],
                    // defaultCheckedKeys: ['0-0-0', '0-0-1'],
                    checkable: false,
                    showLine: true,
                    draggable: false,
                    searchBoxWidth: 300,
                    dataSource: {
                      type: "api",
                      method: "POST",
                      url: '/ime/imeTrackOrder/getTrackOrderQueryTree.action'
                      //   [
                      //   {"key": "0-1","title": "0-1","id":"0-1","pid":null},
                      //   {"key": "0-1-0","title": "0-1-0","id":"0-1-0","pid":"0-1"},
                      //   {"key": "0-2","title": "0-2","id":"0-2","pid":null},
                      //   {"key": "0-2-0","title": "0-2-0","id":"0-2-0","pid":"0-2"},
                      //   {"key": "0-0","title": "0-0","id":"0-0","pid":null},
                      //   {"key": "0-0-0","id":"0-0-0","pid":"0-0","title": "0-0-0"},
                      //   {"key": "0-0-1","id":"0-0-1","pid":"0-0","title": "0-0-1"},
                      //   {"id":"0-0-0-0","pid":"0-0-0","key": "0-0-0-0","title": "0-0-0-0"},
                      //   {"id":"0-0-0-1","pid":"0-0-0","key": "0-0-0-1","title": "0-0-0-1"},
                      //   {"key": "0-0-1-0","id":"0-0-1-0","pid":"0-0-1","title": "0-0-1-0"}
                      // ]
                    },
                    // subscribes: [
                    //   {
                    //     event:'dispatchOrder.onSelectedRows',
                    //     behaviors: [
                    //       {
                    //         type: "request",
                    //         dataSource: {
                    //           type: "api",
                    //           method: "POST",
                    //           paramsInQueryString: true,//参数拼在url后面
                    //           url: "/ime/imeTrackOrder/getTeamPersonTree",
                    //           payloadMapping: [{
                    //             from: "gid",
                    //             to: "id"
                    //           }]
                    //         },
                    //         successPubs: [
                    //           {
                    //             outside: true,
                    //             event: "tree.loadData"
                    //           }
                    //         ]
                    //       }
                    //     ]
                    //   },
                    //   {
                    //     event:"dispatchOrder.onSelectedRowsClear",
                    //     behaviors: [
                    //       {
                    //         type: "request",
                    //         dataSource: {
                    //           type: "api",
                    //           method: "POST",
                    //           url: "/ime/imeTrackOrder/getTrackOrderQueryTree",
                    //
                    //         },
                    //         successPubs: [
                    //           {
                    //             outside: true,
                    //             event: "tree.loadData"
                    //           }
                    //         ]
                    //       }
                    //
                    //     ]
                    //   },
                    // ]
                  }} name="tree"  component={ TreeField } />
                </Card>
              </Col>
              <Col span={1}>


              </Col>

              <Col span={ 16 }>
                <Card bordered={true} style={{ marginTop: "20px" }}>
                <AppTable name="dispatchOrder" config={{
                  "id": "dispatchOrder",
                  "name": "dispatchOrder",
                  "type": "checkbox",//表格单选复选类型
                  "size": "default",//表格尺寸
                  "rowKey": "gid",//主键
                  "onLoadData": false,//初始化是否加载数据
                  "tableTitle": "生产派工",//表头信息
                  "width": 3300,//表格宽度
                  "showSerial": true,//是否显示序号
                  "editType": true,//是否增加编辑列
                  "page": 1,//当前页
                  "pageSize": 10,//一页多少条
                  "isPager": true,//是否分页
                  "conditions":[{"dataIndex":"code"},{"dataIndex":"imeWorkOrderGidRef.code"}],
                  "isSearch": true,//是否显示模糊查询
                  "columns": [
                    { title: '来源工单', width: 150, dataIndex: 'imeWorkOrderGidRef.code', key: '1' },
                    { title: '产品编号', width: 150, dataIndex: 'mdProductInfoGidRef.materialGidRef.code', key: '2' },
                    { title: '派工单号', width: 150, dataIndex: 'code', key: '3' ,columnsType: {"type": "link", url: "imeDispatch/detail"}},
                    { title: '工序编号', width: 150, dataIndex: 'operationCode', key: '4' },
                    { title: '工作单元', width: 150, dataIndex: 'mdFactoryWorkUnitGidRef.workUnitCode', key: '5' },
                    { title: '工位编号', width: 150, dataIndex: 'mdFactoryWorkStationGidRef.stationCode', key: '6' },
                    { title: '设备编号', width: 100, dataIndex: '', key: '7' },
                    { title: '派工对象', width: 100, dataIndex: '', key: '8' },
                    { title: '接收人员', width: 150, dataIndex: 'receivePersonnelGidRef.personnelCode', key: '9' },
                    { title: '开工人员', width: 150, dataIndex: 'startPersonnelGidRef.personnelCode', key: '10' },
                    { title: '完工人员', width: 150, dataIndex: 'finishPersonnelGidRef.personnelCode', key: '11' },
                    { title: '委外类型', width: 150, dataIndex: 'delegateTypeGid', key: '12' },
                    { title: '优先级别', width: 150, dataIndex: 'priorityLevelGid', key: '13' },
                    { title: '计划数量', width: 150, dataIndex: 'planQty', key: '14' },
                    { title: '计划开始时间', width: 200, dataIndex: 'planBeginTime', key: '15' },
                    { title: '计划完成时间', width: 200, dataIndex: 'planEndTime', key: '16' },
                    { title: '测算开始时间', width: 200, dataIndex: 'calculateBeginTime', key: '17' },
                    { title: '测算结束时间', width: 200, dataIndex: 'calculateEndTime', key: '18' },
                    { title: '实际开始时间', width: 200, dataIndex: 'actualBeginTime', key: '19' },
                    { title: '实际完成时间', width: 200, dataIndex: 'actualEndTime', key: '20' },
                    { title: '完工数量', width: 150, dataIndex: 'finiahQty', key: '21' },
                    { title: '派工单状态', width: 150, dataIndex: 'trackOrderStatus', key: '22' }

                  ],
                  subscribes: [
                      {
                        event:'dispatchOrderTree-1.onSelect',
                        pubs: [
                          {

                            event: "dispatchOrder.expression",//在某个组件上执行表达式
                            meta: {
                              expression: `
                                let nodeMap = data.eventPayload.info.node.props['data-item'].nodeMap;
                                let query =[];
                                let count = 0;
                                var array = Object.entries(nodeMap);
                                let fixConditions = {
                                  field:"trackOrderStatus",
                                  type:"le",
                                  value:"40",
                                  operator:"and",
                                  left:"("
                                }
                                query.push(fixConditions)
                                // console.log(array);

                                for(let i = 0;i< array.length;i++){
                                  let conditions = {};
                                  if (i == array.length-1) {
                                    conditions["right"] = ")";
                                    conditions["field"] = array[i][0];
                                    conditions["type"] = "eq";
                                    conditions["value"] = array[i][1];
                                    conditions["operator"] = "and";
                                  } else {
                                    conditions["field"] = array[i][0];
                                    conditions["type"] = "eq";
                                    conditions["value"] = array[i][1];
                                    conditions["operator"] = "and";
                                  }
                                  query.push(conditions);
                                };

                                let params = {
                                  "query":{
                                    "query":query
                                  },
                                  "pager":{"page":1,"pageSize":10}
                                };

                                pubsub.publish("dispatchOrder.loadData",params);
                                `
                            }
                          }
                        ]
                        // pubs: [
                        //   {
                        //     event: "dispatchOrder.loadData",
                        //     payload:{
                        //       "query":{
                        //         "query":[
                        //           {
                        //             "left":"(",
                        //             "field":"code",
                        //             "type":"eq",
                        //             "value":"002",
                        //             "right":")",
                        //             "operator":"and"
                        //           }
                        //         ],
                        //         "sorted":"gid asc"
                        //       },
                        //       "pager":{
                        //         "page":"1",
                        //         "pageSize":"3"
                        //       }
                        //     }
                        //   }
                        // ]
                      }
                  ],
                  rowOperationItem: [
                    {
                      id: "delBtn",
                      type: "linkButton",
                      title: "删除",
                      subscribes: [
                        {
                          event: "delBtn.click",
                          behaviors: [
                            {
                              type: "request",

                              dataSource: {
                                type: "api",
                                method: "POST",
                                // paramsInQueryString: true,//参数拼在url后面
                                url: "/ime/imeTrackOrder/delete.action",
                                // {ids:[1,2,3]}
                                payloadMapping: [{
                                  from:"dataContext",
                                  to:"@@Array",
                                  key:'gid',
                                  // paramKey:"ids"
                                }]
                              },
                              successPubs: [
                                  {
                                    outside:true,
                                    event: "@@message.success",
                                    payload:'删除成功!'
                                  },
                                  {
                                    outside: true,
                                    event: "dispatchOrder.loadData"
                                  }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  dataSource: {
                    type: "api",
                    pager:false,
                    method: "POST",
                    url: "/ime/imeTrackOrder/query.action"
                    // type:"customValue",
                    // method: "get",
                    // values: [
                    //   { gid: "1",mdProductInfoGid: "11111111",code: "1234" }
                    // ]
                  },
                }} />
                </Card>
              </Col>
            </Row>
        {/*生产派工*/}
        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "pro-dispatch-modal", // id，必填*
          pageId: "pro-dispatch-modal-page", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          title: "生产派工", // title，不传则不显示title
          closable: true, // 是否显示右上角关闭按钮，默认不显示
          width: 400, // 宽度，默认520px
          style: {top: 120}, // style样式
          hasFooter: false, // 是否有footer，默认 true
          maskClosable: false, // 点击蒙层是否允许关闭，默认 true
        }}
        >
          <DispatchOrderModal/>
        </ModalContainer>

          {/*参照生产Modal*/}
        <ModalContainer config={{
            visible: false, // 是否可见，必填*
            enabled: true, // 是否启用，必填*
            id: "dispatchOrder-modal-1", // id，必填*
            pageId: "dispatchOrder-modal-1", // 指定是哪个page调用modal，必填*
            type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
            title: "参照工单", // title，不传则不显示title
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
          <DispatchOrderCreateModal/>
        </ModalContainer>

        {/*资源分配*/}
        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "dispatchOrder-modal-allot", // id，必填*
          pageId: "dispatchOrder-modal-allot", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          title: "资源分配", // title，不传则不显示title
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
          <DispatchOrderAllotModal/>
        </ModalContainer>

        </div>
    );
  }
}

DispatchPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};



export default reduxForm({
  form: "DispatchPage",
})(DispatchPage)
