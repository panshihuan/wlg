/*
 *
 * WorkOrderTreePage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb , Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import AppButton from "components/AppButton"
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
import pubsub from 'pubsub-js'
import Immutable from 'immutable'
import TreeField from 'components/Form/TreeField';
import WorkOrderView from './WorkOrderView'
import RouteLineView from './RouteLineView'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'


export class WorkOrderTreePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
        console.log("props",props)
        this.modifyId = this.props.location.state[0].gid
        let modifyData = this.props.location.state[0]

        let dataSource = {
            mode: "dataContext",
            type: "api",
            method: "POST",
            url: "/ime/imeWorkOrder/findById.action?id="+this.modifyId,
        }

        resolveDataSource({ dataSource, dataContext: { id: this.modifyId } }).then(function (data) {
            modifyData.mdProductInfoDetailDTOs = data.data.mdProductInfoDetailDTOs
            pubsub.publish("@@form.init", { id: "WorkOrderTreeForm", data: Immutable.fromJS(modifyData) })
        })

    }

  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>生产管理</Breadcrumb.Item>
              <Breadcrumb.Item>生产工单</Breadcrumb.Item>
              <Breadcrumb.Item>工单树</Breadcrumb.Item>
          </Breadcrumb>
          <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <Col>
                      <AppButton config={{
                          id: "refreshBtn",
                          title: "刷新",
                          visible: true,
                          enabled: true,
                          type: "primary",
                          subscribes: [
                              {
                              }
                          ]
                      }}/>
                      <AppButton config={{
                          id: "goBackBtn",
                          title: "返回",
                          visible: true,
                          enabled: true,
                          type: "primary",
                          subscribes: [
                              {
                                  event: "goBackBtn.click",
                                  pubs: [
                                      {
                                          event: "@@navigator.push",
                                          payload: {
                                              url: "/imeWorkOrder"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}/>
                  </Col>
              </Row>
          </Card>
          <Row>
              <Col span={ 5 }>
                  <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                      <Field config={{
                          id: 'workOrderTree',
                          search: false,
                          enabled: true,
                          visible: true,
                          checkable: false,
                          showLine: true,
                          draggable: false,
                          searchBoxWidth: 300,
                          dataSource: {
                              type: "api",
                              method: "POST",
                              url: '/ime/imeWorkOrder/getworkOrderTree.action?id='+this.modifyId,
                          },
                          subscribes: [
                              {
                                  event:"workOrderTree.onSelect",
                                  pubs:[
                                      {
                                          event:"workOrderViewForm.expression",
                                          meta:{
                                              expression:`
                                                 console.log("11111",data)
                                                 if(data.eventPayload.selectNode.code=="workOrder"){
                                                    pubsub.publish("workOrderViewForm.visible",true)
                                                    pubsub.publish("routeLineViewForm.visible",false)
                                                 }
                                              `
                                          }
                                      },
                                      {
                                          event:"routeLineViewForm.expression",
                                          meta:{
                                              expression:`
                                                 if(data.eventPayload.selectNode.code=="routeLine"){
                                                    pubsub.publish("routeLineViewForm.visible",true)
                                                    pubsub.publish("workOrderViewForm.visible",false)
                                                 }
                                              `
                                          }
                                      }
                                  ]
                              }
                          ]
                      }} name="workOrderTree"  component={ TreeField } />
                  </Card>

              </Col>
              <Col span={1}>
              </Col>
              <Col span={18}>
                 <WorkOrderView workOrderFormValue={this.props.location.state[0]} config={{id: `workOrderViewForm` ,visible:false}}/>
              </Col>
              <Col span={18}>
                 <RouteLineView routeLineFormValue={this.props.location.state[0].routeGidRef} config={{id: `routeLineViewForm` ,visible:false}}/>
              </Col>
          </Row>
      </div>
    );
  }
}

WorkOrderTreePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

let WorkOrderTreeForm = reduxForm({
    form: "WorkOrderTreeForm",
})(WorkOrderTreePage)
export default connect(null, mapDispatchToProps)(WorkOrderTreeForm);
