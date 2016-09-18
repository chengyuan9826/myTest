var adminApp = angular.module("adminApp", ["ui.router", "ngFileUpload", "default", "class", "user", "teacher", "student", "questionType", "question", "records", "kindAttendance", "tip", "leave", "questionMark", "studentEvening", "favoriteActivity", "stars", "observe", "otherUser", "activity"]);
adminApp.directive("bsDatepicker", function () {
    return {
        restrict: "A",
        link: function ($scope, element, attr) {
            var format = $(element).attr("format");
            void 0 == format && (format = "yyyy-mm-dd");
            var datepicker1 = $(element).datepicker({format: format}).on("changeDate", function (ev) {
                var dtime = $(element).val();
                "" != dtime && ($scope[attr.ngModel] = dtime),
                 //scope.model = $(element).val();//获取时间值
                    datepicker1.hide()
            }).data("datepicker")
        }
    }
}); /*对象转成html代码*/
    adminApp.directive("page", function ($compile, $parse) {
        return {
            restrict: "E",
            link: function (scope, element, attr) {
                scope.$watch(attr.content, function () {
                    element.html($parse(attr.content)(scope)),
                        $compile(element.contents())(scope)
                }, !0)
            }
        }
    });
  adminApp.config(function ($stateProvider, $urlRouterProvider) {
       $urlRouterProvider.otherwise("/default")
  });

adminApp.controller("MainCtrl", ["$log", "$scope", "$http", "$window", function ($log, $scope, $http, $window) {
    $scope.finishLoading = function () {
        var s = document.createElement("script");
            s.src = "/app/plugins/adminLTE/js/app.js";
            document.head.appendChild(s);
    };
    var req = {url: ssDomain + "admin/profile.json", method: "GET"};
    $http(req).then(function (response) {
        var data = response.data.data;
        $scope.user = data;
        $scope.user.schoolName = response.data.orgName
    }, function (response) {
        $log.error(response.data);
        $window.location.href = "/login.html";
    });
    var req = {url: ssDomain + "admin/logout.json", method: "GET"};
    $scope.logout = function () {
        //弹出一个页面层
        layer.open({
            type: 1,
            title: "提示信息",
            shadeClose: !0,//点击遮罩关闭
            area: ["250px", "150px"],
            content: "<br/>&nbsp;&nbsp;&nbsp;&nbsp;确定要退出系统吗？",
            btn: ["确定", "取消"],
            yes: function (index, layero) {//或者使用确定
//退出登录
                $http(req).then(function (response) {
                    console.log("退出中返回的login");
                    $window.location.href = "/login.html"
                })
            },
            cancel: function (index) {//或者使用取消
                layer.close(index)
            }
        })
    };/*修改方法*/
        $scope.editUI = function (user) {
            var html = '<form name="userForm" ng-submit="doSubmit()"><div class="box-body"><input name="id" type="hidden" value="' + user.id + '"/><div class="form-group"><input name="name" type="text" value="' + user.name + '" class="form-control" placeholder="请输入姓名..." required/></div><div class="form-group"><input name="phone" type="text" value="' + user.phone + '" class="form-control" placeholder="请输入手机号..."/></div><div class="form-group"><input name="pwd" type="password" class="form-control" placeholder="输入新密码..." required/></div><div class="form-group"><input name="repwd" type="password"  class="form-control" placeholder="输入确认密码..."/></div></div></form>';
            layer.open({
                type: 1,
                title: "修改信息",
                shadeClose: !0,//点击遮罩关闭
                area: ["400px", "320px"],
                content: html,
                btn: ["确定", "取消"],
                yes: function (index, layero) {//或者使用确定
                    var id = $("input[name='id']").val(),
                        name = $("input[name='name']").val(),
                        phone = $("input[name='phone']").val(),
                        pwd = $("input[name='pwd']").val(),
                        repwd = $("input[name='repwd']").val();
                    if ("" == name)return void layer.tips("名称不能为空！", "input[name='name']");
                    if ("" == phone)return void layer.tips("手机号不能为空！", "input[name='phone']");
                    if ("" == pwd)return void layer.tips("新密码不能为空！", "input[name='pwd']");
                    if ("" == repwd)return void layer.tips("确认密码不能为空！", "input[name='repwd']");
                    if (pwd != repwd)return void layer.tips("两次输入的密码不相同！", "input[name='repwd']");
                    var req = {
                        method: "POST",
                        url: ssDomain + "admin/modifyInfo",
                        data: {id: id, name: name, phone: phone, password: pwd}
                    };
                    $http(req).then(function (response) {
                        layer.closeAll();
                        layer.alert("下次登录生效！", {icon: 6});
                    })
                }, cancel: function (index) {//或者使用取消
                    layer.closeAll()
                }
            })
        }
}]);
adminApp.controller("menuCtrl", ["$scope", "$state", function ($scope, $state) {
    $scope.goClassPage = function () {
        $state.go("class")
    };
    $scope.goRecordsPage = function () {
        $state.go("checkRecords")
    };
    $scope.goLeavePage = function () {
        $state.go("leave")
    };
    $scope.goStudentEveningPage = function () {
        $state.go("studentEvening")
    };
    $scope.goFavoriteActivityPage = function () {
        $state.go("favoriteActivityCheckRecords")
    };
    $scope.goStarsPage = function () {
        $state.go("stars")
    };
    $scope.goQuestionMarkPage = function () {
        $state.go("questionMark")
    };
    $scope.goObservePage = function () {
        $state.go("observe")
    }
}]);
adminApp.run(["userService", "$log", "$window", "$http", function (userService, $log, $window, $httpProvider) {
    userService.userLoggedIn() || (console.log("未登录中返回login"), $window.location.href = "/login.html"), $httpProvider.defaults.withCredentials = !0
}]);
/*! xybbGarten 最后修改于： 2016-06-21 */