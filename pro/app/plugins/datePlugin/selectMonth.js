/*写时间插件*/
function genDatePicker(classElem){$("#monthYear").remove();//移除节点
var heigth=$("#"+classElem).parent().height();$("#"+classElem).parent().append('<div id="monthYear" class="datepicker datepicker-dropdown dropdown-menu datepicker-orient-left datepicker-orient-top"><div id=\'month\' class="datepicker-days" style=\'display: block;\'><table class="table table-condensed"><thead><tr><th class="prev" style="visibility: visible;" onclick=\'javascript:goYear(1);\'>«</th><th id=\'year\' colspan=\'5\' class="datepicker-switch">'+temp+"</th><th onclick='javascript:goYear(2);' class=\"next\" style=\"visibility: visible;\">»</th></tr></thead><tbody><tr><td colspan='7'><span class='month' onclick='javascript:selectMonth(1,\""+classElem+"\");'> 一月 </span><span class='month' onclick='javascript:selectMonth(2,\""+classElem+"\");'> 二月 </span><span class='month' onclick='javascript:selectMonth(3,\""+classElem+"\");'> 三月 </span><span class='month' onclick='javascript:selectMonth(4,\""+classElem+"\");'> 四月 </span><span class='month' onclick='javascript:selectMonth(5,\""+classElem+"\");'> 五月 </span><span class='month' onclick='javascript:selectMonth(6,\""+classElem+"\");'> 六月 </span><span class='month' onclick='javascript:selectMonth(7,\""+classElem+"\");'> 七月 </span><span class='month' onclick='javascript:selectMonth(8,\""+classElem+"\");'> 八月 </span><span class='month' onclick='javascript:selectMonth(9,\""+classElem+"\");'> 九月 </span><span class='month' onclick='javascript:selectMonth(10,\""+classElem+"\");'> 十月 </span><span class='month' onclick='javascript:selectMonth(11,\""+classElem+"\");'> 十一月 </span><span class='month' onclick='javascript:selectMonth(12,\""+classElem+"\");'>十二月 </span><span class='month'></span><span class='month'></span><span class='month'></span><span class='month' onclick='javascript:cancelDateBox();'>取消</span></td></tr></tbody></table></div></div>"),$("#monthYear").css("display","block").css("top",heigth+"px").css("left","0px").css("z-index",9999)}function goYear(type){var year=$("#year").text();1==type?year--:2==type&&year++,$("#year").text(year)}function selectMonth(month,classEle){console.log(classEle);var year=$("#year").text();10>month&&(month="0"+month),console.log($("#"+classEle)),$("#"+classEle).val(year+"-"+month),$("#monthYear").css("display","none"),$("#monthYear").remove()}function cancelDateBox(){$("#monthYear").remove()}var currentDate=new Date,temp=currentDate.getFullYear();
/*! xybbGarten 最后修改于： 2016-06-21 */