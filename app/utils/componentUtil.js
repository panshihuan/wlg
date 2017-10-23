import request from './request'
import tinyCache from 'tinycache'
import pubsub from 'pubsub-js'
import uuid from 'uuid/v4'
import qs from 'qs';

const uuidV4 = require("uuid/v4");
const safeEval = require('notevil')
import Immutable,{fromJS} from "immutable"
import { submit } from 'redux-form/immutable'

var dictionaryCache = new tinyCache();

export function resolveDataSource({dataSource, eventPayload, dataContext}) {
  if (dataSource.type == "api" && dataSource.bodyExpression) {
    let context = {};
    return new Promise(function (resolve, reject) {
      var result = safeEval(dataSource.bodyExpression, {
        fromJS: fromJS,
        eventPayload: eventPayload,
        dataSource: dataSource,
        dataContext: dataContext,
        pubsub,
        JSON,
        uuidV4,
        console,
        resolveFetch,
        submitValidateForm,
        _,
          Immutable,
          setTimeout,
          clearTimeout,
        callback:(body)=>{
           request(dataSource.url, {
            method: dataSource.method,
            body: JSON.stringify(body)
          }).then(function (data) {
             resolve(data)
           })
        }
      })

    })




  }
  else {


    if (dataSource.type == "api") {
      let body = {};
      if (dataSource.withForm != undefined) {
        if (dataSource.mode == "dataContext") {
          if (dataSource.payloadMapping != undefined && dataSource.payloadMapping.length == 1 && dataSource.payloadMapping[0].to == "@@Array") {
            body[dataSource.payloadMapping[0].paramKey] = dataContext.map(d => d[dataSource.payloadMapping[0].key])
          }

          return request(dataSource.url, {
            method: dataSource.method,
            body: JSON.stringify(Object.assign({}, body, window.store.getState().get("form").get(dataSource.withForm).toJS().values))
          })
        }

        else {
          window.store.dispatch(submit(dataSource.withForm))
          let currentForm=window.store.getState().get("form").get(dataSource.withForm);
          let error=false;
          if(currentForm!=undefined)
            {
              if(currentForm.get('syncErrors')|| currentForm.get('asyncErrors'))
                {
                  error=true
                }
            }
          
        if(!error)
          return request(dataSource.url, {
            method: dataSource.method,
            body: JSON.stringify(currentForm.toJS().values)
          })
        }
        return Promise.resolve({})
      }

      if (dataSource.mode == "dataContext") {
        //单独处理，待修改
        if (dataSource.payloadMapping != undefined && dataSource.payloadMapping[0].from == "@@Array" && dataSource.payloadMapping[0].to == 0) {
          return request(dataSource.url, {
            method: dataSource.method,
            body: JSON.stringify(dataContext[dataSource.payloadMapping[0].to])
          })
        } else if (dataSource.payloadMapping != undefined && dataSource.payloadMapping[0].from == "@@Array" && typeof(dataSource.payloadMapping[0].to) == 'string') {
          return request(dataSource.url, {
            method: dataSource.method,
            body: JSON.stringify(dataSource.payload)
          }).then(data => {
            console.log('data:::', data)
            let assi = Object.assign(data, {"data": data.data[dataSource.payloadMapping[0].to]})
            return assi;
          })
        } else {
          return request(dataSource.url, {method: dataSource.method, body: JSON.stringify(dataContext)})
        }
      }

      if (dataSource.mode == "eventPayload") {
        let paramArr = []

        if (dataSource.payloadMapping != undefined && dataSource.payloadMapping.length == 1 && dataSource.payloadMapping[0].to == "@@Array") {
          paramArr = eventPayload.map(d => d[dataSource.payloadMapping[0].key]);
          if (dataSource.payloadMapping[0].paramKey != undefined) {
            body[dataSource.payloadMapping[0].paramKey] = paramArr;
          } else {
            body = paramArr;
          }


          if (dataSource.pagerInfo != undefined) {
            body.pager = dataSource.pagerInfo;
          }
          return request(dataSource.url, {method: dataSource.method, body: JSON.stringify(body)})

        }
      }

      if (dataSource.mode == "payload") {

        return request(dataSource.url, {method: dataSource.method, body: JSON.stringify(dataSource.payload)})
      }


      //针对不同的数据源组成不同的数据参数
      if (dataSource.mode != undefined) {
        processData(dataSource, eventPayload, dataContext, dataSource.mode);
      }


      if (eventPayload != undefined) {
        //就把dataContext里面的数据转换为body为[id1,id2,id3]的形式来满足后端
        if (dataSource.payloadMapping != undefined && dataSource.payloadMapping.length == 1) {
          if (dataSource.payloadMapping[0].to == "@@Array") {
            if (dataContext != undefined && dataSource.payloadMapping[0].from == "dataContext") {
              if (dataContext instanceof Array) {
                if (dataSource.payloadMapping[0].paramKey != undefined) {
                  body[dataSource.payloadMapping[0].paramKey] = dataContext.map(d => d[dataSource.payloadMapping[0].key])
                } else {
                  body = dataContext.map(d => d[dataSource.payloadMapping[0].key])
                }
              } else if (dataContext instanceof Object) {
                let paramArr = [];
                if (dataSource.payloadMapping[0].paramKey != undefined) {
                  paramArr.push(dataContext[dataSource.payloadMapping[0].key]);
                  body[dataSource.payloadMapping[0].paramKey] = paramArr;
                } else {
                  paramArr.push(dataContext[dataSource.payloadMapping[0].key]);
                  body = paramArr;
                }
              }
            }
          } else if (dataSource.payloadMapping[0].to == "@@String") {
            if (dataContext != undefined && dataSource.payloadMapping[0].from == "dataContext") {
              let paramString = "";
              for (let i = 0; i < dataContext.length; i++) {
                if (i == dataContext.length - 1) {
                  paramString += dataContext[i][dataSource.payloadMapping[0].key];
                  continue;
                }
                paramString += `${dataContext[i][dataSource.payloadMapping[0].key]},`;
              }
              if (dataSource.payloadMapping[0].paramKey != undefined) {
                body[dataSource.payloadMapping[0].paramKey] = paramString;
              } else {
                body = paramString;
              }
            }
          } else {
            //默认映射规则
            let prepared = Object.assign({}, eventPayload, dataContext)
            if (dataSource.payloadMapping != undefined)
              dataSource.payloadMapping.forEach(m => {
                body[m.to] = prepared[m.from]
              })
            else {
              body = prepared;
            }
          }
        } else if (dataSource.payloadMapping != undefined && dataSource.payloadMapping.length > 1) {
          //todo 暂时还没写
        } else {
          //默认映射规则
          let prepared = Object.assign({}, eventPayload, dataContext)
          if (dataSource.payloadMapping != undefined)
            dataSource.payloadMapping.forEach(m => {
              body[m.to] = prepared[m.from]
            })
          else {
            body = prepared;
          }
        }
        if (dataSource.payload != undefined) {
          body = Object.assign({},dataSource.payload,body)
        }
        if (dataSource.paramsInQueryString) {
          return request(`${dataSource.url}?${qs.stringify(body)}`, {method: dataSource.method})
        } else {
          //只是给表格用
          if(dataSource.mode==undefined&&eventPayload.eventPayload==undefined&&dataSource.pagerInfo instanceof Object)
            {
              body["pager"]=dataSource.pagerInfo;
              return request(dataSource.url, {method: dataSource.method, body: JSON.stringify(body)})

            }else

          return request(dataSource.url, {method: dataSource.method, body: JSON.stringify(body)})
        }
      } else {
        return request(dataSource.url, {method: dataSource.method})
      }
    } else if (dataSource.type == "customValue") {
      return Promise.resolve({data: dataSource.values})
    } else if (dataSource.type == "dictionary") {
      const id = dataSource.payload.code;
      const dictionaryValues = dictionaryCache.get(id)
      if (dictionaryValues) {
        return Promise.resolve({data: dictionaryValues})
      } else {
        return new Promise(function (resolve, reject) {
          request('/api/dictionary.json', {
            method: "POST",
            body: JSON.stringify({code: dataSource.payload.code})
          }).then(function (response) {
            dictionaryCache.put(id, response.data);
            resolve({data: response.data})
          }).catch(function (e) {
            reject(e)
          })
        })
      }
    }
  }



}


//处理不同数据源的数据
function processData(dataSource, eventPayload, dataContext, mode) {
  let body = {};
  if (mode == "payload") {
    if (dataSource.payload != undefined) {
      body = Object.assign({}, body, dataSource.payload)
    }
  }
  else if (mode == "dataContext") {
    if (dataSource.paramKey != undefined) {
      body[dataSource.paramKey] = dataContext.map(d => d[dataSource.payloadMapping[0].key])
    } else {
      body = dataContext.map(d => d[dataSource.payloadMapping[0].key])
    }
  }
  else if (mode == "eventPayload") {
    if (eventPayload != undefined) {
      body = Object.assign({}, body, dataSource.payload)
    }
  }
  else if (mode == "payload&&dataContext") {

  }
  else if (mode == "payload&&eventPayload") {

  }
  else if (mode == "dataContext&&eventPayload") {

  }
  else if (mode == "payload&&dataContext&&eventPayload") {

  }
  return body;
}

export function resolveFetch({fetch}) {
  const me = this;

  return new Promise(function (resolve, reject) {

    if (fetch.data == "@@formValues") {

      resolve(window.store.getState().get("form").get(fetch.id).toJS().values)
    }
    else {

      let eventId = uuid();
      pubsub.subscribe(eventId, (name, payload) => {
        pubsub.unsubscribe(eventId);
        if(typeof payload=="function")
          resolve(payload())
        else
          resolve(payload)
      })
      pubsub.publish(`${fetch.id}.fetchData`, {data: fetch.data, eventId: eventId})
    }
  })
}


export function publishEvents({eventName, config, payload, eventPayload, dataContext, payloadMapping, mode, outside, meta}) {
  let pubEventName = eventName;
  if (config.rowIndex != undefined && !outside) {
    let parts = pubEventName.split('.')
    pubEventName = `${parts[0]}[${config.rowIndex}].${parts[1]}`
  }

  if (mode == "payload") {
    pubsub.publish(pubEventName, _.cloneDeep(payload), meta)
  }
  else if (mode == "dataContext") {
    pubsub.publish(pubEventName, _.cloneDeep( dataContext), meta)
  }
  else if (mode == "eventPayload") {
    pubsub.publish(pubEventName, _.cloneDeep( eventPayload), meta)
  }
  else if (mode == "payload&&eventPayload") {
    //todo: 如果eventPayload|payload不是对象类型，需要把eventPayload|payload值包装到eventPayload|payload属性中
    pubsub.publish(pubEventName, _.cloneDeep(Object.assign({}, eventPayload, payload)), meta)
  }
  else if (mode == "payload&&dataContext") {
    //todo: 如果eventPayload|payload不是对象类型，需要把eventPayload|payload值包装到eventPayload|payload属性中

    if (payloadMapping != undefined) {
      if (payloadMapping.length == 1 && payloadMapping[0].from == "@@DataContext") {

        pubsub.publish(pubEventName, _.cloneDeep(Object.assign({}, payload, {[payloadMapping[0].to]: dataContext.data})), meta)
      }

    }
    else
      pubsub.publish(pubEventName, _.cloneDeep(Object.assign({}, payload, dataContext)), meta)
  }
  else if (mode == "payload&&dataContext&&eventPayload") {
    //todo: 如果eventPayload|payload不是对象类型，需要把eventPayload|payload值包装到eventPayload|payload属性中
    pubsub.publish(pubEventName, _.cloneDeep(Object.assign({}, eventPayload, dataContext, payload)), meta)
  }
  else if (mode == "eventPayload&&dataContext") {
    pubsub.publish(pubEventName, _.cloneDeep(Object.assign({}, eventPayload, dataContext)), meta)
  }
  else {
    //兼容目前的行为，以后移除
    if (payload != undefined) {
      pubsub.publish(pubEventName, payload, meta)
    }
    else {
      pubsub.publish(pubEventName, {eventPayload}, meta)
    }
  }
}


export function resolveDataSourceCallback({dataSource, eventPayload, dataContext}, onSuccess, onError) {
  resolveDataSource({dataSource, eventPayload, dataContext}).then(function (response) {
    onSuccess(response)
  }).catch(function (e) {
    onError(e);
  })
}
//触发表单验证如果验证失败 返回false否者true
export function submitValidateForm(withForm) {
  window.store.dispatch(submit(withForm))
  let currentForm=window.store.getState().get("form").get(withForm);
  let error=false;
  if(currentForm!=undefined)
  {
    if(currentForm.get('syncErrors')|| currentForm.get('asyncErrors'))
    {
      error=true
    }
  }
  return error

}