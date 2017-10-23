
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';

import {WhiteSpace, WingBlank,Grid,List,Icon,Tabs} from 'antd-mobile';
import NewsCss from './styles.js';
const TabPane = Tabs.TabPane;

import PhoneListView from 'components/PhoneListView'

export class NewsPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    callback(key) {
    }
    handleTabClick(key) {
    }

    render() {
        return (
            <NewsCss>
                <Tabs defaultActiveKey="1" onChange={this.callback} pageSize={5} onTabClick={this.handleTabClick}>
                    {/*{makeMultiTabPane(11)}*/}
                    <TabPane tab="要闻" key={1}>
                        <PhoneListView config={{
                            id:'news-listView-1',
                            dataSource:{
                                type: 'api',
                                method: 'get',
                                url: '/messages',
                            }
                        }}/>
                            {/*<PhoneListView config={{*/}
                                {/*id:'news-listView-1',*/}
                                {/*dataSource:{*/}
                                    {/*type: 'api',*/}
                                    {/*method: 'post',*/}
                                    {/*url: '/ime/imePlanOrder/query.action',*/}
                                {/*}*/}
                            {/*}}/>*/}
                    </TabPane>
                    <TabPane tab="公告1" key={2}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff' }}>

                        </div>
                    </TabPane>
                    <TabPane tab="校园天地" key={3}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff' }}>
                            校园天地
                        </div>
                    </TabPane>
                    <TabPane tab="德育" key={4}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff' }}>
                            德育
                        </div>
                    </TabPane>
                    <TabPane tab="体育" key={5}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff' }}>
                            体育
                        </div>
                    </TabPane>
                    <TabPane tab="看常德" key={6}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff' }}>
                            看常德
                        </div>
                    </TabPane>
                    <TabPane tab="其他" key={7}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff' }}>
                            其他
                        </div>
                    </TabPane>
                </Tabs>
            </NewsCss>
        );
    }
}


NewsPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(NewsPage);
