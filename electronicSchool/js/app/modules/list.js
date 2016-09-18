/**
 * Created by Administrator on 2016/8/17.
 */
var paper=angular.module('paper',[]);

paper.controller('list',function($scope,$http){
    /*某省的学校*/
    var provinceId=1;
    $http({method:"post",url:"json/school.json",data:{provinceID:provinceId}}).success(
        function(data){
            $scope.schoolDetail=data;
        }
    ).error(function(){alert('error');});

    /*某学部的年级*/
    var levelId=1;
    $http({method:"post",url:"json/grade.json",data:{levelID:levelId}}).success(
        function(data){
            $scope.grade=data;
        }
    ).error(function(){alert('error');});

    /*学科*/
    $http({method:"post",url:"json/subject.json"}).success(
        function(data){
            $scope.subject=data;
        }
    ).error(function(){alert('error');});

    /*试卷*/
    $http({method:"post",url:"json/exam.json"}).success(
        function(data){
            $scope.exam=data;
        }
    ).error(function(){alert('error');});
});
