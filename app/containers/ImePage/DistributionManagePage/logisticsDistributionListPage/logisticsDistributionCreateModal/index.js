import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import Immutable from 'immutable';
import pubsub from 'pubsub-js'
import {connect} from 'react-redux';
import AppButton from 'components/AppButton'
import AppTable from 'components/AppTable'
import ModalContainer from 'components/ModalContainer'
import DropdownButton from 'components/DropdownButton';
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
import TreeField from 'components/Form/TreeField'
import UploadField from 'components/Form/UploadField'
import FindbackField from 'components/Form/FindbackField'
import tinyCache from 'tinycache'

const TabPane = Tabs.TabPane;
import CoreComponent from 'components/CoreComponent'

export class LogisticsDistributionCreateModal extends React.PureComponent {
  callback = (key) => {
    console.log(key);
  }

  render() {
    return (

      <div>
        <Row>
          <Col span={24} style={{textAlign: 'center'}}>
            <AppTable name="logistics-dist-modal-grid-1" config={{
              "id": "logistics-dist-modal-grid-1",
              "name": "logistics-dist-modal-grid-1",
              "type": "checkbox",//表格单选复选类型
              "size": "default",//表格尺寸
              "rowKey": "gid",//主键
              "onLoadData": false,//初始化是否加载数据
              "tableTitle": "",//表头信息
              "width": 3000,//表格宽度
              "showSerial": true,//是否显示序号
              // "editType": true,//是否增加编辑列
              "page": 1,//当前页
              "pageSize": 10,//一页多少条
              "isPager": true,//是否分页
              "isSearch": false,//是否显示模糊查询
              "columns": [
                {title: '物流派工单编号', width: 150, dataIndex: 'code', key: '1'},
                {title: '来源物流工单号', width: 150, dataIndex: 'logisticsWorkOrderGidRef.code', key: '2'},
                {title: '供应仓库', dataIndex: 'mdWarehouseGidRef.warehouseName', key: '3', width: 150},
                {title: '配送类型', dataIndex: 'mdMrlDeliverySchemeGidRef.deliveryType', key: '4', width: 100},
                {title: '物料组号', dataIndex: 'mdMrlDeliveryModeGidRef.code', key: '5', width: 150},
                {title: '物料组名', dataIndex: 'mdMrlDeliveryModeGidRef.name', key: '6', width: 150},
                {title: '物料编码', dataIndex: 'mdMaterielInfoGidRef.code', key: '7', width: 150},
                {title: '物料名称', dataIndex: 'mdMaterielInfoGidRef.name', key: '8', width: 150},
                {title: '包装方式', dataIndex: 'packingMode', key: '9', width: 100},
                {title: '包装标准', dataIndex: 'packingStandard', key: '10', width: 100},
                {title: '标准数量', dataIndex: 'standardQty', key: '11', width: 100},
                {title: '标准单位', dataIndex: 'standardUnit', key: '12', width: 100},
                {title: '需求产线', dataIndex: 'factoryLineGidRef.lineName', key: '13', width: 150},
                {title: '计划数量', dataIndex: 'planQty', key: '14', width: 100},
                {title: '需求数量', dataIndex: 'reqQty', key: '15', width: 100},
                {title: '需求日期', dataIndex: 'reqDate', key: '16', width: 150},
                {title: '需求时间', dataIndex: 'reqDate', key: '17', width: 150},
                {title: '工序', dataIndex: 'routeOpeartionName', key: '18', width: 150},
                {title: '工位', dataIndex: 'factoryWorkStationGidRef.stationName', key: '19', width: 150},
              ],
              dataSource: {
                type: 'api',
                method: 'post',
                url: '/ime/imeLogisticsTrack/query.action',
                pager:true,
              },
              subscribes: [
                {
                  event:"logistics-dist-modal-grid-1.onTableTodoAny",
                  pubs:[
                    {
                      event:"logistics-dist-modal-grid-1.loadData",
                      eventPayloadExpression:`
                      var params = {"query":{"query":[
                        {"left":"(","operator":"and","field":"logisticsDeliveryGid","type":"null"},
                        {"right":")","operator":"and","field":"status","type":"eq",value:"20"}
                      ]}}
                      callback(params);
                      `
                    }
                  ]
                },
                {
                  event: "logistics-dist-modal-grid-1.onSelectedRows",
                  pubs: [
                    {
                      event: "logistics-dist-confirm-modal-btn-1.dataContext"
                    }, {
                      event: "logistics-dist-confirm-modal-btn-1.enabled",
                      payload: true
                    }
                  ]
                }, {
                  event: "logistics-dist-modal-grid-1.onSelectedRowsClear",
                  pubs: [
                    {
                      event: "logistics-dist-confirm-modal-btn-1.enabled",
                      payload: false
                    }
                  ]
                }
              ]
            }}/>
          </Col>
        </Row>
        <Row style={{marginTop: '30px'}}>
          <Col span={4} offset={20}>
            {/*确定按钮*/}
            <AppButton config={{
              id: "logistics-dist-confirm-modal-btn-1",
              title: "确定",
              type: "primary",
              size: "large",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: "logistics-dist-confirm-modal-btn-1.click",
                  behaviors: [
                    {
                      type: "request",
                      dataSource: {
                        type: "api",
                        method: 'post',
                        url: '/ime/imeLogisticsDelivery/create.action',
                        mode: "dataContext",
                        bodyExpression: `
                           console.log(":::",dataContext);
                           var array = [];
                           if(dataContext && dataContext.length > 0) {
                             for(var i = 0; i < dataContext.length; i++) {
                              array.push(dataContext[i].gid);
                             }
                              callback(array);
                           }
                      `,
                      },
                      successPubs: [
                        {
                          event: "logistics-dist-grid-index.loadData",
                        }, {
                          event: "logistics-dist-add-modal-1.onCancel"
                        }
                      ],
                    }
                  ]
                }
              ]
            }}/>
            {/*取消按钮*/}
            <AppButton config={{
              id: "logistics-dist-cancel-modal-btn-2",
              title: "取消",
              type: "default",
              size: "large",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: 'logistics-dist-cancel-modal-btn-2.click',
                  pubs: [
                    {
                      event: 'logistics-dist-add-modal-1.onCancel'
                    }
                  ]
                }
              ]
            }}/>
          </Col>
        </Row>
      </div>
    );
  }
}

LogisticsDistributionCreateModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
  form: "logisticsDistributionCreateModalForm",
})(LogisticsDistributionCreateModal)