/*
 *
 * Login
 *
 */
import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Card } from 'antd';
import { Row, Col } from 'antd';
import { Icon, Input, Button, Checkbox } from 'antd'
import { Select } from 'antd';
import { reduxForm } from 'redux-form/immutable'
import request from '../../utils/request';
const Option = Select.Option;
import pubsub from 'pubsub-js'
import Background from '../../images/bg.jpg';


export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.login = this.login.bind(this);
    this.state = Object.assign({},{
      userName: '',
      passWord: '',
      group: [],
      gid:'',
      busiGroupName:'',
      msg: ''
    },this.state);
  }
  static propTypes = {
    children: React.PropTypes.node,
  };

  componentDidMount() {
    request('/sm/busiGroup/query.action',{
      method:"POST",
      // headers: {
      //   "Content-Type":"application/x-www-form-urlencoded"
      // },
      body: ""
    }).then(response => {
      this.setState({
        group : response.data
      });
    }).catch(error => {
      this.setState({
        group:[
          {gid:1,busiGroupName:"东软集团",busiGroupCode:"code1" },
          {gid:2,busiGroupName:"华为集团",busiGroupCode:"code2" },
          {gid:3,busiGroupName:"联想集团",busiGroupCode:"code3" }
        ]
      });
    });

    // this.setState({
    //   group:[
    //     {gid:1,busiGroupName:"东软集团",busiGroupCode:"code1" },
    //     {gid:2,busiGroupName:"华为集团",busiGroupCode:"code2" },
    //     {gid:3,busiGroupName:"联想集团",busiGroupCode:"code3" }
    //   ]
    // });
  }

  handleChange (value ) {
    this.state.group.map((item) => {
      if(item.gid == value) {
        this.setState({
          gid: item.gid,
          busiGroupName: item.busiGroupName
        });
      }
    });


    // this.setState({
    //   groupValue: '',
    //   gid: '',
    //   busiGroupName: ''
    // });
  }

  handleBlur () {

  }

  handleFocus (){

  }

  onChangeUserName = (e) => {
    this.setState({ userName: e.target.value });
  }

  onChangePassWord = (e) => {
    this.setState({ passWord: e.target.value });
  }

  login() {
    this.setState({msg: ""});

    // console.log(this.state.busiGroupName,this.state.gid);

    if (this.state.group == "") {
      this.setState({ msg: '* 业务组不能为空，请重新输入' });
      return false;
    }
    if (this.state.userName == "") {
      this.setState({ msg: '* 用户名不能为空，请重新输入' });
      return false;
    }
    if (this.state.passWord == "") {
      this.setState({ msg: '* 密码不能为空，请重新输入' });
      return false;
    }

    request('/login.action',{
      method:"POST",
      headers: {
        "Content-Type":"application/x-www-form-urlencoded"
      },
      body: "username=" + this.state.userName + "&password="+ this.state.passWord + "&gid="+ this.state.gid + "&busiGroupName="+ this.state.busiGroupName
    }).then(response => {
      if(response.success) {
        localStorage.setItem("schemeList",JSON.stringify(response.data.schemeList));
        localStorage.setItem("user",JSON.stringify(response.data.user));
        localStorage.setItem("token",response.data.token);
        localStorage.setItem("busiGroupName", this.state.busiGroupName);
        pubsub.publish("@@navigator.push",{url:"/home"})
      } else {
        this.setState({ msg: "* 用户名或密码输入错误，请重新输入" });
      }
    });


  }

  render() {

    const { userName,passWord,group,msg,groupValue } = this.state;
    var children = group.map((item,index,array) => {
      return <Option key={item.gid}>{item.busiGroupName}</Option>
    });
    return (

      <div style={{ width:'100%',height:'100%',background: `url(${Background}) no-repeat`,backgroundSize:'cover' }}>
            <Helmet
                    title="Login"
                    meta={[
                { name: 'description', content: 'Description of Login' },
            ]}
            />
        <Card title="登录" extra={<h2>IME</h2>} style={{ width: 420,height:400,position:'absolute',left:'50%',top:'50%',marginLeft:'-210px',marginTop:'-200px',padding: '30px 50px',borderRadius:'10px' }}>
          <form name="loginForm" method="post">
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6} style={{paddingTop: "5px"}}>
                业&nbsp;&nbsp;务&nbsp;&nbsp;组：
              </Col>
              <Col span={18}>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="请选择业务组"
                  optionFilterProp="children"
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {children}
                </Select>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6} style={{paddingTop: "6px"}}>
                用&nbsp;&nbsp;户&nbsp;&nbsp;名：
              </Col>
              <Col span={18}>
                  <div>
                    <Input  value={ userName } name="username" onChange={this.onChangeUserName} prefix={<Icon type="user" style={{ fontSize: 18 }} />} size="large" placeholder="请输入用户名" />
                  </div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6} style={{paddingTop: "6px"}}>
                密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：
              </Col>
              <Col span={18}>
                <Input name="password" value={ passWord } onChange={this.onChangePassWord} prefix={<Icon type="lock" style={{ fontSize: 18 }} />} size="large" type="password" placeholder="请输入密码" />
              </Col>
            </Row>
            <Row style={{ marginBottom: '30px' }}>
              <Col span={24}>
                <Checkbox>记住密码</Checkbox>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ marginBottom: '30px' }}>
                  <Button type="primary" style={{width: '100%'}} onClick={this.login} size="large" className="login-form-button">
                      登录
                  </Button>
            </Col>
            </Row>
            <Row>
              <Col span={24} style={{ marginBottom: '20px' }}>
                <span style={{color:"red"}}>{msg}</span>
              </Col>
            </Row>

          </form>
        </Card>
        <footer style={{ textAlign: 'center', position: 'absolute', bottom: '60px',width:'100%',fontSize: '14px', color:'#ffffff'}}>Copyright &copy; 2017 北京东软慧聚信息技术股份有限公司. All rights reserved. </footer>
      </div>
  );
  }
}




Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
  form: "loginForm"
})(Login)
