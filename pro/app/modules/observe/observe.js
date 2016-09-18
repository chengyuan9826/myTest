/**
 * Created by ywg on 2016/3/30.
 * function:观察记录相关业务
 *            observeCtrl处理观察记录记录查看ctrl
 *            echart_observeCtrl处理观察记录报表分析ctrl
 */
var recordsModule = angular.module("observe", ["ui.router", "ui.bootstrap", "angularUtils.directives.dirPagination"]);
recordsModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("observe", {
        url: "/observe",
        templateUrl: "/app/modules/observe/observe.html"
    }).state("echart_observe", {url: "/echartObserve", templateUrl: "/app/modules/observe/echart_observe.html"})
}]), recordsModule.controller("observeCtrl", ["$log", "$window", "$scope", "$http", "$filter", "$sce", "$state", "$uibModal", function ($log, $window, $scope, $http, $filter, $sce, $state, $uibModal) {
    $scope.child = {classOfChild: "0", gradeOfChild: "0", childName: ""}, $scope.paganation = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0
    }, /*年级班级联动开始*/
        $http.post(ssDomain + "admin/grades.json").success(function (response) {
            "undefined" != typeof response.error ? alert("请求参数错误！") : $scope.select1 = response.grades
        }), $scope.selChange = function (id) {
        $http.post(ssDomain + "admin/queryClassList.json", {gradeId: id}).success(function (response) {
            $scope.select2 = response.classList
        })
    }, /*年级班级联动结束*/
        /*有关时间控件的设置-start */
        $scope.rangeDate = {
            startDate: (new Date).Format(fmt),
            endDate: (new Date).Format(fmt)
        }, $scope.getRangeDate = function () {
        $scope.rangeDate.startDate = $("#startTime").val() ? $("#startTime").val() : (new Date).Format(fmt), $scope.rangeDate.endDate = $("#endTime").val() ? $("#endTime").val() : (new Date).Format(fmt)
    }, /*有关时间控件的设置-end */
        /* 导出到excel */
        $scope.exportToExcel = function () {
            $scope.getRangeDate(),
// 后端访问地址
                console.log("download excel ");
            var param = "classOfChild=" + $scope.child.classOfChild + "&gradeOfChild=" + $scope.child.gradeOfChild + "&childName=" + $scope.child.childName + "&startDate=" + $scope.rangeDate.startDate + "&endDate=" + $scope.rangeDate.endDate;
            url = ssDomain + "admin/observeRecordsToExcel", $window.location.href = url + "?" + param
        }, $scope.pageChangeHandler = function (num) {
        $scope.paganation.currentPage = num, $scope.searchbycontent()
    }, /* 条件查选 */
        $scope.searchbycontent = function () {
            $scope.getRangeDate(), $http.post(ssDomain + "admin/searchObserveRecords.json", {
                paganation: $scope.paganation,
                child: $scope.child,
                rangeDate: $scope.rangeDate
            }).success(function (response) {
                $scope.observes = response.data, $scope.paganation.totalCount = response.totalNum
            })
        }, $scope.searchbycontent()
}]), recordsModule.controller("echart_observeCtrl", function ($scope, $http, $log) {
    $http.post(ssDomain + "admin/grades.json").success(function (response) {
        "undefined" != typeof response.error ? alert("请求参数错误！") : $scope.gradelist = response.grades
    }), $scope.selChange = function (id) {
        $http.post(ssDomain + "admin/queryClassList.json", {gradeId: id}).success(function (response) {
            $scope.classlist = response.classList
        })
    }, $scope.legendListSrc = ["记录数", "点赞数", "评论数"], $scope.legendList = ["记录数", "点赞数", "评论数"], $scope.dayList = new Array, $scope.option = {};
    var weekDate = new Date;
    weekDate.setDate(weekDate.getDate() - 7);
    var day1 = weekDate.getDate();
    10 > day1 && (day1 = "0" + day1),
//$scope.startTime = (weekDate.getFullYear())+"-"+genMonth(weekDate.getMonth()+1)+"-"+day1;
        $scope.startTime = weekDate.getFullYear() + "-" + genMonth(curDate.getMonth() + 1) + "-01";
    var day2 = curDate.getDate();
    10 > day2 && (day2 = "0" + day2), $scope.endTime = curDate.getFullYear() + "-" + genMonth(curDate.getMonth() + 1) + "-" + day2, $scope.analyzer = function () {
        var sDate = $scope.startTime, eDate = $scope.endTime;
        return void 0 == sDate || void 0 == eDate ? void alert("请选择日期") : sDate > eDate ? void alert("结束日期不能小于开始日期") : (console.log(sDate + "," + eDate), void $http.post(ssDomain + "admin/kidObserveAnalysis.json", {
            gradeId: $scope.gradeId,
            classId: $scope.classId,
            startTime: $scope.startTime,
            endTime: $scope.endTime
        }).success(function (response) {
            var jsdata = response.records;
            if (null != jsdata)for (var item = null, i = 0; i < jsdata.length; i++)item = jsdata[i], $scope.dayList.push(item.day);
            var srcOption = {
                title: {text: "教师观察记录分析报表", x: "center", y: "top"},
                tooltip: {trigger: "axis"},
                toolbox: {show: !0, itemSize: 24, feature: {saveAsImage: {show: !0}}},
                calculable: !0,
                xAxis: [{type: "category", boundaryGap: !1, data: $scope.dayList}],
                yAxis: [{type: "value", axisLabel: {formatter: "{value} 人"}}],
                legend: {data: $scope.legendList, orient: "vertical", x: "right", y: "center"},
                series: []
            };
            $scope.option = srcOption, $scope.legendList = ["记录数", "点赞数", "评论数"], $scope.dayList = [], $scope.observeObjList = [], $scope.genChart(response.records, "line")
        }))
    }, $scope.observeObjList = [], $scope.genChart = function (jsdata, type) {
        if (null != jsdata) {
            for (var obserObj0 = [], obserObj1 = [], obserObj2 = [], item = null, i = 0; i < jsdata.length; i++)item = jsdata[i], obserObj0.push(item.observationNum), obserObj1.push(item.praiseNum), obserObj2.push(item.commentNum);
            $scope.observeObjList = [obserObj0, obserObj1, obserObj2];
            for (var myChart = echarts.init(document.getElementById("chart")), i = 0; i < $scope.observeObjList.length; i++) {
                var oneOptionItem = {name: "", type: "line", data: []};
                $scope.observeObjList[i].length > 0 && (oneOptionItem.name = $scope.legendList[i], oneOptionItem.data = $scope.observeObjList[i], $scope.option.series.push(oneOptionItem))
            }
            myChart.setOption($scope.option)
        }
    }, $scope.analyzer(), $scope.chkChecked = function (obj) {
        var id = "#ck" + obj.$index;
        if (console.log("id:" + id), $(id).is(":checked")) {
            $scope.option.legend.data.push($(id).val());
            for (var datalist = [], i = 0; i < $scope.option.legend.data.length; i++)if ($scope.option.legend.data[i] == $(id).val()) {
                datalist = $scope.observeObjList[i];
                break
            }
            var addOption = {name: $(id).val(), type: "line", data: datalist};
            $scope.option.series.push(addOption)
        } else {
            for (var i = 0; i < $scope.option.legend.data.length; i++)if ($scope.option.legend.data[i] == $(id).val()) {
                $scope.option.legend.data.splice(i, 1);
                break
            }
            for (var i = 0; i < $scope.option.series.length; i++)if ($scope.option.series[i].name == $(id).val()) {
                $scope.option.series.splice(i, 1);
                break
            }
        }
        myChart = echarts.init(document.getElementById("chart")), myChart.setOption($scope.option)
    }
});
/*! xybbGarten 最后修改于： 2016-06-23 */