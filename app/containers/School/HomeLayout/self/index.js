/**
 * Created by ASUS on 2017/10/16.
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';

import ReactCoreImageUpload  from 'react-core-image-upload';

import {WhiteSpace, WingBlank,Grid,List,Icon,Button} from 'antd-mobile';
import SelfCss from './styles.js';

const Item = List.Item;
const Brief = Item.Brief;

export class SelfPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    handleRes(e){
        console.log(11,e)
    }

    handleBefore(res){
        console.log(2222,res)
    }


    render() {
        return (
            <SelfCss className="selfCss">
               <List className="selfCss-item">
                   <Item arrow="horizontal" onClick={() => {}}>
                       <span>个人头像</span>
                       <ReactCoreImageUpload
                           className="selfCss-item-icon"
                           inputOfFile="files"
                           url="http://localhost:3000/users/uploads"
                           imageChanged={this.handleBefore}
                           imageUploaded={this.handleRes}>

                           <img src="iconfont/icons/brush-o.svg" alt=""/>

                       </ReactCoreImageUpload>
                   </Item>

               </List>

                <List className="selfCss-item">
                    <Item extra="磐石中学" align="top">
                        学校
                    </Item>
                    <Item extra="张三" arrow="horizontal" onClick={() => {}}>用户名</Item>
                    <Item extra="22222@qq.com" arrow="horizontal" onClick={() => {}}>邮箱</Item>
                    <Item extra="15011111111" arrow="horizontal" onClick={() => {}}>联系电话</Item>
                </List>

                <List className="selfCss-item">
                    <Item extra="小学" arrow="horizontal" onClick={() => {}}>教学阶段</Item>
                    <Item extra="数学" arrow="horizontal" onClick={() => {}}>任教科目</Item>
                </List>

                <List className="selfCss-item">
                    <Item extra="" arrow="horizontal" onClick={() => {}}>密码修改</Item>
                    <Item extra="武汉市汉阳造" arrow="horizontal" onClick={() => {}}>邮寄地址</Item>
                </List>

                <Button className="btn selfCss-btnExit" type="primary">退出登录</Button>

            </SelfCss>
        );
    }
}


SelfPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(SelfPage);
