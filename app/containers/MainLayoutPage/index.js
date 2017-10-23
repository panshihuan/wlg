/**
 *
 * MainLayoutPage.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import {Layout, Menu, Dropdown, Icon, Button, Row, Col, Tooltip, Input} from 'antd';
import {Link} from 'react-router';
import request from '../../utils/request';
import uri from '../../utils/config';

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import withSizes from 'react-sizes';
import pubsub from 'pubsub-js';
import {Icons} from "../../images";
import {IemContent, ImeHeader, ImeSider, SiderHeader} from "./styles";
import {Small} from "../../global-styles";
import {Logo} from "../../images/index";


class MainLayoutPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      userName: '', // 用户名
      busiGroupName: '', // 业务组名
      planOption: (<Menu.Item></Menu.Item>), // 方案选项
      planOptionName: '',// 方案名称
      group: (<Menu.Item></Menu.Item>), // 业务组选项
      siderCollapsed: false, // Sider缩进
    };
    Object.assign(this.state, {
      menu: (
        <Menu
          mode="inline"
          defaultSelectedKeys={['home']}
        >
          <Menu.Item key="home">
            <Link to="/home">
              <Icon type="home"/>
              <span>首页</span>
            </Link>
          </Menu.Item>
        </Menu>
      ),
    });
  }

  static propTypes = {
    children: React.PropTypes.node,
  };

  // 菜单缩进功能
  toggleSiderCollapsed = () => {
    const collapsed = !this.state.siderCollapsed;
    this.setState({
      siderCollapsed: collapsed
    });
  };

  // 构建菜单
  buildMenu(smSchemeGid) {
    let user = localStorage.getItem('user');
    try {
      user = JSON.parse(user);
    } catch (error) {
      user = {};
    }
    let dataParam = {};
    if (user) {
      Object.assign(dataParam, {'userId': user.gid});
    }
    if (smSchemeGid) {
      Object.assign(dataParam, {'smSchemeGid': smSchemeGid});
    }
    request('/sm/menu/findMenuByUserId.action', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(dataParam)
    }).then(response => {
      if (response.success) {
        const menuAry = response.data;
        const children = this.getRecursiveMenu(menuAry);
        const menu = this.genMenu(children);
        this.setMenuState(menu);
      }
    })
  }

  // 获取递归后的菜单
  getRecursiveMenu(menuAry) {
    if (!menuAry || menuAry.length <= 0) {
      return null;
    }
    return menuAry.map((data) => { // 迭代每条数据，拼接成数组并返回
      if (data.childs && data.childs.length > 0) {
        // 如果有子菜单，则将当前父级元素最为SubMenu，并递归调用子菜单
        const children = this.getRecursiveMenu(data.childs);
        return (
          <SubMenu key={data.gid || ""}
                   title={<span><Icon type="appstore"/><span>{data.menuName || "菜单项"}</span></span>}>
            {children}
          </SubMenu>
        );
      } else {
        // 如果没有子菜单，则当前元素为菜单节点
        data.appUrl = (data.appUrl || "").replace(/%26/g, '&');
        let openModelPM = false; // 是否跳转到建模平台，遇到 application/previewBefore 的url就跳转到 IME建模平台
        if (data.appUrl.indexOf('application/previewBefore') != -1) {
          openModelPM = true;
        }
        return (
          <Menu.Item key={data.gid || ""}>
            {openModelPM ?
              <a href={uri.modelPlatformUrl + data.appUrl} target="_blank">
                <Icon type="ellipsis"/>
                <span>{data.menuName || "菜单项"}</span>
              </a>
              :
              <Link to={data.appUrl}>
                <Icon type="ellipsis"/>
                <span>{data.menuName || "菜单项"}</span>
              </Link>
            }
          </Menu.Item>
        );
      }
    });
  }

  // 生成menu
  genMenu(children) {
    const menu = (
      <Menu
        mode="inline"
        defaultSelectedKeys={['home']}
        inlineIndent={20}
      >
        <Menu.Item key="home">
          <Link to="/home">
            <Icon type="home"/>
            <span>首页</span>
          </Link>
        </Menu.Item>
        {children}
      </Menu>
    );
    return menu;
  }

  // 构建菜单后，更新菜单
  setMenuState(menu) {
    this.setState({
      menu: menu
    });
  }

  // 获取方案选项
  getPlanOption() {
    let schemeList = localStorage.getItem('schemeList');
    try {
      schemeList = JSON.parse(schemeList);
    } catch (error) {
      schemeList = [];
    }

    if (!schemeList || !Array.isArray(schemeList)) {
      return (
        <Menu className="main-header">
        </Menu>
      );
    }
    const children = schemeList.map((data) => {
      return (
        <Menu.Item key={data.gid} type='planOption' name={data.schemeName}>
          <a href="javascript:;">{data.schemeName}</a>
        </Menu.Item>
      );
    });
    return children;
  }
  //获取业务组
  getGroups() {
    request('/sm/busiGroup/query.action',{
      method:"POST",
      body: ""
    }).then(res => {
      const groups = res.data.map((data) => {
        return (
          <Menu.Item key={data.gid} type='groups' name={data.busiGroupName}>
            <a href="javascript:;">{data.busiGroupName}</a>
          </Menu.Item>
        )
      });
      this.setState({
        groups: groups
      });
    }).catch(err => { console.error('获取业务组失败：', err) });
  }
  // 方案和业务组change事件
  handleClick = (e) => {
    if(e.item.props.type === 'planOption'){
      if (e.key === "init") {
        this.buildMenu();
      } else {
        this.buildMenu(e.key);
      }
      this.setState({ planOptionName: e.item.props.name })
    }else if(e.item.props.type === 'groups'){
      //此处应该有操作
      this.setState({ busiGroupName: e.item.props.name })
    }

  };
  componentWillMount() {
    let user = localStorage.getItem('user');
    try {
      user = JSON.parse(user);
    } catch (error) {
      user = {};
    }
    let userName = "";
    if (user) {
      userName = user.userName;
    }
    let busiGroupName = localStorage.getItem('busiGroupName');
    if (!busiGroupName) {
      busiGroupName = "";
    }
    let planOption = this.getPlanOption();
    this.getGroups();
    this.setState({
      userName: userName,
      planOption: planOption,
      busiGroupName: busiGroupName,
    });

    this.buildMenu();
  }

  // 退出系统
  logout() {
    request('/loginOut.action', {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }).then(response => {
      if (response.success) {
        localStorage.removeItem("schemeList");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("busiGroupName");
        pubsub.publish("@@navigator.push", {url: "/login"});
      }
    }).catch(error => {
      localStorage.removeItem("schemeList");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("busiGroupName");
      pubsub.publish("@@navigator.push", {url: "/login"});
    })
  }

  // 跳转至设计器
  jumpToDesigner() {
    window.open(uri.modelPlatformUrl);
  }
  render() {
    const demoMenu = (
      <Menu
        mode="inline"
        inlineIndent={20}
      >
        <SubMenu key="sub1" title={<span><Icon type="appstore"/><span>demo菜单</span></span>}>
          <Menu.Item key="layout">
            <Link to="/ImeLayoutPage">
              <Icon type="appstore"/>
              <span>各类布局</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="page1">
            <Link to="/page1">
              <Icon type="appstore"/>
              <span>页面一</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="uploadPage">
            <Link to="/uploadPage">
              <Icon type="minus-square-o"/>
              <span>uploadPage</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="selectFieldPage">
            <Link to="/selectFieldPage">
              <Icon type="ellipsis"/>
              <span>selectFieldPage</span>
            </Link>
          </Menu.Item>
          <SubMenu title={<span><Icon type="desktop"/><span>生产管理</span></span>}>
            <Menu.Item key="imeOrder">
              <Link to="/imeOrder">
                <Icon type="book"/>
                <span>订单工作台</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="imeWorkOrder">
              <Link to="/imeWorkOrder">
                <Icon type="book"/>
                <span>工单工作台</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="imeDispatch">
              <Link to="/imeDispatch">
                <Icon type="book"/>
                <span>生产派工单</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="imeDispatchRecord">
              <Link to="/imeDispatchRecord">
                <Icon type="book"/>
                <span>报工记录</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="orderIssueRule">
              <Link to="/orderIssueRule">
                <Icon type="check-square-o"/>
                <span>订单下发规则（ L ）</span>
              </Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="appTable">
            <Link to="/appTable">
              <Icon type="check"/>
              <span>AppTable</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="casePage">
            <Link to="/casePage">
              <Icon type="check-square-o"/>
              <span>案例页面</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="treeFieldPage">
            <Link to="/treeFieldPage">
              <Icon type="check-square-o"/>
              <span>treeFieldPage</span>
            </Link>
          </Menu.Item>
          <SubMenu title={<span><Icon type="desktop"/><span>业务建模</span></span>}>
            <SubMenu title={<span><Icon type="desktop"/><span>物流</span></span>}>
              <Menu.Item key="imeDistributionType">
                <Link to="/imeDistributionType">
                  <Icon type="check-square-o"/>
                  <span>配送类型</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="imeLogisticsMode">
                <Link to="/imeLogisticsMode">
                  <Icon type="check-square-o"/>
                  <span>物料配送方式</span>
                </Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu title={<span><Icon type="desktop"/><span>设置</span></span>}>
              <Menu.Item key="imeLogisticsTime">
                <Link to="/imeLogisticsTime">
                  <Icon type="check-square-o"/>
                  <span>物料时间方案</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="imeLogisticsChooes">
                <Link to="/imeLogisticsChooes">
                  <Icon type="check-square-o"/>
                  <span>物料选择规则</span>
                </Link>
              </Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu title={<span><Icon type="desktop"/><span>物流管理</span></span>}>
            <Menu.Item key="imeLogisticsWork">
              <Link to="/imeLogisticsWork">
                <Icon type="check-square-o"/>
                <span>物流工单</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="imeLogisticsDispatch">
              <Link to="/imeLogisticsDispatch">
                <Icon type="check-square-o"/>
                <span>物流派工单</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="imeLogisticsDistributionList">
              <Link to="/imeLogisticsDistributionList">
                <Icon type="check-square-o"/>
                <span>物流配送单</span>
              </Link>
            </Menu.Item>
            <SubMenu title={<span><Icon type="desktop"/><span>设置</span></span>}>
              <Menu.Item key="imeWorkRule">
                <Link to="/imeWorkRule">
                  <Icon type="check-square-o"/>
                  <span> 物流工单生单规则</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="imeDistributionRule">
                <Link to="/imeDistributionRule">
                  <Icon type="check-square-o"/>
                  <span>物流配送单生单规则</span>
                </Link>
              </Menu.Item>
            </SubMenu>
          </SubMenu>

          <SubMenu title={<span><Icon type="desktop"/><span>业务建模(质量)</span></span>}>
            <SubMenu title={<span><Icon type="desktop"/><span>质量</span></span>}>
              <Menu.Item key="imeFixtureFile">
                <Link to="/imeFixtureFile">
                  <Icon type="check-square-o"/>
                  <span>检具档案</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="imeQualityGrade">
                <Link to="/imeQualityGrade">
                  <Icon type="check-square-o"/>
                  <span>质量等级</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="imeQualityInspectionMethod">
                <Link to="/imeQualityInspectionMethod">
                  <Icon type="check-square-o"/>
                  <span>质检方式</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="imeQualityInspectionItems">
                <Link to="/imeQualityInspectionItems">
                  <Icon type="check-square-o"/>
                  <span>质检项目</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="imeDefectInformation">
                <Link to="/imeDefectInformation">
                  <Icon type="check-square-o"/>
                  <span>缺陷信息</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="imeQualityStandard">
                <Link to="/imeQualityStandard">
                  <Icon type="check-square-o"/>
                  <span>质检标准</span>
                </Link>
              </Menu.Item>
            </SubMenu>
          </SubMenu>


          <SubMenu title={<span><Icon type="desktop"/><span>质量管理</span></span>}>
            <Menu.Item key="imeFixtureFile">
              <Link to="/qualityDispatch">
                <Icon type="check-square-o"/>
                <span>派检单</span>
              </Link>
            </Menu.Item>
          </SubMenu>


        </SubMenu>

      </Menu>
    );
    return (
      <Layout>
        <ImeHeader>
          <div className="logo">
            <img className="img-responsive inline" src={Logo}/>
          </div>
          <Row type="flex" justify="space-between">
            <Col>
              <Row type="flex" justify="space-between" gutter={16}>
                <Col>
                  <Button type="primary" onClick={this.toggleSiderCollapsed}>
                    <Icon type={this.state.siderCollapsed ? 'menu-unfold' : 'menu-fold'}/>
                  </Button>
                </Col>
                <Col>
                  <Input
                    size="large"
                    placeholder="输入搜索内容..."
                    suffix={<Icon type="search" />}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Menu
                mode="horizontal"
                onClick={this.handleClick}
              >
                {/*<SubMenu title={<span>个人中心&nbsp;&nbsp;<Icon type="down"/></span>}>
                  <Menu>
                    <Menu.Item>
                      <a href="javascript:;" onClick={this.jumpToDesigner}>建模平台</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="javascript:;">用户信息</a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href="javascript:;">修改密码</a>
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item>
                      <a href="javascript:;" onClick={this.logout}>退出</a>
                    </Menu.Item>
                  </Menu>
                </SubMenu>*/}
                <SubMenu title={<span>方案{this.state.planOptionName? '：'+this.state.planOptionName:''}&nbsp;&nbsp;<Icon type="down"/></span>} >
                  {this.state.planOption}
                </SubMenu>
                <SubMenu title={<span>业务组{this.state.busiGroupName? '：'+this.state.busiGroupName:''}&nbsp;&nbsp;<Icon type="down"/></span>} >
                  {this.state.groups}
                </SubMenu>
                <Menu.Item className="menu-item-icon">
                  <Tooltip placement="bottom" title='通知'>
                    <a href="javascript:;">
                      <Icon type="bell" />
                    </a>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item className="menu-item-icon">
                  <Tooltip placement="bottom" title='皮肤'>
                    <a href="javascript:;">
                      <Icon type="skin" />
                    </a>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item className="menu-item-icon">
                  <Tooltip placement="bottom" title='注销' onClick={this.logout}>
                    <a href="javascript:;" >
                      <Icon type="logout" />
                    </a>
                  </Tooltip>
                </Menu.Item>
              </Menu>
            </Col>
          </Row>
        </ImeHeader>
        <ImeSider collapsed={this.state.siderCollapsed}>
          <Layout className="h-full">
            <Sider
              width="230"
              trigger={null}
              collapsible
              collapsed={this.state.siderCollapsed}
            >
              <SiderHeader collapsed={this.state.siderCollapsed}>
                <a href="javascript:;">
                  <img className="img-responsive rounded w-xxs inline" src={Icons.a0}/>
                  <span> {this.state.userName?  this.state.userName:'未登录'} </span>
                </a>
              </SiderHeader>
              {this.state.menu}
              {demoMenu}
            </Sider>
            <IemContent>
              <Content>
                {React.Children.toArray(this.props.children)}
              </Content>
            </IemContent>
          </Layout>
        </ImeSider>
      </Layout>
    );
  }

}

const mapSizesToProps = ({width, height}) => ({
  height: height
});

export default withSizes(mapSizesToProps)(MainLayoutPage);
