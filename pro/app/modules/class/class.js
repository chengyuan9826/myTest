/**
 * Created by Administrator on 2016/3/30.
 */
var classModule = angular.module("class", ["ui.router", "ui.bootstrap"]);
classModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("class", {url: "/class", templateUrl: "/app/modules/class/class_list.html"})
}]);
classModule.directive("page", function ($compile, $parse) {
    return {
        restrict: "E",
        link: function (scope, element, attr) {
            scope.$watch(attr.content, function () {
                element.html($parse(attr.content)(scope));
                $compile(element.contents())(scope);
            }, !0)
        }
    }
}), /*自定义指令进行分页操作*/
    classModule.factory("Data", function () {/*定义全局变量*/
        return {pages: "", classes: ""}
    });
   classModule.controller("classCtrl", ["$scope", "$http", "$filter", "$state", "$uibModal", "Data", function ($scope, $http, $filter, $state, $uibModal, Data) {
        $scope.msg = "删除后数据不可恢复，确定删除吗？";
        $scope.isShowOK = !0,//是否显示确认按钮
        $scope.mode = "0",//mode = 0添加 mode=1修改操作
        $scope.currentPage = "1";
        $scope.data = Data;
        $("#classNameInput").keydown(function (e) {
        var curKey = e.which;
        return 13 == curKey ? ($scope.query(), !1) : void 0
    }), $scope.list = function (params) {
        $http.post(ssDomain + "admin/classList.json", params).success(function (response) {
            "undefined" != typeof response.error ? layer.alert("请求参数错误！", {icon: 0}) : (Data.pages = response.rows.page, Data.classes = response.rows.records)
        }).error(function (data, status, headers, config) {
            400 == status && layer.alert(data.message, {icon: 0})
        })
    }, /*查询*/
        $scope.query = function () {
            var name = $scope.queryCondition;
            void 0 != name && "" != name || (
//layer.alert('请求内容不能为空！',{icon: 0});
                name = null);
            var params = {pageNO: "1", className: name};
            $scope.list(params)
        }, /*获取列表*/
        $scope.list({pageNO: "1"}), /*下一页操作*/
        $scope.nextPage = function (page) {
            $scope.currentPage = page, $scope.list({pageNO: page, className: $scope.queryCondition})
        }, /*上一页操作*/
        $scope.prePage = function (page) {
            $scope.currentPage = page, $scope.list({pageNO: page, className: $scope.queryCondition})
        }, /*页面指哪打哪*/
        $scope.goPage = function (page) {
            $scope.currentPage = page, $scope.list({pageNO: page, className: $scope.queryCondition})
        }, /*刷新操作*/
        $scope.reload = function () {
            $scope.list({pageNO: "1"})
        }, /*添加页面*/
        $scope.addUI = function () {
            $scope.mode = "0";
            $uibModal.open({
                templateUrl: "class_edit.html",
                controller: "ModalInstanceCtrl",
                size: "sm",
                resolve: {
                    fdclass: function () {
                        return ""
                    }, mode: function () {
                        return $scope.mode
                    }, page: function () {
                        return $scope.currentPage
                    }
                }
            })
        }, /*修改页面*/
        $scope.editUI = function (inclass) {
            $scope.mode = "1", $uibModal.open({
                templateUrl: "class_edit.html",
                controller: "ModalInstanceCtrl",
                size: "sm",
                resolve: {
                    fdclass: function () {
                        return JSON.parse(JSON.stringify(inclass))
                    }, mode: function () {
                        return $scope.mode
                    }, page: function () {
                        return $scope.currentPage
                    }
                }
            })
        }, /*    //全选
     $scope.checkAll = function () {
     var list = Data.classes;
     var isChecked = $("input[name=checkAll]").prop("checked");
     for (var i = 0; i < list.length; i++) {
     list[i].checked = isChecked;
     }
     }
     //单击选中
     $scope.check=function(inclass){
     if(inclass.checked){
     inclass.checked = false;
     inclass.info="";
     }else{
     inclass.checked = true;
     inclass.info="info";
     }
     }*/
//删除操作
        $scope.remove = function (inclass) {
            $scope.msg = "删除后数据不可恢复，确定删除吗？", $scope.isShowOK = !0, $scope.isFlag = !0;
//打开提示框
            $uibModal.open({
                templateUrl: "class_message.html",
                controller: "DeleteCtrl",
                size: "sm",
                resolve: {
                    id: function () {
                        return inclass.id
                    }, msg: function () {
                        return $scope.msg
                    }, isShowOK: function () {
                        return $scope.isShowOK
                    }, page: function () {
                        return $scope.currentPage
                    }
                }
            })
        }
}]),
//班级修改模态框控制器
    classModule.controller("ModalInstanceCtrl", ["$http", "$scope", "$uibModalInstance", "fdclass", "mode", "page", "Data", function ($http, $scope, $uibModalInstance, fdclass, mode, page, Data) {
        $scope.fdclass = fdclass, $scope.mode = mode, $scope.doSubmit = function () {
            if ("0" == $scope.mode) {//添加操作
                var obj = $scope.fdclass, path = ssDomain + "admin/addClass.json", data = {
                    className: obj.className,
                    nickName: obj.nickName,
                    remark: obj.remark
                };//获取表单数据
                $scope.submit(path, data)
            } else if ("1" == $scope.mode) {//修改操作
                var obj = $scope.fdclass, path = ssDomain + "admin/modifyClass.json", data = {
                    classId: obj.id,
                    className: obj.className,
                    nickName: obj.nickName,
                    remark: obj.remark
                };//获取表单数据
                $scope.submit(path, data)
            }
        }, $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel")
        },
//提交后台方法
            $scope.submit = function (path, data) {
                $http.post(path, data).success(function (response) {
                    "undefined" != typeof response.error ? alert("请求参数错误！") : /*获取列表*/
                        $http.post(ssDomain + "admin/classList.json", {pageNO: page}).success(function (response) {
                            "undefined" != typeof response.error ? alert("请求参数错误！") : (Data.pages = response.rows.page, Data.classes = response.rows.records, $scope.cancel())
                        })
                }).error(function (data, status, headers, config) {
                    400 == status && alert(data.message)
                })
            }
    }]),
//删除模态框
    classModule.controller("DeleteCtrl", function ($http, $scope, $uibModalInstance, msg, isShowOK, page, Data, id) {
        $scope.msg = msg, $scope.isShowOK = isShowOK, $scope.id = id,
//删除方法
            $scope.del = function (path, data) {
                $http.post(path, data).success(function (response) {
                    "undefined" != typeof response.error ? alert("请求参数错误！") : $http.post(ssDomain + "admin/classList.json", {pageNO: page}).success(function (response) {
                        "undefined" != typeof response.error ? alert("请求参数错误！") : (Data.pages = response.rows.page, Data.classes = response.rows.records, $scope.cancel())
                    })
                })
            },
//单个删除
            $scope.ok = function (id) {
                var path = ssDomain + "admin/deleteClass.json", data = {classIds: id};
                $scope.del(path, data), $scope.cancel()
            }, $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel")
        }
    });
/*! xybbGarten 最后修改于： 2016-06-23 */