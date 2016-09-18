/**
 * Created by ywg on 2016/4/29.
 * function:活动信息列表
 */
var activityModule=angular.module("activity",["ui.router","ui.bootstrap"]);activityModule.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$stateProvider.state("activity",{url:"/activity",templateUrl:"/app/modules/activity/activity_list.html"})}]),activityModule.controller("actCtrl",["$scope","$http","$filter","$state","$uibModal","Data",function($scope,$http,$filter,$state,$uibModal,Data){/*查询方法*/
$scope.list=function(params){$http.post(ssDomain+"admin/queryActivityList.json",params).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):$scope.acts=response.activityList}).error(function(data,status,headers,config){400==status&&layer.alert(data.message,{icon:0})})},$scope.hideInfo=function(act){var flag=1==act.isShow?0:1,parm={id:act.id,isShow:flag};$http.post(ssDomain+"admin/updateActivity.json",parm).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):(layer.alert("操作成功！",{icon:0}),$scope.list({pageSize:10,pageNO:1}))}).error(function(data,status,headers,config){400==status&&layer.alert(data.message,{icon:0})})},$scope.delAct=function(act){layer.alert("删除后无法恢复，确定删除吗？",{titie:"提示信息",icon:"0",yes:function(){var parm={id:act.id};$http.post(ssDomain+"admin/deleteActivity",parm).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):(layer.alert("操作成功！",{icon:0}),$scope.list({pageSize:10,pageNO:1}))}).error(function(data,status,headers,config){400==status&&layer.alert(data.message,{icon:1})})}})},/*获取列表*/
$scope.list({pageSize:20,pageNO:1}),/*刷新操作*/
$scope.reload=function(){$scope.list({pageSize:20,pageNO:1})}}]);
/*! xybbGarten 最后修改于： 2016-06-23 */