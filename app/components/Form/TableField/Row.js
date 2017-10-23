import React from 'react'
import Cell from './Cell'
import { Checkbox,Radio } from 'antd';
import pubsub from 'pubsub-js'
import _ from 'lodash'
import AppLinkButton from '../../AppLinkButton'

export class Row extends React.PureComponent {
  constructor(props) {
    super();
  }

  handleRemove = () => {
    const {index, fields} = this.props;
    let curList = _.cloneDeep(fields.getAll().toJS())
    this.props.rowIds.splice(index, 1)
    fields.remove(index)
    pubsub.publish(`${this.props.id}.onDelete`,curList[index])
  }

  //单选
  onSelect = (e) =>{
    this.props.handleChange(e.target.value)
    pubsub.publish(`${this.props.id}.onSelect`,e.target.value)
  }

  //多选
  onCheck = (e) =>{
    this.props.handleCheck(e)
  }

  //渲染操作列
  operateRender = () =>{
    const {rowOperationItem,rowIndex,fields:{name},form,rowIds,activeRows,addRows,unEditable,mode} = this.props
    if(mode == "new"){
      if(!unEditable || addRows.indexOf(rowIndex)!= -1 || activeRows.indexOf(rowIndex)!= -1){
        if(rowOperationItem && rowOperationItem.length>0){
          return rowOperationItem.map((item)=>{
            let i= rowIds.findIndex((r)=>r==rowIndex);
            let data = window.store.getState().get('form').get(form).get('values').toJS()[name][i]
            return (
              <AppLinkButton key={`${item.id}[${rowIndex}]`} data={data} config={{
                id: `${item.id}[${rowIndex}]`,
                title:item.title,
                rowIndex: rowIndex,
                subscribes: item.subscribes
              }} />
            )
          })
        }else{
          return (
            <AppLinkButton key={`delete[${rowIndex}]`} _click={()=>{this.handleRemove()}} config={{
              id: `delete[${rowIndex}]`,
              title:"删除",
              rowIndex: rowIndex,
            }} />
          )
        }
      }
    }else{
      if(!unEditable || addRows.indexOf(rowIndex)!= -1 || activeRows.indexOf(rowIndex)!= -1){
        if(rowOperationItem && rowOperationItem.length>0){
          return rowOperationItem.map((item)=>{
            let i= rowIds.findIndex((r)=>r==rowIndex);
            let data = window.store.getState().get('form').get(form).get('values').toJS()[name][i]
            return (
              <AppLinkButton key={`${item.id}[${rowIndex}]`} data={data} config={{
                id: `${item.id}[${rowIndex}]`,
                title:item.title,
                rowIndex: rowIndex,
                subscribes: item.subscribes
              }} />
            )
          })
        }else{
          return (
            <div className="operate"><a onClick={this.handleRemove}>删除</a></div>
          )
        }
      }
    }
  }

  render() {
    const {
      rowIndex, member, fields, columns, index, type, showSelect,selectedKeys,activeRows,unEditable,showRowDeleteButton,
      checkedKeys, activeCols, addRows,rowOperationItem,mode
    } = this.props;

    const cellConfig = {
      activeRows,activeCols,index,rowIndex,member,fields,unEditable,addRows,mode
    }

    return <tr className="ant-table-row">
      {
        showSelect && type === "radio" && <td>
          <Radio checked={rowIndex === selectedKeys ? true : false} value={rowIndex} onChange = {this.onSelect}/>
        </td>
      }
      {
        showSelect && type === "checkbox" && <td>
          <Checkbox checked={checkedKeys.indexOf(rowIndex)!= -1 ? true : false} value={rowIndex} onChange = {this.onCheck}/>
        </td>
      }
      {
        columns.map((column, columnIndex) => {
          if(column["visible"] !== false){
            return <Cell key={columnIndex} column={column} columnIndex={columnIndex} {...cellConfig}/>
          }
        })
      }
      { showRowDeleteButton && <td>{this.operateRender()}</td> }

    </tr>;
  }
}

Row.propTypes = {}

export default Row
