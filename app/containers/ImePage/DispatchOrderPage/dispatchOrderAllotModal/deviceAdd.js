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

export class DeviceAdd extends React.PureComponent {
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
        <AppTable name="deviceAddTable" config={{
          "id": "deviceAdd-table",
          "name": "deviceAdd-table",
          "type": "checkbox",//表格单选复选类型
          "size": "default",//表格尺寸
          "rowKey": "gid",//主键
          "onLoadData": false,//初始化是否加载数据
          "tableTitle": "",//表头信息
          "width": 100,//表格宽度
          "showSerial": true,//是否显示序号
          "editType": false,//是否增加编辑列
          "page": 1,//当前页
          "pageSize": 10,//一页多少条
          "isPager": true,//是否分页
          "isSearch": false,//是否显示模糊查询
          "columns": [
            { title: '设备编码', width: 100, dataIndex: 'code', key: '1' },
            { title: '设备名称', width: 100, dataIndex: 'name', key: '2' },
            { title: '设备型号', width: 100, dataIndex: 'model', key: '3' },
            { title: '设备规格', dataIndex: 'spec', key: '4', width: 100 },
            { title: '设备类型', dataIndex: 'mdEquipmentTypeGidRef.name', key: '5', width: 100 },
            { title: '计量单位', dataIndex: 'mdMeasurementUnitGidRef.name', key: '6', width: 100 },
            { title: '设备状态', dataIndex: 'status', key: '7', width: 100 },
            { title: '设备序列号', dataIndex: 'serialNo', key: '8', width: 100 }
          ],
          dataSource: {
            type: 'api',
            method: 'post',
            mode:"eventPayload",
            pager:true,
            url: '/ime/imeTrackOrder/getEquipmentInfoByParams.action',
            bodyExpression:`
              let routeGid = eventPayload[0]['imeWorkOrderGidRef']['routeGid']
              resolveFetch({fetch:{id:"AllotModal-device-add",data:"dataContext"}}).then(function (data) {
                let equipmentGids = []
                if(data && data.length>0){
                  for(let i = 0;i<data.length;i++){
                    equipmentGids.push(data[i]["mdEquipmentGid"])
                  }
                }
                console.log(data)
                callback({routeGid:routeGid,equipmentGids:equipmentGids})
              })
            `,
          },
          subscribes:[
            {
              event:"deviceAdd-table.onTableTodoAny",
              behaviors: [
                {
                  type: "fetch",
                  id: "dispatchOrder-btn-4", //要从哪个组件获取数据
                  data: "dataContext",//要从哪个组件的什么属性获取数据
                  successPubs: [  //获取数据完成后要发送的事件
                    {
                      event:"deviceAdd-table.loadData",
                    }
                  ]
                }
              ]
            }
          ]
        }} />

        <Row>
          <Col span={6} offset={20}>

            {/*确定按钮*/}
            <AppButton config={{
              id: "deviceAdd-Ok",
              title: "确定",
              type:"primary",
              size:"large",
              visible: true,
              enabled: false,
              subscribes: [
                {
                  event:"deviceAdd-table.onSelectedRows",
                  pubs:[
                    {
                      event:"deviceAdd-Ok.enabled",
                      payload:true
                    },
                    {
                      event:"deviceAdd-Ok.dataContext"
                    }
                  ]
                },
                {
                  event:"deviceAdd-table.onSelectedRowsClear",
                  pubs:[
                    {
                      event:"deviceAdd-Ok.enabled",
                      payload:false
                    }
                  ]
                },
                {
                  event:"deviceAdd-Ok.click",
                  behaviors:[
                    {
                      type: "request",
                      dataSource: {
                        type:"api",
                        method:"post",
                        url:"/ime/imeTrackOrder/dispatcherEquipmentInter.action",
                        withForm:"",
                        bodyExpression:`
                        resolveFetch({fetch:{id:"dispatchOrder-btn-4",data:"dataContext"}}).then(function (data) {
                          var ids = []
                          var equipmentGid = []
                          for(var m=0;m<data.length;m++){
                            ids.push(data[m]["gid"])
                          }
                          for(var n=0;n<dataContext.length;n++){
                            equipmentGid.push(dataContext[n]["gid"])
                          }
                          callback({trackGid:ids,equipmentGid:equipmentGid})
                        })
                        `,
                      },
                      successPubs: [  //获取数据完成后要发送的事件
                        {
                          event: "@@message.success",
                          payload: "新增成功"

                        },
                        {
                          event:"dispatchAllot-modal-device.onCancel"
                        },
                        {
                          event:"dispatchAllot-modal-device.onSuccessCancel"
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
              id: "deviceAdd-Cancel",
              title: "取消",
              type:"default",
              size:"large",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: "deviceAdd-Cancel.click",
                  pubs:[{
                    event: "dispatchAllot-modal-device.onCancel",
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

DeviceAdd.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(DeviceAdd);
