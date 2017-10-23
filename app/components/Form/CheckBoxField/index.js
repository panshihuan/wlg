import React from 'react';
import CoreComponent from 'components/CoreComponent'
import { Form,Checkbox } from 'antd'
import pubsub  from 'pubsub-js'
import request from 'utils/request'
import {resolveDataSource} from 'utils/componentUtil'
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
class CheckBoxField extends CoreComponent { 

  constructor(props) {
    super(props)
    this.state = Object.assign({dataSource: []}, this.state)
  }
  componentDidMount() {
    this.fetchSelectData()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.onChange`)
  }

  fetchSelectData = () => {
    resolveDataSource({dataSource:this.props.config.dataSource}).then(function (response) {
      this.setState({dataSource: response.data})
    }.bind(this));
  }

  handleOnChange = (e) => {
    pubsub.publish(`${this.props.config.id}.onChange`, e)
    this.props.input.onChange(e);
  }
  render() {
    let { dataSource } = this.state;
    if (this.state.visible == false)
      return null;
    const {
      input, config, hasFeedback, labelSpan,
      wrapperSpan, showRequiredStar, meta: {asyncValidating, touched, error},
      ...custom
    } = this.props;
    if(input.value==""){
      input.value=[];
    }
    return (
      <FormItem
        label={config.label}
        labelCol={{span: config.labelSpan == undefined ? "8" : config.labelSpan}}
        wrapperCol={{span: config.wrapperSpan == undefined ? "16" : config.wrapperSpan}}
        hasFeedback={(hasFeedback == undefined || hasFeedback == true) ? true : false}
        validateStatus={asyncValidating ? "validating" : ((touched && error) ? "error" : "")}
        help={touched && error} required={showRequiredStar ? true : false}
      >
        <CheckboxGroup  value={input.value} size="default" {...custom} onChange={this.handleOnChange} disabled={!this.state.enabled} >
            {dataSource.map((item,index)=>{
              return <Checkbox key={index} value={item[config.valueField]}>{item[config.displayField]}</Checkbox>
            })}
        </CheckboxGroup>
      </FormItem>
    );
  }
}

CheckBoxField.propTypes = {};

export default CheckBoxField;
