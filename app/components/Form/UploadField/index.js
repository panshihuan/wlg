/**
 *
 * ExcelComponent
 *
 */

import React from 'react';
import CoreComponent from '../../CoreComponent/index'
import {Button,Upload, Icon, Modal,Form} from 'antd'
import pubsub from 'pubsub-js'
import ExcelCss from '../../Styled/ExcelCss/index'
import currentServer from 'utils/config.js'

const FormItem = Form.Item;

class ExcelComponent extends CoreComponent { 

  constructor(props) {
    super(props);
    this.state={
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }

    this.result=undefined;
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  //图片
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ file,fileList,event }) => {
    var self=this;
      var result;
      if(file&&file.response){
          if(file.response.success){
              result=true
          }else{
              if(file.response.data){
                  result=file.response.data
              }
          }

      }

      self.result=result;
      pubsub.publish(`${self.props.config.id}.onChange`,result)
      self.props.input.onChange(result)

    var arr=[]
    fileList = fileList.map(function(file) {
      if (file.response) {
      }else{
          file.url = file.thumbUrl;
      }

      return file;
    });

    pubsub.publish(`${self.props.config.id}.change`,arr)
      // self.props.input.onChange(result)

    this.setState({ fileList });
  }

  beforeUploadChange(file){
    
  }

  render() {
    const {id,title,typeFile,requestUrl,requestName,headers}=this.props.config
    const { previewVisible, previewImage, fileList } = this.state;
    var self=this;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{title}</div>
      </div>
    );

    //上传excel所需props
    const props = {
        name: requestName,
        code:'',
        action: `${currentServer.currentServer}${requestUrl}` || '//jsonplaceholder.typicode.com/posts/',
        headers: headers||{
          authorization: 'authorization-text',
        },

        onChange({ file,fileList,event }) {
          var result;
          if(file&&file.response){
            if(file.response.success){
                result={success:true}
            }else{
              if(file.response.data){
                result=file.response.data
              }
            }

              self.result=result;
              pubsub.publish(`${self.props.config.id}.onChange`,result)
              // self.props.input.onChange(result)

          }


        },

    };
    
    return (
      <ExcelCss className="chart">
          {
            typeFile=='else'?
            <FormItem>
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> {title}
                  </Button>
                </Upload>
            </FormItem>:

                typeFile=="img"?
                  <FormItem>
                      <div className="clearfix">
                          <Upload
                            action={currentServer.currentServer+''+requestUrl}
                            listType="picture-card"
                            onChange={this.handleChange}
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            beforeUpload={this.beforeUploadChange}
                            showUploadList={false}
                          >
                            {fileList.length >= 3 ? null : uploadButton}
                          </Upload>
                          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                          </Modal>
                      </div>
                  </FormItem>
                 :''
          }
      </ExcelCss>
    );
  }

}

ExcelComponent.propTypes = {};

export default ExcelComponent;
