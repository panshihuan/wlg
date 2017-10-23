
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import request from 'utils/request'
import AppButton from 'components/AppButton'
import ExcelComponent from 'components/Form/UploadField'
import Helmet from 'react-helmet';
import {Button, DatePicker, Input, Breadcrumb, Row, Col} from 'antd'
import {Link} from 'react-router'
import pubsub from 'pubsub-js'
import LinkToComponent from 'components/LinkTo'
import InputNumberField from 'components/Form/InputNumberField'

import {inputNumberAction} from './actions'

import {reduxForm, Field,propTypes } from 'redux-form/immutable'

const validate = values => {
  const errors = {};
  if (!values.get('number')) {
    errors.number = '必填项!'
  }else if(typeof(values.get('number'))!=="number" ){
      errors.number = '请填写数字!'
  }
  return errors
};

class ExcelPage extends React.PureComponent {

  constructor(props) {
    super(props)
    console.log(this.props.location);
    this.state = {
      name: "",
      list: [],
      fileValue:null,
    }
  }

  componentDidMount() {
      // this.props.inputNumberAction({"number":112233})
      pubsub.subscribe("upload-1.change", (eventName, payload) => {
        this.setState({fileValue:payload})
      })

      pubsub.subscribe("upload-2.change", (eventName, payload) => {

      })

      pubsub.subscribe("number-1.onChange", (eventName, payload) => {
        console.log('payload:::',payload)
      })

  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe("upload-1.change")
    pubsub.unsubscribe("upload-2.change")
  }

  render() {
      const {initialValues}=this.props
    return (
      <div>
        <Helmet
          title="Upload"
          meta={[
            {name: 'description', content: 'Description of DeviceStatus'},
          ]}
        />
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>文件上传页面</Breadcrumb.Item>
        </Breadcrumb>

        <form>

{/*上传*/}
          <Field config={{
            id:'upload-1',
            typeFile:'img',
            title:'上传图片',
            requestUrl:'/ime/imePlanOrder/importPlanOrderList.action',
            requestName:'file',
            headers:'',
          }} name="file" component={ExcelComponent}/>

          <Field config={{
            id:'upload-2',
            typeFile:'else',
            title:'上传',
            requestUrl:'/ime/imePlanOrder/importPlanOrderList.action',
            requestName:'file',
            headers:'',
              subscribes:[
                  {
                      event:'upload-2.onChange',
                      pubs:[
                          {
                              event:'upload-2.expression',
                              meta:{
                                  expression:`
                                    console.log('me:::',me.result)
                                    console.log('data:::',data)

                                  `
                              }
                          }
                      ]
                  }
              ]
          }} name="file" component={ExcelComponent}/>

          <br/>

{/*数字输入框*/}
          <Field config={{
              id: "number-1",
              enabled: true,  //是否启用
              visible: true,  //是否可见
              label: "数字:",  //标签名称
              size:'large',  //尺寸大小:large、small
              min:1,        //最小、大值
              max:undefined,
              formatter:'rmb',   //百分比%：percent；货币￥：rmb（ 格式化数字，以展示具有具体含义的数据）
              step:undefined,   //小数位数: 0.01保留2位有效数值
              labelSpan: 4,   //标签栅格比例（0-24）
              wrapperSpan: 7,  //输入框栅格比例（0-24）
              showRequiredStar: true,  //是否显示必填星号
              hasFeedback: false  //验证失败时是否显示feedback图案
          }} name="number" component={InputNumberField}/>

          <br/>

          <Button loading={this.props.submitting} onClick={this.props.handleSubmit((values)=>{
            var obj= {
              upload:values.get('file'),
              number:values.get('number')
            }
            console.log('obj:::',obj)
          })}>提交</Button>

          <Button onClick={this.props.reset}>reset</Button>

        </form>


        {/*超链接*/}
        <br/>
        <LinkToComponent config={{
            id:'link-1',
            title:'超链接',
            link:'/'
        }}>

        </LinkToComponent>

      </div>
    );
  }
}

ExcelPage = reduxForm({
    form: "uploadForm",
    validate,
    // initialValues:{
    //     "number":123123
    // },
    // enableReinitialize:true,
    keepDirtyOnReinitialize:true,// 这个值表示重新初始化表单后，不替换已更改的值，
})(ExcelPage);


// function mapStateToProps(state) {
//     return {
//         // initialValues: {number:6666666}
//     }
// }
//
// function mapDispatchToProps(dispatch) {
//     return {
//         inputNumberAction: bindActionCreators(inputNumberAction, dispatch),
//     }
// }
//
// ExcelPage = connect(mapStateToProps, mapDispatchToProps)(ExcelPage);

export default ExcelPage;
