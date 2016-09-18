var leaveModule = angular.module("leave", ["ui.router", "ui.bootstrap", "angularUtils.directives.dirPagination"]);
leaveModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("leave", {
        url: "/leave",
        templateUrl: "/app/modules/leave/leave.html"
    }).state("leaveSummary", {url: "/leaveSummary", templateUrl: "/app/modules/leave/leaveSummary.html"})
}]);
leaveModule.controller("leaveCtrl", function ($scope, $http) {
    function getResultsPage(pageNumber) {
        var createTime = $("#datepicker").val() ? $("#datepicker").val() : (new Date).Format(fmt), req = {
            method: "POST", url: ssDomain + "admin/leaveApplication/leaveApplicationList.json", data: {
                gradeId: $scope.gradeId,
                classId: $scope.classId,
                createTime: createTime,
                studentName: $scope.studentName,
                pageSize: $scope.pageSize,//每页显示多少条
                pageNo: pageNumber
            }
        };
        $http(req).then(function (result) {
            $scope.leaves = result.data.leaveApplicationList;
            $scope.totalCount = result.data.totalCount;
        })
    }

    $scope.pageSize = 10, $scope.pageNo = 1, $scope.totalCount = 0, $scope.createTime = (new Date).Format(fmt), getResultsPage(1), $("#studentNameInput").keydown(function (e) {
        var curKey = e.which;
        return 13 == curKey ? ($scope.query(), !1) : void 0
    }), $scope.pageChanged = function (newPage) {
        getResultsPage(newPage)
    }, $http.post(ssDomain + "admin/grades.json").success(function (response) {
        $scope.gradeList = response.grades
    }), $scope.selChange = function (id) {
        $http.post(ssDomain + "admin/queryClassList.json", {gradeId: id}).success(function (response) {
            $scope.classList = response.classList
        })
    },
//导出
        $scope.exportToExcel = function () {
            var createTime = $("#datepicker").val(), params = "gradeId=" + $scope.gradeId + "&classId=" + $scope.classId + "&createTime=" + createTime + "&studentName=" + $scope.studentName;
            url = ssDomain + "admin/exportLeaveApplication", window.location.href = url + "?" + params
        },
//查询
        $scope.query = function () {
            getResultsPage(1)
        }
}), leaveModule.controller("leaveSummaryCtrl", function ($scope, $http) {
    function getResultsPage(pageNumber) {
        var startTime = $("#startTime").val() ? $("#startTime").val() : (new Date).Format(fmt), endTime = $("#endTime").val() ? $("#endTime").val() : (new Date).Format(fmt), req = {
            method: "POST",
            url: ssDomain + "admin/leaveApplication/leaveSummaryList.json",
            data: {
                gradeId: $scope.gradeId,
                classId: $scope.classId,
                startTime: startTime,
                endTime: endTime,
                studentName: $scope.studentName,
                pageSize: $scope.pageSize,
                pageNo: pageNumber
            }
        };
        $http(req).then(function (result) {
            $scope.leaves = result.data.leaveSummary, $scope.totalCount = result.data.totalCount
        })
    }

    $scope.pageSize = 10, $scope.pageNo = 1, $scope.totalCount = 0, $scope.startTime = (new Date).Format(fmt), $scope.endTime = (new Date).Format(fmt), getResultsPage(1), $scope.pageChanged = function (newPage) {
        getResultsPage(newPage)
    }, $http.post(ssDomain + "admin/grades.json").success(function (response) {
        $scope.gradeList = response.grades
    }), $scope.selChange = function (id) {
        $http.post(ssDomain + "admin/queryClassList.json", {gradeId: id}).success(function (response) {
            $scope.classList = response.classList
        })
    },
//导出
        $scope.exportToExcel = function () {
            var startTime = $("#startTime").val(), endTime = $("#endTime").val(), params = "gradeId=" + $scope.gradeId + "&classId=" + $scope.classId + "&startTime=" + startTime + "&endTime=" + endTime;
            url = ssDomain + "admin/exportLeaveSummary", window.location.href = url + "?" + params
        },
//查询
        $scope.query = function () {
            getResultsPage(1)
        }
});
/*! xybbGarten 最后修改于： 2016-06-23 */