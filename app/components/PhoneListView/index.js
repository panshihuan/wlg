
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
    resolveDataSource,
    resolveFetch,
    resolveDataSourceCallback,
} from 'utils/componentUtil'
import pubsub from 'pubsub-js'
import { Link } from 'react-router';

import {WhiteSpace, WingBlank,RefreshControl, ListView,Icon} from 'antd-mobile';
import PhoneCss from './styles.js';

const data = [
    {
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        title: 'Meet hotel',
        des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
        img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
        title: 'McDonald\'s invites you',
        des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
        img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
        title: 'Eat the week',
        des: '不是所有的兼职汪都需要风吹日晒',
    },
];

let index;

const NUM_ROWS = 10;
let pageIndex = 0;

function genData(pIndex = 0) {
    const dataArr = [];
    for (let i = 0; i < NUM_ROWS; i++) {
        dataArr.push(`row - ${(pIndex * NUM_ROWS) + i}`);
    }
    return dataArr;
}

export class PhoneListView extends React.PureComponent {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            data,
            dataSource,
            refreshing: true,
            height: document.documentElement.clientHeight,
            pageIndex:1,
            pageSize:10
        };
    }

    requestData(pageIndex=1){
        if(this.props.config.dataSource.method=='get'){
            return resolveDataSource({dataSource: this.props.config.dataSource}).then(pd=>{
                return pd.data
            })
        }else{
            return resolveDataSource({dataSource: this.props.config.dataSource,eventPayload:{pager:{page:pageIndex,pageSize:this.state.pageSize}}}).then(pd=>{
                console.log('pd:::',pd)
                return pd.data
            })
        }

    }

    componentDidMount() {
        // Set the appropriate height
        setTimeout(() => this.setState({
            height: this.state.height - this.lv.offsetTop,
        }), 0);

        // handle https://github.com/ant-design/ant-design-mobile/issues/1588
        this.lv.getInnerViewNode().addEventListener('touchstart', this.ts = (e) => {
            this.tsPageY = e.touches[0].pageY;
        });
        // In chrome61 `document.body.scrollTop` is invalid
        const scrollNode = document.scrollingElement ? document.scrollingElement : document.body;
        this.lv.getInnerViewNode().addEventListener('touchmove', this.tm = (e) => {
            this.tmPageY = e.touches[0].pageY;
            if (this.tmPageY > this.tsPageY && this.scrollerTop <= 0 && scrollNode.scrollTop > 0) {
                console.log('start pull to refresh');
                this.domScroller.options.preventDefaultOnTouchMove = false;
            } else {
                this.domScroller.options.preventDefaultOnTouchMove = undefined;
            }
        });
    }

    componentWillUnmount() {
        this.lv.getInnerViewNode().removeEventListener('touchstart', this.ts);
        this.lv.getInnerViewNode().removeEventListener('touchmove', this.tm);
    }

    onScroll = (e) => {
        this.scrollerTop = e.scroller.getValues().top;
        this.domScroller = e;
    };

    onRefresh = () => {
        console.log('onRefresh');
        if (!this.manuallyRefresh) {
            this.setState({ refreshing: true });
        } else {
            this.manuallyRefresh = false;
        }

        // simulate initial Ajax
            this.requestData().then((rData)=>{
                this.rData=rData;
                index=rData.length-1;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(rData),
                    refreshing: false,
                    showFinishTxt: true,
                });
                if (this.domScroller) {
                    this.domScroller.scroller.options.animationDuration = 500;
                }
            });

    };

    onEndReached = (event) => {
        console.log('reach end', event);
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }

        this.setState({ isLoading: true });

        this.requestData(++this.state.pageIndex).then(pd=>{
            this.rData = [...this.rData, ...pd];
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
            });
        })


    };

    scrollingComplete = () => {
        // In general, this.scrollerTop should be 0 at the end, but it may be -0.000051 in chrome61.
        if (this.scrollerTop >= -1) {
            this.setState({ showFinishTxt: false });
        }
    };

    renderCustomIcon() {
        return [
            <div key="0" className="am-refresh-control-pull">
                <span>{this.state.showFinishTxt ? '刷新完毕' : '下拉可以刷新'}</span>
            </div>,
            <div key="1" className="am-refresh-control-release">
                <span>松开立即刷新</span>
            </div>,
        ];
    }

    render() {
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: '0.4rem',
                    borderTop: '1px solid #ECECED',
                    borderBottom: '1px solid #ECECED',
                }}
            />
        );

        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = this.rData.length - 1;
            }
            const obj = this.rData[index--];

            return (
                <div key={rowID}
                     style={{
                         padding: '0 0.6rem',
                         backgroundColor: 'white',
                     }}
                >
                    {/*<div style={{ height: '2rem', lineHeight: '2rem', color: '#888', fontSize: '0.72rem', borderBottom: '2px solid #ddd' }}>*/}
                        {/*{obj.title}*/}
                    {/*</div>*/}
                    <div style={{ display: '-webkit-box', display: 'flex', padding: '0.6rem' }}>
                        {obj.code}
                        {/*<img style={{ height: '2.52rem', width: '2.52rem', marginRight: '0.6rem' }} src={obj.code} alt="icon" />*/}
                        {/*<div style={{ display: 'inline-block' }}>*/}
                            {/*<div style={{ marginBottom: '0.32rem', color: '#000', fontSize: '0.64rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '10rem' }}>{obj.code}-{rowData}</div>*/}
                            {/*<div style={{ fontSize: '0.64rem' }}><span style={{ fontSize: '1.2rem', color: '#FF6E27' }}>{rowID}</span> 元/任务</div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            );
        };


        return (
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderHeader={() => <span>Pull to refresh</span>}
                    renderFooter={() => (<div style={{ padding: '0.6rem', textAlign: 'center' }}>
                        {this.state.isLoading ? 'Loading...' : 'Loaded'}
                    </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    initialListSize={5}
                    pageSize={5}
                    style={{
                        height: this.state.height,
                        border: '2px solid #ddd',
                        margin: '0.2rem 0',
                    }}
                    scrollerOptions={{ scrollbars: true, scrollingComplete: this.scrollingComplete }}
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                        icon={this.renderCustomIcon()}
                    />}
                    onScroll={this.onScroll}
                    scrollRenderAheadDistance={400}
                    scrollEventThrottle={40}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={30}
                />
        );
    }
}


PhoneListView.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(PhoneListView);
