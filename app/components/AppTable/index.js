import React from 'react';
import pubsub from 'pubsub-js'
import {Table, Row, Col, Input, Button,Icon } from 'antd'
import AppLinkButton from '../AppLinkButton'
import request from 'utils/request'
import CoreComponent from 'components/CoreComponent'
import {history} from '../../app.js'
import Immutable, {fromJS} from "immutable"
import {
  resolveDataSource,
  publishEvents,
  resolveFetch,
  resolveDataSourceCallback,
  submitValidateForm
} from 'utils/componentUtil'
const safeEval = require('notevil')
class AppTable extends CoreComponent {
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
      downButton:false,
      fuzzyValue:""
    }, this.state);
    this.columns = this.props.config.columns == undefined ? [] : this.props.config.columns;//表头
    this.dataSource = this.props.config.dataSource == undefined ? [] : this.props.config.dataSource;//标题
    this.rowOperationItem = this.props.config.rowOperationItem == undefined ? [] : this.props.config.rowOperationItem;//编辑按钮数据
    this.showSerial = this.props.config.showSerial == undefined ? true : this.props.config.showSerial;//是否增加序号
    this.editType = this.props.config.editType == undefined ? false : this.props.config.editType;//是否增加编辑按钮数据
    this.onLoadData = this.props.config.onLoadData == undefined ? true : this.props.config.onLoadData;//初始化是否加载数据
    this.id = this.props.config.id == undefined ? "" : this.props.config.id;//组件主键
    this.page = this.props.config.page == undefined ? 1:this.props.config.page;//当前页
    this.pageSize = this.props.config.pageSize == undefined ? 10 :this.props.config.pageSize;//每页条数
    this.isPager = this.props.config.isPager == undefined ? true : this.props.config.isPager;//是否加载分页
    this.width = this.props.config.width == undefined ? 1500:this.props.config.width;//设置表格宽度
    this.isSearch = this.props.config.isSearch == undefined ? true:this.props.config.isSearch;//是否显示模糊查询
    this.isUpdown = this.props.config.isUpdown == undefined ? false : this.props.config.isUpdown;//是否显示上下移按钮
    this.isSelectable = this.props.config.isSelectable == undefined ?true:this.props.config.isSelectable;//待定 这个浏览器会报警告
    this.showHeader = this.props.config.isShowHeader == undefined ?true:this.props.config.isShowHeader;//是否显示表头
    this.allSituation = undefined;//传入的参数
    this.rowRecord = {};//点击行数据
    this.ext = {};//转换值

    pubsub.subscribe(`${this.id}.loadData`, (eventName, payload) => {
      this.loadTableData(payload);
    })//刷新表格
    this.setTableData();//动态设置表格数据

    //清空点击的数据
    pubsub.subscribe(`${this.id}.clearClickRow`, (eventName, payload) => {
      pubsub.publish(`${this.id}.onClickRow`,{});
      this.rowRecord = {};
    })
  }
  componentDidMount() {
    let columnsData=this.initEditTable(this.editType,this.columns,this.rowOperationItem,this.showSerial);//配置列是否加载序号和操作列
    let configuration = this.configuration(this.columns);//重新渲染表格列
    this.setState({columns:columnsData})
    if(this.onLoadData){
      let param = {pager:{page:this.page,pageSize:this.pageSize}};
      this.reloadTableData(columnsData,this.dataSource,param)
    }
      //table加载完之后需要去触发的逻辑
      pubsub.publish(`${this.props.config.id}.onTableTodoAny`,{})
  }
  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.id}.loadData`)
    pubsub.unsubscribe(`${this.id}.setData`)
  }
  //重构列
  configuration(columns){
    columns.map((item,index)=>{
        if(item.columnsType){
          if(item.columnsType.type =="link"){
            item["render"]=(text,record,rowIndex) => {
              let location = item.columnsType.url;
              let expression = item.columnsType.expression
              return <a onClick={()=>this.linkToNextUrl(location,record,expression)} >{text}</a>
           }
          }else if(item.columnsType.type =="replace"){
            item["render"]=(text,record,rowIndex) => {
              let replace = item.columnsType.text;
              _.mapKeys(replace, function(value, key) {
                if(key == `${text}`){
                  return text = value;
                }
              });
              return text;
           }
          }else if(item.columnsType.type =="date"){
            item["render"]=(text,record,rowIndex) => {
              let replaceRule = item.columnsType.format;
              let dateData = new Date(text)
              if(dateData != "Invalid Date"){
                return this.dateFormat(replaceRule,dateData)   
              }else{
                return text
              }
                         
            }
          }
        }
    })
  }
  //时间格式转换
  dateFormat(fmt,times){
    let time = { 
      "M+" : times.getMonth()+1,                 //月份 
      "d+" : times.getDate(),                    //日 
      "h+" : times.getHours(),                   //小时 
      "m+" : times.getMinutes(),                 //分 
      "s+" : times.getSeconds(),                 //秒 
      "q+" : Math.floor((times.getMonth()+3)/3), //季度 
      "S"  : times.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (times.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in time) {
      if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (time[k]) : (("00"+ time[k]).substr((""+ time[k]).length)));
      }
    }
    return fmt; 
  }
  //跳链接
  linkToNextUrl(link,param,expression) {
    let params = [];
    if(expression !=undefined){
      safeEval(expression, {
        fromJS: fromJS,
        eventPayload: param,//当前行的数据
        pubsub,
        JSON,
        console,
        resolveDataSource,
        resolveFetch,
        resolveDataSourceCallback,
        _,
        localStorage,
        Immutable,
        Math,
        setTimeout,
        clearTimeout,
        callback: (payload) => {
          history.push({ pathname: link, state: payload });
        }
      })
    }else{
      params.push(param);
      history.push({ pathname: link, state: params });
    }
    
}
   //加载表格数据
   reloadTableData = (columns,dataSource,param ={}) => {
    if(columns.length>0){
      this.setState({dataSource: [],selectedRowKeys:[],selectedRows:[],loading:true}, () => {
        pubsub.publish(`${this.id}.onSelectedRowsClear`, []);
        pubsub.publish(`${this.id}.onClickRowClear`, []);
        this.rowRecord = [];
        this.selectedRows = [];
        let {page,pageSize} = this.state;
        if(this.dataSource.pager ){
          this.dataSource.pagerInfo = {page:page,pageSize:pageSize};
        }else{
          param["pager"] = {page:page,pageSize:pageSize};
        }
        resolveDataSource({dataSource: this.dataSource,eventPayload:param}).then(function (response) {
         // this.allSituation = this.dataSource.payload;//初始化查询中带的参数
            if(response.success){
              if(response["ext"]!==undefined&&response["ext"]!==null){
                columns=this.renderReplaceText(columns,response["ext"])
              }
              this.setState({columns:columns},()=>{
                let tableData = this.addSerialNum(response.data);
                this.setState({
                  dataSource:tableData,
                  count:response.pager&&response.pager.count,
                  page:response.pager&&response.pager.page,
                  pageSize:response.pager&&response.pager.pageSize
                },()=>{
                  this.setState({loading:false})
                  //发布数据加载完之后
                pubsub.publish(`${this.props.config.id}.onTableLoaded`,tableData)
                });
              })
            }else{
              this.setState({loading:false})
            }
          }.bind(this));
        })
    }
  }
   //发布加载本身数据源的方法
  loadTableData(payload){
      this.setState({dataSource: [],selectedRowKeys:[],selectedRows:[],loading:true}, () => {
        pubsub.publish(`${this.id}.onSelectedRowsClear`, []);
        pubsub.publish(`${this.id}.onClickRowClear`, []);
        this.rowRecord = [];
        this.selectedRows = [];
        //传递的参数
        if(this.dataSource.pager ){
          let {page,pageSize} = this.state;
          this.dataSource.pagerInfo = {page:page,pageSize:pageSize};
        }
        if(payload == undefined){
          payload ={};
        }
        
        resolveDataSource({dataSource: this.dataSource, eventPayload: payload.eventPayload==undefined?payload:payload.eventPayload}).then(function (response) {
          let {columns} =this.state;
          this.allSituation = payload;
          if(response.success){
              if(response["ext"]!==undefined&&response["ext"]!==null){
                columns=this.renderReplaceText(columns,response["ext"])
              }
              this.setState({columns:columns},()=>{
                let tableData = this.addSerialNum(response.data);
                this.setState({
                dataSource:tableData,
                count:response.pager&&response.pager.count,
                page:response.pager&&response.pager.page,
                pageSize:response.pager&&response.pager.pageSize
              },()=>{
                this.setState({loading:false})
                //发布数据加载完之后
                pubsub.publish(`${this.id}.onTableLoaded`,tableData)
              });
            })
          }else{
            this.setState({loading:false})
          }
          }.bind(this));
        })

  }
  //重新渲染某一列数据
  renderReplaceText(columns = [],ext = {}){
    this.ext = _.cloneDeep(ext);
    if(ext["enumHeader"] !=undefined&&ext["enumHeader"]!=null&&columns.length>0){
        columns.map((item,index)=>{
          Object.keys(ext["enumHeader"]).forEach(function(key){
            if(item["dataIndex"] === key){
              item["render"]=(text,record,rowIndex) => {
                 if(ext["enumHeader"][key][text] !=undefined){
                    return ext["enumHeader"][key][text]
                 }else{
                  return text
                 }
              }
            }
        });
      })
     }
     return columns;
  }
  //发布动态设置表格数据
  setTableData(){
    pubsub.subscribe(`${this.id}.setData`,(eventName,payload) =>{
      pubsub.publish(`${this.id}.onSelectedRowsClear`, []);
      pubsub.publish(`${this.id}.onClickRowClear`, []);
      this.rowRecord = [];
      this.selectedRows = [];
      let {columns} =this.state;
      let copyColumns = _.cloneDeep(columns);
      if(payload["ext"]!==undefined&&payload["ext"]!==null){
        copyColumns=this.renderReplaceText(copyColumns,payload["ext"])
      }
      this.setState({dataSource: [],selectedRowKeys:[],selectedRows:[],loading:true,columns:copyColumns}, () => {
        if(payload["eventPayload"]!=undefined&&payload["eventPayload"] instanceof Array&&payload["eventPayload"].length>0){
          let tableData = this.addSerialNum(payload["eventPayload"]);
          this.isPager = false;
          this.setState({
            dataSource:tableData,
            count:tableData.length,
            page:1,
            pageSize:10
          },()=>{
            this.setState({loading:false})
          });
        }else if(payload.data&&payload.data.length>0&&payload.data instanceof Array){
            let tableData = this.addSerialNum(payload.data);
            this.isPager = false;
            this.setState({
                dataSource:tableData,
                count:tableData.length,
                page:1,
                pageSize:10
            },()=>{
                this.setState({loading:false})
            })
        }else{
            this.setState({loading:false})
        }
      })
    })
  }
  //增加序号数据
  addSerialNum(data=[]){
    if(data instanceof Array&&data.length>0&&this.showSerial){
      data.map((item,index)=>{
        item["serialNum"] = index+1;
      })
      return data;
    }
    return data;
  }
  
  //显示条数
  onPageSizeChange=(current, pageSize)=> {
    let {columns,fuzzyValue} = this.state;
    let conditions=this.searchFuzzyTable(fuzzyValue);
    this.setState({page:current,pageSize:pageSize},()=>{
      let allParams= this.splitQuery(conditions);
      this.reloadTableData(columns,this.dataSource,allParams)
    });
    
  }
  //翻页
  onPageChange = (current)=>{
    this.selectedRows = undefined;
    let {fuzzyValue,columns} = this.state;
    this.setState({selectedRowKeys: [],selectedRows:[]});
    this.rowRecord = [];
    this.selectedRows = [];
    let conditions=this.searchFuzzyTable(fuzzyValue);
    this.setState({page:current},()=>{
      let allParams= this.splitQuery(conditions);
      this.reloadTableData(columns,this.dataSource,allParams)
    });
  }
   //模糊搜索(按钮)
   fuzzySearch = (value) =>{
     let {columns} = this.state;
    this.setState({fuzzyValue:value});
    this.rowRecord = [];
    let conditions=this.searchFuzzyTable(value);
    let allParams= this.splitQuery(conditions);
    this.reloadTableData(columns,this.dataSource,allParams)
  }
  //onchange和enter触发快速搜索
  quickSearch = (e) =>{
    let {columns} = this.state;
    this.setState({fuzzyValue:e.target.value});
    this.rowRecord = [];
    this.selectedRows = [];
    let conditions=this.searchFuzzyTable(e.target.value);
    let allParams= this.splitQuery(conditions);
    this.reloadTableData(columns,this.dataSource,allParams)
  }
  //拼接条件
  splitQuery(conditions){
    let allParams = undefined;
    let receiveParam = _.cloneDeep(this.allSituation)
    if(this.allSituation!=undefined ){
      if(this.allSituation instanceof Object){
        if(this.allSituation.eventPayload !=undefined && this.allSituation.eventPayload instanceof Object){
            allParams=Object.assign({},receiveParam.eventPayload)
          }else if(this.allSituation instanceof Object){
            allParams=Object.assign({},receiveParam)
        }
      }
    }
    if(conditions.length>0){
      let params = {query:{}};
      params["query"]["query"]=conditions;
      if(allParams !=undefined){
        if(allParams.query!=undefined&&allParams.query.query!=undefined){
          allParams.query.query=allParams.query.query.concat(conditions);
        }else{
          allParams=Object.assign({},allParams,params)
        }
      }else{
        allParams=Object.assign({},params)
      }
    }
    return allParams;
  }
  //查询拼接条件
  searchFuzzyTable(value){
    let columns = _.cloneDeep(this.columns);
    if( this.props.config.conditions !=undefined){
      columns = this.props.config.conditions;//暂时这样写,后期设计器出来后再修改
    }
    let query =[];
    for(var i = 0 ;i < columns.length;i++){
      let conditions = {};
      if(i==0){
        conditions["left"] = "(";
        conditions["field"] = columns[i]["dataIndex"];
        conditions["type"] = "like";
        conditions["value"] = value;
        conditions["operator"] = "or";
        if(columns.length == 1){
          conditions["right"] = ")";
        }
      }else if(i == columns.length-1){
        conditions["right"] = ")";
        conditions["field"] = columns[i]["dataIndex"];
        conditions["type"] = "like";
        conditions["value"] = value;
        conditions["operator"] = "or";
      }else{
        conditions["field"] = columns[i]["dataIndex"];
        conditions["type"] = "like";
        conditions["value"] = value;
        conditions["operator"] = "or";
      }
      query.push(conditions);
    }
    return query
  }
  //选中项发生变化的时的回调
  onSelectChange = (selectedRowKeys, selectedRows)=>{
    let {dataSource} =this.state;
    this.listenUpDown(dataSource,selectedRows);
    this.setState({selectedRowKeys:selectedRowKeys,selectedRows:selectedRows},()=>{
      //发布勾选数据集合
      this.selectedRows = selectedRows;
      if(selectedRows.length>0){
        //选中时候发布的事件
        pubsub.publish(`${this.id}.onSelectedRows`, _.cloneDeep(selectedRows));
      }else{
        //取消选中的时候发布的事件
        pubsub.publish(`${this.id}.onSelectedRowsClear`, []);
      }
    });

  }
  //向上移动
  upDataSource = (e) =>{
    let {dataSource,selectedRows} = this.state;
    let copyData = _.cloneDeep(dataSource);//复制一份源数据
    let copySelectedRows = _.cloneDeep(selectedRows);//复制一份选择的数据
    for(let i=0;i<copySelectedRows.length;i++){
      let gid = copySelectedRows[i].gid;
      let index =_.findIndex(copyData,{gid:gid});
      if(index!=undefined&&index>0){
        let tmp = copyData[index-1];
        copyData[index-1] = copyData[index];
        copyData[index] = tmp;
       }
    }
    this.listenUpDown(copyData,copySelectedRows);
  }
  //向下移动
  downDataSource = (e) =>{
    let {dataSource,selectedRows} = this.state;
    let copyData = _.cloneDeep(dataSource);//复制一份源数据
    let copySelectedRows = _.cloneDeep(selectedRows);//复制一份选择的数据
    for(let i=copySelectedRows.length-1;i>=0;i--){
      let gid = copySelectedRows[i].gid;
      let index =_.findIndex(copyData,{gid:gid});
      if(index!=undefined&&index!=copyData.length-1){
        let tmp = copyData[index+1];
        copyData[index+1] = copyData[index];
        copyData[index] = tmp;
       }
    }
    this.listenUpDown(copyData,copySelectedRows);
  }
  //上下移动更改序号和按钮状态
  listenUpDown(data,selectedRows){
    let upState = false;
    let downState = false;
    for(let i=0;i<selectedRows.length;i++){
      let gid = selectedRows[i].gid;
      let index =_.findIndex(data,{gid:gid});
      if(index == 0){
        upState= true;
      }
      if(index == data.length-1){
        downState=true;
      }
    }
    let dataSource=this.addSerialNum(data)
    this.setState({upButton:upState,downButton:downState,dataSource:dataSource});
  }
  //是否加载编辑按钮
  initEditTable(editType,columns=[],rowOperationItem,showSerial){
    let columnsData = [];
    columns.map((item)=>{columnsData.push(item)});
    if(showSerial&&columnsData.length>0){
      let column={
        title:'序号',
        dataIndex:'serialNum',
        key:columnsData.length+1,
        width:60
      }
      columnsData.splice(0,0,column)
    }
    if(editType&&columnsData.length>0){
        let column= {
          title:'操作',
          dataIndex: 'operation',
          key:columnsData.length+1,
          width:100,
          render: (text,record,rowIndex) => {
           return  rowOperationItem&&rowOperationItem.map((item)=>{
              if(item.type==="linkButton"){
                return (
                  <AppLinkButton key={`${item.id}[${rowIndex}]`} data={record} config={{
                    id: `${item.id}[${rowIndex}]`,
                    title:item.title,
                    rowIndex: rowIndex,
                    subscribes: item.subscribes,
                  }}/>
              );
              }
            })
          }
        }
        columnsData.push(column);
    }
    return columnsData
  }

  //点击行触发
  onRowClick = (record, index, event) =>{
    pubsub.publish(`${this.id}.onClickRow`,record);
    this.rowRecord = record;
  }
  //双击行触发
  onRowDoubleClick = (record, index, event) =>{
    pubsub.publish(`${this.id}.onRowDoubleClick`,record);
    this.rowRecord = record;
  }
  render() {
    const Search = Input.Search;
    const ButtonGroup = Button.Group;
    const {config:{size,rowKey,type,tableTitle}} =this.props;
    const {columns,dataSource,bordered,loading,count,pageSize,selectedRowKeys,upButton,downButton} = this.state;
    let rowSelection =null;
    if(this.isSelectable){
      rowSelection={
        selectedRowKeys,
        type:type == undefined?"checkbox":type,
        onChange:this.onSelectChange
      }
    }
    return (
      <div>
          <Row style={{"marginBottom":"10px"}}>
            <Col span={this.isUpdown?19:20}>
                <h3>{tableTitle == undefined?"":tableTitle}</h3>
            </Col>
            {this.isSearch&&<Col span={4}>
                <Search
                  addonBefore="关键字"
                  size="large"
                  placeholder="input search text"
                  onSearch={this.fuzzySearch}
                  onPressEnter = {this.quickSearch}
                  />
            </Col>}
            {this.isUpdown&&<Col span={this.isSearch?1:5}>
              <ButtonGroup style={{float:"right"}}>
                <Button type="dashed" icon="up" size="large" onClick = {this.upDataSource} disabled={upButton}/>
                <Button type="dashed" icon="down" size="large" onClick = {this.downDataSource} disabled={downButton}/>
              </ButtonGroup>
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

AppTable.propTypes = {};

export default AppTable;
