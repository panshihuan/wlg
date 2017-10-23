/**
 * Created by ASUS on 2017/10/13.
 */
/**
 * Created by ASUS on 2017/10/12.
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';

import { TabBar, Icon } from 'antd-mobile';
import HomePage from './Home'
import MenuPage from './Menu'
import SelfPage from './Self'


export class HomeLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'redTab',
            hidden: false,
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    renderContent(pageText) {
        return (
            <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
                <div style={{ paddingTop: 60 }}>你已点击“{pageText}” tab， 当前展示“{pageText}”信息</div>
                <Link to="news" style={{ display: 'block', marginTop: 40, marginBottom: 600, color: '#108ee9' }}
                   onClick={(e) => {
                       e.preventDefault();
                       this.setState({
                           hidden: !this.state.hidden,
                       });
                   }}
                >
                    点击切换 tab-bar 显示/隐藏

                </Link>

                <Icon type="check"/>

            </div>
        );
    }



    render() {
        return (
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
                hidden={this.state.hidden}
            >
                <TabBar.Item
                    title="首页"
                    key="首页"
                    icon={{uri:'iconfont/icons/home.svg'}}
                    selectedIcon={{uri:'iconfont/icons/home-o.svg'}}
                    selected={this.state.selectedTab === 'blueTab'}
                    badge={1}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'blueTab',
                        });
                    }}
                    data-seed="logId"
                >
                    <HomePage />
                </TabBar.Item>
                <TabBar.Item
                    icon={{uri:'iconfont/icons/type.svg'}}
                    selectedIcon={{uri:'iconfont/icons/type-o.svg'}}
                    title="菜单"
                    key="菜单"
                    badge={'new'}
                    selected={this.state.selectedTab === 'redTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'redTab',
                        });
                    }}
                    data-seed="logId1"
                >
                    <MenuPage />
                </TabBar.Item>
                <TabBar.Item
                    icon={{uri:'iconfont/icons/find.svg'}}
                    selectedIcon={{uri:'iconfont/icons/find-o.svg'}}
                    title="发现"
                    key="发现"
                    dot
                    selected={this.state.selectedTab === 'greenTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'greenTab',
                        });
                    }}
                >
                    {this.renderContent('发现')}
                </TabBar.Item>
                <TabBar.Item
                    icon={{uri:'iconfont/icons/user.svg'}}
                    selectedIcon={{uri:'iconfont/icons/user-o.svg'}}
                    title="个人"
                    key="个人"
                    selected={this.state.selectedTab === 'yellowTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'yellowTab',
                        });
                    }}
                >
                    <SelfPage/>
                </TabBar.Item>
            </TabBar>
        );
    }
}

HomeLayout.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(HomeLayout);
