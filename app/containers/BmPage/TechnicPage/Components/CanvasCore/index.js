import React from 'react';
import pubsub from 'pubsub-js'
import forEach from 'lodash/forEach'


// pubsub的全局注销类
class CanvasCore extends React.Component{
    constructor(props) {
        super(props);
        this.pubsubEvents = {}
    }

    //销毁
    componentWillUnmount(){
        // 遍历注销组件中pubsub订阅
        forEach(this.pubsubEvents, (value, key)=>{
            pubsub.unsubscribe(value);
        })
    }

}

export default CanvasCore;