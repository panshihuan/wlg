import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'

import TextField from 'components/Form/TextField'
import RadiosField from 'components/Form/RadiosField'
import AutoCompleteField from 'components/Form/AutoCompleteField'
import CheckBoxField from 'components/Form/CheckBoxField'
import DateField from 'components/Form/DateField'
import InputNumberField from 'components/Form/InputNumberField'
import SelectField from 'components/Form/SelectField'
import SwitchField from 'components/Form/SwitchField'
import TableField from 'components/Form/TableField'
import TextAreaField from 'components/Form/TextAreaField'
import UploadField from 'components/Form/UploadField'
import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import LinkTo from 'components/LinkTo'
import AppTable from '../../../components/AppTable'
import SimpleTable from '../../../components/SimpleTable'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

export class CasePage extends React.PureComponent {
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
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>ayaan</Breadcrumb.Item>
          <Breadcrumb.Item>详细例子</Breadcrumb.Item>
        </Breadcrumb>
          {/*<h1>跳转</h1>

          <LinkTo config={{
              link:'/imeDistributionType', //跳转至
              hasParm:true, //为true:跳转时带参数,默认或不加也可

          }}>
              跳转
          </LinkTo>

          <LinkTo config={{
              link:'/imeDistributionType', //跳转至
          }}>
              直接跳转
        </LinkTo>*/}
            <Card>
              {/*<SimpleTable config={{
                "id": "1234567890"
              }}/>*/}
            </Card>
      </div>
    );
  }
}

CasePage.propTypes = {
    dispatch: PropTypes.func.isRequired,
  };
  
  
  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    };
  }
  
  function mapStateToProps(props) {
    return {
      onSubmit:()=>{debugger}
    };
  }
  
  
  let CaseForm = reduxForm({
    form: "caseForm",
  })(CasePage)
  
  export default connect(mapStateToProps, mapDispatchToProps)(CaseForm);
