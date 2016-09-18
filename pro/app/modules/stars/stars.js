/**
 * Created by ywg on 2016/3/30.
 * function：今日小明星相关业务
 * desc：
 *        starsCtrl 小明星记录查看controller
 *        echart_starCtrl 小明星报表分析controller
 *
 */
var recordsModule = angular.module("stars", ["ui.router", "ui.bootstrap", "angularUtils.directives.dirPagination"]);
recordsModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("stars", {
        url: "/stars",
        templateUrl: "/app/modules/stars/stars.html"
    }).state("chartStars", {url: "/chart_stars", templateUrl: "/app/modules/stars/echart_star.html"})
}]), recordsModule.controller("starsCtrl", ["$log", "$window", "$scope", "$http", "$filter", "$sce", "$state", "$uibModal", function ($log, $window, $scope, $http, $filter, $sce, $state, $uibModal) {
    $("#studentNameInput").keydown(function (e) {
        var curKey = e.which;
        return 13 == curKey ? ($scope.searchbycontent(), !1) : void 0
    }), $scope.child = {classOfChild: "0", gradeOfChild: "0", childName: ""}, $scope.paganation = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0
    }, $scope.startTime = (new Date).Format(fmt), $scope.endTime = (new Date).Format(fmt), /*年级班级联动开始*/
        $http.post(ssDomain + "admin/grades.json").success(function (response) {
            "undefined" != typeof response.error ? alert("请求参数错误！") : $scope.select1 = response.grades
        }), $scope.selChange = function (id) {
        $http.post(ssDomain + "admin/queryClassList.json", {gradeId: id}).success(function (response) {
            $scope.select2 = response.classList
        })
    }, /*年级班级联动结束*/
        /* 导出到excel */
        $scope.exportToExcel = function () {
// 后端访问地址
            console.log("download excel ");
            var param = "classOfChild=" + $scope.child.classOfChild + "&gradeOfChild=" + $scope.child.gradeOfChild + "&childName=" + $scope.child.childName + "&startDate=" + $scope.startTime + "&endDate=" + $scope.endTime;
            url = ssDomain + "admin/starsRecordsToExcel", $window.location.href = url + "?" + param
        }, $scope.pageChangeHandler = function (num) {
        if (1 == num)$scope.searchbycontent(); else {
            var currentnum = (num - 1) * $scope.paganation.pageSize, response = $scope.starsall, result = [], i = 0;
            for (var item in response)i > currentnum && result.push(response[item]), i++;
            $scope.stars = result
        }
    }, /* 条件查选 */
        $scope.searchbycontent = function (inclass) {/* 获取列表 */
            $http.post(ssDomain + "admin/searchStarsRecords.json", {
                paganation: $scope.paganation,
                child: $scope.child,
                rangeDate: {startDate: $scope.startTime, endDate: $scope.endTime}
            }).success(function (response) {
                $scope.paganation.totalCount = response.totalNum, $scope.starsall = response.data, $scope.stars = response.data
            })
        }, $scope.searchbycontent()
}]), recordsModule.controller("echart_starCtrl", function ($scope, $http) {
    $http.post(ssDomain + "admin/grades.json").success(function (response) {
        "undefined" != typeof response.error ? alert("请求参数错误！") : $scope.gradelist = response.grades
    }), $scope.selChange = function (id) {
        $http.post(ssDomain + "admin/queryClassList.json", {gradeId: id}).success(function (response) {
            $scope.classlist = response.classList
        })
    }, $scope.startTime = curDate.getFullYear() + "-" + genMonth(curDate.getMonth() + 1) + "-01", $scope.endTime = curDate.getFullYear() + "-" + genMonth(curDate.getMonth() + 1) + "-" + genDay(curDate.getDate()), $scope.starsList = ["文明礼貌星", "乐于分享星", "艺术创意星", "活动健康星"];
    var starSelected = [];
    $scope.analyzer = function () {
        starSelected = [];
        for (var list = $scope.starsList, i = 0; i < list.length; i++) {
            var id = "#ck" + (i + 1);
            $(id).is(":checked") && starSelected.push(list[i])
        }
        0 == starSelected.length && (starSelected = $scope.starsList);
        var sDate = $scope.startTime, eDate = $scope.endTime;
        return void 0 == sDate || void 0 == eDate ? void alert("请选择日期") : sDate > eDate ? void alert("结束日期不能小于开始日期") : void $http.post(ssDomain + "admin/kidStarAnalysis.json", {
            gradeId: $scope.gradeId,
            classId: $scope.classId,
            startTime: $scope.startTime,
            endTime: $scope.endTime
        }).success(function (response) {
            $scope.genChart(response.records, "bar"), $scope.genChartPie(response.records, "pie")
        })
    }, $scope.genChartPie = function (jsdata, type) {
        document.getElementById("chart" + type).style.width = document.body.clientWidth - 300;
        var starList = starSelected, starObjList = new Array, tempStarList = starList.join(",");
        tempStarList.indexOf("文明") > -1 && starObjList.push("文明礼貌星"), tempStarList.indexOf("活动") > -1 && starObjList.push("活动健康星"), tempStarList.indexOf("分享") > -1 && starObjList.push("乐于分享星"), tempStarList.indexOf("艺术") > -1 && starObjList.push("艺术创意星");
        for (var item = null, civilityAll = 0, liveAll = 0, shareAll = 0, artAll = 0, i = 0; i < jsdata.length; i++)item = jsdata[i], tempStarList.indexOf("文明") > -1 && (civilityAll += item.civilityStarNum), tempStarList.indexOf("活动") > -1 && (liveAll += item.livelyStarNum), tempStarList.indexOf("分享") > -1 && (shareAll += item.shareStarNum), tempStarList.indexOf("艺术") > -1 && (artAll += item.artStarNum);
        for (var myChart = echarts.init(document.getElementById("chart" + type)), data = [], i = 0; i < starObjList.length; i++) {
            var oneStarItem = {};
            oneStarItem.name = starObjList[i], oneStarItem.name.indexOf("文明") > -1 && (oneStarItem.value = civilityAll), oneStarItem.name.indexOf("活动") > -1 && (oneStarItem.value = liveAll), oneStarItem.name.indexOf("分享") > -1 && (oneStarItem.value = shareAll), oneStarItem.name.indexOf("艺术") > -1 && (oneStarItem.value = artAll), data.push(oneStarItem)
        }
        var option = {
            title: {text: "汇总分析报表", x: "center", y: "top"},
            toolbox: {
                show: !0,
                itemSize: 24,
                feature: {
                    mark: {show: !1},
                    dataView: {show: !1, readOnly: !1},
                    magicType: {show: !1, type: ["line", "bar"]},
                    restore: {show: !1},
                    saveAsImage: {show: !0}
                }
            },
            tooltip: {trigger: "item", formatter: "{a} <br/>{b} : {c} ({d}%)"},
            legend: {data: starList, x: "center", y: "bottom"},
            series: [{
                name: "汇总分析报表",
                type: "pie",
                radius: "55%",
                center: ["50%", "60%"],
                data: data,
                itemStyle: {emphasis: {shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)"}}
            }]
        };
        myChart.setOption(option)
    }, $scope.genChart = function (jsdata, type) {
        document.getElementById("chart" + type).style.width = document.body.clientWidth - 300;
        var starList = starSelected, dayList = [], starObj0 = [], starObj1 = [], starObj2 = [], starObj3 = [], starObjList = new Array, tempStarList = starList.join(",");
        tempStarList.indexOf("文明") > -1 && starObjList.push(starObj0), tempStarList.indexOf("活动") > -1 && starObjList.push(starObj1), tempStarList.indexOf("分享") > -1 && starObjList.push(starObj2), tempStarList.indexOf("艺术") > -1 && starObjList.push(starObj3);
        for (var item = null, i = 0; i < jsdata.length; i++)item = jsdata[i], dayList.push(item.day), tempStarList.indexOf("文明") > -1 && starObj0.push(item.civilityStarNum), tempStarList.indexOf("活动") > -1 && starObj1.push(item.livelyStarNum), tempStarList.indexOf("分享") > -1 && starObj2.push(item.shareStarNum), tempStarList.indexOf("艺术") > -1 && starObj3.push(item.artStarNum);
        for (var myChart = echarts.init(document.getElementById("chart" + type)), option = {
            title: {
                text: "明细分析报表",
                x: "center",
                y: "top"
            },
            toolbox: {
                show: !0,
                itemSize: 24,
                feature: {
                    mark: {show: !1},
                    dataView: {show: !1, readOnly: !1},
                    magicType: {show: !1, type: ["line", "bar"]},
                    restore: {show: !1},
                    saveAsImage: {show: !0}
                }
            },
            tooltip: {trigger: "axis", axisPointer: {type: "line"}},
            legend: {data: starList, x: "center", y: "bottom"},
            calculable: !0,
            xAxis: [{type: "category", data: dayList}],
            yAxis: [{type: "value"}],
            series: []
        }, i = 0; i < starObjList.length; i++) {
            var oneOptionItem = {name: "", type: type, stack: "star", barWidth: 30, data: []};
            starObjList[i].length > 0 && (oneOptionItem.name = starList[i], oneOptionItem.data = starObjList[i], option.series.push(oneOptionItem))
        }
//console.log(JSON.stringify(option));
        myChart.setOption(option)
    },
//首次加载启动上个月的报表
        $scope.analyzer()
});
/*! xybbGarten 最后修改于： 2016-06-23 */