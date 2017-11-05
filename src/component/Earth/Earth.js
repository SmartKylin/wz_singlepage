import React from 'react'
import {simpleLoad} from './mutils'
import API from './API'

import _ from 'lodash'
import $ from 'jquery'


var Earth = React.createClass({
    wordInst: null,//地球实例
    managerInst: null,//管理实例
    getInitialState: function () {
        return {
            me: null,
            ads: [],
        }
    },
    componentDidMount: function () {
        this.loadBall();
        this.getAds();
    },
    componentWillUnmount: function () {
        const MAP = window.MAP
        if (MAP != null) {
            MAP.detach_graph_canvas();
            MAP.stop();
        }
    },
    getAds(){
        window._AD_ = []
        API.idc.recomm.query().done((res)=> {
            _.each(res.data, (x)=> {
                window._AD_.push({x})
            })
        })
    },
    loadBall(){
        $.when(
            // simpleLoad('/libs/home/keymaster.js'),
            simpleLoad('/libs/home/gl-matrix.js'),
            simpleLoad('/libs/home/MersenneTwister.js'),
            simpleLoad('/libs/home/perlin.js'),
            simpleLoad('/libs/home/webgl.js'),
            simpleLoad('/libs/home/lang.js'),
            simpleLoad('/libs/home/webgl-utils.js'),
            simpleLoad('/libs/home/webgl-3d-math.js'),
            simpleLoad('/libs/home/primitives.js')
        ).done(()=> {
            simpleLoad('/libs/home/interface.js').done(()=> {
                simpleLoad('/libs/home/map.js').done(()=> {
                    let {MAP, GTW, MAP_functions} = window
                    MAP_functions.show_country_name = (country)=> {
                        if (country == null) {
                            $('#selected-country-name').text("");
                        } else {
                            var iso3 = country.iso3;
                            $('#selected-country-name').text(window.lang.getText("MAP_COUNTRY_" + iso3));
                        }
                    };
                    MAP_functions = _.merge(MAP_functions, {
                        show_country_popup: (countryName)=> {
                            if (this.refs["cablistpop"] != null)
                                this.refs["cablistpop"].showCountry(countryName, window._AD_);
                        }, hide_country_popup2: ()=> {
                            if (this.refs["cablistpop"] != null)
                                this.refs["cablistpop"].hide();
                        }, show_cabinets: ()=> {
                            _.each(window._AD_, (x)=> {
                                MAP.ms_launch(8, [x.longitude, x.latitude, 0])
                            })
                        }, isLoaded: true,
                    });
                    var oManager = {
                        init: function () {
                            this.arrDType = ['oas', 'ods', 'mav', 'vul', 'kas'].join(',');
                            this.arrLType = ['wav', 'ids', 'bad'].join(',');
                            this._initSelectShowStyle();
                            this.showDot(true);
                            this.showLine(true);
                            GTW.reset_dot_alpha(0.9);
                            this._initMap();
                            this.getAdData();
                            this.showAD(true);
                        },
                        _initSelectShowStyle: function () {
                            var _this = this;
                            $('#importExportBtns .check').click(function () {
                                var eT = $(this);
                                var type = eT.data('type');
                                var bChecked = !eT.hasClass('inactive')
                                if (!bChecked) {
                                    eT.removeClass('inactive');
                                } else {
                                    eT.addClass('inactive');
                                }
                                switch (type) {
                                    case 1: {
                                        _this.showDot(!bChecked);
                                        break;
                                    }
                                    case 2: {
                                        _this.showLine(!bChecked);
                                        break;
                                    }
                                    case 3: {
                                        _this.showAD(!bChecked)
                                        break;
                                    }
                                }
                            });
                        },
                        _initMap: function () {
                            GTW.SHADER_SOURCES = '/libs/home/all-shaders.glsl';
                            GTW.SHADER_DEMO_SOURCES = '/libs/home/demo-shaders.glsl';
                            GTW.WING_COLORS = {};
                            MAP.init({
                                functions: MAP_functions,
                                // quality: (platformDetection.isMobile ? 'medium' : 'high'),
                                quality: 'high',
                                // screensaver: true,
                                // widget: true,
                            })
                        },
                        changeToPanMap: function () {
                            MAP.set_view("flat");
                        },
                        changeToGlobeMap: function () {
                            MAP.set_view("globe")
                        },
                        showAD: function (bShow) {
                            MAP.set_ad_status(bShow);
                            if (bShow)
                                MAP_functions.show_country_popup({iso3: 'CHINA'})
                            else
                                MAP_functions.hide_country_popup2();
                        },
                        showLine: function (bShow) {
                            //$.each(this.arrLType, function (i, e) {
                            //    debugger;
                            //    MAP.toggle_map(e);
                            //    MAP.toggle_graph(e);
                            //})
                            //var _this = this;
                            //$.each(GTW.systems, function (i, e) {
                            //    if (_this.arrLType.indexOf(e.name.toLowerCase()) > -1) {
                            //        e.enabled_graph = bShow;
                            //        e.enabled = bShow;
                            //    }
                            //})
                            GTW.resetUseMissiles(bShow);
                        },
                        showDot: function (bShow) {
                            //$.each(this.arrDType, function (i, e) {
                            //    MAP.toggle_map(e);
                            //    MAP.toggle_graph(e);
                            //})
                            //var _this = this;
                            //$.each(GTW.systems, function (i, e) {
                            //    if (_this.arrDType.indexOf(e.name.toLowerCase()) > -1) {
                            //        e.enabled_graph = bShow;
                            //        e.enabled = bShow;
                            //    }
                            //})
                            GTW.resetUseIcons(bShow);
                        },
                        getAdData: function () {//获取广告数据

                        }
                    };
                    oManager.init();
                    this.managerInst = oManager;
                })
            })
        });
    },
    render() {
        //之前加载过了
        if (window.MAP_functions != null && window.MAP_functions.isLoaded) {
            window.location.reload();
            return false;
        }

        return (
            <canvas id="webgl-canvas"/>
        )
    }
})
export default Earth
