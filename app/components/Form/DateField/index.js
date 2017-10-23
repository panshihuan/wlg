/**
 *
 * DateField
 *
 */

import React from 'react';
import moment from 'moment'
import CoreComponent from 'components/CoreComponent'
import {DatePicker, Form} from 'antd'
import pubsub from 'pubsub-js'
const FormItem = Form.Item;
// import Styled from 'Styled-components';

class DateField extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
  }

  handleClick = (e,dateString) => {
    pubsub.publish(`${this.props.config.id}.onChange`, dateString)
    this.props.input.onBlur(dateString)
    this.props.input.onChange(dateString);
  }

  render() {

    if (this.state.visible == false)
      return null;

    const {
      input, config: {label,showTime=false,onlyTime=false, id, placeholder, labelSpan, wrapperSpan, hasFeedback, showRequiredStar,size}, meta: {asyncValidating, touched, error},
      ...custom
    } = this.props;
    let format
    if(showTime){
      format = "YYYY-MM-DD HH:mm:ss"
    }else if(onlyTime){
      format = "HH:mm:ss"
    }else {
      format = "YYYY-MM-DD"
    }
    if(input.value==""||input.value==undefined)
      {
        input.value=null;
      }else
      {
        input.value=moment(input.value)
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
        <DatePicker value={input.value }
                    {...custom}
                    onChange={this.handleClick}
                    disabled={!this.state.enabled}
                    placeholder={placeholder}
                    showTime={showTime}
                    format={format}
                    size={size}
                    style={{width:"100%"}}
        />
      </FormItem>
    );
  }
}

DateField.propTypes = {};

export default DateField;
