import React from 'react';
import CoreComponent from '../CoreComponent'
import {Button} from 'antd'
import pubsub from 'pubsub-js'

class AppLinkButton extends CoreComponent { 
  constructor(props) {
    super(props)
    this.dataContext = this.props.data;
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.click`)
  }

  handleClick = () => {
    pubsub.publish(`${this.props.config.id}.click`, {})
    this.props._click && this.props._click()
  }

  render() {
    const {config:{title}} =this.props;
    return (
      this.state.visible &&
      <span>
        <a href="javascript:;" onClick={this.handleClick}>{title==undefined?"":title}</a>
        <span className="ant-divider" />
      </span>
    );
  }
}

AppLinkButton.propTypes = {};

export default AppLinkButton;
