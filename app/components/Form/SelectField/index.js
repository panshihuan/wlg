/**
 *
 * SelectField
 *
 */

import React from 'react';
import CoreComponent from 'components/CoreComponent'
// import Styled from 'Styled-components';
import {Select, Form} from 'antd';
import pubsub from 'pubsub-js'
import {reduxForm, Field} from 'redux-form/immutable'
import {resolveDataSource} from 'utils/componentUtil'

const Option = Select.Option;
const FormItem = Form.Item;

class SelectField extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
    this.state = Object.assign({dataSource: []}, this.state)
    this.handleChange = this.handleChange.bind(this);


    pubsub.subscribe(`${props.config.id}.loadData`, (eventName, payload) => {

      this.setState({dataSource: []}, () => {
        props.input.onChange("")
        resolveDataSource({dataSource: this.props.config.dataSource, eventPayload: payload}).then(function (response) {
          this.setState({dataSource: response.data})
        }.bind(this));
      })


    })

      pubsub.subscribe(`${props.config.id}.setData`, (eventName, payload) => {
          this.setState({dataSource: payload}, () => {
              props.input.onChange("")
          })
      })
  }

  handleChange(v) {
    this.props.input.onChange(v);
    pubsub.publish(`${this.props.config.id}.onChange`, v)

    //
  }

  handleSelect = (e) => {
    pubsub.publish(`${this.props.config.id}.onSelect`, e)
  }

  handleDeselect = (v) => {
    pubsub.publish(`${this.props.config.id}.onDeselect`, v)
  }

  handleSearch = (v) => {
    pubsub.publish(`${this.props.config.id}.onSearch`, v)
  }

  handleBlur = (v) => {
    pubsub.publish(`${this.props.config.id}.onBlur`, v)
  }

  handleFocus = (v) => {
    pubsub.publish(`${this.props.config.id}.onFocus`, v)
  }

  componentDidMount() {

    if (this.props.config.loadDataOnLoad == undefined || this.props.config.loadDataOnLoad)
      this.fetchSelectData()
  }


  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.loadData`)
      pubsub.unsubscribe(`${this.props.config.id}.setData`)

  }

  fetchSelectData = () => {
    resolveDataSource({dataSource: this.props.config.dataSource}).then(function (response) {
      this.setState({dataSource: response.data})
    }.bind(this));
  }

  render() {
    if (this.state.visible == false)
      return null;
    const {
      input,config, config:{hasFeedback, labelSpan,
      wrapperSpan, showRequiredStar}, meta: {asyncValidating, touched, error},
      ...custom
    } = this.props;
    if (input.value == "" || input.value == null)
      input.value = undefined;
    const children = this.state.dataSource.map((data) => {
      return <Option key={data[config.valueField]} value={data[config.valueField]}>{data[config.displayField]}</Option>;
    });

    return (
      <div>
        {this.state.visible && <FormItem label={config.label}
                                         labelCol={{span: labelSpan == undefined ? "8" : labelSpan}}
                                         wrapperCol={{span: wrapperSpan == undefined ? "16" : wrapperSpan}}
                                         hasFeedback={(hasFeedback == undefined || hasFeedback == true) ? true : false}
                                         validateStatus={asyncValidating ? "validating" : ((touched && error) ? "error" : "")}
                                         help={touched && error} required={showRequiredStar ? true : false}>
          <Select {...input} style={{width:"100%"}} onChange={this.handleChange} onSelect={this.handleSelect}
                  onDeselect={this.handleDeselect} onSearch={this.handleSearch}
                  onBlur={this.handleBlur} onFocus={this.handleFocus} mode={config.mode} multiple={config.multiple}
                  tags={config.tags} combobox={config.combobox}
                  allowClear={config.allowClear} filterOption={config.filterOption} placeholder={config.placeholder}
                  notFoundContent={config.notFoundContent} size={config.size} showSearch={config.showSearch}
                  disabled={!this.state.enabled} defaultActiveFirstOption={config.defaultActiveFirstOption}
                  dropdownStyle={config.dropdownStyle} dropdownClassName={config.dropdownClassName}
                  labelInValue={config.labelInValue} tokenSeparators={config.tokenSeparators} {...custom}>
            {children}
          </Select>
        </FormItem>}
      </div>
    );
  }
}

SelectField.propTypes = {};

export default SelectField;
