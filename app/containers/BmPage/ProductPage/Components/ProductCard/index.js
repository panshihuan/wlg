import React from 'react';
import pubsub from 'pubsub-js'
import {Card, Row, Icon, Col} from 'antd'


// pubsub的全局注销类
class ProductCard extends React.Component{
    //构造
    constructor(props) {
        super(props);

    }

    //不用
    componentWillMount() {
    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {
    }
    //销毁
    componentWillUnmount() {
    }


    initSubscribe() {
    }

    //不用
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <Card key={this.props.item.gid}  className={'productCard'} bodyStyle={{ padding: 0 }}>
                <div className="media" >
                    <div className="media-left">
                        <div className="media-object"></div>
                    </div>
                    <div className="media-body">
                        <ul>
                            <li>{this.props.item.materialGidRef.code}</li>
                            <li>{this.props.item.materialGidRef.name}</li>
                        </ul>
                    </div>
                </div>
                <div className='control-bottom'>
                    <Row>
                        <Col offset={12} span={12} style={{textAlign:'right'}}>
                            <Icon type="edit" />
                            <Icon type="ellipsis" />
                        </Col>
                    </Row>
                </div>
            </Card>
        )
    }


}

export default ProductCard;