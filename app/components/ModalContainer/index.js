/**
 *
 * ModalContainer
 *
 */

import React from 'react';
import pubsub from 'pubsub-js';
import { Modal } from 'antd';
import CoreComponent from 'components/CoreComponent';

class ModalContainer extends CoreComponent {
  static propTypes = {
    children: React.PropTypes.node,
  };

  constructor(props) {
    super(props);
    // Object.assign(props, {visible: false});
    this._modalRef = {}; // 用于关闭非modal模式下的弹出框
  }

  componentDidUpdate() {
  }

  componentDidMount() {
    pubsub.subscribe(`${this.props.config.pageId}.openModal`, () => {
      this.setState({visible: true});
      if (this.props.config.type != "modal") {
        this.callOtherModal();
      }
    })

    pubsub.subscribe(`${this.props.config.id}.onCancel`, () => {
      this.setState({visible: false});
    })
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.onOk`);
    pubsub.unsubscribe(`${this.props.config.id}.onCancel`);
    pubsub.unsubscribe(`${this.props.config.id}.afterClose`);
    pubsub.unsubscribe(`${this.props.config.pageId}.openModal`);
  }

  handleOk = (e) => {
    this.setState({visible: false});
    if (this.props.config.type != "modal") {
      this._modalRef.destroy();
    }
    pubsub.publish(`${this.props.config.id}.onOk`, e);
  }

  handleCancel = (e) => {
    this.setState({visible: false});
    if (this.props.config.type != "modal") {
      this._modalRef.destroy();
    }
    pubsub.publish(`${this.props.config.id}.onCancel`, e);
  }

  handleAfterClose = (e) => {
    pubsub.publish(`${this.props.config.id}.afterClose`, e);
  }

  callOtherModal = () => {
    if (this.state.visible == false) {
      return null;
    }
    switch (this.props.config.type) {
      case "info":
        this._modalRef = Modal.info({
          title: this.props.config.title,
          width: this.props.config.width,
          okText: this.props.config.okText,
          cancelText: this.props.config.cancelText,
          maskClosable: this.props.config.maskClosable,
          content: this.props.config.content,
          onOk: this.handleOk,
          onCancel: this.handleCancel
        });
        break;
      case "success":
        this._modalRef = Modal.success({
          title: this.props.config.title,
          width: this.props.config.width,
          okText: this.props.config.okText,
          cancelText: this.props.config.cancelText,
          maskClosable: this.props.config.maskClosable,
          content: this.props.config.content,
          onOk: this.handleOk,
          onCancel: this.handleCancel
        });
        break;
      case "error":
        this._modalRef = Modal.error({
          title: this.props.config.title,
          width: this.props.config.width,
          okText: this.props.config.okText,
          cancelText: this.props.config.cancelText,
          maskClosable: this.props.config.maskClosable,
          content: this.props.config.content,
          onOk: this.handleOk,
          onCancel: this.handleCancel
        });
        break;
      case "warning":
        this._modalRef = Modal.warning({
          title: this.props.config.title,
          width: this.props.config.width,
          okText: this.props.config.okText,
          cancelText: this.props.config.cancelText,
          maskClosable: this.props.config.maskClosable,
          content: this.props.config.content,
          onOk: this.handleOk,
          onCancel: this.handleCancel
        });
        break;
      case "confirm":
        this._modalRef = Modal.confirm({
          title: this.props.config.title,
          width: this.props.config.width,
          okText: this.props.config.okText,
          cancelText: this.props.config.cancelText,
          maskClosable: this.props.config.maskClosable,
          content: this.props.config.content,
          onOk: this.handleOk,
          onCancel: this.handleCancel
        });
        break;
    }
  }

  render() {
    if (this.state.enabled == false || this.state.visible==false) {
      return null;
    }

    const {
      config: {
        id, // id 必填
        pageId, // 页面id必填
        type = "modal", // 调用modal的模式：modal info success error warning confirm
        title, // 头部描述
        width, // 宽度
        okText = "确定", // ok按钮
        cancelText = "取消", // cancel按钮
        maskClosable = true, // 点击蒙层是否允许关闭
        content, // 内容描述, modal模式没有该属性
        closable = false, // 右上角关闭按钮, modal模式才有该属性
        wrapClassName, // 自定义样式class, modal模式才有该属性
        style, // 自定义style, modal模式才有该属性
        hasFooter = true, // 是否有footer, modal模式才有该属性
      }
    } = this.props;

    if (type != "modal") {
      return null;
    }

    let modalDiv = ``;

    if (hasFooter) {
      modalDiv = (
        <Modal
          visible={this.state.visible}
          title={title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          afterClose={this.handleAfterClose}
          closable={closable}
          width={width}
          okText={okText}
          cancelText={cancelText}
          wrapClassName={wrapClassName}
          style={style}
          maskClosable={maskClosable}
        >
          {React.Children.toArray(this.props.children)}
        </Modal>
      );
    } else {
      modalDiv = (
        <Modal
          visible={this.state.visible}
          title={title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          afterClose={this.handleAfterClose}
          closable={closable}
          width={width}
          okText={okText}
          cancelText={cancelText}
          wrapClassName={wrapClassName}
          style={style}
          maskClosable={maskClosable}
          footer={null}
        >
          {React.Children.toArray(this.props.children)}
        </Modal>
      );
    }

    return (
      <div>
        {this.state.visible&&modalDiv}
      </div>
    );
  }
}

ModalContainer.propTypes = {};

export default ModalContainer;
