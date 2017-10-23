/**
 *
 * FindbackField
 *
 */

import React from 'react';
// import Styled from 'Styled-components';
import pubsub from 'pubsub-js'
import CoreComponent from 'components/CoreComponent'
import ModalContainer from 'components/ModalContainer'
import AppTable from 'components/AppTable';
import {Form, Input} from 'antd';
import uuid from 'uuid/v4'
import {fromJS} from "immutable"
import {resolveDataSource, publishEvents, resolveFetch, resolveDataSourceCallback} from 'utils/componentUtil'

const Search = Input.Search;
const FormItem = Form.Item;


class FindbackField extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
    this.state = Object.assign({
      displayValue: ""
    }, this.state)


    pubsub.subscribe(`${props.config.id}.setDisplayValue`, (name, eventPayload) => {
      this.setState({displayValue: eventPayload})

    })
    this.selectedRows = false
    this.modalId = uuid() //参照弹出层id
  }

  componentWillReceiveProps(nextProp)
  {
    if(this.props.input.value!=""&&nextProp.input.value=="")
    {

      this.setState({displayValue:""})
    }
  }

  componentDidMount() {
    const {
      config: {tableInfo, rowIndex},
      input: {value}
    } = this.props
    let tableId = ""

    if (value !== "") {
      this.fetchFindData()
    }

    if (rowIndex != undefined) {
      tableId = `${tableInfo.id}[${rowIndex}]`
    }
    else {
      tableId = tableInfo.id
    }

    pubsub.subscribe(`${tableId}.onSelectedRows`, ((e, selectedRows) => {
      this.selectedRows = _.get(selectedRows, 0)
    }));
    pubsub.subscribe(`${tableId}.onRowDoubleClick`, ((e, record) => {
      this.selectedRows = record
      this.setFormValue()
      pubsub.publish(`${ this.modalId}.onCancel`)
    }));

    pubsub.subscribe(`${ this.modalId}.onOk`, () => {
      this.setFormValue()
    });

  }

  fetchFindData() {

    if (this.props.config.dataSource != undefined)

      resolveDataSource({
        dataSource: this.props.config.dataSource,
        eventPayload: {eventPayload: this.props.input.value}
      }).then(function (response) {
        this.selectedRows = response.data
        this.setFormValue()
      }.bind(this));

    else {
      // resolveFetch({fetch: {data: "@@formValues", id: this.props.config.form}}).then(function (data) {
      //
      //   if(this.props.config.rowIndex!=undefined)
      //   {
      //     //可编辑表格情况
      //     if (data != undefined && data.size > 0) {
      //       let result = data.toJS();
      //       let rowIndex=this.props.index;
      //       let currentRow=result[rowIndex];
      //       if(currentRow)
      //       {
      //         //todo: set displayValue
      //
      //
      //       }
      //
      //     }
      //   }
      //   else
      //   {
      //     //todo: 非可编辑表格情况
      //   }
      //
      // }.bind(this))
    }
  }

  setFormValue = () => {
    const {
      config: {associatedFields, form, displayField, valueField, rowIndex, id},
      input: {name}
    } = this.props
    const selectedRows = this.selectedRows
    if (!selectedRows) {
      return
    }

    this.setState({displayValue: _.get(selectedRows, displayField)})
    this.props.input.onChange(_.get(selectedRows, valueField.from));
    associatedFields && associatedFields.forEach(item => {
      let newName = "";
      let value = _.get(selectedRows, item["from"]);
      if (rowIndex != undefined) {
        newName = `${name.split('.')[0]}.${item["to"]}`
      } else {
        newName = item["to"];
      }
      if(value == undefined){
        value = ""
      }
      pubsub.publish("@@form.change", {
        id: form,
        name: newName,
        value: fromJS(value)
      })
    })
    pubsub.publish(`${id}.onChange`, this.selectedRows);
  }



  componentWillUnmount() {
    super.componentWillUnmount()
    const {tableInfo, rowIndex,id} = this.props.config
    let tableId = ""

    if (rowIndex != undefined) {
      tableId = `${tableInfo.id}[${rowIndex}]`
    }
    else {
      tableId = tableInfo.id
    }

    pubsub.unsubscribe(`${tableId}.onRowDoubleClick`)
    pubsub.unsubscribe(`${tableId}].onSelectedRows`)
    pubsub.unsubscribe(`${this.props.config.id}.setDisplayValue`)
    pubsub.unsubscribe(`${ this.modalId}.onOk`)
  }

  handleSearch = (e) => {
    this.props.input.onBlur()
    const {enabled} = this.state
    const {config: {pageId, rowIndex,id}} = this.props
    pubsub.publish(`${id}.findClick`);
    if (!enabled) {
      return
    }
    if (rowIndex != undefined) {
      pubsub.publish(`${pageId}[${rowIndex}].openModal`, e);
      
    } else {
      pubsub.publish(`${pageId}.openModal`, e);
      
    }
  }

  render() {
    const {
      input,
      config: {label, id, labelSpan, wrapperSpan, hasFeedback, rowIndex, showRequiredStar, size, tableInfo, pageId,
        width=900,style={top:50},title},
      meta: {asyncValidating, touched, error},
      ...custom
    } = this.props;

    return (
      <FormItem
        label={label}
        labelCol={{span: labelSpan == undefined ? "8" : labelSpan}}
        wrapperCol={{span: wrapperSpan == undefined ? "16" : wrapperSpan}}
        validateStatus={asyncValidating ? "validating" : ((touched && error) ? "error" : "")}
        help={touched && error} required={showRequiredStar ? true : false}
      >
        <Search
          {...input}
          value={this.state.displayValue || input.value || ""}
          disabled={true}
          placeholder="请选择"
          onSearch={this.handleSearch}
          size={size}
        />

        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: this.modalId, // id，必填*
          pageId: rowIndex != undefined ? `${pageId}[${rowIndex}]` : `${pageId}`, // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          title: title, // title，不传则不显示title
          width: width, // 宽度，默认520px
          style: style, // style样式
          wrapClassName: "wcd-center", // class样式
        }}
        >
          <AppTable name={rowIndex != undefined ? `${tableInfo.id}[${rowIndex}]` : tableInfo.id} config={{
            id: rowIndex != undefined ? `${tableInfo.id}[${rowIndex}]` : tableInfo.id,
            name: rowIndex != undefined ? `${tableInfo.id}[${rowIndex}]` : tableInfo.id,
            size: tableInfo.size,//表格尺寸
            rowKey: tableInfo.rowKey,//主键
            tableTitle: tableInfo.tableTitle,//表头信息
            columns: tableInfo.columns,
            subscribes: tableInfo.subscribes,
            onLoadData: tableInfo.onLoadData,
            dataSource: tableInfo.dataSource,
            showSerial: tableInfo.showSerial,  //序号
            rowIndex:rowIndex,
            width: tableInfo.width,   //表格宽度
            editType: false,  //操作
            type: "radio",//表格单选复选类型
            isSearch:tableInfo.isSearch,
            rowOperationItem:tableInfo.rowOperationItem,
            isPager:tableInfo.isPager,
            isUpdown:tableInfo.isUpdown,
            isSelectable:tableInfo.isSelectable,
            showHeader:tableInfo.showHeader
          }}/>
        </ModalContainer>
      </FormItem>
    );
  }
}

FindbackField.propTypes = {};

export default FindbackField;
