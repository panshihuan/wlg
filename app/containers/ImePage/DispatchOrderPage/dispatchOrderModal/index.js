/*
 *
 * DispatchOrderModal
 *
 */

import React, { PropTypes } from 'react';
import {  Row, Col } from 'antd';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import pubsub from 'pubsub-js'
import FindbackField from '../../../../components/Form/FindbackField';
import AppButton from '../../../../components/AppButton';
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'


export class DispatchOrderModal extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <form>
        <div style={{ padding: '20px' }}>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Field config={{
                enabled: true,
                id: "dispatchOrderfindBack",
                label: "工作单元",
                form:"findBackForm",
                showRequiredStar: true,  //是否显示必填星号
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 12,  //输入框栅格比例（0-24）
                // formMode:'edit',
                dataSource: {
                  type: 'api',
                  method: 'POST',
                  url: '/ime/imeTrackOrder/assignTrackOrder',
                  // payloadMapping:[{
                  //   from:"eventPayload",
                  //   to:"id"
                  // }]
                },
                tableInfo: {
                  id:"tableId",
                  size:"small",
                  rowKey:"gid",
                  tableTitle:"工作单元",
                  showSerial:true,  //序号
                  columns:[
                    // {title: 'ID', width: 100, dataIndex: 'gid', key: '1'},
                    {title: '工作单元编号', width: 150, dataIndex: 'workUnitCode', key: '1'},
                    {title: '工作单元名称', width: 150, dataIndex: 'workUnitName', key: '2'}
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/mdFactoryWorkUnit/query',
                    // payload: {name: "ewueiwue"}
                  }
                },
                pageId:'findBackTable',
                displayField: "workUnitName",
                valueField: {
                  "from": "gid",
                  "to": "workUnitName"
                },
                // associatedFields: [
                //   {
                //     "from": "name",
                //     "to": "name"
                //   },
                //   {
                //     "from": "age",
                //     "to": "age1"
                //   }
                // ]
              }} name="workUnitGid" component={FindbackField}/>



              {/*<Field config={{
                  id: "workcell",
                  enabled: true,
                  visible: true,
                  label: "工作单元",
                  dataSource: {
                    type: "api",
                    method: "post",
                    url: "/ime/imeTrackOrder/assignTrackOrder",
                    // payloadMapping: [{
                    //   from: "id",
                    //   to: "code"
                    // }]
                  },
                  placeholder: "请选择",
                  displayField: "name",
                  valueField: "id",
                  labelSpan: 8,   //标签栅格比例（0-24）
                  wrapperSpan: 12,  //输入框栅格比例（0-24）
                  showRequiredStar: false,  //是否显示必填星号
                  hasFeedback: false  //验证失败时是否显示feedback图案
                }} name="workcell" component={AutoCompleteField}/>*/}

            </Col>
          </Row>

          <Row style={{ marginTop: '30px' }}>
            <Col span={10} offset={14}>
              {/*确定按钮*/}
              <AppButton config={{
                id: "dispatch-modal-btn-1",
                title: "确定",
                type:"primary",
                size:"large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "dispatch-modal-btn-1.click",
                    behaviors:[
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: 'post',
                          url: '/ime/imeTrackOrder/assignTrackOrder.action',
                          withForm:"DispatchOrderModal",
                          mode:"dataContext",

                          bodyExpression:`
                            resolveFetch({fetch:{id:"dispatchOrder-btn-3",data:"dataContext"}}).then(function (data) {
                              let dispatchOrders = _.cloneDeep(data)||[];
                              resolveFetch({fetch:{id:"DispatchOrderModal",data:"@@formValues"}}).then(function (data) {
                                let workUnitObj = _.cloneDeep(data)||[];
                                let workUnitGid = workUnitObj.workUnitGid;
                                console.error(workUnitObj);
                                let trackOrderGids = [];
                                for(let i = 0; i < dispatchOrders.length; i++){
                                     trackOrderGids.push(dispatchOrders[i].gid);
                                }
                                callback({workUnitGid:workUnitGid,trackOrderGids:trackOrderGids})
                              })
                            })
                          `,
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            payload:'派工成功!'
                          },
                          {
                            event: "dispatchOrder.loadData",
                          },{
                            event: "pro-dispatch-modal.onCancel"
                          }

                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload:'派工失败!'
                          },
                          // {
                          //   event: "dispatchOrder.loadData",
                          // }
                        ]
                      }

                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "dispatch-modal-btn-2",
                title: "取消",
                type:"default",
                size:"large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "dispatch-modal-btn-2.click",
                    pubs:[{
                      event: "pro-dispatch-modal.onCancel",
                    }]
                  }
                ]
              }} />
            </Col>
          </Row>
        </div>
      </form>
    );
  }
}

DispatchOrderModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
};



export default reduxForm({
  form: "DispatchOrderModal",
})(DispatchOrderModal)
