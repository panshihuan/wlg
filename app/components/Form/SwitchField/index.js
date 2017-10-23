/**
 *
 * SwitchField
 *
 */

import React from 'react';
import CoreComponent from 'components/CoreComponent'
import {Input, Form, Switch} from 'antd'
import pubsub from 'pubsub-js'

const FormItem = Form.Item;

// import Styled from 'Styled-components';


class SwitchField extends CoreComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.onChange`)
  }

  handleOnChange = (e) => {
    pubsub.publish(`${this.props.config.id}.onChange`, e)
    if (this.props.config.isNumber)
      this.props.input.onChange(e ? 1 : 0)
    else
      this.props.input.onChange(e)
  }

  render() {
    if (this.state.visible == false)
      return null;
    const {
      input,
      config: {
        label, id, labelSpan, wrapperSpan, isNumber, hasFeedback, defaultChecked, checkedChildren, unCheckedChildren, size,
        minRows, maxRows, showRequiredStar
      },
      meta: {asyncValidating, touched, error},
      ...custom
    } = this.props;

    if (input.value == "" || input.value == undefined || input.value == "false") {
      input.value = false;
    }
    else if (input.value == true || input.value == "true") {

      input.value = true;
    }
    return (
      <FormItem
        label={label}
        labelCol={{span: labelSpan == undefined ? "24" : labelSpan}}
        wrapperCol={{span: wrapperSpan == undefined ? "24" : wrapperSpan}}
        hasFeedback={(hasFeedback == undefined || hasFeedback == true) ? true : false}
        help={touched && error} required={showRequiredStar ? true : false}
      >
        <Switch {...input}
                checked={input.value}
                defaultChecked={defaultChecked}
                checkedChildren={checkedChildren}
                unCheckedChildren={unCheckedChildren}
                size={size}
                disabled={!this.state.enabled}
                onChange={this.handleOnChange} {...custom}
        />
      </FormItem>
    );
  }
}

SwitchField.propTypes = {};

export default SwitchField;
