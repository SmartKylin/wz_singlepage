import {CacheGet, CacheGetP, simpleLoad, removeLoad} from './mutils'
import _ from 'lodash'
import $ from 'jquery'

const pre = '/api';
var API = {
    //各个数据的key v 对照
    // rows: {
    //      st=sort type 排序顺序, b:越大越好 s:越小越好 , t:true优先
    //      ipt 代表输入的时候的表单样式 默认input,其他: textarea
    //      vtype 表示值得类型, float,int
    //      hn,null时是否显示,默认false
    // }
    // canShowInCmp 表示是否在对比的时候显示，默认true
    //
    InfoDict: {
        jb: {
            name: '基本参数',
            name_en: 'Basic parameter',
            key: 'jb',
            api: '/idc/view?ids={id}',
            apiInput: '/idc/input',
            rows: [{name: '机房名称', key: 'name'},
                {name: '机房等级（星）', key: 'grade', st: 'b'},
                {name: '运营商', key: 'operator'},
                {name: '机房简介', key: 'resume', ipt: 'textarea'},
                {name: '国家', key: 'country'},
                {name: '地区', key: 'area'},
                {name: '省份', key: 'province'},
                {name: '所在城市', key: 'city'},
                {name: '具体地址', key: 'address'},
                {name: '经度', key: 'longitude', vtype: 'float'},
                {name: '纬度', key: 'latitude', vtype: 'float'},
                {name: '交通周边', key: 'traffic'},
                {name: '链路资源', key: 'link_resource'},
                {name: '接入网络', key: 'access_network'},
                {name: '接入级别', key: 'access_level', st: 's'},
                {name: '是否骨干节点', key: 'is_backbone', "yon": true, st: 't'},
                {name: '出口带宽总量', key: 'bandwidth_total', st: 'b', vtype: 'int'},
                {name: '出口带宽余量', key: 'bandwidth_remain', st: 'b', vtype: 'int'},
                {name: '可提供接口', key: 'supply_interface', st: 'b'},
                {name: '机房机柜总量', key: 'cabinet_total', st: 'b', vtype: 'int'},
                {name: '机房机柜剩余量', key: 'cabinet_remain', st: 'b', vtype: 'int'},]
        },
        jz: {
            name: '建筑概况',
            name_en: 'Construction status',
            key: 'jz',
            icon: '',
            api: '/idc/building/view?ids={id}',
            apiInput: '/idc/building/input',
            rows: [{name: '运营时间', key: 'operation_time'},
                {name: '建筑面积（平方米）', key: 'construction_ms', st: 'b', vtype: 'int'},
                {name: '业务区承载能力', key: 'business_bearing'},
                {name: '电力区承载能力', key: 'power_bearing'},
                {name: '机房层高', key: 'storey'},
                {name: '业务面积(平方米)', key: 'business_ms', st: 'b', vtype: 'int'},
                {name: '规划机架数', key: 'rack', st: 'b', vtype: 'int'},
                {name: '供电类型', key: 'power_type'},
                {name: '油机', key: 'oil_machine', st: 'b'},
                {name: 'UPS设备', key: 'ups'},
                {name: 'ups后备时间（分钟）', key: 'ups_time', st: 'b'},
                {name: '冬季机房温度', key: 'winter_temperature'},
                {name: '夏季机房温度', key: 'summer_temperature'},
                {name: '机房湿度', key: 'humidity'},
                {name: '备用机组', key: 'standby_unit', st: 'b'},]
        },
        zc: {
            name: '支撑概况',
            name_en: 'Support profile',
            key: 'zc',
            icon: '',
            api: '/idc/support/view?ids={id}',
            apiInput: '/idc/support/input',
            rows: [{"key": "is_overstory", "name": "是否顶层", "yon": true},
                {"key": "overstory_remark", "name": "顶层备注", hn: true},
                {"key": "has_cargo_lift", "name": "是否有货梯", "yon": true, st: 't'},
                {"key": "cargo_lift_remark", "name": "货梯备注", hn: true},
                {"key": "has_storehouse", "name": "是否有库房", "yon": true, st: 't'},
                {"key": "storehouse_remark", "name": "库房备注", hn: true},
                {"key": "can_receive", "name": "是否能代收货物", "yon": true, st: 't'},
                {"key": "receive_remark", "name": "代收货物备注", hn: true},
                {"key": "supply_maintenance", "name": "是否提供维护设备（键盘、显示器）", "yon": true, st: 't'},
                {"key": "maintenance_remark", "name": "维护设备备注", hn: true},
                {"key": "cabinet_style", "name": "机柜样式"},
                {"key": "cabinet_style_remark", "name": "机柜样式备注", hn: true},
                {"key": "cabinet_dimension", "name": "机柜宽深高"},
                {"key": "cabinet_dimension_remark", "name": "机柜宽深高备注", hn: true},
                {"key": "tray_style", "name": "托盘样式及承重", st: 'b'},
                {"key": "tray_style_remark", "name": "托盘样式及承重备注", hn: true},
                {"key": "u_number", "name": "机柜支持U数", st: 'b', vtype: 'int'},
                {"key": "u_number_remark", "name": "机柜支持U数备注", hn: true},
                {"key": "refrigeration", "name": "机柜制冷方式"},
                {"key": "refrigeration_remark", "name": "机柜制冷方式备注", hn: true},
                {"key": "electric_category", "name": "电流类别"},
                {"key": "electric_category_remark", "name": "电流类别备注", hn: true},
                {"key": "ab_interpolation", "name": "AB路插法"},
                {"key": "ab_interpolation_remark", "name": "AB路插法备注", hn: true},
                {"key": "power_line", "name": "电源线样式"},
                {"key": "power_line_remark", "name": "电源线样式备注", hn: true},
                {"key": "electric_max", "name": "机柜电流最大额度(A)", st: 'b'},
                {"key": "electric_max_remark", "name": "机柜电流最大额度(A)备注", hn: true},
                {"key": "air_conditioner", "name": "中央空调组数", st: 'b', vtype: 'int'},
                {"key": "air_conditioner_remark", "name": "中央空调组数备注", hn: true},
                {"key": "temperature_setting", "name": "机房设定的温度/湿度范围"},
                {"key": "temperature_setting_remark", "name": "机房设定的温度/湿度范围备注", hn: true},
                {"key": "ups_mode", "name": "UPS方式"},
                {"key": "ups_mode_remark", "name": "UPS方式备注", hn: true},
                {"key": "ups_support_time", "name": "UPS支持时间", st: 'b'},
                {"key": "ups_support_time_remark", "name": "UPS支持时间备注", hn: true},
                {"key": "standby_endurance_time", "name": "备用发电设备续航时间"},
                {"key": "standby_endurance_time_remark", "name": "备用发电设备续航时间备注", hn: true},
                {"key": "row_spacing", "name": "机柜排间距", st: 'b'},
                {"key": "row_spacing_remark", "name": "row_spacing备注", hn: true},
                {"key": "cabinet_current", "name": "机房机柜数量", st: 'b', vtype: 'int'},
                {"key": "cabinet_current_remark", "name": "机房机柜数量备注", hn: true},
                {"key": "cabinet_expanded", "name": "可扩建机柜数量", st: 'b', vtype: 'int'},
                {"key": "cabinet_expanded_remark", "name": "可扩建机柜数量备注", hn: true},
                {"key": "unit_bearing", "name": "机房单位面积承重kg/M²", st: 'b'},
                {"key": "unit_bearing_remark", "name": "机房单位面积承重kg/M²备注", hn: true},
                {"key": "fire_mode", "name": "消防方式"},
                {"key": "fire_mode_remark", "name": "消防方式备注", hn: true},
                {"key": "idc_level", "name": "机房级别"},]
        },
        wl: {
            name: '机房网络',
            name_en: 'IDC network',
            key: 'wl',
            icon: '',
            api: '/idc/network/view?ids={id}',
            apiInput: '/idc/network/input',
            rows: [{"key": "core_model", "name": "核心设备型号"},
                {"key": "core_model_remark", "name": "核心设备型号备注", hn: true},
                {"key": "internetmeans", "name": "可提供的互联方式"},
                {"key": "internetmeans_remark", "name": "可提供的互联方式备注", hn: true},
                {"key": "tracerts", "name": "可提供的路由方式"},
                {"key": "tracerts_remark", "name": "可提供的路由方式备注", hn: true},
                {"key": "core_interface_model", "name": "核心设备接口模块类型"},
                {"key": "core_interface_model_remark", "name": "核心设备接口模块类型备注", hn: true},
                {"key": "wiring_to", "name": "布线槽道走向"},
                {"key": "wiring_to_remark", "name": "布线槽道备注", hn: true},
                {"key": "can_flow_clean", "name": "是否提供流量清洗", "yon": true, st: 't'},
                {"key": "can_flow_clean_remark", "name": "提供流量清洗备注", hn: true},
                {"key": "link_redundancy", "name": "链路冗余情况"},
                {"key": "link_redundancy_remark", "name": "链路冗余情况备注", hn: true},
                {"key": "export_bandwidth", "name": "机房整体出口带宽", st: 'b', vtype: 'float'},
                {"key": "export_bandwidth_remark", "name": "机房整体出口带宽备注", hn: true},
                {"key": "core_expansion", "name": "核心扩容能力"},
                {"key": "core_expansion_remark", "name": "核心扩容能力备注", hn: true},
                {"key": "line_load", "name": "线路负载方式"},
                {"key": "line_load_remark", "name": "线路负载方式备注", hn: true},]
        },
        nc: {
            name: '机房NOC',
            name_en: 'IDC NOC',
            key: 'nc',
            icon: '',
            api: '/idc/noc/view?ids={id}',
            apiInput: '/idc/noc/input',
            rows: [{"key": "need_subscribe", "name": "入室是否提前预约", "yon": true},
                {"key": "need_subscribe_remark", "name": "提前预约备注", hn: true},
                {"key": "test_electric", "name": "是否测电", "yon": true},
                {"key": "test_electric_remark", "name": "是否测电备注", hn: true},
                {"key": "help_aintain", "name": "是否具备代维能力", "yon": true},
                {"key": "help_maintain_remark", "name": "代维能力备注", hn: true},
                {"key": "certificates", "name": "入室证件"},
                {"key": "certificates_remark", "name": "入室证件备注", hn: true},
                {"key": "burglary", "name": "办理入室方式"},
                {"key": "burglary_remark", "name": "办理入室方式备注", hn: true},
                {"key": "onduty", "name": "是否7*24小时值班", "yon": true},
                {"key": "onduty_remark", "name": "7*24小时值班备注", hn: true},
                {"key": "patrol", "name": "是否巡检", "yon": true},
                {"key": "patrol_remark", "name": "巡检备注", hn: true},
                {"key": "authorization", "name": "授权认证方式"},
                {"key": "authorization_remark", "name": "授权认证方式备注", hn: true},
                {"key": "delivery_address", "name": "收货地址"},
                {"key": "delivery_address_remark", "name": "收货地址备注", hn: true},
                {"key": "consignee", "name": "收货人"},
                {"key": "consignee_remark", "name": "收货人备注", hn: true},
                {"key": "consignee_phone", "name": "收货人手机"},
                {"key": "contacts_person", "name": "机房联系人"},
                {"key": "contacts_phone", "name": "机房联系人电话"},
                {"key": "contacts_email", "name": "机房联系人email"},
                {"key": "contacts_qq", "name": "机房联系人qq"},
                {"key": "contacts_remark", "name": "机房联系人备注", hn: true},]
        },
        qt: {
            name: '其他信息',
            name_en: 'Other information',
            key: 'qt',
            icon: '',
            api: '/idc/other/view?ids={id}',
            apiInput: '/idc/other/input',
            rows: [{"key": "operator_type", "name": "运营商类型"},
                {"key": "operator_type_remark", "name": "运营商类型备注", hn: true},
                {"key": "bandwidth_expansion", "name": "带宽扩容能力"},
                {"key": "bandwidth_expansion_remark", "name": "带宽扩容能力备注", hn: true},
                {"key": "cabinet_expansion", "name": "机柜扩容能力"},
                {"key": "cabinet_expansion_remark", "name": "机柜扩容能力备注", hn: true},
                {"key": "delivery_time", "name": "机房交付时间"},
                {"key": "delivery_time_remark", "name": "机房交付时间备注", hn: true},
                {"key": "ip_match", "name": "IP配比情况"},
                {"key": "ip_match_remark", "name": "IP配比情况备注", hn: true},
                {"key": "join_up_maintenance_link", "name": "是否能接入维护线路", "yon": true},
                {"key": "join_up_maintenance_link_remark", "name": "是否能接入维护线路备注", hn: true},
                {"key": "out_fibre", "name": "是否可以出纤", "yon": true},
                {"key": "out_fibre_remark", "name": "是否可以出纤备注", hn: true},
                {"key": "advantage", "name": "机房优势"},]
        },
        ip: {
            name: 'IP',
            name_en: 'IP',
            key: 'ip',
            icon: '',
            api: '/idc/ip?id={id}',
            apiInput: '/idc/ip/input',
            rows: [{"key": "ip", "name": "IP地址"},
                {"key": "port", "name": "端口"}],
            canShowInCmp: false,
        }
    },
    //省份列表
    getProvinceList(){
        return [
            "北京",
            "上海",
            "广东",
            "天津",
            "重庆",
            "安徽",
            "澳门",
            "福建",
            "甘肃",
            "广西",
            "贵州",
            "海南",
            "河北",
            "河南",
            "黑龙江",
            "湖北",
            "湖南",
            "吉林",
            "江苏",
            "江西",
            "辽宁",
            "内蒙古",
            "宁夏",
            "青海",
            "山东",
            "山西",
            "陕西",
            "四川",
            "台湾",
            "西藏",
            "香港",
            "新疆",
            "云南",
            "浙江"
        ];
    },
    getOpertorEN(cn, def = undefined){
        switch (cn.trim()) {
            case '移动':
                return 'cm'
            case '联通':
                return 'cnc'
            case '电信':
                return 'ctc'
        }
        return def
    },
    getOpertorCN(cn){
        switch (cn.trim()) {
            case 'china':
                return '全国'
            case 'cm':
                return '移动'
            case 'cnc':
                return '联通'
            case 'ctc':
                return '电信'
        }
    },
    areaENtoCN: x => areaENtoCN[x],
    pre: pre,
    failFunc(msg){
        const _ = window._
        alert(_.get(msg, 'responseJSON.msg', '请稍后重试'))
    },
    get(url, params){
        return CacheGetP(pre + url, params, false)
    },
}


//const bmapUrl = "http://api.map.baidu.com/getscript?v=2.0&ak=wEdGBRYrr5t1tF9X9cGbSmkB&services=&t=20160804144823";
const bmapUrl = '/libs/bdmap.js'
var load = (url, cache = true) => {
    return (data) => {
        var def = $.Deferred();
        CacheGet(url + "?" + $.param(data), (res) => {
            def.resolve(res);
        }, cache)
        return def;
    }
};
var idcViewLoader = (block) => {
    return (id) => {
        var def = $.Deferred();
        CacheGetP(pre + block.api.replace(/\{id\}/, id)).done((res) => {
            if (res.msg == "") {
                def.resolve(res.data[0]);
            }
        })
        return def
    }
}
//构建城市
var areaENtoCN = (() => {
    let areaENtoCN = [];
    areaENtoCN["anhui"] = "安徽"
    areaENtoCN["aomen"] = "澳门"
    areaENtoCN["beijing"] = "北京"
    areaENtoCN["fujian"] = "福建"
    areaENtoCN["gansu"] = "甘肃"
    areaENtoCN["guangdong"] = "广东"
    areaENtoCN["guangxi"] = "广西"
    areaENtoCN["guizhou"] = "贵州"
    areaENtoCN["hainan"] = "海南"
    areaENtoCN["hebei"] = "河北"
    areaENtoCN["henan"] = "河南"
    areaENtoCN["heilongjiang"] = "黑龙江"
    areaENtoCN["hubei"] = "湖北"
    areaENtoCN["hunan"] = "湖南"
    areaENtoCN["jilin"] = "吉林"
    areaENtoCN["jiangsu"] = "江苏"
    areaENtoCN["jiangxi"] = "江西"
    areaENtoCN["liaoning"] = "辽宁"
    areaENtoCN["neimenggu"] = "内蒙古"
    areaENtoCN["ningxia"] = "宁夏"
    areaENtoCN["qinghai"] = "青海"
    areaENtoCN["shandong"] = "山东"
    areaENtoCN["shanxi"] = "山西"
    areaENtoCN["shan3xi"] = "陕西"
    areaENtoCN["shanghai"] = "上海"
    areaENtoCN["sichuan"] = "四川"
    areaENtoCN["taiwan"] = "台湾"
    areaENtoCN["tianjin"] = "天津"
    areaENtoCN["xizang"] = "西藏"
    areaENtoCN["hongkong"] = "香港"
    areaENtoCN["xinjiang"] = "新疆"
    areaENtoCN["yunnan"] = "云南"
    areaENtoCN["zhejiang"] = "浙江"
    areaENtoCN["chongqing"] = "重庆"
    return areaENtoCN;
})();
var reportLoad = (url) => {
    return (idcid) => {
        if (idcid == null) {
            var d = $.Deferred();
            d.reject();
            return d;
        }
        return load('/api' + url, false)({dest: idcid, faker: true})
    }
}
var _localFavList = [];
API = _.merge(API, {
    idc: {
        getJB: idcViewLoader(API.InfoDict.jb),
        /*
         query := param.String(r, "q", "")
         // 地区
         area := param.String(r, "area", "")
         // 省份
         province := param.String(r, "province", "")
         // 运营商
         operator := param.String(r, "operator", "")
         // 接入级别
         access_level := param.String(r, "access_level", "")
         // 机房等级，比如T1、T2
         idc_level := param.String(r, "idc_level", "")
         // 链路资源，比如单线、双线
         link_resource := param.String(r, "link_resource", "")
         // 带宽范围，限制最大值
         bandwidth_max := param.Int(r, "bandwidth_max", 10000000)
         // 带宽范围，限制最小值
         bandwidth_min := param.Int(r, "bandwidth_min", 0)
         */
        query(par){
            if (par == null) {
                par = {}
            }
            if (!par.hasOwnProperty('limit')) {
                par.limit = 2000;
            }
            return CacheGetP(pre + '/idc/query', par)
        },
        recomm: {
            query(){
                return CacheGetP(pre + '/idc/recomm/query')
            },
        },
        save(url, data){
            return $.post(pre + url, JSON.stringify(data), null, 'json')
        },
        delete(id){
            return $.post(pre + '/idc/delete', {id: id})
        }
    },
})
API = _.merge(API, {
    report: {
        radar: reportLoad('/report/radar'),
        ping: reportLoad('/report/ping'),
        tcp: reportLoad('/report/query'),
        lastmile: reportLoad('/report/lastmile'),
        updown: reportLoad('/report/updown'),
        table: reportLoad('/report/table'),
        lost: reportLoad('/report/lost'),
    },
    auth: {
        /**
         *
         * @param identity 手机号或者邮箱
         * @param password 密码
         * @param captcha_id 隐藏域中的captcha_id要一并传上来
         * @param captcha_value 用户输入的验证码
         */
        login: (identity, password, captcha_id, captcha_value) => {
            return $.post(pre + '/auth/login', {identity, password, captcha_id, captcha_value})
        },
        // @param way 注册方式，如果是通过手机号注册的way=phone，如果是通过邮箱注册的way=mail
        // @param phone 手机号注册的时候需要传上来手机号
        // @param code 手机号注册的时候需要传上来手机验证码
        // @param mail 邮箱注册的时候需要传上来邮箱
        // @param name 昵称，必填
        // @param password 密码，必填
        // @param agree bool值，表示是否勾选了【我已阅读用户协议】，阅读了，可以传个1，没阅读可以传个0
        register(obj){
            return $.post(pre + '/auth/register', obj)
        },
        logout(){
            return $.get(pre + '/auth/logout')
        },
        captcha(){
            return $.get(pre + '/captcha?v=' + new Date().getTime())
        },
        captchaUrl(id){
            return pre + '/captcha/' + id + '.png'
        },
        phoneCode(phone){
            return $.get(pre + '/phone/code?phone=' + phone)
        },
        verifyCode(target){
            return $.post(pre + '/verify/code', {target: target})
        },
    },
    net: {
        cloud_last(id){
            return $.get(pre + '/net/cloud/last?faker=true&dest=' + id)
        },
        paris(ids = []){
            return $.get(pre + "/net/ping/pairs/last?faker=true&dests=" + ids.join('|'))
        },
        /**
         * 获取云图的详细数据
         * @param type : string 取值 ping,
         * @param id
         * @return {*}
         */
        timeline(type, id){
            return CacheGetP(pre + '/net/' + type + '/isp/t', {faker: true, dest: id})
        },
        http_last(id){
            return CacheGetP(pre + '/net/http/last', {dest: id, faker: true})
        },
    },
    user: {
        me(){
            return $.get(pre + '/me')
        },
        favList(){
            var def = $.Deferred();
            $.get(pre + '/myidc/favorite/lists').done((res) => {
                _localFavList = res.data
                if (_localFavList.length == 0) {
                    //表示已经初始化过了
                    _localFavList = [{id: 0}]
                }
                def.resolve(_localFavList)
            }).fail(API.failFunc)
            return def;
        },
        favOpt(id, isAdd = true){
            var def = $.Deferred();
            $.post(pre + '/idc/favorite/' + (isAdd ? 'add' : 'cancel'), {id: id}).done((res) => {
                if (isAdd) {
                    _localFavList = _.unionBy(_localFavList, [{id: id}], x => x.id)
                } else {
                    _.remove(_localFavList, x => x.id == id)
                }
                def.resolve(res)
            })
            return def
        },
        isFav(item){
            if (_localFavList.length == 0) {
                return _.get(item, 'favortag', 0) == 1
            }
            return _.some(_localFavList, x => x.id == item.id)
        },
        checkPriv(){
            return $.get(pre + '/usr/priv')
        },
        /**
         * 忘记密码
         *  target := param.MustString(r, "target", "邮箱或手机号")
         code := param.MustString(r, "code", "验证码")
         newPass := param.MustString(r, "new_pass", "新密码")
         repeatPass := param.MustString(r, "repeat_pass", "重复输入的新密码")
         * @param obj
         * @return {*}
         */
        getpwd(obj){
            return $.post(pre + '/usr/getpwd', obj)
        },
        /**修改密码
         * old_pass, new_pass, repeat_pass
         * @param obj
         * @return {*}
         */
        pwd(obj){
            return $.post(pre + '/usr/pwd', obj)
        },
        changeMail(mail){
            return $.post(pre + '/usr/mail', {mail: mail})
        },
        info(){
            return $.get(pre + '/usr/info')
        },
        /**
         * name := param.String(r, "name", "")
         industry := param.String(r, "industry", "")
         company := param.String(r, "company", "")
         position := param.String(r, "position", "")
         * @param obj
         * @return {*}
         */
        changeInfo(obj){
            return $.post(pre + '/usr/profile', obj)
        },
        changePhone(obj){
            return $.post(pre + '/usr/phone', obj)
        }
    },
    loadBMap(){
        window.wise = 1;
        window.netSpeed = 233;
        window.netType = 1;
        window.BMap_loadScriptTime = (new Date).getTime();

        return simpleLoad(bmapUrl)
    },
    removeBMap(){
        reportLoad(bmapUrl)
    },
});
export default API;
