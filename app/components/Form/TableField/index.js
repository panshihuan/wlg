/**
 *
 * TableField
 *
 */

import React from 'react';
// import Styled from 'Styled-components';
import pubsub from 'pubsub-js'
import {reduxForm, Field} from 'redux-form/immutable'
import CoreComponent from 'components/CoreComponent'
import {Input, Form, Button, Table} from 'antd'
import TableFieldCss from './styles'
import uuid from 'uuid/v4'
import _ from "lodash"
import Row from './Row'
import {fromJS} from 'immutable'

class TableField extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)

    this.state = Object.assign({}, {
      selectedKeys: "",  //单选
      checkedKeys: [],   //多选
      unEditable: false,  //初始化是否可编辑
      activeRows: [], //可编辑行
      activeCols: {},  //可编辑列
      addRows: [],  //新增行
      columns: _.cloneDeep(this.props.config.columns)
    }, this.state)
    this.rowIds = [];
    this.id = this.props.config.id

    this.selectedRows = () => {
      let {config: {type = "radio", form}, fields: {name}} = this.props
      let {selectedKeys, checkedKeys} = this.state
      let values  = window.store.getState().get('form').get(form).get('values')
      if (type === "radio" && values) {
        let i = this.rowIds.findIndex((r) => r == selectedKeys);
        if(i!=-1) return values.toJS()[name][i];
      } else if (type === "checkbox" && values) {
        let checks = []
        checkedKeys.map(item => {
          let i = this.rowIds.findIndex((r) => r == item);
          i>-1 && checks.push(values.toJS()[name][i])
        })
        return checks
      }
    }

    let initFields = props.fields.getAll();
    if (initFields != undefined) {
      initFields.forEach(v => this.rowIds.push(uuid()))
    }

    //增行事件
    pubsub.subscribe(`${this.id}.addRow`, (eventName, data) => {
      this.handleNewRow(data)
    })


    pubsub.subscribe(`${this.id}.disableRow`, (eventName, data) => {
      this.state.columns.forEach((c) => {
        pubsub.publish(`${c.id}[${data.eventPayload}].enabled`, false)
      })
      this.controlDelBtn(data.eventPayload,false)
    })

    pubsub.subscribe(`${this.id}.disableAll`, (eventName, data) => {
      this.rowIds.forEach(r => {
        this.state.columns.forEach((c) => {
          pubsub.publish(`${c.id}[${r}].enabled`, false)
        })
      })
      this.controlDelBtn(this.rowIds,false)
    })

    pubsub.subscribe(`${this.id}.enableAll`, (eventName, data) => {
      this.rowIds.forEach(r => {
        this.state.columns.forEach((c) => {
          let isRowEnabled = c.enabled === undefined ? true : c.enabled;
          if (isRowEnabled)
            pubsub.publish(`${c.id}[${r}].enabled`, true)
        })
      })
      this.controlDelBtn(this.rowIds,true)
    })

    pubsub.subscribe(`${this.id}.enableRow`, (eventName, data) => {
      this.state.columns.forEach((c) => {
        let isRowEnabled = c.enabled === undefined ? true : c.enabled;
        if (isRowEnabled)
          pubsub.publish(`${c.id}[${data.eventPayload}].enabled`, true)
      })
      this.controlDelBtn(data.eventPayload,true)
    })

    //根据id控制当前列可编辑
    pubsub.subscribe(`${this.id}.enableCol`, (eventName, data) => {
      data.forEach(c => {
        this.rowIds.forEach(r => {
          pubsub.publish(`${c}[${r}].enabled`, true)
        })

      })
    })

    //根据id控制当前列不可编辑
    pubsub.subscribe(`${this.id}.disableCol`, (eventName, data) => {
      data.forEach(c => {
        this.rowIds.forEach(r => {
          pubsub.publish(`${c}[${r}].enabled`, false)
        })
      })
    })

    //根据id控制当前列可显示
    pubsub.subscribe(`${this.id}.visibleCol`, (eventName, data) => {
      let columns = _.cloneDeep(this.state.columns)
      data.forEach(c => {
        let index = _.findIndex(columns, {id: c});
        if(index != -1){
          columns[index]["visible"] = true
        }
      })
      this.setState({columns})
    })

    //根据id控制当前列不可显示
    pubsub.subscribe(`${this.id}.InvisibleCol`, (eventName, data) => {
      let columns = _.cloneDeep(this.state.columns)
      data.forEach(c => {
        let index = _.findIndex(columns, {id: c});
        if(index != -1){
          columns[index]["visible"] = false
        }
      })
      this.setState({columns})
    })

    //设置当前行为可编辑
    pubsub.subscribe(`${this.id}.activateRow`, (eventName, data) => {
      let {config: {type = "radio"}} = this.props
      if (data.eventPayload) {
        if (type == "radio") {
          this.setState({
            activeRows: [data.eventPayload]
          })
        } else if (type == "checkbox") {
          this.setState({
            activeRows: _.cloneDeep(data.eventPayload)
          })
        }
      }
    })

    //控制当前列是否可编辑
    pubsub.subscribe(`${this.id}.activateCol`, (eventName, data) => {
      this.setState({
        activeCols: _.cloneDeep(data)
      })
    })

    //设置所有是否可编辑
    pubsub.subscribe(`${this.id}.activateAll`, (eventName, data) => {
      if (data) {
        this.setState({
          activeCols: {},
          unEditable: false
        })
      } else {
        this.setState({
          activeRows: [],
          activeCols: {},
          addRows: [],
          unEditable: !data,
        })
      }
    })

    //清除选中
    pubsub.subscribe(`${this.id}.clearSelect`, (eventName, data) => {
      this.setState({
        selectedKeys: "",
        checkedKeys: []
      })
      pubsub.publish(`${this.id}.onSelectedRowsClear`, null)
    })
  }

  controlDelBtn (ids,status){
    const {config:{rowOperationItem = []}} = this.props
    if(rowOperationItem.length>0){
      rowOperationItem.map(item=>{
        if(ids instanceof Array){
          ids.map(id=>{
            pubsub.publish(`${item.id}[${id}].visible`, status)
          })
        }else {
          pubsub.publish(`${item.id}[${ids}].visible`, status)
        }
      })
    }else{
      if(ids instanceof Array){
        ids.map(id=>{
          pubsub.publish(`delete[${id}].visible`, status)
        })
      }else {
        pubsub.publish(`delete[${ids}].visible`, status)
      }
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.id}.addRow`)
    pubsub.unsubscribe(`${this.id}.activateRow`)
    pubsub.unsubscribe(`${this.id}.activateAll`)
    pubsub.unsubscribe(`${this.id}.clearSelect`)

    pubsub.unsubscribe(`${this.id}.disableRow`)
    pubsub.unsubscribe(`${this.id}.enableRow`)
    pubsub.unsubscribe(`${this.id}.enableCol`)
    pubsub.unsubscribe(`${this.id}.disableCol`)

    pubsub.unsubscribe(`${this.id}.enableAll`)
    pubsub.unsubscribe(`${this.id}.disableAll`)


    pubsub.unsubscribe(`${this.id}.activateCol`)
  }

  componentDidMount() {

    if (this.props.config.mode != "new") {
      this.setState({
        unEditable: this.props.config.unEditable
      })
    }
    else {
      if (this.props.config.unEditable == undefined) {
      }
      else {
        if (this.props.config.unEditable) {


          pubsub.publish(`${this.id}.disableAll`)

        }
        else {
          pubsub.publish(`${this.id}.enableAll`)
        }
      }
    }


  }

  //增行
  handleNewRow = (data) => {
    let {addRows} = this.state
    let {fields, config} = this.props;
    let id = uuid()
    this.rowIds.push(id)

    //增加的行都设置为可编辑
    addRows.push(id)
    this.setState({
      addRows
    })
    if (data && !data.target) {
      fields.push(fromJS(data))
    }
    else {
      fields.push(fromJS({}))
    }
  }

  //单选选择事件
  handleChange = (value) => {
    this.setState({
      selectedKeys: value
    })
    pubsub.publish(`${this.id}.onSelectedRows`, value)
  }

  //多选选择事件
  handleCheck = (e) => {
    let checkedKeys = _.cloneDeep(this.state.checkedKeys)
    let target = e.target
    let index = checkedKeys.indexOf(target.value)
    if (target.checked) {
      checkedKeys.push(target.value)
    } else {
      checkedKeys.splice(index, 1)
    }
    this.setState({
      checkedKeys
    })
    if(checkedKeys.length>0){
      pubsub.publish(`${this.id}.onSelectedRows`, checkedKeys)
    }else{
      pubsub.publish(`${this.id}.onSelectedRowsClear`, [])
    }
   
  }

  render() {
    if (this.state.visible == false)
      return null;
    const {
      fields, input,
      config: {id, mode, form, addButton = true, showSelect = false, type = "radio", showRowDeleteButton = true, rowOperationItem = []},
      meta: {touched, error},
      ...custom
    } = this.props;
    const {unEditable, selectedKeys, checkedKeys, activeRows, activeCols, addRows, columns} = this.state

    //传给行的参数
    const rowConfig = {
      handleChange: this.handleChange.bind(this),
      handleCheck: this.handleCheck.bind(this),
      showSelect,
      type,
      selectedKeys,
      showRowDeleteButton,
      checkedKeys,
      activeCols,
      activeRows,
      unEditable,
      fields,
      columns,
      addRows,
      rowOperationItem,
      form,
      id,
      mode
    }

    let allItems = fields.getAll();
    if (allItems != undefined && allItems.size > 0 && this.rowIds.length != allItems.size) {
      this.rowIds = [];
      allItems.forEach((v, i) => {
        this.rowIds.push(uuid())
      })
    }
    if (allItems == undefined || allItems.size == 0) {
      this.rowIds = [];
    }

    return (
      <TableFieldCss>
        <div className="ant-table ant-table-bordered">
          {addButton && <Button onClick={this.handleNewRow}>添加</Button>}
          <div className="formTable ant-table-body">
            <table>
              <thead className="ant-table-thead">
              <tr>
                {showSelect && <th width="40px"></th>}
                {
                  columns.map((c, j) => {
                    if(c["visible"] !== false){
                      return (
                        <th key={j}>{c.title}</th>
                      )
                    }
                  })
                }
                {
                  showRowDeleteButton &&
                  <th style={{minWidth: "60px"}}>
                    操作
                  </th>
                }
              </tr>

              </thead>
              <tbody className="ant-table-tbody">

              {fields.map((member, rowIndex) => {
                  return <Row key={this.rowIds[rowIndex]} rowIndex={this.rowIds[rowIndex]} index={rowIndex}
                              member={member} rowIds={this.rowIds} {...rowConfig}/>
                }
              )}
              </tbody>
            </table>
          </div>
        </div>
      </TableFieldCss>
    );
  }
}

TableField.propTypes = {};

export default TableField;
