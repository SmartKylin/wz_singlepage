import 'whatwg-fetch'
import 'es6-promise'

const formatUrlencoded = obj => {
    let arr = [];
    for (let key in obj) {
        arr.push(`${key}=${obj[key]}`);
    }
    return arr.join('&');
};

export const get = url => {

    return fetch(url, {
        Accept: 'application/json',
        // 设置请求可以跨域发送cookie
        credentials: 'include',
        mode: 'cors',
        cache: 'default'
    })
}

export const post = (url, obj) => fetch(url, {
    method: "POST",
    // a=1&b=2&c=3
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include',
    body: formatUrlencoded(obj)
});
export default {
    get,
    post
}
