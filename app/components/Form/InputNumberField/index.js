/**
 *
 * InputNumberField
 *
 */

import React from 'react';
import CoreComponent from 'components/CoreComponent'
import {Input, Form,InputNumber } from 'antd'
import pubsub from 'pubsub-js'
import InputNumberCss from '../../Styled/InputNumber/index'

const FormItem = Form.Item;

class InputNumberField extends CoreComponent {

  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.onChange`)
  }

  handleOnChange=(e)=>{
    pubsub.publish(`${this.props.config.id}.onChange`, e)
    this.props.input.onChange(e);
  }
  handleOnBlur=(e)=>{
    this.props.input.onBlur(e);
  }
  handleOnFocus=(e)=>{
    this.props.input.onFocus(e);
  }

  render() {

    if (this.state.visible == false){
        return null;
    }

    const {
        input,
        config: {label, id, labelSpan, wrapperSpan,formatter,size,min,max,hasFeedback,step, showRequiredStar},
        meta: {asyncValidating, touched, error},
        ...custom
    } = this.props;

    return (
        <InputNumberCss>
            <FormItem
                label={label}
                labelCol={{span: labelSpan == undefined ? "8" : labelSpan}}
                wrapperCol={{span: wrapperSpan == undefined ? "16" : wrapperSpan}}
                hasFeedback={(hasFeedback == undefined || hasFeedback) ? true : false}
                validateStatus={asyncValidating ? "validating" : ((touched && error) ? "error" : "")}
                help={touched && error} required={showRequiredStar ? true : false}
            >
              <InputNumber
                  size={size}
                  min={min}
                  max={max}
                  step={step}
                  value={input.value}
                  // formatter={value =>
                  //     (formatter=="percent"?`${value}%`:formatter=="rmb"?`￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','):null)
                  // }
                  // parser={value =>
                  //     (formatter=="percent"?value.replace('%', ''):formatter=="rmb"?value.replace(/\￥\s?|(,*)/g, ''):null)
                  // }
                  disabled={!this.state.enabled}
                  onChange={this.handleOnChange}
                  //onBlur={this.handleOnBlur} //与redux-form的onBlur冲突
                  onFocus={this.handleOnFocus}
                  {...custom}
              />
            </FormItem>
        </InputNumberCss>
    );
  }
}

InputNumberField.propTypes = {};

export default InputNumberField;
