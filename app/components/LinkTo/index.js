/**
 *
 * ExcelComponent
 *
 */

import React from 'react';
import CoreComponent from '../CoreComponent'
import {Button} from 'antd'
import pubsub from 'pubsub-js'
import {Link} from 'react-router'

class LinkToComponent extends CoreComponent {

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  render() {
    var self = this;
    const {id, title,link,hasParm} = this.props.config;

    console.log('children:::',this.props.children)

    return (<div>
            {
                hasParm?<Link>
                    {this.props.children}
                </Link>:
                <Link to={link}>
                    {this.props.children}
                </Link>
            }

      </div>
    );
  }

}

LinkToComponent.propTypes = {};

export default LinkToComponent;
