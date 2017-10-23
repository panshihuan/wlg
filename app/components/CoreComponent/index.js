/**
 *
 * CoreComponent
 *
 */

import React from 'react';
import pubsub from 'pubsub-js'
import {
  resolveDataSource,
  publishEvents,
  resolveFetch,
  resolveDataSourceCallback,
  submitValidateForm
} from 'utils/componentUtil'

const uuidV4 = require("uuid/v4");
const safeEval = require('notevil')
import Immutable, {fromJS} from "immutable"


// import Styled from 'Styled-components';


class CoreComponent extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
    this.state = {
      visible: props.config.visible == undefined || props.config.visible,
      enabled: props.config.enabled == undefined || props.config.enabled
    }


    this.subscribeVisible()
    this.subscribeEnabled()
    this.subscribeDataContext()
    this.subscribeFetchData()
    this.subscribeExpression()


    props.config.subscribes && props.config.subscribes.forEach(s => {
      let eventName = s.event;


      if (props.config.rowIndex != undefined && !s.outSide) {
        let parts = eventName.split('.')
        eventName = `${parts[0]}[${props.config.rowIndex }].${parts[1]}`
      }


      pubsub.subscribe(eventName, (msg, eventPayload) => {
        s.pubs && s.pubs.forEach(p => {
          //配置了eventPayloadExpression后,mode属性会被重置为eventPayload
          if (p.eventPayloadExpression) {
            safeEval(p.eventPayloadExpression, {
              fromJS: fromJS,
              eventPayload: eventPayload,
              dataContext: this.dataContext,
              pubsub,
              JSON,
              eventName,
              uuidV4,
              console,
              me: this,
              resolveDataSource,
              resolveFetch,
              resolveDataSourceCallback,
              _,
                submitValidateForm,
                localStorage,
                Immutable,
              Math,
              setTimeout,
              clearTimeout,
              callback: (payload) => {

                publishEvents({
                  eventName: p.event,
                  config: props.config,
                  eventPayload: payload,
                  mode: "eventPayload",
                  outside: p.outside,
                  meta: p.meta
                })
              }
            })
          }
          else {
            //如果pubs元素里面配置了iif,iff 已废弃，以后版本删除
            if (p.iif != undefined) {
              if (p.iif == eventPayload)
                publishEvents({
                  eventName: p.event,
                  config: props.config,
                  payload: p.payload,
                  eventPayload,
                  mode: p.mode,
                  outside: p.outside,
                  meta: p.meta
                })
            }
            else {
              publishEvents({
                eventName: p.event,
                config: props.config,
                payload: p.payload,
                eventPayload,
                mode: p.mode,
                outside: p.outside,
                meta: p.meta
              })
            }
          }


        })


        s.behaviors && s.behaviors.forEach(b => {
          //behavior iif 支持,iff 已废弃，以后版本删除
          if (b.iif != undefined) {
            if (b.iif != eventPayload) {
              return;
            }
          }

          if (b.type == "request") {
            let me = this;
            resolveDataSource({
              dataSource: b.dataSource,
              eventPayload: eventPayload,
              dataContext: this.dataContext
            }).then(function (response) {
              if (response.success) {
                b.successPubs && b.successPubs.forEach(s => {
                  if (s.eventPayloadExpression) {
                    safeEval(s.eventPayloadExpression, {
                      fromJS: fromJS,
                      eventPayload: response.data,
                      dataContext: me.dataContext,
                      pubsub,
                      JSON,
                      uuidV4,
                      console,
                      me: me,
                      resolveDataSource,
                      resolveFetch,
                      resolveDataSourceCallback,
                      Immutable,
                      _,
                        submitValidateForm,
                        setTimeout,
                        localStorage,
                      clearTimeout,
                      callback: (payload) => {

                        publishEvents({
                          eventName: s.event,
                          config: props.config,
                          eventPayload: payload,
                          mode: "eventPayload",
                          outside: s.outside,
                          meta: s.meta
                        })
                      }
                    })
                  }
                  else {
                    publishEvents({
                      eventName: s.event,
                      config: props.config,
                      payload: s.payload,
                      mode: s.mode,
                      outside: s.outside,
                      meta: s.meta,
                      payloadMapping: s.payloadMapping,
                      dataContext: response
                    })
                  }


                })
              } else if (response.success === false) {
                b.errorPubs && b.errorPubs.forEach(s => {
                  if (s.eventPayloadExpression) {
                    safeEval(s.eventPayloadExpression, {
                      fromJS: fromJS,
                      eventPayload: response.data,
                      dataContext: me.dataContext,
                      pubsub,
                      JSON,
                      uuidV4,
                      console,
                      me: me,
                      resolveDataSource,
                      resolveFetch,
                      resolveDataSourceCallback,
                      Immutable,
                      _,
                        submitValidateForm,
                        setTimeout,
                        localStorage,
                      clearTimeout,
                      callback: (payload) => {

                        publishEvents({
                          eventName: s.event,
                          config: props.config,
                          eventPayload: payload,
                          mode: "eventPayload",
                          outside: s.outside,
                          meta: s.meta
                        })
                      }
                    })
                  } else {
                    publishEvents({
                      eventName: s.event,
                      config: props.config,
                      payload: s.payload,
                      mode: s.mode,
                      outside: s.outside
                    })
                  }
                })
              }

            }.bind(this));
          }
          else if (b.type == "fetch") {
            let me = this;
            resolveFetch.call(this, {fetch: b}).then(function (data) {
              b.successPubs && b.successPubs.forEach(s => {
                if (s.eventPayloadExpression) {
                  safeEval(s.eventPayloadExpression, {
                    fromJS: fromJS,
                    eventPayload: data,
                    dataContext: me.dataContext,
                    pubsub,
                    JSON,
                    uuidV4,
                    console,
                    me: me,
                    resolveDataSource,
                    resolveFetch,
                    resolveDataSourceCallback,
                    _,
                      submitValidateForm,
                      localStorage,
                    Immutable,
                    setTimeout,
                    clearTimeout,
                    callback: (payload) => {

                      publishEvents({
                        eventName: s.event,
                        config: props.config,
                        eventPayload: payload,
                        mode: "eventPayload",
                        outside: s.outside,
                        meta: s.meta
                      })
                    }
                  })
                }
                else {

                  publishEvents({
                    eventName: s.event,
                    config: props.config,
                    payload: s.payload,
                    eventPayload: data,
                    mode: s.mode,
                    outside: s.outside,
                    meta: s.meta
                  })
                }
              })
            })
          }

        })
      })
    })


  }

  subscribeVisible = () => {
    pubsub.subscribe(`${this.props.config.id}.visible`, (event, payload) => {
      this.setState({visible: payload})
    })
  }

  subscribeEnabled = () => {
    pubsub.subscribe(`${this.props.config.id}.enabled`, (event, payload) => {
      this.setState({enabled: payload})
    })
  }


  subscribeFetchData = () => {
    pubsub.subscribe(`${this.props.config.id}.fetchData`, ((event, payload) => {

      if (payload.data == undefined) {
        pubsub.publish(payload.eventId, this)

      } else {
        let result = this[payload.data]
        pubsub.publish(payload.eventId, result)
      }
    }).bind(this))
  }


  subscribeDataContext = () => {
    pubsub.subscribe(`${this.props.config.id}.dataContext`, (msg, data) => {
      this.dataContext = data.eventPayload;
    })
  }
  subscribeExpression = () => {
    let me = this;


    pubsub.subscribe(`${this.props.config.id}.expression`, (msg, data, meta) => {

      var result = safeEval(meta.expression, {
        fromJS: fromJS,
        data: data,
        dataContext: this.dataContext,
        pubsub,
        JSON,
        uuidV4,
        console,
        me: me,
        resolveDataSource,
        resolveFetch,
        resolveDataSourceCallback,
        submitValidateForm,
        parseInt,
        _,
          localStorage,
        Immutable,
        setTimeout,
        clearTimeout,
        Math,
      })
    })
  }

  unSubscribeExpression = () => {
    pubsub.unsubscribe(`${this.props.config.id}.expression`)
  }


  unSubscribeFetchData = () => {
    pubsub.unsubscribe(`${this.props.config.id}.fetchData`)
  }


  unSubscribeDataContext = () => {
    pubsub.unsubscribe(`${this.props.config.id}.dataContext`)
  }


  unSubscribeVisible = () => {
    pubsub.unsubscribe(`${this.props.config.id}.visible`)
  }

  unSubscribeEnabled = () => {
    pubsub.unsubscribe(`${this.props.config.id}.enabled`)
  }


  componentWillUnmount() {
    this.unSubscribeVisible()
    this.unSubscribeEnabled()
    this.unSubscribeDataContext()
    this.unSubscribeFetchData()
    this.unSubscribeExpression()

    this.props.config.subscribes && this.props.config.subscribes.forEach(s => {
      let eventName = s.event;
      if (this.props.config.rowIndex != undefined) {
        let parts = eventName.split('.')
        eventName = `${parts[0]}[${this.props.config.rowIndex }].${parts[1]}`
      }
      pubsub.unsubscribe(eventName)
    })
  }


}

CoreComponent.propTypes = {
  config: React.PropTypes.object.isRequired,
};

export default CoreComponent;
