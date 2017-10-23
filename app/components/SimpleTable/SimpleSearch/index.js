import React from 'react';
import pubsub from 'pubsub-js'
import {Table, Row, Col, Input, Button,Icon } from 'antd'
import request from 'utils/request'
import CoreComponent from 'components/CoreComponent'
import {resolveDataSource} from 'utils/componentUtil'
import {Link,hashHistory} from 'react-router'

class SimpleSearch extends CoreComponent {
    constructor(props) {
        super(props)
        this.state = Object.assign({
            fuzzyValue:"",
            columns:[]
        }, this.state);
        console.log(props);
      }
    componentDidMount() {
       
    }
    componentWillUnmount() {
        super.componentWillUnmount()
    }
    //模糊搜索(按钮)
    fuzzySearch = (value) =>{
        this.setState({fuzzyValue:value});
        pubsub.publish("")
    }
    //enter触发快速搜索
    quickSearch = (e) =>{
        this.setState({fuzzyValue:e.target.value});
    }
    render() {
        return (
            <div>
                <Search
                    addonBefore="关键字"
                    size="large"
                    placeholder="input search text"
                    onSearch={this.fuzzySearch}
                    onPressEnter = {this.quickSearch}
                    />
            </div>
          )
    }
}

SimpleSearch.propTypes = {};

export default SimpleSearch;