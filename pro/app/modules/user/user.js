/**
 * Created by Administrator on 2016/3/31.
 */
var userModel = angular.module("user", ["ngCookies", "ui.bootstrap"]);
userModel.controller("loginController", ["$scope", "userService", "$log", function ($scope, userService, $log) {
    $log.info("定义loginController");
    $scope.login = function () {
        var isGarten = $("#rdGarten").is(":checked");
        var roleId = 3;
        isGarten && (roleId = 4);
        userService.login($scope.username, $scope.password, $scope.remeberMe, roleId);
    };
    $scope.remeberMe = !1;
    $log.info('这是我的练习');
}]);
//创建用户服务
userModel.factory("userService", ["$cookies", "$http", "$log", "$window", "$ro otScope", function ($cookies, $http, $log, $window, $rootScope) {
    var services = {};
//登录
//判断是否登录
    return services.login = function (username, password, remeberMe, identity) {
        var req = {
            method: "POST",
            url: ssDomain + "admin/login",
            data: {phone: username, password: password, identity: identity}
        };
        $http(req).then(function (response) {
            var data = response.data;
            if (null == data)return void $log.error("登录失败");
            var cookieConfig = {};
            if (remeberMe) {
                var date = new Date;
                date.setDate(date.getDate() + 10);
                cookieConfig.expires = date;
            }
            $cookies.put("sessionid", data.sessionid, cookieConfig);
            3 == identity ? $window.location.href = "http://36.110.49.106:8881/index.html?v=24" : $window.location.href = "/index.html?v=22"
        }, function (response) {
            if (null != response.data) {
                var msg = response.data.message;
                $log.error(msg);
                $rootScope.message = msg
            } else $rootScope.message = "系统异常"
        });
    }, services.userLoggedIn = function () {
        var sessionid = $cookies.get("sessionid");
        return $log.info("sessionid=" + sessionid), null != sessionid && "" != sessionid
    }, services
}]);
/*! xybbGarten 最后修改于： 2016-06-21 */