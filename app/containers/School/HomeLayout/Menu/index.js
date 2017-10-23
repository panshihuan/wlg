
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';

import {WhiteSpace, WingBlank,Grid,List,Icon} from 'antd-mobile';
import MenuCss from './styles.js';
import qzl from 'images/qzl.jpg'

const Item = List.Item;
const Brief = Item.Brief;

const data = Array.from(new Array(9)).map((_val, i) => ({
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    text: `name${i}`,
}));

export class MenuPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: ['', '', ''],
            initialHeight: 200,
        }
    }

    componentDidMount() {
        // simulate img loading
        setTimeout(() => {
            this.setState({
                data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
            });
        }, 100);
    }

    render() {
        const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
        return (
        <MenuCss>
            <div className="menuCss">
                <div className="menuCss-bar">
                    <div className="menuCss-bar-left">
                        <img src={qzl} alt=""/>
                    </div>
                    <div className="menuCss-bar-right">
                        <p>张三</p>
                        <p>13666666666</p>
                    </div>
                </div>

                <div className="menuCss-middle">
                    <div className="menuCss-middle-sch">
                        <span>磐石中学</span>
                    </div>
                </div>

                <div className="menuCss-content">
                    <div className="menuCss-content-item">
                        <Link to="news">
                            <p className="news-o"></p>
                            <p className="menuCss-content-item-text">news</p>
                        </Link>
                    </div>
                    <div className="menuCss-content-item">
                        <p className="kao"></p>
                        <p className="menuCss-content-item-text">考试</p>
                    </div>
                    <div className="menuCss-content-item">
                        <p className="kebiao"></p>
                        <p className="menuCss-content-item-text">课表</p>
                    </div>
                </div>
                <div className="menuCss-content">
                    <div className="menuCss-content-item">
                        <p className="zuoye"></p>
                        <p className="menuCss-content-item-text">作业</p>
                    </div>
                    <div className="menuCss-content-item">
                        <p className="shequ"></p>
                        <p className="menuCss-content-item-text">公共社区</p>
                    </div>
                    <div className="menuCss-content-item">
                        <Link to="address">
                            <p className="phone-o"></p>
                            <p className="menuCss-content-item-text">通讯录</p>
                        </Link>
                    </div>
                </div>
                <div className="menuCss-content">
                    <div className="menuCss-content-item">
                        <p className="teacher"></p>
                        <p className="menuCss-content-item-text">教师部落</p>
                    </div>
                    <div className="menuCss-content-item">
                        <p className="xc"></p>
                        <p className="menuCss-content-item-text">个人行程</p>
                    </div>
                    <div className="menuCss-content-item">
                        <p className="xc"></p>
                        <p className="menuCss-content-item-text">优秀作品展</p>
                    </div>
                </div>
                {/*<Grid data={data} columnNum={3} />*/}
            </div>
        </MenuCss>
        );
    }
}


MenuPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(MenuPage);
