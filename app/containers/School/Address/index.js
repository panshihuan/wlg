/**
 * Created by ASUS on 2017/10/17.
 */


import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';

import {WhiteSpace, WingBlank,Grid,List,Icon} from 'antd-mobile';
import AddressCss from './styles.js';


const data = Array.from(new Array(9)).map((_val, i) => ({
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    text: `name${i}`,
}));

export class AddressPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
        return (
            <AddressCss>
                <h1>通讯录</h1>
            </AddressCss>
        );
    }
}


AddressPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(AddressPage);

