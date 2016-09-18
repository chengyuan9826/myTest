/*!
 * iCheck v1.0.2
 * ===================================
 * Powerful jQuery and Zepto plugin for checkboxes and radio buttons customization
 *
 */
!function($){
// Do something with inputs
function operate(input,direct,method){var node=input[0],state=/er/.test(method)?_indeterminate:/bl/.test(method)?_disabled:_checked,active=method==_update?{checked:node[_checked],disabled:node[_disabled],indeterminate:"true"==input.attr(_indeterminate)||"false"==input.attr(_determinate)}:node[state];
// Check, disable or indeterminate
if(/^(ch|di|in)/.test(method)&&!active)on(input,state);else if(/^(un|en|de)/.test(method)&&active)off(input,state);else if(method==_update)
// Handle states
for(var each in active)active[each]?on(input,each,!0):off(input,each,!0);else direct&&"toggle"!=method||(
// Helper or label was clicked
direct||input[_callback]("ifClicked"),
// Toggle checked state
active?node[_type]!==_radio&&off(input,state):on(input,state))}
// Add checked, disabled or indeterminate state
function on(input,state,keep){var node=input[0],parent=input.parent(),checked=state==_checked,indeterminate=state==_indeterminate,disabled=state==_disabled,callback=indeterminate?_determinate:checked?_unchecked:"enabled",regular=option(input,callback+capitalize(node[_type])),specific=option(input,state+capitalize(node[_type]));
// Prevent unnecessary actions
if(node[state]!==!0){
// Toggle assigned radio buttons
if(!keep&&state==_checked&&node[_type]==_radio&&node.name){var form=input.closest("form"),inputs='input[name="'+node.name+'"]';inputs=form.length?form.find(inputs):$(inputs),inputs.each(function(){this!==node&&$(this).data(_iCheck)&&off($(this),state)})}
// Indeterminate state
indeterminate?(
// Add indeterminate state
node[state]=!0,
// Remove checked state
node[_checked]&&off(input,_checked,"force")):(
// Add checked or disabled state
keep||(node[state]=!0),
// Remove indeterminate state
checked&&node[_indeterminate]&&off(input,_indeterminate,!1)),
// Trigger callbacks
callbacks(input,checked,state,keep)}
// Add proper cursor
node[_disabled]&&option(input,_cursor,!0)&&parent.find("."+_iCheckHelper).css(_cursor,"default"),
// Add state class
parent[_add](specific||option(input,state)||""),
// Set ARIA attribute
parent.attr("role")&&!indeterminate&&parent.attr("aria-"+(disabled?_disabled:_checked),"true"),
// Remove regular state class
parent[_remove](regular||option(input,callback)||"")}
// Remove checked, disabled or indeterminate state
function off(input,state,keep){var node=input[0],parent=input.parent(),checked=state==_checked,indeterminate=state==_indeterminate,disabled=state==_disabled,callback=indeterminate?_determinate:checked?_unchecked:"enabled",regular=option(input,callback+capitalize(node[_type])),specific=option(input,state+capitalize(node[_type]));
// Prevent unnecessary actions
node[state]!==!1&&(
// Toggle state
!indeterminate&&keep&&"force"!=keep||(node[state]=!1),
// Trigger callbacks
callbacks(input,checked,callback,keep)),
// Add proper cursor
!node[_disabled]&&option(input,_cursor,!0)&&parent.find("."+_iCheckHelper).css(_cursor,"pointer"),
// Remove state class
parent[_remove](specific||option(input,state)||""),
// Set ARIA attribute
parent.attr("role")&&!indeterminate&&parent.attr("aria-"+(disabled?_disabled:_checked),"false"),
// Add regular state class
parent[_add](regular||option(input,callback)||"")}
// Remove all traces
function tidy(input,callback){input.data(_iCheck)&&(
// Remove everything except input
input.parent().html(input.attr("style",input.data(_iCheck).s||"")),
// Callback
callback&&input[_callback](callback),
// Unbind events
input.off(".i").unwrap(),$(_label+'[for="'+input[0].id+'"]').add(input.closest(_label)).off(".i"))}
// Get some option
function option(input,state,regular){return input.data(_iCheck)?input.data(_iCheck).o[state+(regular?"":"Class")]:void 0}
// Capitalize some string
function capitalize(string){return string.charAt(0).toUpperCase()+string.slice(1)}
// Executable handlers
function callbacks(input,checked,callback,keep){keep||(checked&&input[_callback]("ifToggled"),input[_callback]("ifChanged")[_callback]("if"+capitalize(callback)))}
// Cached vars
var _iCheck="iCheck",_iCheckHelper=_iCheck+"-helper",_checkbox="checkbox",_radio="radio",_checked="checked",_unchecked="un"+_checked,_disabled="disabled",_determinate="determinate",_indeterminate="in"+_determinate,_update="update",_type="type",_click="click",_touch="touchbegin.i touchend.i",_add="addClass",_remove="removeClass",_callback="trigger",_label="label",_cursor="cursor",_mobile=/ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);
// Plugin init
$.fn[_iCheck]=function(options,fire){
// Walker
var handle='input[type="'+_checkbox+'"], input[type="'+_radio+'"]',stack=$(),walker=function(object){object.each(function(){var self=$(this);stack=self.is(handle)?stack.add(self):stack.add(self.find(handle))})};
// Check if we should operate with some method
if(/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(options))
// Normalize method's name
// Find checkboxes and radio buttons
return options=options.toLowerCase(),walker(this),stack.each(function(){var self=$(this);"destroy"==options?tidy(self,"ifDestroyed"):operate(self,!0,options),$.isFunction(fire)&&fire()});if("object"!=typeof options&&options)return this;
// Check if any options were passed
var settings=$.extend({checkedClass:_checked,disabledClass:_disabled,indeterminateClass:_indeterminate,labelHover:!0},options),selector=settings.handle,hoverClass=settings.hoverClass||"hover",focusClass=settings.focusClass||"focus",activeClass=settings.activeClass||"active",labelHover=!!settings.labelHover,labelHoverClass=settings.labelHoverClass||"hover",
// Setup clickable area
area=0|(""+settings.increaseArea).replace("%","");
// Selector limit
// Clickable area limit
// Walk around the selector
return selector!=_checkbox&&selector!=_radio||(handle='input[type="'+selector+'"]'),-50>area&&(area=-50),walker(this),stack.each(function(){var self=$(this);
// If already customized
tidy(self);var helper,node=this,id=node.id,
// Layer styles
offset=-area+"%",size=100+2*area+"%",layer={position:"absolute",top:offset,left:offset,display:"block",width:size,height:size,margin:0,padding:0,background:"#fff",border:0,opacity:0},
// Choose how to hide input
hide=_mobile?{position:"absolute",visibility:"hidden"}:area?layer:{position:"absolute",opacity:0},
// Get proper class
className=node[_type]==_checkbox?settings.checkboxClass||"i"+_checkbox:settings.radioClass||"i"+_radio,
// Find assigned labels
label=$(_label+'[for="'+id+'"]').add(self.closest(_label)),
// Check ARIA option
aria=!!settings.aria,
// Set ARIA placeholder
ariaID=_iCheck+"-"+Math.random().toString(36).substr(2,6),
// Parent & helper
parent='<div class="'+className+'" '+(aria?'role="'+node[_type]+'" ':"");
// Set ARIA "labelledby"
aria&&label.each(function(){parent+='aria-labelledby="',this.id?parent+=this.id:(this.id=ariaID,parent+=ariaID),parent+='"'}),parent=self.wrap(parent+"/>")[_callback]("ifCreated").parent().append(settings.insert),helper=$('<ins class="'+_iCheckHelper+'"/>').css(layer).appendTo(parent),self.data(_iCheck,{o:settings,s:self.attr("style")}).css(hide),!!settings.inheritClass&&parent[_add](node.className||""),!!settings.inheritID&&id&&parent.attr("id",_iCheck+"-"+id),"static"==parent.css("position")&&parent.css("position","relative"),operate(self,!0,_update),label.length&&label.on(_click+".i mouseover.i mouseout.i "+_touch,function(event){var type=event[_type],item=$(this);if(!node[_disabled]){if(type==_click){if($(event.target).is("a"))return;operate(self,!1,!0)}else labelHover&&(/ut|nd/.test(type)?(parent[_remove](hoverClass),item[_remove](labelHoverClass)):(parent[_add](hoverClass),item[_add](labelHoverClass)));if(!_mobile)return!1;event.stopPropagation()}}),self.on(_click+".i focus.i blur.i keyup.i keydown.i keypress.i",function(event){var type=event[_type],key=event.keyCode;return type==_click?!1:"keydown"==type&&32==key?(node[_type]==_radio&&node[_checked]||(node[_checked]?off(self,_checked):on(self,_checked)),!1):void("keyup"==type&&node[_type]==_radio?!node[_checked]&&on(self,_checked):/us|ur/.test(type)&&parent["blur"==type?_remove:_add](focusClass))}),helper.on(_click+" mousedown mouseup mouseover mouseout "+_touch,function(event){var type=event[_type],toggle=/wn|up/.test(type)?activeClass:hoverClass;if(!node[_disabled]){if(type==_click?operate(self,!1,!0):(/wn|er|in/.test(type)?parent[_add](toggle):parent[_remove](toggle+" "+activeClass),label.length&&labelHover&&toggle==hoverClass&&label[/ut|nd/.test(type)?_remove:_add](labelHoverClass)),!_mobile)return!1;event.stopPropagation()}})})}}(window.jQuery||window.Zepto);
/*! xybbGarten 最后修改于： 2016-06-21 */