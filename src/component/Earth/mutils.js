import Moment from 'moment'
import _ from 'lodash'
import $ from 'jquery'
const _timeHour = 60 * 60;
const _timeDay = 60 * 60 * 24;

/**
 * 更具时间来转成最佳的显示,比如2分钟前,10分钟前,1小时前,
 * @param t
 * @return string
 */
export function TimeStrPretty(t) {
    let time = Date.parse(t);
    let now = new Date().getTime();
    let delta = Math.ceil((now - time) / 1000);
    if (delta < 60) {
        return delta + '秒前'
    } else if (delta < _timeHour) {
        return Math.ceil(delta / 60) + '分钟前'
    } else if (delta < _timeDay) {
        return Math.ceil(delta / _timeHour) + '小时前'
    } else {
        return Math.ceil(delta / _timeDay) + '天前'
    }
}

export function TimeStrFmt(t, f = "YYYY-MM-DD HH:mm") {
    let time = Moment(t);
    return time.format(f)
}

export function UserTypeStr(t) {
    switch (t) {
        case 1:
            return '微信用户'
    }
    return '普通用户'
}

var _cacheStore = {};
/**
 * 用来缓存请求
 * @param url 地址
 * @param cb 回调函数
 * @param checkcache 是否强制刷新
 * @return {*} ajax对象
 * @constructor
 */
export function CacheGet(url, cb, checkcache = true) {
    let key = url;
    let x = null;
    //先检测在不在队列里
    if (checkcache && _cacheStore.hasOwnProperty(key)) {
        let wi = window.setInterval(() => {
            let v = _cacheStore[key];
            if (v != null) {
                window.clearInterval(wi);
                cb(v);
            }
        }, 300);

        x = {
            abort(){
            }
        }
    } else {
        //先添加队列,标记为null
        _cacheStore[key] = null;
        x = $.getJSON(url, function (res) {
            _cacheStore[key] = res;
            cb(res);
        });
    }
    // console.log(_cacheStore);
    return x
}
export function CacheGetP(url, data, checkcache = true) {
    var def = $.Deferred();
    if (data != null) {
        url = url + "?" + $.param(data)
    }
    CacheGet(url, (res) => {
        def.resolve(res);
    }, checkcache)
    return def;
}
export function CacheAll() {
    console.log(_cacheStore);
}

/**
 * 获得静态资源的地址
 * @param r
 * @return {*}
 * @constructor
 */
export function StaticUrl(r) {
    if (r.indexOf('/') >= 0) return r;
    else return '/api/file/' + r;
}
/**
 * 将系统内部的以分为单位的价格显示为元为单位
 * @param price 分
 * @param show00 整数的时候显示00
 * @return string 元
 * @constructor
 */
export function PriceToYuan(price, show00 = false) {
    var y = Number(price).toString();
    var res = y.slice(0, -2);
    if (!show00 && y % 100 == 0) {

    } else {
        res += '.' + y.slice(-2)
    }
    return res
}
/**
 * 判断服务器的回复是否正确
 * @param res
 * @return {boolean}
 * @constructor
 */
export function ResIsOk(res) {
    return !res.hasOwnProperty('err_code')
}

var _loadedIds = [];
function getLoadId(url) {
    return url.replace(/\W/gi, '_');
}
export function simpleLoad(url) {
    var def = $.Deferred();
    var sid = getLoadId(url);
    if (document.getElementById(sid) != null) {
        def.resolve();
    } else {
        var script = null;
        if (url.indexOf('.css') > 0) {
            script = document.createElement('link');
            script.rel = 'stylesheet';
            script.href = url;
            script.id = sid;
        } else {
            script = document.createElement('script');
            script.src = url;
            script.id = sid;
        }
        script.onload = function () {
            def.resolve();
        };
        document.head.appendChild(script);
        _loadedIds.push(sid);
    }
    return def;
}
/**
 * 移除添加的脚本或样式
 * @param ids
 */
export function removeLoad(urls) {
    function remove(url) {
        var id = getLoadId(url);
        var r = document.getElementById(id);
        if (r != null) r.parentNode.removeChild(r);
    }

    if (Array.isArray(urls)) {
        urls.map(remove)
    } else {
        remove(urls);
    }
}

export function getOrDefault(obj, def = null) {
    if (obj == null) {
        return def
    }
    return obj
}

export function onIptChange(that, stateKey, cb = null, getVal = null) {
    return ((event) => {
        var obj = {}
        var val = null;
        if (getVal == null) val = event.target.value;
        else val = getVal(event)
        if (typeof val == "string") {
            val = val.trim();
        }
        obj[stateKey] = val
        that.setState(obj)
        if (cb != null) cb.call(that, val);
        // console.log('onIptChange', obj)
    })
}

/**
 * 简陋的双向绑定
 * 用法 {...twoWayBind(this,'x')}
 * @param that
 * @param key
 * @return {{value: *, onChange}}
 */
export function twoWayBind(that, key) {
    return {
        value: _.get(that.state, key),
        onChange: onIptChange(that, key)
    }
}
/**
 * 格式化字符串
 * @param fmt
 * @param items
 * @constructor
 */
export function WingFormat(fmt, items) {
    var res = fmt
    _.map(items, (v, k) => {
        res = res.replace('{' + k + '}', v)
    })
    return res
}

/**
 * Parse query string.
 * ?a=b&c=d to {a: b, c: d}
 * @param {String} (option) queryString
 * @return {Object} query params
 */
export function getQueryParams(queryString) {
    var query = (queryString || window.location.search).substring(1); // delete ?
    if (!query) {
        return undefined;
    }
    return _.chain(query.split('&'))
        .map(function (params) {
            var p = params.split('=');
            return [p[0], decodeURIComponent(p[1])];
        })
        .fromPairs()
        .value();
}

export function isPhone(s) {
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    return reg.test(s)
}

export function runInTry(func) {
    try {
        func()
    } catch (e) {
        if (window.__DEV__) {
            console.error(e)
        }
    }
}

export function getPropsNotInTypes(compInst) {
    let p = _.omit(compInst.props, _.keys(compInst.constructor.propTypes))
    return p
}

export function isEqualPick(objA, objB, paths) {
    return _.isEqual(_.pick(objA, paths), _.pick(objB, paths))
}
/**
 * 清空当前state，并初始化
 * @param compInst, React组建实例
 */
export function clearState(compInst) {
    let newState = _.mapValues(compInst.state, (value, key) => {
        return undefined
    })
    if (compInst.getInitialState != null) newState = _.merge(newState, compInst.getInitialState())
    compInst.setState(newState)
}
