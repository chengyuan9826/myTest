/**
 * Created by Administrator on 2016/8/16.
 */
var app = angular.module('app', []);
app.service('level', function ($http,$q) {
    var deferred=$q.defer();
    function level(){
        $http({method: 'get', url: 'http://localhost:90/electronicSchool/level.php'}).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }
    return {level:level};
});
app.service('province',function($http,$q){
    var deferred=$q.defer();
    function province(){
        $http({method: 'get', url: 'http://localhost:90/electronicSchool/province.php'}).success(function (data) {
            deferred.resolve(data);
        }).error(function () {
            alert('error');
        });
        return deferred.promise;
    }
    return{ pro:province}
});
app.service('school',function($http,$q,$rootScope){
    var deferred=$q.defer();
    function school(){
        $http.post('http://localhost:90/electronicSchool/school.php', {level: 2, provinceId:$rootScope.provinceId}).success(function (data) {
            deferred.resolve(data);
        }).error(function () {
            alert('error');
        });
        return deferred.promise;
    }
    return {school:school};
});

app.service('select',function($rootScope,$scope,school){
    function downList(btn) {
        btn.on('click', function () {
            var ht=$(window).height();
            if ($(this).hasClass('active')) {
                $(this).next('ul').hide();
                $(this).removeClass('active');
                $('.shadow').hide();
            }
            else {
                btn.removeClass('active').next('ul').hide();
                $(this).addClass('active').next('ul').slideDown();
                $(this).addClass('active').next('ul').css('max-height',ht*0.7+'px');
                $('.shadow').show();
            }
        });
        $('.shadow').on('click', function () {
            btn.next('ul').hide();
            btn.removeClass('active');
            $(this).hide();
        })
    }
    function showSelect(list) {
        list.on('click','a', function () {
            var txt = $(this).text();
            list.find('a').removeClass('active');
            $(this).addClass('active').parents('ul').prev().removeClass('active').text(txt);
            $rootScope.provinceId=$(this).data('provinceId');
          school.school().promiseSchool.then(function(data){
                $scope.schoolDetail = data;
            });
            list.hide();
            $('.shadow').hide();
            return false;
        });
    }
    return{downList:downList,selectItem:showSelect}
});
app.controller('main', function ($scope, $http,$rootScope, level,province,school,select) {
    $rootScope.provinceId=0;
    var promiseLevel=level.level();
    promiseLevel.then(function(data){
        $scope.gradeName = data;
    });

    var promiseProvince=province.pro();
    promiseProvince.then(function(data){
        $scope.province = data;
    });

    var promiseSchool=school.school();
    promiseSchool.then(function(data){
        $scope.schoolDetail = data;
    });

    select.downList($('.nav-name'));
    select.selectItem($('.nav-list'));
});

