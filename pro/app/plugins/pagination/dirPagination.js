/**
 * dirPagination - AngularJS module for paginating (almost) anything.
 *
 *
 * Credits
 * =======
 *
 * Daniel Tabuenca: https://groups.google.com/d/msg/angular/an9QpzqIYiM/r8v-3W1X5vcJ
 * for the idea on how to dynamically invoke the ng-repeat directive.
 *
 * I borrowed a couple of lines and a few attribute names from the AngularUI Bootstrap project:
 * https://github.com/angular-ui/bootstrap/blob/master/src/pagination/pagination.js
 *
 * Copyright 2014 Michael Bromley <michael@michaelbromley.co.uk>
 */
!function(){function dirPaginateDirective($compile,$parse,paginationService){function dirPaginationCompileFn(tElement,tAttrs){var expression=tAttrs.dirPaginate,match=expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),filterPattern=/\|\s*itemsPerPage\s*:\s*(.*\(\s*\w*\)|([^\)]*?(?=\s+as\s+))|[^\)]*)/;if(null===match[2].match(filterPattern))throw"pagination directive: the 'itemsPerPage' filter must be set.";var itemsPerPageFilterRemoved=match[2].replace(filterPattern,""),collectionGetter=$parse(itemsPerPageFilterRemoved);addNoCompileAttributes(tElement);
// If any value is specified for paginationId, we register the un-evaluated expression at this stage for the benefit of any
// dir-pagination-controls directives that may be looking for this ID.
var rawId=tAttrs.paginationId||DEFAULT_ID;return paginationService.registerInstance(rawId),function(scope,element,attrs){
// Now that we have access to the `scope` we can interpolate any expression given in the paginationId attribute and
// potentially register a new ID if it evaluates to a different value than the rawId.
var paginationId=$parse(attrs.paginationId)(scope)||attrs.paginationId||DEFAULT_ID;
// (TODO: this seems sound, but I'm reverting as many bug reports followed it's introduction in 0.11.0.
// Needs more investigation.)
// In case rawId != paginationId we deregister using rawId for the sake of general cleanliness
// before registering using paginationId
// paginationService.deregisterInstance(rawId);
paginationService.registerInstance(paginationId);var repeatExpression=getRepeatExpression(expression,paginationId);addNgRepeatToElement(element,attrs,repeatExpression),removeTemporaryAttributes(element);var compiled=$compile(element),currentPageGetter=makeCurrentPageGetterFn(scope,attrs,paginationId);paginationService.setCurrentPageParser(paginationId,currentPageGetter,scope),"undefined"!=typeof attrs.totalItems?(paginationService.setAsyncModeTrue(paginationId),scope.$watch(function(){return $parse(attrs.totalItems)(scope)},function(result){result>=0&&paginationService.setCollectionLength(paginationId,result)})):(paginationService.setAsyncModeFalse(paginationId),scope.$watchCollection(function(){return collectionGetter(scope)},function(collection){if(collection){var collectionLength=collection instanceof Array?collection.length:Object.keys(collection).length;paginationService.setCollectionLength(paginationId,collectionLength)}})),
// Delegate to the link function returned by the new compilation of the ng-repeat
compiled(scope)}}/**
         * If a pagination id has been specified, we need to check that it is present as the second argument passed to
         * the itemsPerPage filter. If it is not there, we add it and return the modified expression.
         *
         * @param expression
         * @param paginationId
         * @returns {*}
         */
function getRepeatExpression(expression,paginationId){var repeatExpression,idDefinedInFilter=!!expression.match(/(\|\s*itemsPerPage\s*:[^|]*:[^|]*)/);return repeatExpression=paginationId===DEFAULT_ID||idDefinedInFilter?expression:expression.replace(/(\|\s*itemsPerPage\s*:\s*[^|\s]*)/,"$1 : '"+paginationId+"'")}/**
         * Adds the ng-repeat directive to the element. In the case of multi-element (-start, -end) it adds the
         * appropriate multi-element ng-repeat to the first and last element in the range.
         * @param element
         * @param attrs
         * @param repeatExpression
         */
function addNgRepeatToElement(element,attrs,repeatExpression){element[0].hasAttribute("dir-paginate-start")||element[0].hasAttribute("data-dir-paginate-start")?(
// using multiElement mode (dir-paginate-start, dir-paginate-end)
attrs.$set("ngRepeatStart",repeatExpression),element.eq(element.length-1).attr("ng-repeat-end",!0)):attrs.$set("ngRepeat",repeatExpression)}/**
         * Adds the dir-paginate-no-compile directive to each element in the tElement range.
         * @param tElement
         */
function addNoCompileAttributes(tElement){angular.forEach(tElement,function(el){1===el.nodeType&&angular.element(el).attr("dir-paginate-no-compile",!0)})}/**
         * Removes the variations on dir-paginate (data-, -start, -end) and the dir-paginate-no-compile directives.
         * @param element
         */
function removeTemporaryAttributes(element){angular.forEach(element,function(el){1===el.nodeType&&angular.element(el).removeAttr("dir-paginate-no-compile")}),element.eq(0).removeAttr("dir-paginate-start").removeAttr("dir-paginate").removeAttr("data-dir-paginate-start").removeAttr("data-dir-paginate"),element.eq(element.length-1).removeAttr("dir-paginate-end").removeAttr("data-dir-paginate-end")}/**
         * Creates a getter function for the current-page attribute, using the expression provided or a default value if
         * no current-page expression was specified.
         *
         * @param scope
         * @param attrs
         * @param paginationId
         * @returns {*}
         */
function makeCurrentPageGetterFn(scope,attrs,paginationId){var currentPageGetter;if(attrs.currentPage)currentPageGetter=$parse(attrs.currentPage);else{
// If the current-page attribute was not set, we'll make our own.
// Replace any non-alphanumeric characters which might confuse
// the $parse service and give unexpected results.
// See https://github.com/michaelbromley/angularUtils/issues/233
var defaultCurrentPage=(paginationId+"__currentPage").replace(/\W/g,"_");scope[defaultCurrentPage]=1,currentPageGetter=$parse(defaultCurrentPage)}return currentPageGetter}return{terminal:!0,multiElement:!0,priority:100,compile:dirPaginationCompileFn}}/**
     * This is a helper directive that allows correct compilation when in multi-element mode (ie dir-paginate-start, dir-paginate-end).
     * It is dynamically added to all elements in the dir-paginate compile function, and it prevents further compilation of
     * any inner directives. It is then removed in the link function, and all inner directives are then manually compiled.
     */
function noCompileDirective(){return{priority:5e3,terminal:!0}}function dirPaginationControlsTemplateInstaller($templateCache){$templateCache.put("angularUtils.directives.dirPagination.template",'<ul class="pagination" ng-if="1 < pages.length || !autoHide"><li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(1)">&laquo;</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a></li><li ng-repeat="pageNumber in pages track by tracker(pageNumber, $index)" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' || ( ! autoHide && pages.length === 1 ) }"><a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a></li><li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.last)">&raquo;</a></li></ul>')}function dirPaginationControlsDirective(paginationService,paginationTemplate){function dirPaginationControlsLinkFn(scope,element,attrs){function goToPage(num){if(paginationService.isRegistered(paginationId)&&isValidPageNumber(num)){var oldPageNumber=scope.pagination.current;scope.pages=generatePagesArray(num,paginationService.getCollectionLength(paginationId),paginationService.getItemsPerPage(paginationId),paginationRange),scope.pagination.current=num,updateRangeValues(),
// if a callback has been set, then call it with the page number as the first argument
// and the previous page number as a second argument
scope.onPageChange&&scope.onPageChange({newPageNumber:num,oldPageNumber:oldPageNumber})}}function generatePagination(){if(paginationService.isRegistered(paginationId)){var page=parseInt(paginationService.getCurrentPage(paginationId))||1;scope.pages=generatePagesArray(page,paginationService.getCollectionLength(paginationId),paginationService.getItemsPerPage(paginationId),paginationRange),scope.pagination.current=page,scope.pagination.last=scope.pages[scope.pages.length-1],scope.pagination.last<scope.pagination.current?scope.setCurrent(scope.pagination.last):updateRangeValues()}}/**
             * This function updates the values (lower, upper, total) of the `scope.range` object, which can be used in the pagination
             * template to display the current page range, e.g. "showing 21 - 40 of 144 results";
             */
function updateRangeValues(){if(paginationService.isRegistered(paginationId)){var currentPage=paginationService.getCurrentPage(paginationId),itemsPerPage=paginationService.getItemsPerPage(paginationId),totalItems=paginationService.getCollectionLength(paginationId);scope.range.lower=(currentPage-1)*itemsPerPage+1,scope.range.upper=Math.min(currentPage*itemsPerPage,totalItems),scope.range.total=totalItems}}function isValidPageNumber(num){return numberRegex.test(num)&&num>0&&num<=scope.pagination.last}
// rawId is the un-interpolated value of the pagination-id attribute. This is only important when the corresponding dir-paginate directive has
// not yet been linked (e.g. if it is inside an ng-if block), and in that case it prevents this controls directive from assuming that there is
// no corresponding dir-paginate directive and wrongly throwing an exception.
var rawId=attrs.paginationId||DEFAULT_ID,paginationId=scope.paginationId||attrs.paginationId||DEFAULT_ID;if(!paginationService.isRegistered(paginationId)&&!paginationService.isRegistered(rawId)){var idMessage=paginationId!==DEFAULT_ID?" (id: "+paginationId+") ":" ";window.console&&console.warn("Pagination directive: the pagination controls"+idMessage+"cannot be used without the corresponding pagination directive, which was not found at link time.")}scope.maxSize||(scope.maxSize=9),scope.autoHide=void 0===scope.autoHide?!0:scope.autoHide,scope.directionLinks=angular.isDefined(attrs.directionLinks)?scope.$parent.$eval(attrs.directionLinks):!0,scope.boundaryLinks=angular.isDefined(attrs.boundaryLinks)?scope.$parent.$eval(attrs.boundaryLinks):!1;var paginationRange=Math.max(scope.maxSize,5);scope.pages=[],scope.pagination={last:1,current:1},scope.range={lower:1,upper:1,total:1},scope.$watch("maxSize",function(val){val&&(paginationRange=Math.max(scope.maxSize,5),generatePagination())}),scope.$watch(function(){return paginationService.isRegistered(paginationId)?(paginationService.getCollectionLength(paginationId)+1)*paginationService.getItemsPerPage(paginationId):void 0},function(length){length>0&&generatePagination()}),scope.$watch(function(){return paginationService.isRegistered(paginationId)?paginationService.getItemsPerPage(paginationId):void 0},function(current,previous){current!=previous&&"undefined"!=typeof previous&&goToPage(scope.pagination.current)}),scope.$watch(function(){return paginationService.isRegistered(paginationId)?paginationService.getCurrentPage(paginationId):void 0},function(currentPage,previousPage){currentPage!=previousPage&&goToPage(currentPage)}),scope.setCurrent=function(num){paginationService.isRegistered(paginationId)&&isValidPageNumber(num)&&(num=parseInt(num,10),paginationService.setCurrentPage(paginationId,num))},/**
             * Custom "track by" function which allows for duplicate "..." entries on long lists,
             * yet fixes the problem of wrongly-highlighted links which happens when using
             * "track by $index" - see https://github.com/michaelbromley/angularUtils/issues/153
             * @param id
             * @param index
             * @returns {string}
             */
scope.tracker=function(id,index){return id+"_"+index}}/**
         * Generate an array of page numbers (or the '...' string) which is used in an ng-repeat to generate the
         * links used in pagination
         *
         * @param currentPage
         * @param rowsPerPage
         * @param paginationRange
         * @param collectionLength
         * @returns {Array}
         */
function generatePagesArray(currentPage,collectionLength,rowsPerPage,paginationRange){var position,pages=[],totalPages=Math.ceil(collectionLength/rowsPerPage),halfWay=Math.ceil(paginationRange/2);position=halfWay>=currentPage?"start":currentPage>totalPages-halfWay?"end":"middle";for(var ellipsesNeeded=totalPages>paginationRange,i=1;totalPages>=i&&paginationRange>=i;){var pageNumber=calculatePageNumber(i,currentPage,paginationRange,totalPages),openingEllipsesNeeded=2===i&&("middle"===position||"end"===position),closingEllipsesNeeded=i===paginationRange-1&&("middle"===position||"start"===position);ellipsesNeeded&&(openingEllipsesNeeded||closingEllipsesNeeded)?pages.push("..."):pages.push(pageNumber),i++}return pages}/**
         * Given the position in the sequence of pagination links [i], figure out what page number corresponds to that position.
         *
         * @param i
         * @param currentPage
         * @param paginationRange
         * @param totalPages
         * @returns {*}
         */
function calculatePageNumber(i,currentPage,paginationRange,totalPages){var halfWay=Math.ceil(paginationRange/2);return i===paginationRange?totalPages:1===i?i:totalPages>paginationRange?currentPage>totalPages-halfWay?totalPages-paginationRange+i:currentPage>halfWay?currentPage-halfWay+i:i:i}var numberRegex=/^\d+$/,DDO={restrict:"AE",scope:{maxSize:"=?",onPageChange:"&?",paginationId:"=?",autoHide:"=?"},link:dirPaginationControlsLinkFn},templateString=paginationTemplate.getString();return void 0!==templateString?DDO.template=templateString:DDO.templateUrl=function(elem,attrs){return attrs.templateUrl||paginationTemplate.getPath()},DDO}/**
     * This filter slices the collection into pages based on the current page number and number of items per page.
     * @param paginationService
     * @returns {Function}
     */
function itemsPerPageFilter(paginationService){return function(collection,itemsPerPage,paginationId){if("undefined"==typeof paginationId&&(paginationId=DEFAULT_ID),!paginationService.isRegistered(paginationId))throw"pagination directive: the itemsPerPage id argument (id: "+paginationId+") does not match a registered pagination-id.";var end,start;if(angular.isObject(collection)){if(itemsPerPage=parseInt(itemsPerPage)||9999999999,start=paginationService.isAsyncMode(paginationId)?0:(paginationService.getCurrentPage(paginationId)-1)*itemsPerPage,end=start+itemsPerPage,paginationService.setItemsPerPage(paginationId,itemsPerPage),collection instanceof Array)
// the array just needs to be sliced
return collection.slice(start,end);
// in the case of an object, we need to get an array of keys, slice that, then map back to
// the original object.
var slicedObject={};return angular.forEach(keys(collection).slice(start,end),function(key){slicedObject[key]=collection[key]}),slicedObject}return collection}}/**
     * Shim for the Object.keys() method which does not exist in IE < 9
     * @param obj
     * @returns {Array}
     */
function keys(obj){if(Object.keys)return Object.keys(obj);var objKeys=[];for(var i in obj)obj.hasOwnProperty(i)&&objKeys.push(i);return objKeys}/**
     * This service allows the various parts of the module to communicate and stay in sync.
     */
function paginationService(){var lastRegisteredInstance,instances={};this.registerInstance=function(instanceId){"undefined"==typeof instances[instanceId]&&(instances[instanceId]={asyncMode:!1},lastRegisteredInstance=instanceId)},this.deregisterInstance=function(instanceId){delete instances[instanceId]},this.isRegistered=function(instanceId){return"undefined"!=typeof instances[instanceId]},this.getLastInstanceId=function(){return lastRegisteredInstance},this.setCurrentPageParser=function(instanceId,val,scope){instances[instanceId].currentPageParser=val,instances[instanceId].context=scope},this.setCurrentPage=function(instanceId,val){instances[instanceId].currentPageParser.assign(instances[instanceId].context,val)},this.getCurrentPage=function(instanceId){var parser=instances[instanceId].currentPageParser;return parser?parser(instances[instanceId].context):1},this.setItemsPerPage=function(instanceId,val){instances[instanceId].itemsPerPage=val},this.getItemsPerPage=function(instanceId){return instances[instanceId].itemsPerPage},this.setCollectionLength=function(instanceId,val){instances[instanceId].collectionLength=val},this.getCollectionLength=function(instanceId){return instances[instanceId].collectionLength},this.setAsyncModeTrue=function(instanceId){instances[instanceId].asyncMode=!0},this.setAsyncModeFalse=function(instanceId){instances[instanceId].asyncMode=!1},this.isAsyncMode=function(instanceId){return instances[instanceId].asyncMode}}/**
     * This provider allows global configuration of the template path used by the dir-pagination-controls directive.
     */
function paginationTemplateProvider(){var templateString,templatePath="angularUtils.directives.dirPagination.template";/**
         * Set a templateUrl to be used by all instances of <dir-pagination-controls>
         * @param {String} path
         */
this.setPath=function(path){templatePath=path},/**
         * Set a string of HTML to be used as a template by all instances
         * of <dir-pagination-controls>. If both a path *and* a string have been set,
         * the string takes precedence.
         * @param {String} str
         */
this.setString=function(str){templateString=str},this.$get=function(){return{getPath:function(){return templatePath},getString:function(){return templateString}}}}/**
     * Config
     */
var moduleName="angularUtils.directives.dirPagination",DEFAULT_ID="__default";/**
     * Module
     */
angular.module(moduleName,[]).directive("dirPaginate",["$compile","$parse","paginationService",dirPaginateDirective]).directive("dirPaginateNoCompile",noCompileDirective).directive("dirPaginationControls",["paginationService","paginationTemplate",dirPaginationControlsDirective]).filter("itemsPerPage",["paginationService",itemsPerPageFilter]).service("paginationService",paginationService).provider("paginationTemplate",paginationTemplateProvider).run(["$templateCache",dirPaginationControlsTemplateInstaller])}();
/*! xybbGarten 最后修改于： 2016-06-21 */