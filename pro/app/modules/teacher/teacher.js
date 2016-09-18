
var classModule = angular.module("teacher", ["ui.router", "ui.bootstrap"]);
classModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("teacher", {url: "/teacher", templateUrl: "/app/modules/teacher/teacher_list.html"})
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
        return {pages: "", teachers: ""}
    }), classModule.controller("teacherCtrl", ["$scope", "$http", "$filter", "$state", "$uibModal", "Data", function ($scope, $http, $filter, $state, $uibModal, Data) {
    $scope.msg = "删除后数据不可恢复，确定删除吗？", $scope.isShowOK = !0,//是否显示确认按钮
        $scope.mode = "0",//mode = 0添加 mode=1修改操作
        $scope.currentPage = "1", $scope.data = Data, $("#teacherNameInput").keydown(function (e) {
        var curKey = e.which;
        return 13 == curKey ? ($scope.query(), !1) : void 0
    }), $scope.list = function (params) {/*获取列表*/
        $http.post(ssDomain + "admin/teacherList.json", params).success(function (response) {
            "undefined" != typeof response.error ? alert("请求参数错误！") : (Data.pages = response.rows.page, Data.teachers = response.rows.records)
        }).error(function (data, status, headers, config) {
            400 == status && layer.alert(data.message, {icon: 0})
        })
    }, /*获取列表*/
        $scope.list({pageNO: "1"}), /*查询*/
        $scope.query = function () {
            var name = $scope.queryCondition;
            void 0 != name && "" != name || (name = null);
            var params = {pageNO: "1", teacherName: name};
            $scope.list(params)
        }, /*下一页操作*/
        $scope.nextPage = function (page) {
            $scope.currentPage = page, $scope.list({pageNO: page, teacherName: $scope.queryCondition})
        }, /*上一页操作*/
        $scope.prePage = function (page) {
            $scope.currentPage = page, $scope.list({pageNO: page, teacherName: $scope.queryCondition})
        }, /*页面指哪打哪*/
        $scope.goPage = function (page) {
            $scope.currentPage = page, $scope.list({pageNO: page, teacherName: $scope.queryCondition})
        }, /*刷新操作*/
        $scope.reload = function () {
            $scope.list({pageNO: "1"})
        }, /*表单操作*/
        $scope.addUI = function () {
            $scope.mode = "0", teacher = {sex: "女", role: "主班教师"};
            $uibModal.open({
                templateUrl: "teacher_edit.html",
                controller: "TeacherOperatorCtrl",
                size: "sm",
                resolve: {
                    teacher: function () {
                        return JSON.parse(JSON.stringify(teacher))
                    }, mode: function () {
                        return $scope.mode
                    }, page: function () {
                        return $scope.currentPage
                    }
                }
            })
        }, $scope.editUI = function (teacher) {
        $scope.mode = "1";
        $uibModal.open({
            templateUrl: "teacher_edit.html",
            controller: "TeacherOperatorCtrl",
            size: "sm",
            resolve: {
                teacher: function () {
                    return JSON.parse(JSON.stringify(teacher))
                }, mode: function () {
                    return $scope.mode
                }, page: function () {
                    return $scope.currentPage
                }
            }
        })
    },
//删除操作
        $scope.remove = function (teacher) {
            $scope.msg = "删除后数据不可恢复，确定删除吗？", $scope.isShowOK = !0;
//打开提示框
            $uibModal.open({
                templateUrl: "teacher_message.html",
                controller: "TeacherMsgCtrl",
                size: "sm",
                resolve: {
                    id: function () {
                        return teacher.id
                    }, msg: function () {
                        return $scope.msg
                    }, isShowOK: function () {
                        return $scope.isShowOK
                    }, list: function () {
                        return Data.teachers
                    }, page: function () {
                        return $scope.currentPage
                    }
                }
            });
//选中
            teacher.checked = !0, teacher.info = "info"
        },
//删除选中
        $scope.removeChecked = function () {
            var list = Data.teachers, results = $filter("filter")(list, {checked: !0}, !0);
            0 == results.length ? ($scope.msg = "没有一条记录，请选择需要删除的记录！", $scope.isShowOK = !1) : ($scope.msg = "删除后不可恢复，您确定删除这" + results.length + "条记录吗？", $scope.isShowOK = !0);
//打开提示框
            $uibModal.open({
                templateUrl: "teacher_message.html",
                controller: "TeacherMsgCtrl",
                size: "sm",
                resolve: {
                    id: function () {
                        return ""
                    }, msg: function () {
                        return $scope.msg
                    }, isShowOK: function () {
                        return $scope.isShowOK
                    }, list: function () {
                        return list
                    }, page: function () {
                        return $scope.currentPage
                    }
                }
            })
        }
}]),
//班级修改模态框控制器
    classModule.controller("TeacherOperatorCtrl", ["$http", "$scope", "$uibModalInstance", "teacher", "mode", "page", "Data", function ($http, $scope, $uibModalInstance, teacher, mode, page, Data) {
        $scope.teacher = teacher, $scope.mode = mode, $scope.doSubmit = function () {
            var obj = $scope.teacher, classId = $("#classId").val(), birthday = $("#datepicker").val(), workDate = $("#workDate").val();
            if (workDate.split("-").length < 3 && (workDate += "-01"), "0" == $scope.mode) {//添加操作
                var path = ssDomain + "admin/addTeacher.json", data = {
                    teacherName: obj.name,
                    teacherSex: obj.sex,
                    taecherRole: obj.role,
                    classId: classId,
                    phone: obj.phone,
                    remark: obj.remark,
                    birthday: birthday,
                    workDate: workDate
                };//获取表单数据
                $scope.submit(path, data)
            } else if ("1" == $scope.mode) {//修改操作
                "" == classId && (classId = obj.classId);
                var path = ssDomain + "admin/modifyTeacher.json", data = {
                    teacherId: obj.id,
                    teacherName: obj.name,
                    teacherSex: obj.sex,
                    teacherRole: obj.role,
                    classId: classId,
                    phone: obj.phone,
                    remark: obj.remark,
                    birthday: birthday,
                    workDate: workDate
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
                        $http.post(ssDomain + "admin/teacherList.json", {pageNO: page}).success(function (response) {
                            "undefined" != typeof response.error ? alert("请求参数错误！") : (Data.pages = response.rows.page, Data.teachers = response.rows.records, $scope.cancel())
                        })
                }).error(function (data, status, headers, config) {
                    400 == status && alert(data.message)
                })
            }, /**
         * 加载班级
         */
            $scope.loadClass = function () {
                var className = "";
                "0" == $scope.mode ?//添加操作
                    className = $("#className").val() : "1" == $scope.mode && (//添加操作)
                    className = $scope.teacher.className), /*读取班级*/
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
    classModule.controller("TeacherMsgCtrl", function ($http, $scope, $uibModalInstance, msg, isShowOK, list, page, Data, id) {
        $scope.msg = msg, $scope.isShowOK = isShowOK, $scope.id = id,
//删除方法
            $scope.del = function (path, data) {
                $http.post(path, data).success(function (response) {
                    "undefined" != typeof response.error ? alert("请求参数错误！") : $http.post(ssDomain + "admin/teacherList.json", {pageNO: page}).success(function (response) {
                        "undefined" != typeof response.error ? alert("请求参数错误！") : (Data.pages = response.rows.page, Data.teachers = response.rows.records, $scope.cancel())
                    })
                })
            },
//单个删除
            $scope.ok = function (id) {
                var pwd = $scope.pwd;
                null == pwd || void 0 == pwd ? layer.alert("输入密码不能为空！", {icon: 0}) : $http.post(ssDomain + "admin/checkPassword.json", {password: pwd}).success(function (response) {
                    if ("undefined" != typeof response.error)layer.alert("参数错误！", {icon: 0}); else if (response.status) {
                        var path = ssDomain + "admin/deleteTeacher.json", data = {teacherIds: id};
                        $scope.del(path, data), $scope.cancel()
                    } else layer.alert("输入密码不正确！", {icon: 0})
                })
            }, $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel")
        }
    });
/*! xybbGarten 最后修改于： 2016-06-23 */