import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
//import {Row, Col} from 'antd'
import { Breadcrumb, Card, Row, Col } from 'antd';
import TreeField from 'components/Form/TreeField';

export class MenuTreeModal extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }
    componentDidMount() {
        // pubsub.publish('orderRepealModal-table-11.laterData',{})
    }
    componentWillUnmount() {
    }
    componentWillReceiveProps(nextProps) {
    }
    render() {
        return (
            <form>

                <Row>
                    <Col span={ 18 } offset={3}>
                        <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "500px" }} bodyStyle={{ padding: "15px" }}>
                            <Field config={{
                                id: 'tree2',
                                search: false,
                                enabled: true,
                                visible: true,
                                checkable: true,
                                showLine: true,
                                draggable: false,
                                searchBoxWidth: 300,
                                checkStrictly:true,
                                dataSource: {
                                    type: "api",
                                    method: "POST",
                                    url: '/sm/menu/queryForTree.action'
                                },
                                subscribes: [
                                    {
                                        event:'orderRepealModal-btn-2.click',
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "tree2", //要从哪个组件获取数据
                                                data: "state",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "orderRepealModal-btn-2.expression",
                                                        eventPayloadExpression:`
                                                                console.log("1111111");
                                                                let info = eventPayload.checkedInfo;
                                                                console.log(info)
                                                                let menuIds = [];
                                                                let names = [];
                                                                for(var i=0; i<eventPayload.checkedInfo.length; i++){
                                                                    if(info[i].parentId){
                                                                        menuIds.push(info[i].gid);
                                                                        names.push(info[i].menuName);
                                                                    }

                                                                }
                                                                //console.log(eventPayload.checkedInfo[0].gid)

                                                                pubsub.publish("@@form.change",  { id: "SchemePage",name:"menuIds" ,value: menuIds })
                                                                pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemesMenu" ,value: names })


                                                            `
                                                    },
                                                    {
                                                        event: "dic.loadData",
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        event:"tree2.onTreeLoaded",
                                        pubs:[
                                            {
                                                event:"tree2.checkedKeys",
                                                eventPayloadExpression:`
                                             resolveFetch({fetch:{id:"tree",data:"state"}}).then(function(state){
                                                let key = state.selectedKeys[0]
                                                let dataSource = {
                                                    type: 'api',
                                                    method: 'post',
                                                    url: '/sm/scheme/queryBySchemeId.action'
                                                }
                                                resolveDataSource({ dataSource:dataSource,eventPayload:{schemeId:key} }).then(function (data) {
                                                    findGid(data.data)
                                                    console.log('array'+array)
                                                     callback(array)
                                                })
                                                console.log(key)

                                             })
                                            var array=[]
                                            function findGid(list){
                                                 for(var i=0;i<list.length;i++){
                                                        array.push(list[i].gid)
                                                        if(list[i].children && list[i].children.length>0){
                                                              findGid(list[i].children)
                                                        }
                                                   }
                                             }
                                          `
                                            }
                                        ]
                                    }
                                ]
                            }} name="tree2"  component={ TreeField } />
                        </Card>
                    </Col>
                    <Col span={6} offset={18}>
                        {/*取消按钮*/}
                        <AppButton config={{
                            id: "orderRepealModal-btn-3",
                            title: "取消",
                            type:"default",
                            size:"large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "orderRepealModal-btn-3.click",
                                    pubs:[{
                                        event: "addMenuPage.onCancel",
                                    }]
                                }
                            ]
                        }} />

                        {/*确定按钮*/}
                        <AppButton config={{
                            id: "orderRepealModal-btn-2",
                            title: "确定",
                            type:"primary",
                            size:"large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "orderRepealModal-btn-2.click",
                                    pubs:[
                                        {
                                            event:"orderRepealModal-btn-2.expression",
                                            meta: {
                                                expression:`
                                             resolveFetch({fetch:{id:"SchemePage",data:"@@formValues"}}).then(function (value) {
                                                resolveFetch({fetch:{id:"tree",data:"state"}}).then(function (tree1) {
                                                    resolveFetch({fetch:{id:"tree2",data:"state"}}).then(function (tree2) {
                                                        let params = {
                                                            schemeCode:value.schemeCode,
                                                            schemeName:value.schemeName,
                                                            gid:tree1.selectedKeys[0],
                                                            menuIds:tree2.checkedKeys
                                                        }
                                                        let dataSource= {
                                                          type: "api",
                                                          method: "POST",
                                                          url: "/sm/scheme/modify"
                                                        };
                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:params},
                                                          function(res){
                                                                pubsub.publish('MenuTable.loadData',{schemeId:params.gid});
                                                                pubsub.publish('@@message.success',"修改成功")
                                                                pubsub.publish('addMenuPage.onCancel')
                                                          },
                                                          function(){
                                                          }
                                                        )
                                                    })
                                                })
                                            })
                                        `
                                            }
                                        }
                                     ]
                                }
                            ]

                        }} />
                        {/*全选按钮*/}
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
                                            event: "tree2.checkedAll"
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
                                            event: "tree2.checkedClear"
                                        }
                                    ]
                                }
                            ]
                        }}/>

                    </Col>
                </Row>
            </form>
        );
    }
}

MenuTreeModal.propTypes = {

};

export default  reduxForm({
    form: "MenuTreeModal",
})(MenuTreeModal);

