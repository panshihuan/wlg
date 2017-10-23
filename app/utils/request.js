
import 'whatwg-fetch';
import appPath from './config.js'
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // let token = window.store.getState().global.get('token');
  let token = localStorage.getItem('token');
  let opt = {};
  if(token !=null){
    opt = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':token,
        //'x-auth-token':token
      },
    };
  }else{
    opt = {
      headers: {
        'Content-Type': 'application/json'
      },
    };
  }
  
  Object.assign(opt, options);

  return fetch(`${appPath.currentServer}${url}`, opt)
    .then(checkStatus)
    .then(parseJSON);
}
