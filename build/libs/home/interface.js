function ucFirst(t) {
    return t.charAt(0).toUpperCase() + t.slice(1)
}
function getQueryParams(t) {
    t = t.split("+").join(" ");
    for (var e, o = {}, s = /[?&]?([^=]+)=([^&]*)/g; e = s.exec(t) ;)
        o[decodeURIComponent(e[1])] = decodeURIComponent(e[2]);
    return o
}
function niceUrlQueryParamsFix() {
    var t = ""
      , e = getQueryParams(document.location.search);
    return $.each(e, function (e, o) {
        "" != e && "_suid" != e && (t += "" == t ? "?" : "&",
        t += encodeURIComponent(e) + "=" + encodeURIComponent(o))
    }),
    t
}
var CYBERMAP_IS_DEVELOPMENT = !location.host.match(/cybermap.kaspersky.com/);
var CYBERMAP_IS_PRODUCTION = !CYBERMAP_IS_DEVELOPMENT
var detectedCountryId = -1;
var logToConsole = true, activeLang = 0, activeLangClass = ".english", langUrlPrefix = "", mapModus = 0;
var demoModeActive = 0, mapColor = 0, siteOpen = 0, currPageId = 1, lastScrollTop = 0, lastScrollDir = 0;
var lastWorldTaskId = 0, lastCountryTaskId = 0, currWorldStatisticsTimePeriod = 0, currWorldStatisticsDetectionType = "oas";
var currWorldStatisticsContentPane = "stats_content_two", nextWorldStatisticsContentPane = "stats_content_one";
var worldStatsTaskList = [], worldStatsTaskListRunning = !1, currCountryStatisticsTimePeriod = 0;
var currCountryStatisticsDetectionType = "oas", currCountryStatisticsContentPane = "stats_content_two";
var nextCountryStatisticsContentPane = "stats_content_one", countryStatsTaskList = [];
var countryStatsTaskListRunning = !1, currCountryStatisticsCountry = 1, lastCountryStatisticsCountry = 1;
var statisticsCountryDropdownOpen = !1, documentWidth = "0px", documentHeight = "0px", statisticsGraphCanvas;
var statisticsGraphContext, countries = [], webgl_countries_data = [], countriesObjs = [];
var waitingForAllCountryData, lastTop5Data, googleShareSettingsBase = {
    contenturl: "https://cybermap.kaspersky.com/",
    contentdeeplinkid: "",
    clientid: "1032749335403-ag40okd8fnis6d5jdpos33mjaaefsij1.apps.googleusercontent.com",
    cookiepolicy: "single_host_origin",
    prefilltext: "Cyberthreath map",
    calltoactionlabel: "OPEN",
    calltoactionurl: "https://cybermap.kaspersky.com/",
    calltoactiondeeplinkid: "",
    requestvisibleactions: "http://schemas.google.com/AddActivity"
}, fixHeaderPosition = function () {
    $(".content").get(0).scrollHeight <= $(".content").height() && parseInt($(".content").css("marginTop")) < 103 && ($(".content").animate({
        marginTop: "103px"
    }),
    $(".header").animate({
        top: "0px"
    }))
}
, detectionTypes = [{
    id: "oas",
    name_en: window.lang.getText("STATISTICS_LOCAL_INFECTIONS"),
    name_ru: window.lang.getText("STATISTICS_LOCAL_INFECTIONS"),
    active: 1
}, {
    id: "wav",
    name_en: window.lang.getText("STATISTICS_WEB_THREATS"),
    name_ru: window.lang.getText("STATISTICS_WEB_THREATS"),
    active: 1
}, {
    id: "ids",
    name_en: window.lang.getText("STATISTICS_NETWORK_ATTACKS"),
    name_ru: window.lang.getText("STATISTICS_NETWORK_ATTACKS"),
    active: 1
}, {
    id: "vul",
    name_en: window.lang.getText("STATISTICS_VULNERABILITIES"),
    name_ru: window.lang.getText("STATISTICS_VULNERABILITIES"),
    active: 1
}, {
    id: "kas",
    name_en: window.lang.getText("STATISTICS_SPAM"),
    name_ru: window.lang.getText("STATISTICS_SPAM"),
    active: 1
}, {
    id: "mav",
    name_en: window.lang.getText("STATISTICS_INFECTED_MAIL"),
    name_ru: window.lang.getText("STATISTICS_INFECTED_MAIL"),
    active: 1
}, {
    id: "ods",
    name_en: window.lang.getText("STATISTICS_ON_DEMAND_SCAN"),
    name_ru: window.lang.getText("STATISTICS_ON_DEMAND_SCAN"),
    active: 1
}, {
    id: "bad",
    name_en: window.lang.getText("STATISTICS_BOTNET_ACTIVITY"),
    name_ru: window.lang.getText("STATISTICS_BOTNET_ACTIVITY"),
    active: 1
}], continents = [{
    name_en: window.lang.getText("CONTINENT_NORTH_AMERICA"),
    name_ru: "Северная Америка",
    countries: [109, 70, 111, 167, 136, 90, 193, 108, 161, 118, 142, 82, 12, 173, 38, 178, 72]
}, {
    name_en: window.lang.getText("CONTINENT_SOUTH_AMERICA"),
    name_ru: "Южная Америка",
    countries: [149, 100, 112, 117, 124, 148, 160, 184, 215, 222, 227, 35, 4, 56, 6]
}, {
    name_en: window.lang.getText("CONTINENT_ASIA"),
    name_ru: "Азия",
    countries: [159, 10, 105, 122, 123, 13, 131, 34, 137, 140, 144, 147, 150, 152, 154, 159, 179, 182, 185, 186, 192, 197, 199, 202, 206, 213, 219, 226, 229, 23, 237, 240, 241, 33, 34, 37, 39, 42, 45, 50, 52, 55, 58, 60, 67, 92]
}, {
    name_en: window.lang.getText("CONTINENT_EUROPE"),
    name_ru: "Европа",
    countries: [1, 103, 113, 117, 120, 125, 146, 15, 166, 17, 171, 187, 19, 194, 197, 203, 207, 211, 218, 221, 223, 233, 235, 253, 26, 27, 28, 29, 46, 48, 49, 59, 66, 69, 75, 81, 86, 91]
}, {
    name_en: window.lang.getText("CONTINENT_AFRIKA"),
    name_ru: "Африка",
    countries: [209, 104, 107, 110, 114, 115, 121, 129, 138, 141, 143, 151, 155, 156, 157, 163, 170, 172, 175, 180, 183, 188, 190, 191, 195, 198, 20, 200, 208, 21, 210, 220, 224, 234, 24, 243, 248, 3, 31, 36, 43, 5, 51, 61, 74, 84, 87, 99]
}, {
    name_en: window.lang.getText("CONTINENT_OCEANIA"),
    name_ru: "Океания",
    countries: [30, 62, 22, 83, 16, 176, 127]
}];
Date.now || (Date.now = function () {
    return (new Date).getTime()
}
);
var timeStamp = function () {
    return Math.floor(Date.now())
}
, shareData = {
    url: window.lang.getText("SOCIAL_LINK"),
    url_ru: window.lang.getText("SOCIAL_LINK"),
    title: window.lang.getText("SUBTITLE"),
    text_en: window.lang.getText("SOCIAL_TEXT"),
    text_ru: window.lang.getText("SOCIAL_TEXT"),
    hashtags: window.lang.getText("SHARE_HASH_TAGS")
}, encodedShareData = function (t) {
    return encodeURIComponent(shareData[t])
}
, addHeaderSharingActions = function () {
    0 == activeLang ? ($("ul.social_links .facebook").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + encodedShareData("url")),
    $("ul.social_links .twitter").attr("href", "https://twitter.com/home?status=" + encodedShareData("text_en") + " " + encodedShareData("hashtags")),
    $("ul.social_links .gplus").attr("href", "http://plus.google.com/share?url=" + encodedShareData("url")),
    $("ul.social_links .vk").attr("href", "http://vk.com/share.php?url=" + encodedShareData("url"))) : ($("ul.social_links .facebook").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + encodedShareData("url_ru")),
    $("ul.social_links .twitter").attr("href", "https://twitter.com/home?status=" + encodedShareData("text_ru") + " " + encodedShareData("hashtags")),
    $("ul.social_links .gplus").attr("href", "http://plus.google.com/share?url=" + encodedShareData("url_ru")),
    $("ul.social_links .vk").attr("href", "http://vk.com/share.php?url=" + encodedShareData("url_ru")))
}
, dataLoader = function (t, e) {
    var o, s = "bad" == t.detection_type;
    if (s || CYBERMAP_IS_PRODUCTION)
        if (t.list_countries)
            o = "assets/data/countries.json";
        else {
            var a = t.data_type + "_" + t.detection_type + "_" + t.time_period + ("country" == t.data_type ? "" : "_" + t.country_id) + ".json";
            o = "assets/data/securelist/" + a
        }
    else
        o = "/assets/lib/data_loader.php?" + $.param(t);
    $.getJSON(o, function (t) {
        e(t)
    })
}
, loadCountriesHelper = function (t) {
    $.isEmptyObject(webgl_countries_data) || (clearInterval(waitingForAllCountryData),
    $.each(t, function (t, e) {
        isSet(webgl_countries_data[e.key]) && (96 != parseInt(e.key) ? (countries[e.key] = {
            en: webgl_countries_data[e.key].name[window.lang.lang()],
            ru: webgl_countries_data[e.key].name.ru
        },
        countriesObjs.push({
            id: e.key,
            value_en: webgl_countries_data[e.key].name[window.lang.lang()],
            value_ru: webgl_countries_data[e.key].name.ru
        })) : (countries[e.key] = {
            en: e.name,
            ru: "Кот-д’Ивуар"
        },
        countriesObjs.push({
            id: e.key,
            value_en: e.name,
            value_ru: "Кот-д’Ивуар"
        })))
    }))
}
, loadCountries = function () {
    dataLoader({
        list_countries: 1
    }, function (t) {
        waitingForAllCountryData = setInterval(function () {
            loadCountriesHelper(t)
        }, 100)
    })
}
var buildStatisticsGraph2 = function (t, e, o, s) {
    var a = $("<div>").addClass("stats_block wide")
      , n = ""
      , i = ""
      , r = ""
      , c = "";
    "world" == e ? (n = 0 == currWorldStatisticsTimePeriod ? window.lang.getText("STATISTICS_WEEK") : window.lang.getText("STATISTICS_MONTH"),
    i = 0 == currWorldStatisticsTimePeriod ? window.lang.getText("STATISTICS_WEEK") : window.lang.getText("STATISTICS_MONTH"),
    $.each(detectionTypes, function (t, e) {
        e.id == currWorldStatisticsDetectionType && (r = e.name_en,
        c = e.name_ru)
    })) : (n = 0 == currCountryStatisticsTimePeriod ? window.lang.getText("STATISTICS_WEEK") : window.lang.getText("STATISTICS_MONTH"),
    i = 0 == currCountryStatisticsTimePeriod ? window.lang.getText("STATISTICS_WEEK") : window.lang.getText("STATISTICS_MONTH"),
    $.each(detectionTypes, function (t, e) {
        e.id == currCountryStatisticsDetectionType && (r = e.name_en,
        c = e.name_ru)
    }));
    var l = $("<h2>").addClass("english").html(window.lang.getText("STATISTICS_TOP") + " - " + r + " " + window.lang.getText("STATISTICS_IN_THE_LAST") + " " + n)
      , d = $("<h2>").addClass("russian").html(window.lang.getText("STATISTICS_TOP") + " - " + r + " " + window.lang.getText("STATISTICS_IN_THE_LAST") + " " + n)
      , p = $("<div>").addClass("canvas_holder")
      , u = $("<div>").addClass("inner_canvas_holder")
      , _ = $("<canvas>").addClass("statistics_canvas_2");
    a.append(l),
    a.append(d),
    u.append(_),
    p.append(u),
    a.append(p),
    "world" == e ? ("bad" == currWorldStatisticsDetectionType && a.css({
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        clear: "both"
    }),
    $(".stats_overview.one .stats_content ." + nextWorldStatisticsContentPane).append(a)) : $(".stats_overview.two .stats_content ." + nextCountryStatisticsContentPane).append(a);
    var g = !1
      , v = []
      , w = [];
    if (isSet(t.data_loader_error)) {
        var T = $("<span>").addClass("english").css({
            position: "absolute",
            left: "0px",
            top: "49%",
            textAlign: "center",
            width: "100%",
            color: "#000000",
            zIndex: 5
        }).text(window.lang.getText("STATISTICS_NO_DATA"))
          , y = $("<span>").addClass("russian").css({
              position: "absolute",
              left: "0px",
              top: "49%",
              textAlign: "center",
              width: "100%",
              color: "#000000",
              zIndex: 5
          }).text(window.lang.getText("STATISTICS_NO_DATA"));
        p.append(T),
        p.append(y),
        "world" == e && 1 == currWorldStatisticsTimePeriod || "world" != e && 1 == currCountryStatisticsTimePeriod ? (v = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        w = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) : (v = ["", "", "", "", "", "", ""],
        w = [0, 0, 0, 0, 0, 0, 0]),
        o.apply(this, s)
    } else
        g = !0,
        $.each(t, function (e, a) {
            var n = a.date;
            e == t.length - 1 && o.apply(this, s),
            t.length - 1 > 7 && platformDetection.isMobile && (e > 0 && 5 > e && (n = ""),
            e > 5 && 10 > e && (n = ""),
            e > 10 && 15 > e && (n = ""),
            e > 15 && 20 > e && (n = ""),
            e > 20 && 25 > e && (n = ""),
            e > 25 && e < t.length - 1 && (n = "")),
            v.push(n),
            w.push(a.count)
        });
    var S = {
        labels: v,
        datasets: [{
            label: "",
            fillColor: "rgba(213,43,30,0.two)",
            strokeColor: "rgba(213,43,30,1)",
            pointColor: "rgba(213,43,30,1)",
            pointStrokeColor: "#d52b1e",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(213,43,30,1)",
            data: w
        }]
    }
      , m = {
          animation: !0,
          animationSteps: 60,
          animationEasing: "easeOutQuart",
          scaleShowGridLines: !0,
          scaleGridLineColor: "rgba(0,0,0,.05)",
          scaleGridLineWidth: 1,
          scaleShowHorizontalLines: !0,
          scaleShowVerticalLines: !1,
          bezierCurve: !0,
          bezierCurveTension: .4,
          pointDot: !0,
          pointDotRadius: 5,
          pointDotStrokeWidth: 1,
          pointHitDetectionRadius: 5,
          datasetStroke: !0,
          datasetStrokeWidth: 1,
          datasetFill: !1,
          responsive: !0,
          maintainAspectRatio: !1,
          showTooltips: g,
          customTooltips: !1,
          tooltipEvents: ["mousemove", "touchstart", "touchmove"],
          tooltipFillColor: "#006d55",
          tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          tooltipFontSize: 14,
          tooltipFontStyle: "normal",
          tooltipFontColor: "#fff",
          tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          tooltipTitleFontSize: 14,
          tooltipTitleFontStyle: "bold",
          tooltipTitleFontColor: "#fff",
          tooltipYPadding: 15,
          tooltipXPadding: 10,
          tooltipCaretSize: 6,
          tooltipCornerRadius: 0,
          tooltipXOffset: 10,
          tooltipTemplate: "<%= value %>",
          multiTooltipTemplate: "<%= value %>",
          legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
          onAnimationProgress: function () { },
          onAnimationComplete: function () { }
      };
    new Chart(_[0].getContext("2d")).Line(S, m)
};
var clickCountry = function (t) {
    return closeDropdowns(0),
    currCountryStatisticsCountry = $(t.target).closest("a").attr("data-country-id"),
    $(".stats_overview.two .stats_overview_controls .location .label.english").html(countries[currCountryStatisticsCountry].en),
    $(".stats_overview.two .stats_overview_controls .location .label.russian").html(countries[currCountryStatisticsCountry].ru),
    loadStatisticsCountryData(!1, !0),
    t.stopPropagation(),
    !1
}
, buildStatisticLists = function (t, e, o, s, a) {
    var n;
    n = "world" == e ? $(".stats_overview.one .stats_content ." + nextWorldStatisticsContentPane) : $(".stats_overview.two .stats_content ." + nextCountryStatisticsContentPane);
    var i = $("<div>").addClass("stats_block " + o)
      , r = $("<h2>")
      , c = $("<ul>").addClass("list")
      , l = $("<li>")
      , d = $("<a>")
      , p = $("<span>");
    $.each(t, function (e, o) {
        var u = i.clone()
          , _ = r.clone().addClass("english").html(o.name_en)
          , g = r.clone().addClass("russian").html(o.name_ru)
          , v = c.clone();
        if (isSet(o.items))
            $.each(o.items, function (t, e) {
                var o = e.value;
                "bad" !== currWorldStatisticsDetectionType && (o += " %");
                var s = l.clone()
                  , a = d.clone().attr("href", "").on("click", function (t) {
                      return t.stopPropagation(),
                      t.preventDefault(),
                      !1
                  })
                  , n = p.clone().addClass("num").text(t + 1 + ".")
                  , i = p.clone().addClass("name")
                  , r = p.clone().addClass("english").html(e.name_en)
                  , c = p.clone().addClass("russian").html(e.name_ru)
                  , u = p.clone().addClass("percentage").html(o)
                  , _ = p.clone().addClass("info")
                  , g = p.clone().addClass("english").html("See data")
                  , w = p.clone().addClass("russian").html("Показать данные");
                i.append(r),
                i.append(c),
                isSet(e.country_id) && "bad" !== currWorldStatisticsDetectionType ? (a.attr("data-country-id", e.country_id).on("click", clickCountry),
                _.append(g),
                _.append(w)) : _.html(o),
                a.append(n),
                a.append(i),
                a.append(u),
                a.append(_),
                s.append(a),
                v.append(s)
            });
        else {
            var w = $("<div>").addClass("nodata_list")
              , T = $("<span>").addClass("english").css({
                  position: "absolute",
                  left: "0px",
                  top: "49%",
                  textAlign: "center",
                  width: "100%",
                  color: "#000000"
              }).text("NO DATA")
              , y = $("<span>").addClass("russian").css({
                  position: "absolute",
                  left: "0px",
                  top: "49%",
                  textAlign: "center",
                  width: "100%",
                  color: "#000000"
              }).text("НЕТ ДАННЫХ");
            w.append(T),
            w.append(y),
            v.append(w)
        }
        u.append(_),
        u.append(g),
        u.append(v),
        $(n).append(u),
        e == t.length - 1 && s.apply(this, a)
    })
}
, secureListDataLoaded = function (t, e, o, s, a) {
    switch (t.data_type) {
        case "country":
            var n = []
              , i = [];
            $.each(continents, function (t, o) {
                var s = {};
                s.name_en = o.name_en,
                s.name_ru = o.name_ru;
                var a = [];
                $.each(o.countries, function (t, o) {
                    if (isSet(countries[o]) && isSet(e[o])) {
                        var s = {
                            country_id: o,
                            name_en: countries[o].en,
                            name_ru: countries[o].ru,
                            value: e[o]
                        };
                        i.push(s),
                        a.push(s)
                    }
                }),
                a.sort(function (t, e) {
                    return t.value == e.value ? 0 : t.value > e.value ? -1 : 1
                }),
                s.items = a.slice(0, 5),
                n.push(s)
            });
            var r = {};
            r.name_en = window.lang.getText("CONTINENT_WORLD"),
            r.name_ru = window.lang.getText("CONTINENT_WORLD"),
            i.sort(function (t, e) {
                return t.value == e.value ? 0 : t.value > e.value ? -1 : 1
            }),
            r.items = i.slice(0, 15),
            n.unshift(r),
            buildStatisticLists(n, o, "", s, a);
            break;
        case "graph":
            buildStatisticsGraph2(e, o, s, a);
            break;
        case "top10":
            var n = []
              , c = {}
              , l = ""
              , d = ""
              , p = ""
              , u = "";
            if ("world" == o ? (l = 0 == currWorldStatisticsTimePeriod ? window.lang.getText("STATISTICS_WEEK") : window.lang.getText("STATISTICS_MONTH"),
            d = 0 == currWorldStatisticsTimePeriod ? window.lang.getText("STATISTICS_WEEK") : window.lang.getText("STATISTICS_MONTH"),
            $.each(detectionTypes, function (t, e) {
                e.id == currWorldStatisticsDetectionType && (p = e.name_en,
                u = e.name_ru)
            }),
            c.name_en = window.lang.getText("STATISTICS_TOP") + " - " + p + " " + window.lang.getText("STATISTICS_IN_THE_LAST") + " " + l,
            c.name_en = window.lang.getText("STATISTICS_TOP") + " - " + p + " " + window.lang.getText("STATISTICS_IN_THE_LAST") + " " + l) : (l = 0 == currCountryStatisticsTimePeriod ? window.lang.getText("STATISTICS_WEEK") : window.lang.getText("STATISTICS_MONTH"),
            d = 0 == currCountryStatisticsTimePeriod ? window.lang.getText("STATISTICS_WEEK") : window.lang.getText("STATISTICS_MONTH"),
            $.each(detectionTypes, function (t, e) {
                e.id == currCountryStatisticsDetectionType && (p = e.name_en,
                u = e.name_ru)
            }),
            c.name_en = c.name_en = window.lang.getText("STATISTICS_TOP") + " - " + p + " " + window.lang.getText("STATISTICS_IN_THE_LAST") + " " + l,
            c.name_ru = c.name_en = window.lang.getText("STATISTICS_TOP") + " - " + p + " " + window.lang.getText("STATISTICS_IN_THE_LAST") + " " + l),
            !isSet(e.data_loader_error)) {
                var _ = [];
                $.each(e, function (t, e) {
                    var o = {
                        name_en: e.name,
                        name_ru: e.name,
                        value: e.percent
                    };
                    _.push(o)
                })
            }
            c.items = _,
            n.push(c),
            "world" == o ? buildStatisticLists(n, o, "wide", s, a) : buildStatisticLists(n, o, "wide", s, a)
    }
}
, loadSecureListData = function (t, e, o, s) {
    logToConsole && console.log("loading securelist data"),
    void 0 === o && (o = function () {
        logToConsole && console.log("no callback!")
    }
    ),
    void 0 === s && (s = []);
    var a = {
        securelist_data: 1,
        country_id: 0,
        data_type: "country",
        detection_type: "oas",
        time_period: "d"
    }
      , n = []
      , i = $.extend({}, a, t);
    dataLoader(i, function (t) {
        $.each(t, function (t, e) {
            n[t] = e
        }),
        secureListDataLoaded(i, n, e, o, s)
    })
}
, googleSharePostCount = 0, updateCountryPopLinks = function () {
    $(".countrypop .countrypop_social .sharing_icons .facebook a").attr("href", shareCurrCountryPopup("facebook")),
    $(".countrypop .countrypop_social .sharing_icons .twitter a").attr("href", shareCurrCountryPopup("twitter")),
    0 == activeLang ? $(".countrypop .countrypop_social .sharing_icons .gplus a").attr("href", "http://plus.google.com/share?url=" + encodedShareData("url")) : $(".countrypop .countrypop_social .sharing_icons .gplus a").attr("href", "http://plus.google.com/share?url=" + encodedShareData("url_ru")),
    $(".countrypop .countrypop_social .sharing_icons .vk a").attr("href", shareCurrCountryPopup("vk"))
}
, MAP_functions = {
    show_country_popup: function (t) {
        // $("#countrypop div.countrypop_header h3 span.english").html(t),
        // $("#countrypop").hasClass("hidden") ? ($("#countrypop").show(),
        // $("#countrypop").removeClass("hidden"),
        // platformDetection.isMobile && ($(".detection_types").removeClass("open"),
        // $(".countrypop div.blocks").getNiceScroll().show(),
        // $(".countrypop div.blocks").getNiceScroll().resize()),
        // setTimeout(updateCountryPopLinks, 100)) : ($("#countrypop").addClass("pulse"),
        // setTimeout(function () {
        //     $("#countrypop").removeClass("pulse")
        // }, 1e3))
    },
    hide_country_popup: function () {
        // platformDetection.isMobile && $(".countrypop div.blocks").getNiceScroll().hide(),
        // $("#countrypop").addClass("hidden"),
        // setTimeout(function () {
        //     $("#countrypop").hasClass("hidden") && $("#countrypop").hide()
        // }, 1e3)
    },
    set_demo_state: function (t) {
        logToConsole && console.log("MAP demo state:", t),
        setUIDemoState(t)
    },
    set_view_state: function (t) {
        logToConsole && console.log("MAP view state:", t),
        setUIViewState(t)
    },
    got_country_data: function (t) {
        webgl_countries_data = t,
        0 == activeLang ? MAP.set_language("en") : MAP.set_language("ru")
    },
    stats_top5: function (t) {
        if ($("div[data-subpage='2']").length)
            for (var e = 0; 5 > e; e++)
                $($(".most_infected_links a")[e]).attr("data-country-id", t[e].key),
                $(".name .english", $($(".most_infected_links a")[e])).html(t[e].name[window.lang.lang()]),
                $(".name .russian", $($(".most_infected_links a")[e])).html(t[e].name.ru);
        else
            lastTop5Data = t
    },
    got_geoip_data: function (t) {
        logToConsole && console.log("got_geoip_data:", t),
        $("div[data-subpage='2']").length ? (isSet(countries[currCountryStatisticsCountry]) && isSet(countries[currCountryStatisticsCountry].en) && isSet(countries[currCountryStatisticsCountry].ru) && (closeDropdowns(0),
        currCountryStatisticsCountry = t,
        $(".stats_overview.two .stats_overview_controls .location .label.english").html(countries[currCountryStatisticsCountry].en),
        $(".stats_overview.two .stats_overview_controls .location .label.russian").html(countries[currCountryStatisticsCountry].ru),
        loadStatisticsCountryData(!1, !0)),
        detectedCountryId = t) : detectedCountryId = t
    }, show_cabinets:function(){},show_country_name:function(){}
}, isSet = function (t) {
    return "undefined" != typeof t && null !== t ? !0 : !1
}
, getDocumentSize = function () {
    documentWidth = $(document).width() + "px",
    documentHeight = $(document).height() + "px"
}
, setUIDemoState = function (t) {
    t ? ($(".controls ul.control_btns .demo_on_btn").hide(),
    $(".controls ul.control_btns .demo_off_btn").show(),
    demoModeActive = 1) : ($(".controls ul.control_btns .demo_on_btn").show(),
    $(".controls ul.control_btns .demo_off_btn").hide(),
    demoModeActive = 0)
}
, setUIViewState = function (t) {
    $(".controls ul.control_btns .map_type_globe").toggle("globe" == t),
    $(".controls ul.control_btns .map_type_plane").toggle("globe" != t)
}
, switchLanguage = function (t) {
    return !0
}
, langBtnClick = function (t) {
    var e = $(t.target).attr("data-lang");
    return switchLanguage(e),
    "en" == e ? ga("send", "event", {
        eventCategory: "Language button",
        eventAction: "Button Click",
        eventLabel: "SELECT EN"
    }) : ga("send", "event", {
        eventCategory: "Language button",
        eventAction: "Button Click",
        eventLabel: "SELECT RU"
    }),
    !1
}
, applyLanguage = function (t) {
    0 == activeLang ? ($(".content .subpage[data-subpage='" + t + "'] .english").addClass("visible").show(),
    $(".content .subpage[data-subpage='" + t + "'] .russian").removeClass("visible")) : ($(".content .subpage[data-subpage='" + t + "'] .english").removeClass("visible").hide(),
    $(".content .subpage[data-subpage='" + t + "'] .russian").addClass("visible").show())
}
, detectionTypeClick = function (t) {
    var e = $(t.target).closest("li").attr("data-detectiontype")
      , o = e.toUpperCase();
    $.each(detectionTypes, function (t, o) {
        o.id == e && (1 == o.active ? o.active = 0 : o.active = 1)
    }),
    1 == activeLang && (o += " (RU)"),
    $("ul.type-icons li[data-detectiontype='" + e + "']").toggleClass("disabled"),
    MAP.toggle_map(e),
    MAP.toggle_graph(e),
    ga("send", "event", {
        eventCategory: "Data detectiontype",
        eventAction: "Button Click",
        eventLabel: o
    })
}
, infectedBtnClick = function (t) { }
, openSite = function () {
    $("html, body").addClass("site_open"),
    $(".wrapper .site .content").css({
        top: documentHeight
    }).show().animate({
        top: "0%"
    }, {
        duration: 250,
        complete: function () {
            $("html, body").removeClass("noscroll"),
            MAP.pause()
        }
    }),
    siteOpen = 1
}
, closeSite = function () {
    $("html, body").addClass("noscroll"),
    $(".header").animate({
        top: "0px"
    }),
    $(".subheader").animate({
        top: "61px"
    }),
    MAP.resume(),
    $(".wrapper .site .content").animate({
        top: documentHeight
    }, {
        duration: 250,
        complete: function () {
            $(".wrapper .site .content").hide(),
            $("html, body").removeClass("site_open")
        }
    }),
    siteOpen = 0
}
, toggleStatisticsDropdown1 = function (t) {
    if ($(".stats_overview.one .stats_overview_controls .type").hasClass("open"))
        $(".stats_overview.one .stats_overview_controls .statistics_dropdown_menu").animate({
            height: "0px"
        }, 500, function () {
            $(document).off("click", toggleStatisticsDropdown1),
            $(".stats_overview.one .stats_overview_controls .type").removeClass("open"),
            $(".stats_overview.one .stats_overview_controls .statistics_dropdown_menu").css({
                height: ""
            }).hide().removeClass("open")
        });
    else {
        $(".stats_overview.one .stats_overview_controls .statistics_dropdown_menu").show();
        var e = $(".stats_overview.one .stats_overview_controls .statistics_dropdown_menu").height();
        if (platformDetection.isMobile) {
            var o = $(".stats_overview.one").position().top;
            o += $(".stats_overview.one .stats_overview_controls").position().top,
            o += $(".stats_overview.one .stats_overview_controls .type").position().top,
            o += $(".content").scrollTop(),
            $(".content").animate({
                scrollTop: o
            })
        }
        $(".stats_overview.one .stats_overview_controls .statistics_dropdown_menu").css({
            height: "0px"
        }).animate({
            height: e + "px"
        }, 500, function () {
            $(document).on("click", toggleStatisticsDropdown1),
            closeDropdowns(1),
            $(".stats_overview.one .stats_overview_controls .type").addClass("open"),
            $(".stats_overview.one .stats_overview_controls .statistics_dropdown_menu").addClass("open")
        })
    }
    return t.stopPropagation(),
    !1
}
, toggleStatisticsDropdown2 = function (t) {
    if ($(".stats_overview.two .stats_overview_controls .type").hasClass("open"))
        $(".stats_overview.two .stats_overview_controls .statistics_dropdown_menu").animate({
            height: "0px"
        }, 500, function () {
            $(document).off("click", toggleStatisticsDropdown2),
            $(".stats_overview.two .stats_overview_controls .type").removeClass("open"),
            $(".stats_overview.two .stats_overview_controls .statistics_dropdown_menu").css({
                height: ""
            }).hide().removeClass("open")
        });
    else {
        $(".stats_overview.two .stats_overview_controls .statistics_dropdown_menu").show();
        var e = $(".stats_overview.two .stats_overview_controls .statistics_dropdown_menu").height();
        if (platformDetection.isMobile) {
            var o = $(".stats_overview.two").position().top;
            o += $(".stats_overview.two .stats_overview_controls").position().top,
            o += 55,
            o += $(".content").scrollTop(),
            $(".content").animate({
                scrollTop: o
            })
        }
        $(".stats_overview.two .stats_overview_controls .statistics_dropdown_menu").css({
            height: "0px"
        }).animate({
            height: e + "px"
        }, 500, function () {
            $(document).on("click", toggleStatisticsDropdown2),
            closeDropdowns(2),
            $(".stats_overview.two .stats_overview_controls .type").addClass("open"),
            $(".stats_overview.two .stats_overview_controls .statistics_dropdown_menu").addClass("open")
        })
    }
    return t.stopPropagation(),
    !1
}
, toggleStatisticsCountryDropdown = function (t) {
    if ($(".stats_overview.two .stats_overview_controls .location").hasClass("open"))
        statisticsCountryDropdownOpen = !1,
        $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu").animate({
            height: "0px"
        }, 500, function () {
            $(document).off("click", toggleStatisticsCountryDropdown),
            $(".stats_overview.two .stats_overview_controls .location").removeClass("open"),
            $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu").css({
                height: ""
            }).hide().removeClass("open")
        });
    else {
        $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu").show();
        var e = $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu").height();
        if (platformDetection.isMobile) {
            var o = $(".stats_overview.two").position().top;
            o += $(".stats_overview.two .stats_overview_controls").position().top,
            o += $(".stats_overview.two .stats_overview_controls .location").position().top,
            o += $(".content").scrollTop(),
            $(".content").animate({
                scrollTop: o
            })
        }
        $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu").css({
            height: "0px"
        }).animate({
            height: e + "px"
        }, 500, function () {
            statisticsCountryDropdownOpen = !0,
            $(document).on("click", toggleStatisticsCountryDropdown),
            closeDropdowns(3),
            $(".stats_overview.two .stats_overview_controls .location").addClass("open"),
            $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu").addClass("open")
        })
    }
    return t.preventDefault(),
    t.stopPropagation(),
    !1
}
, closeDropdowns = function (t) {
    1 != t && $(".stats_overview.one .stats_overview_controls .statistics_dropdown_menu").animate({
        height: "0px"
    }, 500, function () {
        $(document).off("click", toggleStatisticsDropdown1),
        $(".stats_overview.one .stats_overview_controls .type").removeClass("open"),
        $(".stats_overview.one .stats_overview_controls .statistics_dropdown_menu").css({
            height: ""
        }).hide().removeClass("open")
    }),
    2 != t && $(".stats_overview.two .stats_overview_controls .statistics_dropdown_menu").animate({
        height: "0px"
    }, 500, function () {
        $(document).off("click", toggleStatisticsDropdown2),
        $(".stats_overview.two .stats_overview_controls .type").removeClass("open"),
        $(".stats_overview.two .stats_overview_controls .statistics_dropdown_menu").css({
            height: ""
        }).hide().removeClass("open")
    }),
    3 != t && $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu").animate({
        height: "0px"
    }, 500, function () {
        $(document).off("click", toggleStatisticsCountryDropdown),
        statisticsCountryDropdownOpen = !1,
        $(".stats_overview.two .stats_overview_controls .location").removeClass("open"),
        $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu").css({
            height: ""
        }).hide().removeClass("open")
    })
}
, toggleTimePeriod1 = function (t) {
    return $(".stats_overview.one .stats_overview_controls .time_period ul.time_options li[data-time-period]").removeClass("active"),
    currWorldStatisticsTimePeriod ? ($(".stats_overview.one .stats_overview_controls .time_period ul.time_options li[data-time-period='0']").addClass("active"),
    currWorldStatisticsTimePeriod = 0) : ($(".stats_overview.one .stats_overview_controls .time_period ul.time_options li[data-time-period='1']").addClass("active"),
    currWorldStatisticsTimePeriod = 1),
    loadStatisticsWorldData(!1),
    closeDropdowns(0),
    t.preventDefault(),
    t.stopPropagation(),
    !1
}
, toggleTimePeriod2 = function (t) {
    return $(".stats_overview.two .stats_overview_controls .time_period ul.time_options li[data-time-period]").removeClass("active"),
    currCountryStatisticsTimePeriod ? ($(".stats_overview.two .stats_overview_controls .time_period ul.time_options li[data-time-period='0']").addClass("active"),
    currCountryStatisticsTimePeriod = 0) : ($(".stats_overview.two .stats_overview_controls .time_period ul.time_options li[data-time-period='1']").addClass("active"),
    currCountryStatisticsTimePeriod = 1),
    loadStatisticsCountryData(!1, !1),
    closeDropdowns(0),
    t.preventDefault(),
    t.stopPropagation(),
    !1
}
, changedDetectionType1 = function (t) {
    return $(".stats_overview.one .stats_overview_controls .type").removeClass("open"),
    $(".stats_overview.one .stats_overview_controls .statistics_dropdown_menu").removeClass("open"),
    $(document).off("click", toggleStatisticsDropdown1),
    currWorldStatisticsDetectionType = $(t.target).attr("data-detection-type"),
    $(".stats_overview.one .stats_overview_controls .type .label.english").html($(".english", $(t.target).parent()).html()),
    $(".stats_overview.one .stats_overview_controls .type .label.russian").html($(".russian", $(t.target).parent()).html()),
    loadStatisticsWorldData(!1),
    closeDropdowns(0),
    t.preventDefault(),
    t.stopPropagation(),
    !1
}
, changedDetectionType2 = function (t) {
    return $(".stats_overview.two .stats_overview_controls .type").removeClass("open"),
    $(".stats_overview.two .stats_overview_controls .statistics_dropdown_menu").removeClass("open"),
    $(document).off("click", toggleStatisticsDropdown2),
    currCountryStatisticsDetectionType = $(t.target).attr("data-detection-type"),
    $(".stats_overview.two .stats_overview_controls .type .label.english").html($(".english", $(t.target).parent()).html()),
    $(".stats_overview.two .stats_overview_controls .type .label.russian").html($(".russian", $(t.target).parent()).html()),
    loadStatisticsCountryData(!1, !1),
    closeDropdowns(0),
    t.preventDefault(),
    t.stopPropagation(),
    !1
}
, changedDetectionCountry = function (t) {
    return closeDropdowns(0),
    $(".stats_overview.two .stats_overview_controls .location").removeClass("open"),
    $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu").removeClass("open"),
    statisticsCountryDropdownOpen = !1,
    $(document).off("click", toggleStatisticsCountryDropdown),
    currCountryStatisticsCountry = $(t.target).closest("a").attr("data-country-id"),
    $(".stats_overview.two .stats_overview_controls .location .label.english").html($('ul.english li a[data-country-id="' + currCountryStatisticsCountry + '"]').html()),
    $(".stats_overview.two .stats_overview_controls .location .label.russian").html($('ul.russian li a[data-country-id="' + currCountryStatisticsCountry + '"]').html()),
    loadStatisticsCountryData(!1, !1),
    t.preventDefault(),
    t.stopPropagation(),
    !1
}
, statisticsCountryDropDownKeyUpEvent = function (t) {
    if (statisticsCountryDropdownOpen) {
        var e = "number" == typeof t.which ? t.which : t.keyCode
          , o = "";
        if (0 == activeLang && e >= 65 && 122 >= e ? o = "data-first-char" : 1 == activeLang && e >= 1072 && 1103 >= e && (o = "data-first-char-ru"),
        "" != o) {
            var s = String.fromCharCode(e)
              , a = $($(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu ul li a[" + o + "='" + s + "']")[0])
              , n = $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu");
            isSet(a) && a.length > 0 && isSet(n) && n.length > 0 && n.animate({
                scrollTop: a.position().top + n.scrollTop()
            })
        }
    }
}
, statisticsScrollSize = 2.5, statisticsScrollInterval, isDraggingStatisticsDetectionTypes = !1, lastStatisticsDetectionTypesTouchPos = {}, currStatisticsDetectionTypesLeftPos = 0, fixStatisticsDetectionTypesScrollAfterResize = function () {
    var t = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types .type-icons")
      , e = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types");
    parseInt(t.css("marginLeft")) > 0 && (t.css({
        marginLeft: "0px"
    }),
    currStatisticsDetectionTypesLeftPos = 0),
    t.width() > e.width() ? parseInt(t.css("marginLeft")) < -1 * (t.width() - e.width()) && (t.css({
        marginLeft: -1 * (t.width() - e.width()) + "px"
    }),
    currStatisticsDetectionTypesLeftPos = -1 * (t.width() - e.width())) : t.css({
        marginLeft: "0px"
    })
}
, statisticsDetectionTypesScroll = function (t) {
    var e = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types .type-icons")
      , o = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types");
    0 == t ? parseInt(e.css("marginLeft")) + statisticsScrollSize < 0 ? (e.css({
        marginLeft: parseInt(e.css("marginLeft")) + statisticsScrollSize + "px"
    }),
    currStatisticsDetectionTypesLeftPos = parseInt(e.css("marginLeft")) + statisticsScrollSize) : (e.css({
        marginLeft: "0px"
    }),
    currStatisticsDetectionTypesLeftPos = 0) : parseInt(e.css("marginLeft")) - statisticsScrollSize > -1 * (e.width() - o.width()) ? e.css({
        marginLeft: parseInt(e.css("marginLeft")) - statisticsScrollSize + "px"
    }) : e.css({
        marginLeft: -1 * (e.width() - o.width()) + "px"
    });
    var s = parseInt(e.css("marginLeft"));
    0 > s ? $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").css("opacity", "1") : $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").css("opacity", "0.5"),
    s > -1 * (e.width() - o.width()) ? $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_right").css("opacity", "1") : $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_right").css("opacity", "0.5"),
    15 > statisticsScrollSize && (statisticsScrollSize += .25)
}
, statisticsDetectionTypesScrollLeftStart = function (t) {
    return platformDetection.isMobile ? $("body").on("touchend", statisticsDetectionTypesScrollStop) : $("body").on("mouseup", statisticsDetectionTypesScrollStop),
    statisticsScrollInterval = setInterval(function () {
        statisticsDetectionTypesScroll(0)
    }, 25),
    t.preventDefault(),
    t.stopPropagation(),
    !1
}
, statisticsDetectionTypesScrollRightStart = function (t) {
    return platformDetection.isMobile ? $("body").on("touchend", statisticsDetectionTypesScrollStop) : $("body").on("mouseup", statisticsDetectionTypesScrollStop),
    statisticsScrollInterval = setInterval(function () {
        statisticsDetectionTypesScroll(1)
    }, 25),
    t.preventDefault(),
    t.stopPropagation(),
    !1
}
, statisticsDetectionTypesScrollStop = function (t) {
    clearInterval(statisticsScrollInterval);
    var e = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types .type-icons");
    return platformDetection.isMobile ? $("body").off("touchend", statisticsDetectionTypesScrollStop) : $("body").off("mouseup", statisticsDetectionTypesScrollStop),
    currStatisticsDetectionTypesLeftPos = parseInt(e.css("marginLeft")),
    statisticsScrollSize = 1,
    t.preventDefault(),
    t.stopPropagation(),
    !1
}
, beginStatisticsDetectionTypesDragScroll = function (t) {
    var e = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types .type-icons")
      , o = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types");
    isDraggingStatisticsDetectionTypes || (isDraggingStatisticsDetectionTypes = !0,
    lastStatisticsDetectionTypesTouchPos = {
        x: t.originalEvent.touches[0].pageX,
        y: t.originalEvent.touches[0].pageY
    },
    currStatisticsDetectionTypesLeftPos = parseInt(e.css("marginLeft")));
    var s = parseInt(e.css("marginLeft"));
    0 > s ? $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").css("opacity", "1") : $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").css("opacity", "0.5"),
    s > -1 * (e.width() - o.width()) ? $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_right").css("opacity", "1") : $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_right").css("opacity", "0.5")
}
, endStatisticsDetectionTypesDragScroll = function (t) {
    var e = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types .type-icons")
      , o = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types");
    isDraggingStatisticsDetectionTypes && (parseInt(e.css("marginLeft")) > 0 && e.css({
        marginLeft: "0px"
    }),
    parseInt(e.css("marginLeft")) < -1 * (parseInt(e.css("width")) - parseInt(o.css("width"))) && e.css({
        marginLeft: -1 * (parseInt(e.css("width")) - parseInt(o.css("width"))) + "px"
    }),
    isDraggingStatisticsDetectionTypes = !1);
    var s = parseInt(e.css("marginLeft"));
    0 > s ? $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").css("opacity", "1") : $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").css("opacity", "0.5"),
    s > -1 * (e.width() - o.width()) ? $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_right").css("opacity", "1") : $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_right").css("opacity", "0.5")
}
, moveStatisticsDetectionTypesDragScroll = function (t) {
    var e = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types .type-icons")
      , o = $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types");
    if (isDraggingStatisticsDetectionTypes && parseInt(e.css("width")) > parseInt(o.css("width"))) {
        var s = 0;
        s = isSet(t.originalEvent.touches) ? lastStatisticsDetectionTypesTouchPos.x - t.originalEvent.touches[0].pageX : lastStatisticsDetectionTypesTouchPos.x - t.pageX,
        s = currStatisticsDetectionTypesLeftPos - s,
        s > 0 && (s = 0),
        s < -1 * (parseInt(e.css("width")) - parseInt(o.css("width"))) && (s = -1 * (parseInt(e.css("width")) - parseInt(o.css("width")))),
        e.css({
            marginLeft: s + "px"
        })
    }
    var a = parseInt(e.css("marginLeft"));
    0 > a ? $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").css("opacity", "1") : $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").css("opacity", "0.5"),
    a > -1 * (e.width() - o.width()) ? $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_right").css("opacity", "1") : $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_right").css("opacity", "0.5")
}
, addStatisticsEvents = function () {
    $(".stats_overview.one .stats_overview_controls .type").on("click", toggleStatisticsDropdown1),
    $(".stats_overview.one .stats_overview_controls .time_period").on("click", toggleTimePeriod1),
    $(".stats_overview.one .stats_overview_controls .statistics_dropdown_menu a[data-detection-type]").on("click", changedDetectionType1),
    $(".stats_overview.two .stats_overview_controls .location").on("click", toggleStatisticsCountryDropdown),
    $(".stats_overview.two .stats_overview_controls .statistics_country_dropdown_menu a[data-country-id]").on("click", changedDetectionCountry),
    $(document).on("keyup", statisticsCountryDropDownKeyUpEvent),
    $(".stats_overview.two .stats_overview_controls .type").on("click", toggleStatisticsDropdown2),
    $(".stats_overview.two .stats_overview_controls .time_period").on("click", toggleTimePeriod2),
    $(".stats_overview.two .stats_overview_controls .statistics_dropdown_menu a[data-detection-type]").on("click", changedDetectionType2),
    $(".most_infected_links li a").on("click", clickCountry),
    platformDetection.isMobile ? ($("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").on("touchstart", statisticsDetectionTypesScrollLeftStart),
    $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_right").on("touchstart", statisticsDetectionTypesScrollRightStart),
    $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types").on("touchstart", beginStatisticsDetectionTypesDragScroll),
    $("body").on("touchend", endStatisticsDetectionTypesDragScroll),
    $("body").on("touchmove", moveStatisticsDetectionTypesDragScroll)) : ($("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").on("mousedown", statisticsDetectionTypesScrollLeftStart),
    $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_right").on("mousedown", statisticsDetectionTypesScrollRightStart)),
    $("div.subpage[data-subpage='2'] .statistics_detection_types_container .statistics_detection_types_left").css("opacity", "0.5")
}
, buildDetectionTypeDropdowns = function () {
    var t = $("<div>").addClass("statistics_dropdown_menu")
      , e = $("<ul>")
      , o = $("<li>")
      , s = $("<a>")
      , a = t.clone()
      , n = t.clone().css({
          left: "33%"
      })
      , i = e.clone()
      , r = e.clone();
    $.each(detectionTypes, function (t, e) {
        var a = o.clone()
          , n = o.clone()
          , c = s.clone().attr("data-detection-type", e.id)
          , l = s.clone().attr("data-detection-type", e.id)
          , d = $("<span>").addClass("english").html(e.name_en).attr("data-detection-type", e.id)
          , p = $("<span>").addClass("russian").html(e.name_ru).attr("data-detection-type", e.id)
          , u = $("<span>").addClass("english").html(e.name_en).attr("data-detection-type", e.id)
          , _ = $("<span>").addClass("russian").html(e.name_ru).attr("data-detection-type", e.id);
        c.append(d),
        c.append(p),
        a.append(c),
        i.append(a),
        "bad" !== e.id && (l.append(u),
        l.append(_),
        n.append(l),
        r.append(n))
    }),
    a.append(i),
    n.append(r),
    $(".stats_overview.one .stats_overview_controls").append(a),
    $(".stats_overview.two .stats_overview_controls").append(n)
}
, buildStatisticsCountryDropdown = function () {
    var t = $("<div>").addClass("statistics_country_dropdown_menu")
      , e = $("<ul>").addClass("english")
      , o = $("<ul>").addClass("russian")
      , s = $("<li>")
      , a = $("<a>")
      , n = JSON.parse(JSON.stringify(countriesObjs));
    if (countriesObjs.sort(function (t, e) {
        return t.value_en == e.value_en ? 0 : t.value_en < e.value_en ? -1 : 1
    }),
    n.sort(function (t, e) {
        return t.value_ru == e.value_ru ? 0 : t.value_ru < e.value_ru ? -1 : 1
    }),
    $.each(countriesObjs, function (t, o) {
        var n = o.id
          , i = o.value_en
          , r = o.value_ru;
        if (n > 0 && isSet(i) && isSet(r)) {
            var c = s.clone()
              , l = a.clone().attr("data-country-id", n);
            l.attr("data-first-char", i.charAt(0).toUpperCase());
            var d = $("<span>").addClass("english").html(i);
            l.append(d),
            c.append(l),
            e.append(c)
    }
    }),
    $.each(n, function (t, e) {
        var n = e.id
          , i = e.value_en
          , r = e.value_ru;
        if (n > 0 && isSet(i) && isSet(r)) {
            var c = s.clone()
              , l = a.clone().attr("data-country-id", n);
            l.attr("data-first-char-ru", r.charAt(0).toUpperCase());
            var d = $("<span>").addClass("russian").html(r);
            l.append(d),
            c.append(l),
            o.append(c)
    }
    }),
    t.append(e),
    t.append(o),
    $(".stats_overview.two .stats_overview_controls").append(t),
    -1 == detectedCountryId) {
        var i = 0;
        i = 0 == activeLang ? countriesObjs[0] : n[0],
        lastCountryStatisticsCountry = currCountryStatisticsCountry = isSet(i.id) ? i.id : 1,
        $(".stats_overview.two .stats_overview_controls .location .label.english").html(i.value_en),
        $(".stats_overview.two .stats_overview_controls .location .label.russian").html(i.value_ru)
    } else
        lastCountryStatisticsCountry = currCountryStatisticsCountry = detectedCountryId,
        $(".stats_overview.two .stats_overview_controls .location .label.english").html(countries[detectedCountryId].en),
        $(".stats_overview.two .stats_overview_controls .location .label.russian").html(countries[detectedCountryId].ru)
}
, addStatisticsDetectionTypeEvents = function () {
    $(".statistics_detection_types ul.type-icons li[data-detectiontype]").on("click", detectionTypeClick)
}
, worldStatsTaskListComplete = function () {
    logToConsole && console.log("WorldStatsTaskList done!"),
    $(".stats_overview.one .stats_content ." + nextWorldStatisticsContentPane).append($("<div>").css("clear", "both")),
    $(".stats_overview.one .stats_content ." + currWorldStatisticsContentPane).animate({
        left: "-100%"
    }),
    $(".stats_overview.one .stats_content ." + nextWorldStatisticsContentPane).animate({
        left: "0%"
    }, {
        duration: 500,
        complete: function () {
            $(".stats_overview.one .stats_content ." + currWorldStatisticsContentPane).css("left", "100%").empty(),
            $(".stats_overview.one .stats_content").css({
                height: "",
                overflow: ""
            }),
            $(".stats_overview.one .stats_content .stats_content_one").css({
                position: "",
                paddingTop: ""
            }),
            $(".stats_overview.one .stats_content .stats_content_two").css({
                position: "",
                paddingTop: ""
            }),
            $(".stats_overview.one .loader").fadeOut(),
            currWorldStatisticsContentPane = nextWorldStatisticsContentPane
        }
    }),
    setTimeout(function () {
        applyLanguage(2)
    }, 50),
    worldStatsTaskListRunning = !1
}
, addTooWorldStatsTaskList = function (t, e) {
    var o = lastWorldTaskId + 1;
    logToConsole && console.log("addTooWorldStatsTaskList called"),
    e.push(runNextInWorldStatsTaskList),
    e.push([]),
    worldStatsTaskList.push([o, t, e]),
    logToConsole && console.log(" -> added task: " + o),
    lastWorldTaskId = o
}
, runNextInWorldStatsTaskList = function () {
    if (worldStatsTaskList.length > 0) {
        worldStatsTaskListRunning = !0;
        var t = worldStatsTaskList[0]
          , e = window[t[1]]
          , o = t[2];
        "function" == typeof e && (logToConsole && console.log(" -> calling task: " + t[0]),
        logToConsole && console.log(" -> function name: " + t[1]),
        logToConsole && console.log(" -> function args: ", o),
        e.apply(this, o),
        worldStatsTaskList.shift())
    } else
        worldStatsTaskListRunning && setTimeout(worldStatsTaskListComplete, 500)
}
, removeFromWorldStatsTaskList = function (t) {
    if (worldStatsTaskList.length > 0) {
        var e = -1;
        $.each(worldStatsTaskList, function (o, s) {
            logToConsole && console.log("comparing task ids: ", t, s[0]),
            s[0] == t && (e = o),
            o == worldStatsTaskList.length - 1 && (e > -1 ? worldStatsTaskList.splice(e, 1) : (logToConsole && console.log("couldnt remove task?!"),
            worldStatsTaskList.splice(e, 1)),
            logToConsole && console.log("removeFromWorldStatsTaskList called"),
            logToConsole && console.log(" -> task: " + t),
            worldStatsTaskList.length > 0 ? (logToConsole && console.log(" -> running another task"),
            runNextInWorldStatsTaskList()) : logToConsole && console.log(" -> task list complete"))
        })
    }
}
, countryStatsTaskListComplete = function () {
    logToConsole && console.log("CountryStatsTaskList done!"),
    $(".stats_overview.two .stats_content ." + nextCountryStatisticsContentPane).append($("<div>").css("clear", "both")),
    $(".stats_overview.two .stats_content ." + currCountryStatisticsContentPane).animate({
        left: "-100%"
    }),
    $(".stats_overview.two .stats_content ." + nextCountryStatisticsContentPane).animate({
        left: "0%"
    }, {
        duration: 500,
        complete: function () {
            $(".stats_overview.two .stats_content ." + currCountryStatisticsContentPane).css("left", "100%").empty(),
            $(".stats_overview.two .stats_content").css({
                height: "",
                overflow: ""
            }),
            $(".stats_overview.two .stats_content .stats_content_one").css({
                position: "",
                paddingTop: ""
            }),
            $(".stats_overview.two .stats_content .stats_content_two").css({
                position: "",
                paddingTop: ""
            }),
            $(".stats_overview.two .loader").fadeOut(),
            currCountryStatisticsContentPane = nextCountryStatisticsContentPane
        }
    }),
    setTimeout(function () {
        applyLanguage(2)
    }, 50),
    countryStatsTaskListRunning = !1
}
, addTooCountryStatsTaskList = function (t, e) {
    var o = lastCountryTaskId + 1;
    logToConsole && console.log("addTooCountryStatsTaskList called"),
    e.push(runNextInCountryStatsTaskList),
    e.push([]),
    countryStatsTaskList.push([o, t, e]),
    logToConsole && console.log(" -> added task: " + o),
    lastCountryTaskId = o
}
, runNextInCountryStatsTaskList = function () {
    if (countryStatsTaskList.length > 0) {
        countryStatsTaskListRunning = !0;
        var t = countryStatsTaskList[0]
          , e = window[t[1]]
          , o = t[2];
        "function" == typeof e && (logToConsole && console.log(" -> calling task: " + t[0]),
        logToConsole && console.log(" -> function name: " + t[1]),
        logToConsole && console.log(" -> function args: ", o),
        e.apply(this, o),
        countryStatsTaskList.shift())
    } else
        countryStatsTaskListRunning && setTimeout(countryStatsTaskListComplete, 500)
}
, removeFromCountryStatsTaskList = function (t) {
    if (countryStatsTaskList.length > 0) {
        var e = -1;
        $.each(countryStatsTaskList, function (o, s) {
            logToConsole && console.log("comparing task ids: ", t, s[0]),
            s[0] == t && (e = o),
            o == countryStatsTaskList.length - 1 && (e > -1 ? countryStatsTaskList.splice(e, 1) : (logToConsole && console.log("couldnt remove task?!"),
            countryStatsTaskList.splice(e, 1)),
            logToConsole && console.log("removeFromCountryStatsTaskList called"),
            logToConsole && console.log(" -> task: " + t),
            countryStatsTaskList.length > 0 ? (logToConsole && console.log(" -> running another task"),
            runNextInCountryStatsTaskList()) : logToConsole && console.log(" -> task list complete"))
        })
    }
}
, shareCurrCountryPopup = function (t) {
    var e = "https://cybermap.kaspersky.com/"
      , o = "https://kas.pr/map"
      , s = "https://cybermap.kaspersky.com/fb_share_finish.html"
      , a = $(".header h1" + activeLangClass).html().replace(/<(?:.|\n)*?>/gm, "")
      , n = "https://cybermap.kaspersky.com/assets/images/social_share.jpg"
      , i = ""
      , r = $(".countrypop .countrypop_header h3 " + activeLangClass).html()
      , c = $(".countrypop .countrypop_header .subtitle .ranking").text();
    0 == activeLang ? c = "#" + c + " MOST-INFECTED COUNTRY" : (c = "№" + c + " в мире по числу атак",
    e = "https://cybermap.kaspersky.com/ru/");
    var l = "oas:" + $(".countrypop .blocks .oas-popcount h4").text();
    l += ", ods:" + $(".countrypop .blocks .ods-popcount h4").text(),
    l += ", wav:" + $(".countrypop .blocks .wav-popcount h4").text(),
    l += ", mav:" + $(".countrypop .blocks .mav-popcount h4").text(),
    l += ", ids:" + $(".countrypop .blocks .ids-popcount h4").text(),
    l += ", vul:" + $(".countrypop .blocks .vul-popcount h4").text(),
    l += ", kas:" + $(".countrypop .blocks .kas-popcount.english h4").text(),
    l += ", bad:" + $(".countrypop .blocks .bad-popcount h4").text(),
    e = encodeURIComponent(e),
    o = encodeURIComponent(o),
    s = encodeURIComponent(s),
    a = encodeURIComponent(a),
    n = encodeURIComponent(n),
    r = encodeURIComponent(r),
    c = encodeURIComponent(c),
    l = encodeURIComponent(l);
    var d = encodeURIComponent(" | ")
      , p = r + d + c + d + l;
    switch (t) {
        case "facebook":
            i = "https://www.facebook.com/dialog/feed?app_id=634328833377154&display=popup&caption=" + a + "%20-%20" + r + "&name=" + a + "&link=" + e + "&redirect_uri=" + s + "&description=" + p;
            break;
        case "twitter":
            i = "http://twitter.com/share?text=" + p + "&url=" + o;
            break;
        case "gplus":
            i = p;
            break;
        case "vk":
            i = "http://vkontakte.ru/share.php?url=" + e + "&title=" + a + "&description=" + p + "&image=" + n + "&noparse=true";
            break;
        default:
            logToConsole && console.log("Cant share countrypop, dont know " + t)
    }
    return i
}
, loadStatisticsWorldData = function (t) {
    if (!t) {
        $(".stats_overview.one .loader").fadeIn(),
        nextWorldStatisticsContentPane = "stats_content_one" == currWorldStatisticsContentPane ? "stats_content_two" : "stats_content_one";
        var e = $(".stats_overview.one .stats_content").innerHeight();
        $(".stats_overview.one .stats_content").css({
            height: e + "px",
            overflow: "hidden"
        }),
        $(".stats_overview.one .stats_content .stats_content_one").css({
            position: "absolute"
        }),
        $(".stats_overview.one .stats_content .stats_content_two").css({
            position: "absolute"
        }),
        $(".stats_overview.one .stats_content ." + nextWorldStatisticsContentPane).css("left", "100%").empty()
    }
    var o = 0 == currWorldStatisticsTimePeriod ? "w" : "m";
    addTooWorldStatsTaskList("loadSecureListData", [{
        country_id: 0,
        data_type: "country",
        detection_type: currWorldStatisticsDetectionType,
        time_period: o
    }, "world"]),
    addTooWorldStatsTaskList("loadSecureListData", [{
        country_id: 0,
        data_type: "graph",
        detection_type: currWorldStatisticsDetectionType,
        time_period: o
    }, "world"]),
    "bad" !== currWorldStatisticsDetectionType && addTooWorldStatsTaskList("loadSecureListData", [{
        country_id: 0,
        data_type: "top10",
        detection_type: currWorldStatisticsDetectionType,
        time_period: o
    }, "world"]),
    runNextInWorldStatsTaskList()
}
, loadStatisticsCountryData = function (t, e) {
    if (!t) {
        $(".stats_overview.two .loader").fadeIn(),
        e && $(".content").animate({
            scrollTop: $(".stats_overview.two").position().top + $(".content").scrollTop()
        }),
        nextCountryStatisticsContentPane = "stats_content_one" == currCountryStatisticsContentPane ? "stats_content_two" : "stats_content_one";
        var o = $(".stats_overview.two .stats_content").innerHeight();
        $(".stats_overview.two .stats_content").css({
            height: o + "px",
            overflow: "hidden"
        }),
        $(".stats_overview.two .stats_content .stats_content_one").css({
            position: "absolute"
        }),
        $(".stats_overview.two .stats_content .stats_content_two").css({
            position: "absolute"
        }),
        $(".stats_overview.two .stats_content ." + nextCountryStatisticsContentPane).css("left", "100%").empty()
    }
    var s = 0 == currCountryStatisticsTimePeriod ? "w" : "m";
    addTooCountryStatsTaskList("loadSecureListData", [{
        country_id: currCountryStatisticsCountry,
        data_type: "graph",
        detection_type: currCountryStatisticsDetectionType,
        time_period: s
    }, "country"]),
    addTooCountryStatsTaskList("loadSecureListData", [{
        country_id: currCountryStatisticsCountry,
        data_type: "top10",
        detection_type: currCountryStatisticsDetectionType,
        time_period: s
    }, "country"]),
    runNextInCountryStatsTaskList()
}
, statisticsPageLoaded = function () {
    if (isSet(lastTop5Data) && lastTop5Data.length)
        for (var t = 0; 5 > t; t++)
            $($(".most_infected_links a")[t]).attr("data-country-id", lastTop5Data[t].key),
            $(".name .english", $($(".most_infected_links a")[t])).html(lastTop5Data[t].name[window.lang.lang()]),
            $(".name .russian", $($(".most_infected_links a")[t])).html(lastTop5Data[t].name.ru);
    $.each(detectionTypes, function (t, e) {
        0 == e.active && $("ul.type-icons li[data-detectiontype='" + e.id + "']").addClass("disabled")
    }),
    buildDetectionTypeDropdowns(),
    buildStatisticsCountryDropdown(),
    loadStatisticsWorldData(!0),
    loadStatisticsCountryData(!0, !1),
    addStatisticsEvents(),
    addStatisticsDetectionTypeEvents();
    var e = $("#graph")[0];
    MAP.attach_graph_canvas(e)
}
, loadBuzzContent = function () {
    function t(t) {
        var e = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
          , o = 1e3 * parseInt(t);
        return new Date(o).toLocaleDateString(g, e)
    }
    function e(e) {
        var o = s.clone()
          , g = a.clone();
        if (isSet(e.image_url) && "" != e.image_url)
            var v = e.image_url.replace(/^http:\/\//i, "https://")
              , w = n.clone().attr("src", v);
        var T = i.clone().html(t(e.timestamp))
          , y = r.clone().html(e.title)
          , S = window.lang.getText("BUZZ_CTA_" + e.source.toUpperCase())
          , m = c.clone().attr("href", e.link)
          , h = l.clone().addClass(e.source).html(S)
          , C = d.clone()
          , f = p.clone()
          , b = u.clone();
        h.append(C),
        h.append(f),
        h.append(b),
        m.append(h),
        isSet(e.image_url) && "" != e.image_url && g.append(w),
        g.append(T),
        g.append(y),
        g.append(m),
        o.append(g),
        platformDetection.isMobile ? $(".buzz_content.english").append(o) : ($(".buzz_content.english .buzz_column." + _).append(o),
        _ = "left" == _ ? "right" : "left")
    }
    function o(t) {
        t.sort(function (t, e) {
            return e.timestamp - t.timestamp
        }),
        t.forEach(e)
    }
    $(".buzz_content .buzz_column").empty();
    var s = $("<div>").addClass("buzz_block")
      , a = $("<div>").addClass("buzz_block_content")
      , n = $("<img>").addClass("image")
      , i = $("<div>").addClass("info")
      , r = $("<h1>").addClass("title")
      , c = $("<a>").attr("target", "_blank")
      , l = $("<button>").addClass("buzz_btn fancy_btn_wide white multiline")
      , d = $("<i>").addClass("icon")
      , p = $("<i>").addClass("arrow normal")
      , u = $("<i>").addClass("arrow hover")
      , _ = "left"
      , g = window.lang.lang();
    $.getJSON("assets/data/buzz.json", function (t) {
        var e = t[g];
        o(e)
    }).fail(function () {
        logToConsole && console.log("failed to load buzz content!")
    })
}
, addTosEvents = function () {
    $(".site .content div[data-subpage='6'] .close_btn").on("click", function (t) {
        History.pushState({
            page_id: 1,
            lang: activeLang
        }, "", langUrlPrefix + "/"),
        $(".footer_links a.tos").css({
            color: ""
        })
    })
}
, loadPage = function (t) {
    var e = $("<div>").attr("data-subpage", t).addClass("subpage")
      , o = "";
    platformDetection.isMobile && (o = "_mobile"),
    $(".wrapper .site .content").append(e),
    2 == t && e.load("subpages/statistics" + o + ".php?ck=" + timeStamp(), function () {
        setTimeout(function () {
            applyLanguage(2)
        }, 50),
        setTimeout(statisticsPageLoaded, 250)
    }),
    3 == t && e.load("subpages/subsystems" + o + ".php?ck=" + timeStamp(), function () {
        setTimeout(function () {
            applyLanguage(3)
        }, 50)
    }),
    4 == t && e.load("subpages/buzz" + o + ".html?ck=" + timeStamp(), function () {
        setTimeout(function () {
            applyLanguage(4)
        }, 50),
        setTimeout(loadBuzzContent, 250)
    }),
    5 == t && e.load("subpages/widget-setup.php?ck=" + timeStamp(), function () {
        setTimeout(function () {
            applyLanguage(5)
        }, 50),
        setTimeout(function () {
            initWidgetSetup(activeLang)
        }, 250)
    }),
    6 == t && e.load("subpages/terms_and_conditions.php?ck=" + timeStamp(), function () {
        setTimeout(function () {
            applyLanguage(6)
        }, 50),
        setTimeout(function () {
            addTosEvents()
        }, 250)
    })
}
, openPage = function (t) {
    $(".screensaver_download_popup").hide(),
    closeDropdowns(0),
    currPageId != t && ($(".menu li a[data-subpage]").removeClass("active"),
    $(".menu li a[data-subpage='" + t + "']").addClass("active"),
    $(".content").scrollTop(0),
    1 == t ? (5 == currPageId && pauseWidget(),
    closeSite()) : ($("div[data-subpage]").hide(),
    $("div[data-subpage='" + t + "']").length < 1 ? loadPage(t) : (5 == t && resumeWidget(),
    $("div[data-subpage='" + t + "']").show()),
    siteOpen || openSite()),
    currPageId = t)
}
, updateStatisticsGraphSize = function () {
    var t = $(".site .content .subpage .stats_leader .graph").outerWidth() + "px"
      , e = $(".site .content .subpage .stats_leader .graph").outerHeight() + "px";
    $(".site .content .subpage .stats_leader .graph").attr("width", t).attr("height", e)
}
, initGAPIForSharing = function () {
    gapi.interactivepost.render("sharePost", googleShareSettingsBase)
}
, addCountryPopEvents = function () {
    $(".countrypop .countrypop_social .sharing_icons .facebook").on("click", function (t) {
        window.open(shareCurrCountryPopup("facebook"))
    }),
    $(".countrypop .countrypop_social .sharing_icons .twitter").on("click", function (t) {
        window.open(shareCurrCountryPopup("twitter"))
    }),
    $(".countrypop .countrypop_social .sharing_icons .gplus").on("click", function (t) {
        window.open(shareCurrCountryPopup("gplus"))
    }),
    $(".countrypop .countrypop_social .sharing_icons .vk").on("click", function (t) {
        window.open(shareCurrCountryPopup("vk"))
    })
}
, addHistoryJsSupport = function () {
    History.Adapter.bind(window, "statechange", function () {
        var t = History.getState();
        openPage(parseInt(t.data.page_id))
    });
    var t = History.getState()
      , e = 1
      , o = ""
      , s = "/"
      , a = 0
      , n = t.hash.split("?")
      , i = (n[0] + "/").split("/");
    $.each(i, function (t, n) {
        "" != n && ("ru" == n && (a = 1,
        langUrlPrefix = "/ru"),
        "stats" == n && (e = 2,
        o = "STATISTICS",
        s = "/stats/"),
        "subsystems" == n && (e = 3,
        o = "SUBSYSTEMS",
        s = "/subsystems/"),
        "buzz" == n && (e = 4,
        o = "BUZZ",
        s = "/buzz/"),
        "widget" == n && (e = 5,
        o = "WIDGET",
        s = "/widget/"),
        "tos" == n && (e = 6,
        o = "",
        s = "/tos/"),
        "bad" == n && (e = 1,
        o = "",
        s = "/bad/",
        $(".subheader .menu").hide(),
        $(".detection_types").hide(),
        MAP.is_bad_mode = !0))
    }),
    History.replaceState({
        page_id: e,
        lang: a
    }, o, langUrlPrefix + s + niceUrlQueryParamsFix()),
    1 == a && switchLanguage("ru"),
    6 == e && $(".footer_links a.tos").css({
        color: "#629c7f"
    }),
    openPage(e)
}
;
