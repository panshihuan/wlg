/**
 *
 * AutoCompleteField
 *
 */

import React from 'react';
import pubsub from 'pubsub-js'
import {AutoComplete, Form} from 'antd'
import CoreComponent from '../../CoreComponent'
import request from 'utils/request'
import {resolveDataSource} from 'utils/componentUtil'

const FormItem = Form.Item;
const Option = AutoComplete.Option;
/* ,*/
/* */

/**/
class AutoCompleteField extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
    this.state = Object.assign({dataSource: []}, this.state)
  }


  componentDidMount() {
    this.fetchSelectData()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.onSelect`)
    pubsub.unsubscribe(`${this.props.config.id}.onSearch`)
    pubsub.unsubscribe(`${this.props.config.id}.onChange`)
  }

  fetchSelectData = () => {
    resolveDataSource({dataSource:this.props.config.dataSource}).then(function (response) {
      this.setState({dataSource: response.data})
    }.bind(this));
  }

  handleSelect = (e) => {
    pubsub.publish(`${this.props.config.id}.onSelect`, e)
  }

  handleSearch = (e) => {
    pubsub.publish(`${this.props.config.id}.onSearch`, e)
  }

  handleOnChange = (e) => {
    pubsub.publish(`${this.props.config.id}.onChange`, e)
    this.props.input.onChange(e);
  }

  render() {
    const {
      config: {label, id, labelSpan, wrapperSpan, hasFeedback, showRequiredStar, placeholder, displayField, valueField,size},
      input,
      meta: {asyncValidating, touched, error},
      ...custom
    } = this.props;
    const children = this.state.dataSource.map((data) => {
      return <Option key={data[valueField]}>{data[displayField]}</Option>;
    });
    return (
      <div>
        {this.state.visible && <FormItem
          label={label}
          labelCol={{span: labelSpan == undefined ? "8" : labelSpan}}
          wrapperCol={{span: wrapperSpan == undefined ? "16" : wrapperSpan}}
          hasFeedback={(hasFeedback == undefined || hasFeedback == true) ? true : false}
          validateStatus={asyncValidating ? "validating" : ((touched && error) ? "error" : "")}
          help={touched && error} required={showRequiredStar ? true : false}
        >
          <AutoComplete
            {...input}
            style={{width: "100%"}}
            {...custom}
            onSelect={this.handleSelect}
            onSearch={this.handleSearch}
            onChange={this.handleOnChange}
            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            placeholder={placeholder}
            disabled={!this.state.enabled}
            size={size}
          >{children}
          </AutoComplete>
        </FormItem>}
      </div>
    );
  }
}

AutoCompleteField.propTypes = {};

export default AutoCompleteField;
