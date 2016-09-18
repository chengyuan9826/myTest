/**
 * Created by Administrator on 2016/3/30.
 */
var classModule=angular.module("questionType",["ui.router","ui.bootstrap"]);classModule.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$stateProvider.state("questionType",{url:"/questionType",templateUrl:"/app/modules/questionMark/question_type_list.html"})}]),classModule.directive("page",function($compile,$parse){return{restrict:"E",link:function(scope,element,attr){scope.$watch(attr.content,function(){element.html($parse(attr.content)(scope)),$compile(element.contents())(scope)},!0)}}}),/*自定义指令进行分页操作*/
classModule.factory("Data",function(){/*定义全局变量*/
return{pages:"",questionTypes:""}}),classModule.controller("questionTypeCtrl",["$scope","$http","$filter","$state","$uibModal","Data",function($scope,$http,$filter,$state,$uibModal,Data){$scope.msg="删除后数据不可恢复，确定删除吗？",$scope.isShowOK=!0,//是否显示确认按钮
$scope.mode="0",//mode = 0添加 mode=1修改操作
$scope.currentPage="1",$scope.data=Data,/*获取列表*/
$http.post(ssDomain+"admin/questionTypeList.json",{pageNO:"1"}).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):(Data.pages=response.rows.page,Data.questionTypes=response.rows.records)}),/*下一页操作*/
$scope.nextPage=function(page){$scope.currentPage=page,$http.post(ssDomain+"admin/questionTypeList.json",{pageNO:page}).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):(Data.pages=response.rows.page,Data.questionTypes=response.rows.records)})},/*上一页操作*/
$scope.prePage=function(page){$scope.currentPage=page,$http.post(ssDomain+"admin/questionTypeList.json",{pageNO:page}).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):(Data.pages=response.rows.page,Data.questionTypes=response.rows.records)})},/*页面指哪打哪*/
$scope.goPage=function(page){$scope.currentPage=page,$http.post(ssDomain+"admin/questionTypeList.json",{pageNO:page}).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):(Data.pages=response.rows.page,Data.questionTypes=response.rows.records)})},
//goto questionInfo
$scope.addQsInfo=function(){$state.go("question")},/*表单操作*/
$scope.addUI=function(){$scope.mode="0",questionType={};$uibModal.open({templateUrl:"question_type_edit.html",controller:"QuestionTypeOperatorCtrl",size:"sm",resolve:{questionType:function(){return JSON.parse(JSON.stringify(questionType))},mode:function(){return $scope.mode},page:function(){return $scope.currentPage}}})},$scope.editUI=function(questionType){$scope.mode="1";$uibModal.open({templateUrl:"question_type_edit.html",controller:"QuestionTypeOperatorCtrl",size:"sm",resolve:{questionType:function(){return JSON.parse(JSON.stringify(questionType))},mode:function(){return $scope.mode},page:function(){return $scope.currentPage}}})},
//全选
$scope.checkAll=function(){for(var list=Data.questionTypes,isChecked=$("input[name=checkAll]").prop("checked"),i=0;i<list.length;i++)list[i].checked=isChecked},
//单击选中
$scope.check=function(inclass){inclass.checked?(inclass.checked=!1,inclass.info=""):(inclass.checked=!0,inclass.info="info")},
//删除操作
$scope.remove=function(questionType){$scope.msg="删除后数据不可恢复，确定删除吗？",$scope.isShowOK=!0;
//打开提示框
$uibModal.open({templateUrl:"question_type_message.html",controller:"QuestionTypeMsgCtrl",size:"sm",resolve:{id:function(){return questionType.id},msg:function(){return $scope.msg},isShowOK:function(){return $scope.isShowOK},list:function(){return Data.questionTypes},page:function(){return $scope.currentPage}}})}}]),
//班级修改模态框控制器
classModule.controller("QuestionTypeOperatorCtrl",["$http","$scope","$uibModalInstance","questionType","mode","page","Data",function($http,$scope,$uibModalInstance,questionType,mode,page,Data){$scope.questionType=questionType,$scope.mode=mode,$scope.doSubmit=function(){if("0"==$scope.mode){//添加操作
var obj=$scope.questionType,path=ssDomain+"admin/addQuestionType.json",data={qtName:obj.name};//获取表单数据
$scope.submit(path,data)}else if("1"==$scope.mode){//修改操作
var obj=$scope.questionType,path=ssDomain+"admin/modifyQuestionType.json",data={qtId:obj.id,qtName:obj.name};//获取表单数据
$scope.submit(path,data)}},$scope.cancel=function(){$uibModalInstance.dismiss("cancel")},
//提交后台方法
$scope.submit=function(path,data){$http.post(path,data).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):/*获取列表*/
$http.post(ssDomain+"admin/questionTypeList.json",{pageNO:page}).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):(Data.pages=response.rows.page,Data.questionTypes=response.rows.records,$scope.cancel())})}).error(function(data,status,headers,config){400==status&&alert(data.message)})}}]),
//删除模态框
classModule.controller("QuestionTypeMsgCtrl",function($http,$scope,$uibModalInstance,msg,isShowOK,list,page,Data,id){$scope.msg=msg,$scope.isShowOK=isShowOK,$scope.id=id,
//删除方法
$scope.del=function(path,data){$http.post(path,data).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):$http.post(ssDomain+"admin/questionTypeList.json",{pageNO:page}).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):(Data.pages=response.rows.page,Data.questionTypes=response.rows.records,$scope.cancel())})})},
//单个删除
$scope.ok=function(id){var path=ssDomain+"admin/deleteQuestionType.json",data={qtId:id};$scope.del(path,data),$scope.cancel()},$scope.cancel=function(){$uibModalInstance.dismiss("cancel")}});
/*! xybbGarten 最后修改于： 2016-06-23 */