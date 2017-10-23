import pubsub from 'pubsub-js'
import {submit, startSubmit, change,initialize} from 'redux-form'
import {message,notification} from 'antd'
import React, { PropTypes } from 'react';

export default function (history, store) {
  pubsub.subscribe("@@navigator.push", (msg, data) => {
    const {url, query, ...others} = data;
    history.push({
      pathname: url,
      search: query,
      state: others
    });
  })

  pubsub.subscribe("@@navigator.pushQuery", (msg, data) => {
      const {url, query, ...others} = data;
      history.push({
          pathname: url,
          query: query,
          state: others
      });
  })


  pubsub.subscribe("@@navigator.goBack", (msg, data) => {
    history.goBack();
  })

  pubsub.subscribe("@@navigator.replace", (msg, data) => {
    const {url, query, ...others} = data;
    history.replace({
      pathname: url,
      search: query,
      state: others
    });
  })


  pubsub.subscribe("@@message.success", (msg, data) => {
    message.success(data);
  })

  pubsub.subscribe("@@message.error", (msg, data) => {
    message.error(data);
  })

  pubsub.subscribe("@@notification.error", (msg, data) => {
      notification.error({
          description: <div>
              {
                  _.map(data,(item,index)=>{
                    return <p>{item}</p>
                })
              }
          </div>,
      });
  })


  pubsub.subscribe("@@form.change", (msg, data) => {
    store.dispatch(change(data.id, data.name, data.value));
  })

  


  pubsub.subscribe("@@form.init", (msg, data) => {
    store.dispatch(initialize(data.id,data.data));
  })
}



