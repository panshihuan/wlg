/*
 *
 * SelectFieldPage
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {Breadcrumb, Select, Button} from 'antd';
import {Link} from 'react-router';
import pubsub from 'pubsub-js'
import SelectField from 'components/Form/SelectField'
import {reduxForm, Field} from 'redux-form/immutable'

const validate = values => {
  const errors = {}

  if (values.get('userName') == 'val_3') {
    errors.userName = 'not allowed'
  }

  return errors
}

export class SelectFieldPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {

    pubsub.subscribe(`select.onChange`, (e, d) => {
      console.log(e, d)
    })
    pubsub.subscribe(`select.onSelect`, (e, d) => {
      console.log(e, d)
    })
    pubsub.subscribe(`select.onDeselect`, (e, d) => {
      console.log(e, d)
    })
    pubsub.subscribe(`select.onSearch`, (e, d) => {
      console.log(e, d)
    })
    pubsub.subscribe(`select.onBlur`, (e, d) => {
      console.log(e, d)
    })
    pubsub.subscribe(`select.onFocus`, (e, d) => {
      console.log(e, d)
    })

  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe("select.onChange")
    pubsub.unsubscribe("select.onSelect")
    pubsub.unsubscribe("select.onDeselect")
    pubsub.unsubscribe("select.onSearch")
    pubsub.unsubscribe("select.onBlur")
    pubsub.unsubscribe("select.onFocus")

  }

  render() {
    return (
      <div>
        <Helmet
          title="SelectFieldPage"
          meta={[
            {name: 'description', content: 'Description of SelectFieldPage'},
          ]}
        />
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <form>
          <Field config={{
            id: 'select',
            enabled: true,
            visible: true,
            label: "Label",
            dataSource: {
              type: "api",
              method: "get",
              url: "/api/ddd.json",
            },
            mode: "multiple",
            displayField: "id",
            valueField: "name",
            multiple: false,
            // tags: false,
            // combobox: false,
            // allowClear: false,
            // filterOption: true,
            placeholder: '请选择多选选项',
            size: 'large',
            notFoundContent: 'Not Found',
            dropdownMatchSelectWidth: true,
            showSearch: false,
            disabled: false,
            defaultActiveFirstOption: true,
            labelInValue: false,
            tokenSeparators: []
          }} name="userName" component={SelectField}/>


          <Field config={{
            id: 'select1',
            label: "Label",
            dataSource: {
              type: "api",
              method: "get",
              url: "/api/ddd.json",
            },
            displayField: "name",
            valueField: "id",
            placeholder: '请选择多选选项',
            subscribes: [
              {
                event: "select1.onChange",
                pubs: [
                  {
                    event: "select2.loadData"
                  }
                ]
              }
            ]
          }} name="userName1" component={SelectField}/>

          <Field config={{
            id: 'select2',
            label: "Label",
            dataSource: {
              type: "api",
              method: "POST",
              url: "/api/ddd.json",
              payloadMapping: [{
                from: "eventPayload",
                to: "id"
              }]
            },
            loadDataOnLoad: false,
            displayField: "name",
            valueField: "id",
            placeholder: '请选择多选选项',
            subscribes: [
              {
                event: "select1.onChange",
                pubs: [
                  {
                    event: "2.enabled",
                    payload: false
                  }
                ]
              }
            ]
          }} name="userName2" component={SelectField}/>


          <Button loading={this.props.submitting}
                  onClick={this.props.handleSubmit((values) => {
                  })}>
            提交</Button>
        </form>
      </div>
    );
  }
}

SelectFieldPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//   };
// }

// export default connect(null, mapDispatchToProps)(SelectFieldPage);
export default reduxForm({
  form: "testFormSelect",
  validate
})(SelectFieldPage)