var tipModule=angular.module("tip",["ui.router","ui.bootstrap","angularUtils.directives.dirPagination"]);tipModule.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$stateProvider.state("tip",{url:"/tip",templateUrl:"/app/modules/tip/tip.html"})}]),tipModule.controller("tipCtrl",function($scope,$http,$window){function getResultsPage(pageNumber){var createTime=$("#createTime").val()?$("#createTime").val():(new Date).Format(fmt),req={method:"POST",url:ssDomain+"admin/parentTip/tipList.json",data:{gradeId:$scope.gradeId,classId:$scope.classId,createTime:createTime,studentName:$scope.studentName,pageSize:$scope.pageSize,pageNo:pageNumber}};$http(req).then(function(result){$scope.tips=result.data.records,$scope.totalCount=result.data.totalCount})}$scope.pageSize=10,// this should match however many results your API puts on one page
$scope.pageNo=1,$scope.createTime=(new Date).Format(fmt),getResultsPage(1),$scope.totalCount=0,$("#studentNameInput").keydown(function(e){var curKey=e.which;return 13==curKey?($scope.query(),!1):void 0}),$scope.pageChanged=function(newPage){getResultsPage(newPage)},$http.post(ssDomain+"admin/grades.json").success(function(response){$scope.gradeList=response.grades}),$scope.selChange=function(id){$http.post(ssDomain+"admin/queryClassList.json",{gradeId:id}).success(function(response){$scope.classList=response.classList})},
//导出
$scope.exportToExcel=function(){var createTime=$("#createTime").val(),params="gradeId="+$scope.gradeId+"&classId="+$scope.classId+"&createTime="+createTime+"&studentName="+$scope.studentName;url=ssDomain+"admin/exportParentTips",$window.location.href=url+"?"+params},
//查询
$scope.query=function(){getResultsPage(1)}});
/*! xybbGarten 最后修改于： 2016-06-23 */