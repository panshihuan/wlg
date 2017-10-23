import React from 'react';
import pubsub from 'pubsub-js'
import {Table, Row, Col, Input, Button,Icon } from 'antd'
import request from 'utils/request'
import CoreComponent from 'components/CoreComponent'
import {resolveDataSource} from 'utils/componentUtil'
import {Link,hashHistory} from 'react-router'
import SimpleSearch from './SimpleSearch'

class SimpleTable extends CoreComponent {
  constructor(props) {
    super(props)
    this.state = Object.assign({
      dataSource: [],
      columns: [],
      selectedRowKeys: [],
      selectedRows:[],
      count: 1,
      page: 1,
      pageSize: 10,
      loading: false,
      bordered: true,
      upButton:false,
      downButton:false
    }, this.state);
    this.columns = this.props.config.columns == undefined ? [] : this.props.config.columns;//表头
    this.id = this.props.config.id == undefined ? "" : this.props.config.id;//组件主键
    pubsub.publish(`${this.id}.headerInfomation`,this.columns);
    
  }
  componentDidMount() {
   
  }
  componentWillUnmount() {
    super.componentWillUnmount()
   
  }

  render() {
    const {config:{size,rowKey,type,tableTitle}} =this.props;
    return (
      <div>
        <Row style={{"marginBottom":"10px"}}>
          <Col span={this.isUpdown?19:20}>
              <h3>{tableTitle == undefined?"":tableTitle}</h3>
          </Col>
          {this.isSearch&&<Col span={4}>
              <SimpleSearch  parmary={this.id} headerInfo={this.columns}/>
          </Col>}
        </Row>
        <Row>
          <Col span={24}>
            <Table columns={columns} 
                  dataSource={dataSource} 
                  showHeader={this.showHeader}
                  size={size == undefined?"default":size}//表格尺寸
                  scroll={{ x: this.width, y: 550 }} 
                  bordered={bordered}
                  loading={loading}//加载状态
                  rowKey={rowKey}//主键
                  rowSelection={rowSelection}
                  onRowClick = {this.onRowClick}
                  onRowDoubleClick = {this.onRowDoubleClick}
                  pagination={this.isPager&&{  //分页
                    total: count, //数据总数量
                    pageSize: pageSize,  //显示几条一页
                    defaultPageSize: 10, //默认显示几条一页
                    pageSizeOptions:["10","20","30","40","50"],
                    showSizeChanger: true,  //是否显示可以设置几条一页的选项
                    onShowSizeChange:this.onPageSizeChange,
                    onChange:this.onPageChange
                }}
                >
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

SimpleTable.propTypes = {};

export default SimpleTable;
