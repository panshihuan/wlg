/**
 *
 * TreeSelectField
 *
 */

import React from 'react';
import CoreComponent from 'components/CoreComponent'
import {TreeSelect,Form} from 'antd'
import pubsub from 'pubsub-js'
import {resolveDataSource} from 'utils/componentUtil'

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;

// import Styled from 'Styled-components';


class TreeSelectField extends CoreComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)
    this.state = Object.assign({dataSource: []}, this.state)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  componentDidMount() {
    this.fetchSelectData()
  }

  fetchSelectData = () => {
    resolveDataSource({dataSource:this.props.config.dataSource}).then(function (response) {
      this.setState({dataSource: response.data})
    }.bind(this));
  }

  handleOnChange=(e)=>{
    let select = e
    // const {config:{treeCheckStrictly,treeCheckable}} = this.props
    // if(treeCheckStrictly && treeCheckable){
    //   select = []
    //   e.map(item=>{
    //     select.push(item["value"])
    //   })
    // }
    pubsub.publish(`${this.props.config.id}.onChange`, select)
    this.props.input.onChange(select);
  }

  render() {
    if (this.state.visible == false)
      return null;
    const {
      input,
      config: {
        label, id,placeholder, labelSpan, treeCheckStrictly,displayField, valueField,wrapperSpan, hasFeedback,
        showRequiredStar, treeCheckable, showSearch, dropdownMatchSelectWidth
      },
      meta: {asyncValidating,touched, error},
      ...custom
    } = this.props;

    if(treeCheckable && input.value == ""){
      input.value = []
    }

    const loop = data => data.map((item) => {
      if (item.childs) {
        return (
          <TreeNode key={item[valueField]} value={item[valueField]} title={item[displayField]} >
            {loop(item.childs)}
          </TreeNode>
        );
      }
      return <TreeNode key={item[valueField]} value={item[valueField]} title={item[displayField]} />;
    });

    return (
      <FormItem
        label={label}
        labelCol={{span: labelSpan == undefined ? "8" : labelSpan}}
        wrapperCol={{span: wrapperSpan == undefined ? "16" : wrapperSpan}}
        hasFeedback={(hasFeedback == undefined || hasFeedback) ? true : false}
        validateStatus={asyncValidating ? "validating" : ((touched && error) ? "error" : "")}
        help={touched && error} required={showRequiredStar ? true : false}
      >
        <TreeSelect {...input}
                    value={input.value}
                    size="default"
                    style={{width: "100%"}}
                    {...custom}
                    placeholder = {placeholder}
                    disabled={!this.state.enabled}
                    onChange={this.handleOnChange}
                    treeCheckable={treeCheckable}
                    treeCheckStrictly={treeCheckStrictly}
                    showSearch={showSearch}
                    dropdownMatchSelectWidth={dropdownMatchSelectWidth}
                    treeNodeFilterProp="title"
        >
          {loop(this.state.dataSource)}
        </TreeSelect>
      </FormItem>
    );
  }
}

TreeSelectField.propTypes = {};

export default TreeSelectField;
