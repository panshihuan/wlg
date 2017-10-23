
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';

import {WhiteSpace, WingBlank,Grid,List,Icon} from 'antd-mobile';
import NewsKey1Css from './styles.js';

export class NewsKey1Page extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <NewsKey1Css>
                <h1>kkkkkk</h1>
            </NewsKey1Css>
        );
    }
}


NewsKey1Page.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(NewsKey1Page);
