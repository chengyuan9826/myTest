/**
 * Created by Administrator on 2016/3/30.
 */
var defaultModule = angular.module("default", ["ui.router", "ui.bootstrap", "ngFileUpload"]);
defaultModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("default", {url: "/default", templateUrl: "/app/modules/default/default.html"})
}]),
//<input type="file"/>双向数据绑定
    defaultModule.directive("fileread", [function () {
        return {
            scope: {fileread: "="},
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader;
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result
                        })
                    }, reader.readAsDataURL(changeEvent.target.files[0])
                })
            }
        }
    }]);
    defaultModule.controller("defaultCtr", ["$scope", "$http", "$filter", "$state", "$uibModal", "Upload",
        function ($scope, $http, $filter, $state, $uibModal, Upload) {
      $scope.getNewsList = function () {
        var api = "http://api.iyoujiao.net/articles";
            parmAct = [{artilceId: 1,flag: 0,classId: 32,recordCount: 3}, {artilceId: 1, flag: 0, classId: 34, recordCount: 3},
                {artilceId: 1,flag: 0,classId: 35, recordCount: 3}, {artilceId: 1, flag: 0, classId: 36, recordCount: 3}];
        $scope.childActs = [];
        for (var i = 0; i < parmAct.length; i++)$http.post(api, parmAct[i]).success(function (response) {
            "undefined" != typeof response.error ? alert("请求参数错误！") : $scope.childActs.push(response.data)
        }).error(function (data, status, headers, config) {
            400 == status && layer.alert(data.message, {icon: 0})
        })
    }, /*下载文件*/
        $scope.downloadExcel = function () {
//弹出一个页面层
            layer.open({
                type: 1,
                title: "提示信息",
                shadeClose: !0,//点击遮罩关闭
                area: ["250px", "150px"],
                content: "<br/>&nbsp;&nbsp;&nbsp;&nbsp;是否确定下载！",
                btn: ["确定", "取消"],
                yes: function (index, layero) {//或者使用确定
                    window.location.replace(ssDomain + "admin/download");
                    layer.closeAll()
                },
                cancel: function (index) {//或者使用取消
                    layer.close(index)
                }
            })
        }, $scope.upload = function (file) {
        $scope.fileInfo = file, Upload.upload({//请求路径
            url: ssDomain + "admin/upload.json", file: file
        }).progress(function (evt) {//进度条
            var progressPercentage = parseInt(100 * evt.loaded / evt.total);
            console.log("progess:" + progressPercentage + "%" + evt.config.file.name)
        }).success(function (data, status, headers, config) {//上传成功
            console.log("file " + config.file.name + "uploaded. Response: " + data), layer.alert("上传成功", {icon: 1})
        }).error(function (data, status, headers, config) {//上传失败
            layer.alert(data.message, {icon: 0})
        })
    },
//立即执行的对象
        $scope.getNewsList(), $scope.kindAna = function () {
        $state.go("chartRecords")
    }, $scope.inSchool = function () {
        $state.go("chartKindAttendance")
    }, $scope.loveAct = function () {
        $state.go("chartActivity")
    }, $scope.todayStarChart = function () {
        $state.go("chartStars")
    }
}]);
/*! xybbGarten 最后修改于： 2016-06-23 */