import React, {PropTypes} from 'react';
import {Button, DatePicker, Input, Breadcrumb, Row, Col, Table} from 'antd'
import {reduxForm} from 'redux-form/immutable'
import {resolveDataSource, publishEvents, resolveFetch, resolveDataSourceCallback} from 'utils/componentUtil'
import ModalContainer from '../../../components/ModalContainer'
import ResizeSensor from '../../../utils/resizeSensor';
import AppButton from '../../../components/AppButton';

// 样式组件
import CanvasMainCss from './Styled/CanvasMainCss';
import RouteLineForm from './Page/RouteLineForm';
import RouteOperationForm from './Page/RouteOperationForm';
import pubsub from 'pubsub-js';

// 功能组件
import CanvasCore from './Components/CanvasCore'
import Sider from './Layout/Sider'
import Content from "./Layout/Content";
import TempCanvas from './Layout/TempCanvas'
import Top from './Layout/Top'
import Footer from './Layout/Footer'

const validate = values => {
    const errors = {}
    if (!values.get('FactoryModelingPage')) {
        errors.busiGroupCode = '必填项'
    }
    return errors
}

export class TechnicPage extends CanvasCore {
    //构造
    constructor(props) {
        super(props);
        this.state = {
            config: {
                width: 0,
                height: 0,
                siderWidth:200,
                layoutContentHeight:0,
                contentWidth: 0,
                contentHeight:0,
            },
            currentModalForm:'',
            currentShape:null,
        }
        this.pubsubEvents = {
            'technic.openModelForm': 'technic.openModelForm',
        }
    }

    //不用
    componentWillMount() {
    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {
        let _this = this;

        // 注册pubsub事件
        this.initSubscribe();

        let canvasMain = document.querySelector('#canvasMain');
        // 监听大小改变
        _this.reflashScreen();
       /* new ResizeSensor(canvasMain, debounce(()=>{
            _this.reflashScreen();
        }, 1000));*/


        // 禁止自定义右键
        document.oncontextmenu = function(ev) {
            var oEvent = ev || event;
            //return false阻止系统自带的菜单，
            //return false必须写在最后，否则自定义的右键菜单也不会出现
            return false;
        }

    }

    // 注册事件
    initSubscribe(){
        pubsub.subscribe('technic.changeModelForm', (e,shape) => {
            let shapeType = shape.getAttr('shapeType');
            this.setState({
                currentModalForm: shapeType,
                currentShape: shape
            })
            pubsub.publish('technicFormModal.openModal')
        })
    }

    //重新计算屏幕大小
    reflashScreen(){
        let _this = this;

        setTimeout(() => {
            // 设置屏幕高度
            let canvasMainHeight = document.querySelector('.ant-layout-has-sider').offsetHeight;
            let canvasMainWidth = document.querySelector('#canvasMain').clientWidth;

            // 获取头部和底部的高度
            let topHeight = document.querySelector('#canvasMain >.top').offsetHeight;
            let footerHeight = document.querySelector('#canvasMain >.footer').offsetHeight;
            this.setState({
                config:Object.assign({},this.state.config, {
                    width: canvasMainWidth,
                    height: canvasMainHeight,
                    layoutContentHeight: canvasMainHeight - topHeight -footerHeight
                })
            })
        },10)
    }

    // openModelForm 打开视图窗口
    returnModelForm(){
        let currentModalForm = this.state.currentModalForm;
        switch (currentModalForm){
            case 'process':
                return <RouteOperationForm shape={this.state.currentShape}/>;
                break;
            case 'routeLine':
                return <RouteLineForm shape={this.state.currentShape}/>;
                break;
        }
    }

    //销毁
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    //不用
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <CanvasMainCss config={this.state.config} id='canvasMain' >
                <Top/>
                <div className='layoutContent' id='canvasLayout'>
                    <Sider {...this.props} config={this.state.config} />
                    <Content {...this.props} config = {this.state.config} />
                    <TempCanvas {...this.props} config = {this.state.config} />
                </div>
                <Footer/>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "technicFormModal", // id，必填*
                    pageId: "technicFormModal", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    closable: true, // 是否显示右上角关闭按钮，默认不显示
                    width: "1300", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: {top: 120}, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}>
                    {this.returnModelForm()}
                </ModalContainer>

            </CanvasMainCss>

        )
    }
}

TechnicPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
    form: "TechnicPage",
    validate,
})(TechnicPage)

