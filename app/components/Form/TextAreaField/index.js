/**
*
* TextAreaField
*
*/

import React from 'react';
import CoreComponent from 'components/CoreComponent'
import {Input, Form} from 'antd'
import pubsub  from 'pubsub-js'
const FormItem = Form.Item;
const { TextArea } = Input;


class TextAreaField extends CoreComponent {

  constructor(props){
    super(props);
    this.state.hasInputWords = 0; // 已经输入的字符数
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.onChange`)
  }

  handleOnChange=(e)=>{
    if (/^[1-9]\d*$/.test(this.props.config.maxWords)) {
      e.target.value = e.target.value.substring(0, this.props.config.maxWords);
    }
    this.setState({ // 输入框中有change，就会重新render，因此这里setState不会造成额外影响
      hasInputWords: e.target.value.length
    })
    pubsub.publish(`${this.props.config.id}.onChange`, e.target.value)
    this.props.input.onChange(e);
  }

  render() {
    if (this.state.visible == false) {
      return null;
    }

    const {
      input,
      config: {
        label, id, labelSpan, wrapperSpan, hasFeedback, showRequiredStar,
        minRows, maxRows, maxWords
      },
      meta: {asyncValidating, touched, error},
      ...custom
    } = this.props;

    let maxWordsDiv = ``; // 用于显示可输入多少字符的div
    if (/^[1-9]\d*$/.test(maxWords)) {
      if (this.state.hasInputWords == 0) {
        maxWordsDiv = (
          <div style={{float: "right", lineHeight: "1.5"}}>{`最多可输入${maxWords}个字符`}</div>
        );
      } else {
        let lenAllow = maxWords - this.state.hasInputWords;
        maxWordsDiv = (
          <div style={{float: "right", lineHeight: "1.5"}}>{`还可以输入${lenAllow}个字符`}</div>
        );
      }
    }

    return (
    <FormItem
      label={label}
      labelCol={{span: labelSpan == undefined ? "24" : labelSpan}}
      wrapperCol={{span: wrapperSpan == undefined ? "24" : wrapperSpan}}
      hasFeedback={(hasFeedback == undefined || hasFeedback == true) ? true : false}
      validateStatus={asyncValidating ? "validating" : ((touched && error) ? "error" : "")}
      help={touched && error} required={showRequiredStar ? true : false}
    >
      <TextArea
        {...input} {...custom} value={input.value}
        autosize={
          (maxRows <= 0) ? {} : {minRows: (!minRows || minRows < 0) ? 2 : minRows, maxRows: !maxRows ? 6 : maxRows }
        }
        onChange={this.handleOnChange} disabled={!this.state.enabled}
      />
      {maxWordsDiv}
    </FormItem>
    );
  }
}

TextAreaField.propTypes = {};

export default TextAreaField;
