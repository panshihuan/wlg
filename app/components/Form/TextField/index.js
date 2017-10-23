/**
 *
 * TextField
 *
 */

import React from 'react';
import CoreComponent from 'components/CoreComponent'
import {Input, Form} from 'antd'
import pubsub from 'pubsub-js'

const FormItem = Form.Item;

// import Styled from 'Styled-components';


class TextField extends CoreComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.onChange`)
  }

  handleOnChange = (e) => {
    pubsub.publish(`${this.props.config.id}.onChange`, e.target.value)
    this.props.input.onChange(e);
  }

  componentDidMount() {
    pubsub.publish(`${this.props.config.id}.initValue`, this.props.input.value)
  }

  render() {
    if (this.state.visible == false)
      return null;
    const {
      input, config: {label, id, placeholder, labelSpan, wrapperSpan, hasFeedback, showRequiredStar}, meta: {asyncValidating, touched, error},
      ...custom
    } = this.props;
    return (
      <FormItem
        label={label}
        labelCol={{span: labelSpan == undefined ? "8" : labelSpan}}
        wrapperCol={{span: wrapperSpan == undefined ? "16" : wrapperSpan}}
        hasFeedback={(hasFeedback == undefined || hasFeedback) ? true : false}
        validateStatus={asyncValidating ? "validating" : ((touched && error) ? "error" : "")}
        help={touched && error} required={showRequiredStar ? true : false}
      >
        <Input {...input} value={input.value} size="default" {...custom} placeholder={placeholder}
               onChange={this.handleOnChange} disabled={!this.state.enabled}/>
      </FormItem>
    );
  }
}

TextField.propTypes = {};

export default TextField;
