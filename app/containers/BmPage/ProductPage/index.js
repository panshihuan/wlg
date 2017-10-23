/*
 *
 * ProductModelingPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col,Pagination  } from 'antd';
import { Link } from 'react-router';
import AppButton from '../../../components/AppButton';
import AppTable from '../../../components/AppTable';
import { resolveDataSource, publishEvents, resolveFetch } from '../../../utils/componentUtil'

import ProductCardCss from './Styled/ProductCardCss'

import ProductCard from './Components/ProductCard'

export class ProductPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

    onChange(current, pageSize) {
        let state = this
        let dataSource= {
            type: "api",
            method: "POST",
            mode:"payload",
            payload: {"pager":{"page":current,"pageSize":pageSize}},
            url: "/ime/mdProductInfo/query.action"};
        resolveDataSource({dataSource:dataSource}).then(function(res){
            state.setState({
                list:res.data,
                rowNum: Math.ceil(res.data.length/3),
                page:res.pager.page,
                pageSize:res.pager.pageSize,
                total:res.pager.count});
        });
    }

    constructor(props){
        super(props)
        this.state={list:[]}
    }
    componentDidMount(){
        //初始化加载数据
       this.onChange(1,10);
    }

    constructTable(){
        let table  = []

        for (let i = 0; i < this.state.rowNum; i++) {
            table.push (
                <Row gutter={30} key={i}>
                    <Col span={8}>
                        {this.state.list[i*3] ? <ProductCard item={this.state.list[i*3]}/> : ''}
                    </Col>
                    <Col span={8}>
                        {this.state.list[i*3+1] ? <ProductCard key={this.state.list[i*3+1].gid} item={this.state.list[i*3+1]}/> : ''}
                    </Col>
                    <Col span={8}>
                        {this.state.list[i*3+2] ? <ProductCard key={this.state.list[i*3+2].gid} item={this.state.list[i*3+2]}/> : ''}
                    </Col>
                </Row>
            )
        }
        return table
    }




  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>业务建模</Breadcrumb.Item>
              <Breadcrumb.Item>产品</Breadcrumb.Item>
          </Breadcrumb>
          <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>

              <Row>
                  <Col span={14} xs={24}>
                      <AppButton config={{
                          id: "productCreateBtn",
                          title: "创建",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "productCreateBtn.click",
                                  pubs: [
                                      {
                                          event: "@@navigator.push",
                                          payload: {
                                              url: "product/Create"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}>
                      </AppButton>
                      <AppButton config={{
                          id: "productModifyBtn",
                          title: "修改",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"productTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "productTable.expression",
                                          meta: {
                                              expression: `
                                                  let size = data.eventPayload.length
                                                  console.log(size)
                                                  if(size==1){
                                                    pubsub.publish("productModifyBtn.enabled",true);
                                                  }else{
                                                    pubsub.publish("productModifyBtn.enabled",false);
                                                  }
                                                  `
                                          }
                                      }
                                  ]
                              },
                              {
                                  event:"productTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "productModifyBtn.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "productModifyBtn.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "productTable", //要从哪个组件获取数据
                                          data: "selectedRows",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@navigator.push",
                                                  mode: "payload&&eventPayload",
                                                  payload: {
                                                      url: "product/Modify"
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
                          id: "productDeleteBtn",
                          title: "删除",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"productTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "productDeleteBtn.enabled",
                                          payload:true
                                      }
                                  ]
                              },
                              {
                                  event:"productTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "productDeleteBtn.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "productTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "productDeleteBtn.dataContext"
                                      }
                                  ]
                              },
                              /*{
                                  event: "productDeleteBtn.click",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              url: "/ime/mdProductInfo/delete",
                                              paramsInQueryString:true,//参数拼在url后面
                                              payloadMapping:[{
                                                  from: "dataContext",
                                                  to: "@@String",
                                                  key: "gid",
                                                  paramKey:"id"
                                              }]
                                          },
                                          successPubs: [
                                              {
                                                  event: "productTable.loadData"
                                              }
                                          ]
                                      }
                                  ]
                              }*/
                              {
                                  event: "productDeleteBtn.click",
                                  pubs:[
                                      {

                                              event: "productDeleteBtn.expression",
                                              meta: {
                                              expression: `
                                         resolveFetch({fetch:{id:"productDeleteBtn",data:"dataContext"}}).then(function(value){
                                            //console.log("value11111111111",value)
                                            let ids=[]
                                            for(var i in value){
                                                ids.push(value[i].gid)
                                            }
                                            //console.log("ids1111",ids)
                                            let dataSource = {
                                                type: "api",
                                                method: "POST",
                                                url: "/ime/mdProductInfo/deleteList.action",
                                                mode:"payload",
                                                payload:ids
                                            }
                                            let onSuccess = function(response){
                                                if(response.success){
                                                    pubsub.publish("@@message.success","删除成功")
                                                    pubsub.publish("productTable.loadData")
                                                }else{
                                                    pubsub.publish("@@message.error","删除失败")
                                                }
                                            }
                                            resolveDataSourceCallback({dataSource:dataSource},onSuccess)

                                         })
                                      `
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}>
                      </AppButton>
                  </Col>
              </Row>
          </Card>


          {/*内容区块*/}
          <ProductCardCss className='test'>
              {this.constructTable()}
          </ProductCardCss>

          {/*分页组件*/}
          <div style={{ background: '#ECECEC', padding: '30px' }}>
                      {<Pagination showSizeChanger onShowSizeChange={this.onChange.bind(this)} onChange={this.onChange.bind(this)} defaultCurrent={this.state.page} total={this.state.total} />}
          </div>
      </div>
    );
  }
}

ProductPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};



function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(ProductPage);
