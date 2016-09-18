/**
 * Created by Administrator on 2016/4/5.
 */
var alertModule = angular.module("alert", []);
alertModule.factory("alertService", function ($rootScope) {
    var alertService = {};
// 创建一个全局的 alert 数组
    return $rootScope.alerts = [],alertService.add = function (type, msg) {
        $rootScope.alerts.push({
            type: type, msg: msg, close: function () {
                alertService.closeAlert(this)
            }
        })
    }, alertService.closeAlert = function (alert) {
        alertService.closeAlertIdx($rootScope.alerts.indexOf(alert))
    }, alertService.closeAlertIdx = function (index) {
        $rootScope.alerts.splice(index, 1)
    }, alertService
});
/*! xybbGarten 最后修改于： 2016-06-23 */