import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import forEach from 'lodash/forEach'


class CanvasBaseForm extends React.Component {
    constructor(props) {
        super(props)
        this.pubsubEvents = {}
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        // 遍历注销组件中pubsub订阅
        forEach(this.pubsubEvents, (value, key)=>{
            pubsub.unsubscribe(value);
        })
    }

    componentWillReceiveProps(nextProps) {
    }

}


export default CanvasBaseForm;