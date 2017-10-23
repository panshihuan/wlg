import React from 'react';
import {Row, Col, Switch, Icon, Button, Badge, Layout, Card, Breadcrumb, Radio, Dropdown, Menu, Tooltip} from 'antd';
import {colors, ImeBreadcrumb, ImeRow, ImeToolBar, sizes} from "../../../global-styles";

class ImeLayoutPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      layoutType: 1,
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  selectLayout = (e)=> {
    this.setState({
      layoutType: e.target.value,
    });
  };
  demoCard = (
    <Card
      title="我的日程"
      noHovering={true}
      extra={
        <Row type="flex" align="middle">
          <Tooltip placement="top" title='搜索'>
            <Button shape="circle" icon="search"/>
          </Tooltip>
          <Tooltip placement="top" title='添加'>
            <Button shape="circle" icon="plus"/>
          </Tooltip>
          <Tooltip placement="top" title='删除'>
            <Button shape="circle" type="danger" icon="delete"/>
          </Tooltip>
        </Row>
      }
    >
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </Card>
  );
  demoCardFull = (
    <Card
      title="我的日程"
      className="card-full"
      noHovering={true}
      extra={
        <Row type="flex" align="middle">
          <Tooltip placement="top" title='搜索'>
            <Button shape="circle" icon="search"/>
          </Tooltip>
          <Tooltip placement="top" title='添加'>
            <Button shape="circle" icon="plus"/>
          </Tooltip>
          <Tooltip placement="top" title='删除'>
            <Button shape="circle" type="danger" icon="delete"/>
          </Tooltip>
        </Row>
      }
    >
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </Card>
  );

  layoutContent = (type)=>{
    switch (type){
      case 1:
        return this.demoCard;
      case 2:
        return (
          <Layout>
            <Row gutter={32}>
              <Col className='left-bar'>
                {this.demoCardFull}
              </Col>
              <Col className='right-bar'>
                {this.demoCardFull}
              </Col>
            </Row>
          </Layout>
        );
      case 3:
        return (
          <Layout>
            <Row gutter={16}>
              <Col span={12}>
                {this.demoCardFull}
              </Col>
              <Col span={12}>
                {this.demoCardFull}
              </Col>
            </Row>
          </Layout>
        );
      case 4:
        return (
          <Layout>
            <Row gutter={32}>
              <Col className='left-bar'>
                <ImeRow>
                  {this.demoCard}
                </ImeRow>
              </Col>
              <Col className='right-bar'>
                <ImeRow>
                  {this.demoCard}
                  {this.demoCard}
                </ImeRow>
              </Col>
            </Row>
          </Layout>
        );
      default: return;
    }
  };
  render() {
    return (
      <Layout>
        <ImeBreadcrumb>
          <Row type="flex" justify="space-between" align="middle">
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item href="">
                  <Icon type="home" />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <Icon type="user" />
                  <span>带图标的</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  仅文字
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col className='breadcrumb-btn'>
              布局：
              <Radio.Group onChange={this.selectLayout} value={this.state.layoutType}>
                <Radio value={1}>A</Radio>
                <Radio value={2}>B</Radio>
                <Radio value={3}>C</Radio>
                <Radio value={4}>D</Radio>
              </Radio.Group>
              <Button>次要</Button>
              <Button type="primary">主要</Button>
            </Col>
          </Row>
        </ImeBreadcrumb>
        <ImeRow>
          <ImeToolBar>
            <Card noHovering={true} >
              <Row type="flex" align="middle">
                <Button type="primary">主要</Button>
                <Button type="primary" ghost>线框</Button>
                <Button type="danger" ghost>危险</Button>
                <Button>次要按钮</Button>
                <span style={{color: colors.gray_7}}>|</span>
                <Radio.Group>
                  <Radio.Button>按钮组</Radio.Button>
                  <Radio.Button>按钮组</Radio.Button>
                </Radio.Group>
                <span style={{color: colors.gray_7}}>|</span>
                <Dropdown overlay={
                  <Menu>
                    <Menu.Item key="1">1st item</Menu.Item>
                    <Menu.Item key="2">2nd item</Menu.Item>
                    <Menu.Item key="3">3rd item</Menu.Item>
                  </Menu>
                }>
                  <Button>
                    下拉 <Icon type="down" />
                  </Button>
                </Dropdown>
                <span style={{color: colors.gray_7}}>|</span>
                <Tooltip placement="top" title='搜索'>
                  <Button shape="circle" icon="search"/>
                </Tooltip>
              </Row>
            </Card>
          </ImeToolBar>
          {this.layoutContent(this.state.layoutType)}
        </ImeRow>
      </Layout>
    );
  }

}

ImeLayoutPage.propTypes = {};

export default ImeLayoutPage;

/*
说明：

理论上页面尽量避免出现行内样式

整个页面使用<Layout/>包裹起来

面包屑导航使用<ImeBreadcrumb/>包裹，使用flex栅格布局方便右侧添加按钮

内容部分支持栅格布局，左侧固定布局，上下布局，使用卡片<Card>填充

全屏卡片只需要在卡片上添加className=‘card-full’，使用全屏卡片不建议纵向上有一个以上的卡片

父元素存在多个子元素的时候，使用<ImeRow/>包裹子元素，使每个子元素拥有固定的margin-bottom

按钮控件使用准则：

  每个控制区域，最多存在一个主要按钮，其他按钮使用线框按钮和次要按钮

  删除按钮必须带上红色标记

  图标按钮必须添加文字描述
*/
