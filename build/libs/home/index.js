window.platformDetection = (function () {
    var ua = navigator.userAgent;
    var isIOS = /iPhone|iPad|iPod/i.test(ua);
    var isAndroid = /(?:Android)/.test(ua);
    var isFireFox = /(?:Firefox)/.test(ua);
    var isTablet = /(?:iPad|PlayBook)/.test(ua) || (isFireFox && /(?:Tablet)/.test(ua));
    var isMobile = /mobile/i.test(ua);

    return {
        isDesktop: !isIOS && !isAndroid,
        isTablet: isTablet,
        isMobile: isMobile,
        isIOS: isIOS,
        isAndroid: isAndroid
    };
})();

$.fn.extend({
    select_color: function (callback) {
        $.each(this, function () {
            var eT = $(this);
            var eBar = eT.find('.bar')[0];
            var iInit = 0;
            var iMax = eT.height();
            var iY = eBar.offsetTop;
            eT.on('draginit', function (event) {
                iInit = eBar.offsetTop;
            }).on('drag', function (event, data) {
                iY = iInit + data.deltaY;
                if (iY < -5) {
                    iY = -5
                } else if (iY > iMax) {
                    iY = iMax;
                }
                $(eBar).css({
                    'top': iY
                });
            }).on('dragend', function (event, data) {
                callback && callback.call(this, 1 - (iY < 0 ? 0 : iY) / iMax);
            })

            eT.on('click', function (event) {
                var iY = event.offsetY;
                $(eBar).css({
                    'top': iY
                });
                callback && callback.call(this, 1 - (iY < 0 ? 0 : iY) / iMax);
            })
        })
    }
});

$(function () {
    var oManager = {
        init: function () {
            this.arrDType = ['oas', 'ods', 'mav', 'vul', 'kas'].join(',');
            this.arrLType = ['wav', 'ids', 'bad'].join(',');
            this.getAdData();
            this._initSelectColor();
            this._initSelectShowType();
            this._initSelectShowStyle();
            this._initMap();
        },
        _initSelectColor: function () {
            $('.color-select').select_color(function (v) {
                if ($(this).data('type') == 1) {
                    GTW.reset_dot_alpha(v);
                } else {
                    GTW.reset_line_alpha(v);
                }
            });
        },
        _initSelectShowType: function () {
            var _this = this;
            $('#select_show_type a').click(function () {
                var eT = $(this);
                var type = eT.data('type');
                if (!eT.hasClass('active')) {
                    switch (type) {
                        case 1: {
                            _this.changeToGlobeMap();
                            break;
                        }
                        case 2: {
                            _this.changeToPanMap();
                            break;
                        }
                      
                    }
                    $('#select_show_type a.active').removeClass('active');
                    eT.addClass('active')
                }
            });
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
            MAP.init({
                functions: MAP_functions,
                quality: (platformDetection.isMobile ? 'medium' : 'high'),
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
            window._AD_ = ["我是广告0:000000000000000000000000", "我是广告1:1111111111111111111111", "我是广告2:22222222222222222222222222222", "我是广告3:333333333333333333333333", "我是广告4:444444444444444444444444444", "我是广告5:5555555555555555555555555555555555555", "我是广告6:666666666666666666666666666666", "我是广告7:777777777777777777", "我是广告8:8888888888888888888888888888", "我是广告9:9999999999999999999999999999999999999999999"]
        }
    };
    oManager.init();
});