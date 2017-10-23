/**
*
* DropdownField
*
*/

import React from 'react';
import CoreComponent from 'components/CoreComponent'
import {Menu, Dropdown, Button,Icon} from 'antd'
import pubsub from 'pubsub-js'
import request from 'utils/request'
import {resolveDataSource} from 'utils/componentUtil'


class DropdownField extends CoreComponent { 

  constructor(props) {
    super(props)
    this.state = Object.assign({dataSource: []}, this.state)
      pubsub.subscribe(`${this.props.config.id}.itemEnabled`,(eventName,payload)=>{
          let {dataSource} = this.state;
          let copyData = _.cloneDeep(dataSource); 
          payload&&payload.map((item)=>{
            let element = _.find(copyData,{key:item.key});
            element["enabled"] = item["enabled"];
          })
          this.setState({
            dataSource:copyData
          })
      })
  }

  componentDidMount() {
    this.fetchSelectData()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.onClick`)
  }

  fetchSelectData = () => {
     resolveDataSource({dataSource:this.props.config.dataSource}).then(function (response) {
      this.setState({dataSource: response.data})
    }.bind(this)); 
  }

 handleMenuClick = (e) => {
   pubsub.publish(`${this.props.config.id}.onClick`, e.key)
} 

  render(){
    const {
     config: {id, name, displayField, valueField,type,size},
      ...custom
    } = this.props;
    const children = this.state.dataSource.map((data,index) => {
      return <Menu.Item disabled={data.enabled == undefined?false:!data.enabled} key={index}>
      {data[displayField]}
      </Menu.Item>;
    });

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {children}
      </Menu>
    )

    if (this.state.visible == false)
      return null;
    return (
       <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']} {...custom} disabled = {!this.state.enabled}>
         <Button  type={type == undefined?"default":type} size={size == undefined?"default":size}>{name}<Icon type="down" /></Button>
       </Dropdown>
    );
  }
}

DropdownField.propTypes = {};

export default DropdownField;
