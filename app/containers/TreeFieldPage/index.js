/*
 *
 * TreeFieldPage
 *
 */
import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import Helmet from 'react-helmet';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import { Breadcrumb } from 'antd';
import {resolveDataSource} from 'utils/componentUtil'
import TreeField from 'components/Form/TreeField'
import AppButton from 'components/AppButton'
export class TreeFieldPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    pubsub.subscribe(`tree1.onSelect`, (e, d) => {
      console.log(e, d)
    })

    pubsub.subscribe(`tree1.onCheck`, (e, d) => {
      console.log(e, d)
    })

    pubsub.subscribe(`tree1.onChange`, (e, d) => {
      console.log(e, d)
    })

    pubsub.subscribe(`tree1.onDrop`, (e, d) => {
      console.log(e, d)
    })

    pubsub.subscribe(`tree1.onDragEnter`, (e, d) => {
      console.log(e, d)
    })

    pubsub.subscribe(`tree1.onLoadData`, (e, d) => {
      console.log(e, d)
    })

    pubsub.subscribe(`tree1.onExpand`, (e, d) => {
      console.log(e, d)
    })
  }

  componentWillUnmount() {
    pubsub.unsubscribe(`init`)
    pubsub.unsubscribe(`tree1.onSelect`)
    pubsub.unsubscribe(`tree1.onCheck`)
    pubsub.unsubscribe(`tree1.onChange`)
    pubsub.unsubscribe(`tree1.onDrop`)
    pubsub.unsubscribe(`tree1.onDragEnter`)
    pubsub.unsubscribe(`tree1.onLoadData`)
    pubsub.unsubscribe(`tree1.onExpand`)

  }

  render() {

    return (
      <div>
            <Helmet
                    title="TreeFieldPage"
                    meta={[
                { name: 'description', content: 'Description of TreeFieldPage' },
            ]}
            />
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ backgroundColor: "#fff", float: 'left', width: '350px', margin: "20px 10px", padding: "20px" }}>
            <AppButton config={{
              id: "checkedAll",
              title: "全选",
              type: "primary",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: "checkedAll.click",
                  pubs: [
                    {
                      event: "tree1.checkedAll"
                    }
                  ]
                }
              ]
            }}/>
            <AppButton config={{
              id: "checkedKeys",
              title: "部分选择",
              type: "primary",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: "checkedKeys.click",
                  pubs: [
                    {
                      event: "tree1.checkedKeys",
                      payload:["0-0","0-0-0"]
                    }
                  ]
                }
              ]
            }}/>
            <AppButton config={{
              id: "checkedClear",
              title: "清除选择",
              type: "primary",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: "checkedClear.click",
                  pubs: [
                    {
                      event: "tree1.checkedClear"
                    }
                  ]
                }
              ]
            }}/>
            <Field config={{
              id: 'tree1',
              search: false,
              enabled: true,
              visible: true,
              checkable: true,
              showLine: true,
              draggable: true,
              searchBoxWidth: 300,
              dataSource: {
                type: "api",
                method: "get",
                url: "/api/tree_array.json",
              },
            }} name="tree1"  component={ TreeField } />
          </div>

          <div style={{ backgroundColor: "#fff", float: 'left', width: '350px', margin: "20px 10px", padding: "20px" }}>
            <AppButton config={{
              id: "reload",
              title: "重新加载",
              type: "primary",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: "reload.click",
                  pubs: [
                    {
                      event: "tree2.loadData"
                    }
                  ]
                }
              ]
            }}/>
            <Field config={{
              id: 'tree2',
              search: true,
              enabled: true,
              visible: true,
              checkable: true,
              showLine: true,
              draggable: false,
              searchBoxWidth: 300,
              dataSource: {
                type: "api",
                method: "get",
                url: "/api/tree.json"
              },
            }} name="tree2"  component={ TreeField } />
          </div>
        
          <div style={{ backgroundColor: "#fff", float: 'left', width: '350px', margin: "20px 10px", padding: "20px" }}>
            <AppButton config={{
              id: "loadData",
              title: "初始化不加载，点击加载",
              type: "primary",
              visible: true,
              enabled: true,
              subscribes: [
                {
                  event: "loadData.click",
                  pubs: [
                    {
                      event: "tree3.loadData"
                    }
                  ]
                }
              ]
            }}/>
            <Field config={{
              id: 'tree3',
              search: true,
              enabled: true,
              visible: true,
              checkable: true,
              showLine: true,
              draggable: true,
              searchBoxWidth: 300,
              onLoadData:false,
              dataSource: {
                type: "api",
                method: "get",
                url: "/api/tree_array.json",
              },
            }} name="tree3"  component={ TreeField } />
          </div>
      </div>
    );
  }
}

TreeFieldPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
  form: "treeForm",
})(TreeFieldPage)