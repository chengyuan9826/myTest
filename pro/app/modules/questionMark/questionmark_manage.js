/**
 * Created by Administrator on 2016/3/30.
 */
var classModule=angular.module("question",["ui.router","ui.bootstrap"]);classModule.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$stateProvider.state("question",{url:"/question",templateUrl:"/app/modules/questionMark/question_list.html"})}]),classModule.directive("page",function($compile,$parse){return{restrict:"E",link:function(scope,element,attr){scope.$watch(attr.content,function(){element.html($parse(attr.content)(scope)),$compile(element.contents())(scope)},!0)}}}),/*自定义指令进行分页操作*/
classModule.factory("Data",function(){/*定义全局变量*/
return{pages:"",questions:""}}),classModule.controller("questionCtrl",["$scope","$http","$filter","$state","$uibModal","Data",function($scope,$http,$filter,$state,$uibModal,Data){$scope.msg="删除后数据不可恢复，确定删除吗？",$scope.isShowOK=!0,//是否显示确认按钮
$scope.mode="0",//mode = 0添加 mode=1修改操作
$scope.currentPage="1",$scope.data=Data,/*查询*/
$scope.list=function(params){$http.post(ssDomain+"admin/questionList.json",params).success(function(response){"undefined"!=typeof response.error?layer.alert("请求参数错误！",{icon:0}):(Data.pages=response.rows.page,Data.questions=response.rows.records)}).error(function(data,status,headers,config){400==status&&layer.alert(data.message,{icon:0})})},/*通过内容查询操作*/
$scope.query=function(){void 0==$scope.queryCondition||""==$scope.queryCondition?layer.alert("搜索内容不能为空！",{icon:0}):$scope.list({pageNO:"1",title:$scope.queryCondition})},/*获取列表*/
$scope.list({pageNO:"1"}),/*下一页操作*/
$scope.nextPage=function(page){$scope.currentPage=page,$scope.list({pageNO:page,title:$scope.queryCondition})},/*上一页操作*/
$scope.prePage=function(page){$scope.currentPage=page,$scope.list({pageNO:page,title:$scope.queryCondition})},/*页面指哪打哪*/
$scope.goPage=function(page){$scope.currentPage=page,$scope.list({pageNO:page,title:$scope.queryCondition})},/*刷新操作*/
$scope.reload=function(){$scope.list({pageNO:"1"})},$scope.quesTypeInfo=function(){$state.go("questionType")},/*表单操作*/
$scope.addUI=function(){$scope.mode="0",question={};$uibModal.open({templateUrl:"question_edit.html",controller:"QuestionOperatorCtrl",size:"sm",resolve:{question:function(){return JSON.parse(JSON.stringify(question))},mode:function(){return $scope.mode},page:function(){return $scope.currentPage}}})},$scope.editUI=function(question){$scope.mode="1";$uibModal.open({templateUrl:"question_edit.html",controller:"QuestionOperatorCtrl",size:"sm",resolve:{question:function(){return JSON.parse(JSON.stringify(question))},mode:function(){return $scope.mode},page:function(){return $scope.currentPage}}})},
//删除操作
$scope.remove=function(question){$scope.msg="删除后数据不可恢复，确定删除吗？",$scope.isShowOK=!0;
//打开提示框
$uibModal.open({templateUrl:"question_message.html",controller:"QuestionMsgCtrl",size:"sm",resolve:{id:function(){return question.id},msg:function(){return $scope.msg},isShowOK:function(){return $scope.isShowOK},list:function(){return Data.questions},page:function(){return $scope.currentPage}}})}}]),
//班级修改模态框控制器
classModule.controller("QuestionOperatorCtrl",["$http","$scope","$uibModalInstance","question","mode","page","Data",function($http,$scope,$uibModalInstance,question,mode,page,Data){$scope.question=question,$scope.mode=mode,$scope.doSubmit=function(){if("0"==$scope.mode){//添加操作
var obj=$scope.question,path=ssDomain+"admin/addQuestion.json",typeId=$("#typeId").val(),data={typeId:typeId,title:obj.title};//获取表单数据
$scope.submit(path,data)}else if("1"==$scope.mode){//修改操作
var obj=$scope.question,path=ssDomain+"admin/modifyQuestion.json",typeId=$("#typeId").val();""==typeId&&(typeId=obj.typeId);var data={questionId:obj.id,typeId:typeId,title:obj.title};//获取表单数据
$scope.submit(path,data)}},$scope.loadType=function(){var typeName="";"0"==$scope.mode?//添加操作
typeName=$("#typeName").val():"1"==$scope.mode&&(//添加操作)
typeName=$scope.question.typeName),/*读取类型*/
$http.post(ssDomain+"admin/showQuestionTypes.json",{schoolId:"0"}).success(function(response){if("undefined"!=typeof response.error)layer.alert("请求参数错误！",{icon:6});else{$scope.questionTypes=response.questionTypes;for(var len=$scope.questionTypes.length,html='<div class="user-class">',i=0;len>i;i++)typeName==$scope.questionTypes[i].name?(html+='<div class="in-class">',html=html+'<input type="radio" id="'+$scope.questionTypes[i].id+'" name="radio-sex" value="'+$scope.questionTypes[i].name+'" ng-click="aa();" checked>',html=html+'<label for="sex-man">'+$scope.questionTypes[i].name+"</label>",html+="</div>"):(html+='<div class="in-class">',html=html+'<input type="radio" id="'+$scope.questionTypes[i].id+'" name="radio-sex" value="'+$scope.questionTypes[i].name+'">',html=html+'<label for="sex-man">'+$scope.questionTypes[i].name+"</label>",html+="</div>");html+="</div>",
//弹出一个页面层
layer.open({type:1,title:"选择小问号类型",shadeClose:!0,//点击遮罩关闭
content:html,btn:["确定","取消"],yes:function(index,layero){//或者使用确定
$("input[name='radio-sex']").each(function(){1==this.checked&&($("#typeId").val(this.id),$("#typeName").val(this.value),layer.closeAll())}),layer.close(index)},cancel:function(index){//或者使用取消
layer.close(index)}}),$(".user-class input").each(function(){var self=$(this);label=self.next(),label_text=label.text(),label.remove(),self.iCheck({checkboxClass:"icheckbox_sm-blue",radioClass:"radio_sm-blue",insert:label_text})})}})},$scope.cancel=function(){$uibModalInstance.dismiss("cancel")},
//提交后台方法
$scope.submit=function(path,data){$http.post(path,data).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):/*获取列表*/
$http.post(ssDomain+"admin/questionList.json",{pageNO:page}).success(function(response){"undefined"!=typeof response.error?layer.alert("请求参数错误！",{icon:6}):(Data.pages=response.rows.page,Data.questions=response.rows.records,$scope.cancel())})})}}]),
//删除模态框
classModule.controller("QuestionMsgCtrl",function($http,$scope,$uibModalInstance,msg,isShowOK,list,page,Data,id){$scope.msg=msg,$scope.isShowOK=isShowOK,$scope.id=id,
//删除方法
$scope.del=function(path,data){$http.post(path,data).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):$http.post(ssDomain+"admin/questionList.json",{pageNO:page}).success(function(response){"undefined"!=typeof response.error?alert("请求参数错误！"):(Data.pages=response.rows.page,Data.questions=response.rows.records,$scope.cancel())})})},
//单个删除
$scope.ok=function(id){var path=ssDomain+"admin/deleteQuestion.json",data={questionId:id};$scope.del(path,data),$scope.cancel()},$scope.cancel=function(){$uibModalInstance.dismiss("cancel")}});
/*! xybbGarten 最后修改于： 2016-06-23 */