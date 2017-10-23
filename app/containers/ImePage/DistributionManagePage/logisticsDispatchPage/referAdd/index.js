import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import pubsub from 'pubsub-js'
import {fromJS} from 'immutable'

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
import DropdownButton from 'components/DropdownButton';
const TabPane = Tabs.TabPane;

export class LogisticsDispatchReferAddPage extends React.PureComponent {
  render() {
    return (
      <div>
        <AppTable config={{
          "id": "referAdd-table",
          "name": "1234567890",
          "type": "checkbox",//表格单选复选类型
          "size": "default",//表格尺寸
          "rowKey": "gid",//主键
          "onLoadData": true,//初始化是否加载数据
          "editType": false,
          "isPager": true,//是否分页
          "isSelectable":true,
          "isSearch": true,
          "width":100,
          "columns": [
            {title: '物流工单编号', width: 100, dataIndex: 'code', key: '1'},
            {title: '供应仓库', width: 100, dataIndex: 'mdWarehouseGidRef.warehouseName', key: '2'},
            {title: '配送类型', dataIndex: 'mdMrlDeliverySchemeGidRef.deliveryName', key: '3', width: 100},
            {title: '需求产线', dataIndex: 'factoryLineGidRef.lineName', key: '4', width: 100},
            {title: '需求日期', width: 100, dataIndex: 'reqDate', key: '5' ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
            {title: '需求时间', dataIndex: 'reqDate', key: '6', width: 100,columnsType:{"type":"date","format":"hh:mm:ss"}},
            {title: '单据状态', dataIndex: 'status', key: '7', width: 100},
          ],
          dataSource: {
            type: 'api',
            method: 'post',
            url: '/ime/imeLogisticsOrder/query.action',
            pager:true,
            payload:{
              "query":{
                "query":[
                  {"field":"status","type":"eq","value":"10","operator":"and"}
                ]
              },
            }
          }
        }} />
        <Row>
          <Col span={6} offset={20}>
            {/*确定按钮*/}
            <AppButton config={{
              id: "referAdd-Ok",
              title: "确定",
              type:"primary",
              size:"large",
              visible: true,
              enabled: false,
              subscribes: [
                {
                  event:"referAdd-table.onSelectedRows",
                  pubs:[
                    {
                      event:"referAdd-Ok.enabled",
                      payload:true
                    },
                    {
                      event:"referAdd-Ok.dataContext"
                    }
                  ]
                },
                {
                  event:"referAdd-table.onSelectedRowsClear",
                  pubs:[
                    {
                      event:"referAdd-Ok.enabled",
                      payload:false
                    }
                  ]
                },
                {
                  event:"referAdd-Ok.click",
                  behaviors:[
                    {
                      type: "request",
                      dataSource: {
                        type:"api",
                        method:"post",
                        url:"/ime/imeLogisticsTrack/generationLogisticsTrack.action",
                        bodyExpression:`
                            var ids = []
                            for(var n=0;n<dataContext.length;n++){
                              ids.push(dataContext[n]["gid"])
                            }
                            callback({ids:ids})
                        `,
                      },
                      successPubs: [  //获取数据完成后要发送的事件
                        {
                          event: "@@message.success",
                          payload: "新增成功"

                        },
                        {
                          event:"logisticsDispatch-referModal.onCancel"
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
              id: "referAdd-Cancel",
              title: "取消",
              type:"default",
              size:"large",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: "referAdd-Cancel.click",
                  pubs:[{
                    event: "logisticsDispatch-referModal.onCancel",
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

LogisticsDispatchReferAddPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
  form: "LogisticsDispatchReferAddForm",
})(LogisticsDispatchReferAddPage)