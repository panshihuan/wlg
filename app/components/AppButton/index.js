/**
 *
 * AppButton
 *
 */

import React from 'react';
import CoreComponent from '../CoreComponent'
import {Button} from 'antd'
import pubsub from 'pubsub-js'

// import Styled from 'Styled-components';


class AppButton extends CoreComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  handleClick = () => {
    pubsub.publish(`${this.props.config.id}.click`, {})
  }

  render() {
    const {config:{title,type,size,ghost}} =this.props;
    return (
      this.state.visible &&
      <Button ghost={ghost == undefined?false:ghost} disabled={!this.state.enabled} type={type == undefined?"default":type} size={size == undefined?"default":size} style={{marginLeft: 3}} onClick={this.handleClick}>
        {title}
      </Button>
    );
  }
}

AppButton.propTypes = {};

export default AppButton;
