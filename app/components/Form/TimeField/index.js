/**
 *
 * TimeField
 *
 */

import React from 'react';
import moment from 'moment'
import CoreComponent from 'components/CoreComponent'
import {TimePicker, Form} from 'antd'
import pubsub from 'pubsub-js'
const FormItem = Form.Item;

class TimeField extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
  }

  handleClick = (e,timeString) => {
    pubsub.publish(`${this.props.config.id}.onChange`, timeString)
    this.props.input.onBlur(timeString)
    this.props.input.onChange(timeString);
  }

  render() {
    if (this.state.visible == false)
      return null;

    const {
      input,
      config: {label,id, placeholder, labelSpan, wrapperSpan, hasFeedback, showRequiredStar,size, format="HH:mm:ss"},
      meta: {asyncValidating, touched, error},
      ...custom
    } = this.props;

    if(input.value==""||input.value==undefined) {
      input.value=null;
    }else {
      input.value=moment(input.value,format)
    }

    return (
      <FormItem
        label={label}
        labelCol={{span: labelSpan == undefined ? "8" : labelSpan}}
        wrapperCol={{span: wrapperSpan == undefined ? "16" : wrapperSpan}}
        hasFeedback={(hasFeedback == undefined || hasFeedback) ? true : false}
        validateStatus={asyncValidating ? "validating" : ((touched && error) ? "error" : "")}
        help={touched && error} required={showRequiredStar ? true : false}
      >
        <TimePicker value={input.value}
                    {...custom}
                    onChange={this.handleClick}
                    disabled={!this.state.enabled}
                    placeholder={placeholder}
                    format={format}
                    size={size}
                    style={{width:"100%"}}
        />
      </FormItem>
    );
  }
}

TimeField.propTypes = {};

export default TimeField;
