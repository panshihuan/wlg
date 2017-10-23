import React from 'react'
import {reduxForm, Field} from 'redux-form/immutable'
import uuid from 'uuid/v4'
import pubsub from 'pubsub-js'
import TextField from 'components/Form/TextField'
import TextAreaField from 'components/Form/TextAreaField'
import DateField from 'components/Form/DateField'
import SwitchField from 'components/Form/SwitchField'
import SelectField from 'components/Form/SelectField'
import AutoCompleteField from 'components/Form/AutoCompleteField'
import InputNumberField from 'components/Form/InputNumberField'
import UploadField from 'components/Form/UploadField'
import FindbackField from 'components/Form/FindbackField'
import TreeSelectField from 'components/Form/TreeSelectField'

export class Cell extends React.PureComponent {
	constructor(props) {
		super();
	}

	renderElement(column, columnIndex, member, rowIndex,index,activeRows,activeCols,addRows,unEditable,mode) {

    let isRowEnabled=column.enabled;
    if(mode!="new") {
      isRowEnabled = unEditable === true ? false : column.enabled === undefined ? true : column.enabled;

      //设置新增行可编辑
      if (addRows.find((a) => a === rowIndex) !== undefined) {
        isRowEnabled = column.enabled === undefined ? true : column.enabled;
      }
      //设置可编辑列
      if (activeCols.cols && activeCols.cols.find((a) => a === column.name) !== undefined) {
        isRowEnabled = activeCols.type
      }
      //设置可编辑行
      if (activeRows.find((a) => a === rowIndex) !== undefined) {
        isRowEnabled = column.enabled === undefined ? true : column.enabled;
      }

      pubsub.publish(`${column.id}[${rowIndex}].enabled`, isRowEnabled)
    }
		if (column.type === "textField") {
			return <Field
				key={`${column.id}.${columnIndex}.${rowIndex}`}
				config={{
					id: `${column.id}[${rowIndex}]`,
					subscribes: column.subscribes,
          rowIndex: rowIndex,
          enabled:isRowEnabled,
					wrapperSpan: 24,
					size:'default'
				}}
				name={`${member}.${column.name}`}
				component={TextField}
			/>
		} else if (column.type === "textAreaField") {
			return <Field
				key={`${column.id}.${columnIndex}.${rowIndex}`}
				config={{
					id: `${column.id}[${rowIndex}]`,
					subscribes: column.subscribes,
          rowIndex: rowIndex,
          enabled:isRowEnabled,
					wrapperSpan: 24,
					size:'default'
				}}
				name={`${member}.${column.name}`}
				component={TextAreaField}
			/>
		} else if (column.type === "dateField") {
			return <Field
				key={`${column.id}.${columnIndex}.${rowIndex}`}
				config={{
					id: `${column.id}[${rowIndex}]`,
					subscribes: column.subscribes,
          rowIndex: rowIndex,
          enabled:isRowEnabled,
					wrapperSpan: 24,
          showTime:column.showTime,
					size:'default'
				}}
				name={`${member}.${column.name}`}
				component={DateField}
			/>
		} else if (column.type === 'selectField') {
			return <Field
				key={`${column.id}.${columnIndex}.${rowIndex}`}
				config={{
					id: `${column.id}[${rowIndex}]`,
					dataSource: column.dataSource,
					displayField: column.displayField,
					valueField: column.valueField,
					loadDataOnLoad: column.loadDataOnLoad,
					rowIndex: rowIndex,
          enabled:isRowEnabled,
					subscribes: column.subscribes,
					wrapperSpan: 24,
					size:'default'
				}}
				name={`${member}.${column.name}`}
				component={SelectField}
			/>
		} else if (column.type === 'switchField') {
			return <Field
				key={`${column.id}.${columnIndex}.${rowIndex}`}
				config={{
					id: `${column.id}[${rowIndex}]`,
          checkedChildren:column.checkedChildren,
          unCheckedChildren:column.unCheckedChildren,
					subscribes: column.subscribes,
          rowIndex: rowIndex,
          enabled:isRowEnabled,
					wrapperSpan: 24,
					isNumber:column.isNumber
				}}
				name={`${member}.${column.name}`}
				component={SwitchField}
			/>
		} else if (column.type === 'autoCompleteField') {
			return <Field
				key={`${column.id}.${columnIndex}.${rowIndex}`}
				config={{
					id: `${column.id}[${rowIndex}]`,
					dataSource: column.dataSource,
					displayField: column.displayField,
					valueField: column.valueField,
					subscribes: column.subscribes,
          rowIndex: rowIndex,
          enabled:isRowEnabled,
					wrapperSpan: 24,
					size:'default'
				}}
				name={`${member}.${column.name}`}
				component={AutoCompleteField}
			/>
		} else if (column.type === 'InputNumberField') {
      return <Field
        key={`${column.id}.${columnIndex}.${rowIndex}`}
        config={{
          id: `${column.id}[${rowIndex}]`,
          subscribes: column.subscribes,
          min:column.min,
          max:column.max,
          formatter:column.formatter,
          step:column.step,
          rowIndex: rowIndex,
          enabled:isRowEnabled,
          wrapperSpan: 24,
          size:'default',
        }}
        name={`${member}.${column.name}`}
        component={InputNumberField}
      />
		} else if (column.type === 'uploadField') {
      return <Field
        key={`${column.id}.${columnIndex}.${rowIndex}`}
        config={{
          id: `${column.id}[${rowIndex}]`,
          typeFile:column.typeFile||"else",
          rowIndex: rowIndex,
          enabled:isRowEnabled,
          size:'default',
          width: column.width,  //弹窗的宽度
          style: column.style,  //弹窗样式
          title: column.title,
        }}
        name={`${member}.${column.name}`}
        component={UploadField}
      />
		} else if (column.type === 'findbackField') {

      return <Field
				key={`${column.id}.${columnIndex}.${rowIndex}`}
				config={{
          id: `${column.id}[${rowIndex}]`,
          dataSource: column.dataSource,
          displayField: column.displayField,
          valueField: column.valueField,
          subscribes: column.subscribes,
          form:column.form,
          associatedFields:column.associatedFields,
          tableInfo:column.tableInfo,
          pageId:column.pageId,
          enabled:isRowEnabled,
          wrapperSpan: 24,
          rowIndex: rowIndex,
					index:index,
          size:'default',
        }}
				name={`${member}.${column.name}`}
				component={FindbackField}
			/>
    } else if (column.type === 'treeSelectField') {

      return <Field
				key={`${column.id}.${columnIndex}.${rowIndex}`}
				config={{
          id: `${column.id}[${rowIndex}]`,
          dataSource: column.dataSource,
          displayField: column.displayField,
          valueField: column.valueField,
          subscribes: column.subscribes,
          form:column.form,
          enabled:isRowEnabled,
          wrapperSpan: 24,
          rowIndex: rowIndex,
          treeCheckStrictly:column.treeCheckStrictly,
          treeCheckable: column.treeCheckable,
          showSearch:column.showSearch,
          dropdownMatchSelectWidth: column.dropdownMatchSelectWidth,
          size:'default',
        }}
				name={`${member}.${column.name}`}
				component={TreeSelectField}
			/>
    }
	}

	render() {
		const {rowIndex, member, column, columnIndex,index,activeRows,activeCols,addRows,unEditable,mode} = this.props;
		// console.log(this.props)
		return <td>
			{this.renderElement(column, columnIndex, member, rowIndex,index,activeRows,activeCols,addRows,unEditable,mode)}
		</td>
	}
}

Cell.propTypes = {}

export default Cell
