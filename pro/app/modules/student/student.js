
/**
 * Created by Administrator on 2016/3/30.
 */
var classModule = angular.module("student", ["ui.router", "ui.bootstrap"]);
classModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("student", {url: "/student", templateUrl: "/app/modules/student/student_list.html"})
}]), classModule.directive("page", function ($compile, $parse) {
    return {
        restrict: "E", link: function (scope, element, attr) {
            scope.$watch(attr.content, function () {
                element.html($parse(attr.content)(scope)), $compile(element.contents())(scope)
            }, !0)
        }
    }
}), /*自定义指令进行分页操作*/
    classModule.factory("Data", function () {/*定义全局变量*/
        return {pages: "", students: ""}
    }), classModule.controller("studentCtrl", ["$scope", "$http", "$filter", "$state", "$uibModal", "Data", function ($scope, $http, $filter, $state, $uibModal, Data) {
    $scope.msg = "删除后数据不可恢复，确定删除吗？", $scope.isShowOK = !0,//是否显示确认按钮
        $scope.mode = "0",//mode = 0添加 mode=1修改操作
        $scope.currentPage = "1", $scope.data = Data, $("#studentNameInput").keydown(function (e) {
        var curKey = e.which;
        return 13 == curKey ? ($scope.query(), !1) : void 0
    }), $http.post(ssDomain + "admin/grades.json").success(function (response) {
        $scope.gradeList = response.grades
    }), $scope.selChange = function (id) {
        $http.post(ssDomain + "admin/queryClassList.json", {gradeId: id}).success(function (response) {
            $scope.classList = response.classList
        })
    }, /*查询方法*/
        $scope.list = function (params) {
            $http.post(ssDomain + "admin/studentList.json", params).success(function (response) {
                "undefined" != typeof response.error ? alert("请求参数错误！") : (Data.pages = response.rows.page, Data.students = response.rows.records)
            }).error(function (data, status, headers, config) {
                400 == status && layer.alert(data.message, {icon: 0})
            })
        }, /*查询*/
        $scope.query = function () {
            var params = ($scope.queryCondition, $scope.queryClassCondition, {
                pageNO: "1",
                studentName: $scope.queryCondition,
                gradeId: $scope.gradeId,
                classId: $scope.classId
            });
//var params = {"pageNO":"1","studentName":$scope.queryCondition,"className":$scope.queryClassCondition,"gradeId":$scope.gradeId,"classId":$scope.classId};
            /**
             if((name == undefined || name == '') && (className == undefined || className == '')){
    		layer.alert('请求内容不能为空！',{icon: 0});
    	}else{
    		$scope.list(params);
    	}
             */
            $scope.list(params)
        }, /*获取列表*/
        $scope.list({pageNO: "1"}), /*下一页操作*/
        $scope.nextPage = function (page) {
            $scope.currentPage = page, $scope.list({
                pageNO: page,
                studentName: $scope.queryCondition,
                gradeId: $scope.gradeId,
                classId: $scope.classId
            })
        }, /*上一页操作*/
        $scope.prePage = function (page) {
            $scope.currentPage = page, $scope.list({
                pageNO: page,
                studentName: $scope.queryCondition,
                gradeId: $scope.gradeId,
                classId: $scope.classId
            })
        }, /*页面指哪打哪*/
        $scope.goPage = function (page) {
            $scope.currentPage = page, $scope.list({
                pageNO: page,
                studentName: $scope.queryCondition,
                gradeId: $scope.gradeId,
                classId: $scope.classId
            })
        }, /*刷新操作*/
        $scope.reload = function () {
            $scope.list({pageNO: "1"})
        }, /*表单操作*/
        $scope.addUI = function () {
            $scope.mode = "0", student = {sex: "男"};
            $uibModal.open({
                templateUrl: "student_edit.html",
                controller: "StudentOperatorCtrl",
                size: "sm",
                resolve: {
                    student: function () {
                        return JSON.parse(JSON.stringify(student))
                    }, mode: function () {
                        return $scope.mode
                    }, page: function () {
                        return $scope.currentPage
                    }
                }
            })
        }, $scope.editUI = function (student) {
        $scope.mode = "1";
        $uibModal.open({
            templateUrl: "student_edit.html",
            controller: "StudentOperatorCtrl",
            size: "sm",
            resolve: {
                student: function () {
                    return JSON.parse(JSON.stringify(student))
                }, mode: function () {
                    return $scope.mode
                }, page: function () {
                    return $scope.currentPage
                }
            }
        })
    },
//删除操作
        $scope.remove = function (student) {
            $scope.msg = "删除后数据不可恢复，确定删除吗？", $scope.isShowOK = !0;
//打开提示框
            $uibModal.open({
                templateUrl: "student_message.html",
                controller: "StudentMsgCtrl",
                size: "sm",
                resolve: {
                    id: function () {
                        return student.id
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
    classModule.controller("StudentOperatorCtrl", ["$http", "$scope", "$uibModalInstance", "student", "mode", "page", "Data", function ($http, $scope, $uibModalInstance, student, mode, page, Data) {
        $scope.student = student, $scope.mode = mode, $scope.doSubmit = function () {
            if ("0" == $scope.mode) {//添加操作
                var obj = $scope.student, path = ssDomain + "admin/addStudent.json", birth = $("#datepicker").val(), classId = $("#classId").val(), data = {
                    studentName: obj.name,
                    studentSex: obj.sex,
                    birthday: birth,
                    classId: classId,
                    fname: obj.fname,
                    fphone: obj.fphone,
                    mname: obj.mname,
                    mphone: obj.mphone,
                    remark: obj.remark
                };//获取表单数据
                $scope.submit(path, data)
            } else if ("1" == $scope.mode) {//修改操作
                var obj = $scope.student, path = ssDomain + "admin/modifyStudent.json", birth = $("#datepicker").val(), classId = $("#classId").val();
                "" == classId && (classId = obj.classId);
                var data = {
                    studentId: obj.id,
                    studentName: obj.name,
                    studentSex: obj.sex,
                    birthday: birth,
                    classId: classId,
                    fid: obj.fid,
                    fname: obj.fname,
                    fphone: obj.fphone,
                    mid: obj.mid,
                    mname: obj.mname,
                    mphone: obj.mphone,
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
                        $http.post(ssDomain + "admin/studentList.json", {pageNO: page}).success(function (response) {
                            "undefined" != typeof response.error ? alert("请求参数错误！") : (Data.pages = response.rows.page, Data.students = response.rows.records, $scope.cancel())
                        })
                }).error(function (data, status, headers, config) {
                    400 == status && layer.alert(data.message, {icon: 0})
                })
            }, /**
         * 加载班级
         */
            $scope.loadClass = function () {
                var className = "";
                "0" == $scope.mode ?//添加操作
                    className = $("#className").val() : "1" == $scope.mode && (//添加操作)
                    className = $scope.student.className), /*读取班级*/
                    $http.post(ssDomain + "admin/showClasses.json").success(function (response) {
                        if ("undefined" != typeof response.error)alert("请求参数错误！"); else {
                            $scope.classes = response.classes;
                            for (var len = $scope.classes.length, html = '<div class="user-class">', i = 0; len > i; i++)className == $scope.classes[i].className ? (html += '<div class="in-class">', html = html + '<input type="radio" id="' + $scope.classes[i].id + '" name="radio-sex" value="' + $scope.classes[i].className + '" ng-click="aa();" checked>', html = html + '<label for="sex-man">' + $scope.classes[i].className + "</label>", html += "</div>") : (html += '<div class="in-class">', html = html + '<input type="radio" id="' + $scope.classes[i].id + '" name="radio-sex" value="' + $scope.classes[i].className + '">', html = html + '<label for="sex-man">' + $scope.classes[i].className + "</label>", html += "</div>");
                            html += "</div>",
//弹出一个页面层
                                layer.open({
                                    type: 1, title: "选择班级", shadeClose: !0,//点击遮罩关闭
                                    content: html, btn: ["确定", "取消"], yes: function (index, layero) {//或者使用确定
                                        $("input[name='radio-sex']").each(function () {
                                            1 == this.checked && ($("#classId").val(this.id), $("#className").val(this.value), layer.closeAll())
                                        }), layer.close(index)
                                    }, cancel: function (index) {//或者使用取消
                                        layer.close(index)
                                    }
                                }), $(".user-class input").each(function () {
                                var self = $(this);
                                label = self.next(), label_text = label.text(), label.remove(), self.iCheck({
                                    checkboxClass: "icheckbox_sm-blue",
                                    radioClass: "radio_sm-blue",
                                    insert: label_text
                                })
                            })
                        }
                    })
            }
    }]),
//删除模态框
    classModule.controller("StudentMsgCtrl", function ($http, $scope, $uibModalInstance, msg, isShowOK, page, Data, id) {
        $scope.msg = msg, $scope.isShowOK = isShowOK, $scope.id = id,
//删除方法
            $scope.del = function (path, data) {
                $http.post(path, data).success(function (response) {
                    "undefined" != typeof response.error ? alert("请求参数错误！") : $http.post(ssDomain + "admin/studentList.json", {pageNO: page}).success(function (response) {
                        "undefined" != typeof response.error ? alert("请求参数错误！") : (Data.pages = response.rows.page, Data.students = response.rows.records, $scope.cancel())
                    })
                })
            },
//单个删除
            $scope.ok = function (id) {
                var path = ssDomain + "admin/deleteStudent.json", data = {studentId: id};
                $scope.del(path, data), $scope.cancel()
            }, $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel")
        }
    });
/*! xybbGarten 最后修改于： 2016-06-23 */