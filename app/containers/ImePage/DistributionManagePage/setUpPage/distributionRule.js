import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Breadcrumb, Card, Row, Col} from 'antd';

import AppButton from 'components/AppButton'
import AppTable from 'components/AppTable'
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
import FindbackField from 'components/Form/FindbackField'

export class DistributionRulePage extends React.PureComponent {
  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>物流管理</Breadcrumb.Item>
        <Breadcrumb.Item>设置</Breadcrumb.Item>
        <Breadcrumb.Item>物流配送单生单规则</Breadcrumb.Item>
        </Breadcrumb>
        
      </div>
    );
  }
}

DistributionRulePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
  form: "DistributionRuleForm",
})(DistributionRulePage)