/**
 * Created by Administrator on 2016/7/18.
 */
$(function () {
    //downList($('.show-selected'));//显示选择菜单
   // downList($('.nav-name'));//显示选择菜单
  //  downList($('.school-name'));//显示选择菜单
    showSelect($('.show-list'));//点击选中
    showSelect($('.nav-list'));
    showSelect($('.school-name-list'));
    showBtn();
    cancel();
    showTip($('.send-btn .btn'));
    remberEmai();//记住邮箱
});

/*点击显示下拉菜单*/
function downList(btn, shadow) {
    btn.on('click', function () {
        var ht=$(window).height();
        if ($(this).hasClass('active')) {
            $(this).next('ul').hide();
            $(this).removeClass('active');
            $('.shadow').hide();
        }
        else {
            btn.removeClass('active').next('ul').hide();
            $(this).addClass('active').next('ul').slideDown()/*animate({'height': '12rem'})*/;
            $(this).addClass('active').next('ul').css('max-height',ht*0.7+'px');
            $('.shadow').show();
        }
    });
    $('.shadow').on('click', function () {
        btn.next('ul').hide();
        btn.removeclass('active');
        $(this).hide();
    })
}
/*显示已选中的信息*/
function showSelect(list) {
    list.on('click','a', function () {
        var txt = $(this).text();
        list.find('a').removeClass('active');
        $(this).addClass('active').parents('ul').prev().removeClass('active').text(txt);
        list.hide();
        $('.shadow').hide();
        return false;
    });
}
/*显示发送到邮箱选项*/
function showBtn() {
    $('.item-icon').on('click', function () {
        $('.wrap-shadow').show();
        $('.btn-list').animate({'bottom': '0'});
        return false;
    });
}
/*取消按钮 (发送到邮箱)*/
function cancel() {
    $('.cancel').on('tap', function () {
        $('.btn-list').animate({'bottom': '-30%'}, function () {
            $('.wrap-shadow').hide();
        });
    });
}

/*列表页点击显示在线预览页面*/
function showDetail() {
    $('.list-item-con').on('click', function () {
        $('.page-content').show();
        return false;
    });
    $('.close').on('click', function () {
        $('.page-content').hide();
    });
}

/*记住邮箱*/
function remberEmai() {
    $('.rember-email label').on('click', function () {
        if ($('#rember').prop('checked')) {
            $(this).removeClass('active');
        }
        else {
            $(this).addClass('active');
        }
    });
}

/*显示发送邮箱提示*/
function showTip(btn){
    btn.on('click',function(){
        var box=$('.show-window');
        box.show();
        var boxHeight=box.children().height();
        var winHeight=$(window).height();
        box.children().animate({'marginTop':(winHeight-boxHeight)/2+'px'});
        var sTop = $('body').scrollTop();
        $(window).on('scroll', function () {
            $(this).scrollTop(sTop);
        });
        box.on('click',function(){
            $(this).hide();
            box.children().animate({'marginTop':0},500);
        });
        /*    setTimeout(function(){
         $('.show-window').hide();
         box.children().animate({'marginTop':0});
         },2000);*/
        return false;
    })
}
function scrollShow(){
    $(window).on('scroll',function(){
        var contentH=$('.main').height();
        var  viewH = $(this).height();//可见高度
    //    var contentH = $(this).get(0).scrollHeight;//内容高度
        var scrollTop = $(this).scrollTop();//滚动高度
        if (scrollTop + viewH >= contentH)
        {
            alert(1);
        }
    });

}