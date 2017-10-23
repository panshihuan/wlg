import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppButton from 'components/AppButton';
import appPath from 'utils/config.js'
export class PreviewPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  componentDidMount() {
   
  }

  componentWillUnmount() {
     
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div style={{height:"84vh"}}>
        <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
            bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
            {/*<AppButton config={{
                id: "print_btn",
                title: "打印",
                size: "large",
                type: "primary",
                visible: true,
                enabled: true,
                }}>
              </AppButton>
              <AppButton config={{
                id: "export_btn",
                title: "导出",
                size: "large",
                type: "primary",
                visible: true,
                enabled: true,
                }}>
              </AppButton>*/}
              <AppButton config={{
                id: "cancel_btn",
                title: "返回",
                size: "large",
                type: "primary",
                visible: true,
                enabled: true,
                subscribes: [
                {
                  event: "cancel_btn.click",
                  pubs: [
                  {
                    event: "@@navigator.goBack"
                  }
                    ]
                }
              ]
            }}>
              </AppButton>
        </Card>
        <iframe width="100%" height="100%" frameBorder='0' src={`${appPath.currentServer}/sm/report/previewPdf.action?path=orderDetail.jasper&code=${this.props.location.state[0].code}`}></iframe>
      </div>
    );
  }
}

PreviewPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(PreviewPage);
