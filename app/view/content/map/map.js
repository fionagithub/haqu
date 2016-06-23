   angular.module('content.map', ['ibuildweb.factorys.services', 'ibuildweb.factorys', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
       .controller('mapCtrl', mapCtrl)
       .directive('inlineTools', function($templateRequest, $compile) {
           return {
               scope: true,
               restrict: 'C',
               link: function(scope, element) {
                   element.on("click", function(event) {
                       angular.element(document.querySelector('.map .selected')).removeClass('selected');
                       angular.element(element).addClass('selected');
                       scope.$apply(function() {
                           $templateRequest("../view/content/map/tool.html").then(function(html) {
                               angular.element(document.querySelector('.tools')).remove($compile(html)(scope));
                               angular.element(element).append($compile(html)(scope));
                           });
                       })
                   });

               }
           }
       })
       .directive('jscrollpane', function($timeout) {
           return {
               restrict: 'A',
               scope: {
                   options: '=jscrollpane',
                   scrollToElement: '=',
                   bind: '='
               },
               link: function(scope, element, attr) {
                   $timeout(function() {
                       if (navigator.appVersion.indexOf("Win") != -1)
                           element.jScrollPane($.extend({ mouseWheelSpeed: 20 }, scope.options))
                       else
                           element.jScrollPane(scope.options);
                       element.on('click', '.jspVerticalBar', function(event) {
                           event.preventDefault();
                           event.stopPropagation();
                       });
                       element.bind('mousewheel', function(e) {
                           e.preventDefault();
                       });

                       // bind event http://jscrollpane.kelvinluck.com/events.html
                       if (scope.bind) {
                           for (var event in scope.bind) {
                               element.bind(event, scope.bind[event])
                           }
                       }
                       // scroll to element
                       if (attr.hasOwnProperty('scrollToElement')) {
                           var _api = $(element).data('jsp');
                           scope.$watch('scrollToElement', function(_elemnt) {
                               if (_elemnt) {
                                   if (typeof _elemnt == 'string') {
                                       _elemnt = document.getElementById(_elemnt);
                                   }
                                   _api.scrollToElement(_elemnt, true);
                               }
                           })
                       }

                   });
               }
           };
       })

   function mapCtrl($scope, $log, $mdSidenav, $state, map, deviceInfo, $mdComponentRegistry, DeviceField) {
       $scope.$on('$stateChangeSuccess', function() {});

       $scope.$on("loadFromParrent", load);
       load();

       // 用来检测报警列表滚动
       $scope.onJspScrollY = function() {
           if ($scope.isLoadTop) {
               $scope.page += 10;
               showMore();
           }
       };


       // 自定义设备 查看列表数据
       $scope.selectedRow = function(index, event, obj) {
           // $state.go('ibuildweb.category.content.child', { mapid: obj[DeviceField.MAP_ID] });
           $scope.isDel = true;
           if (obj.open) {
               obj.open = false;
           } else {
               obj.open = true;
           }
           var o = {};
           o[DeviceField.MAP_ID] = obj[DeviceField.MAP_ID];

           if (obj[DeviceField.MAP_NO]) {
               showMore(o);
           }
       };
       $scope.showDataList = [];

       function showMore(o) {
           deviceInfo.filterCount(o).then(function(data) {
               var count = data.data.count;
               $scope.deviceTypeCount = Math.floor(count / 50) * 50;

               if ($scope.page) {
                   o._skip = $scope.page;
               }
               o.limit = 50;
               deviceInfo.filter(o).then(function(data) {
                   var objList = data.data;
                   $scope.showDataList = $scope.showDataList.concat(objList);
               }); 
               if ($scope.page == $scope.deviceTypeCount) {
                   $scope.isLoadEnd = true;
                   $scope.isLoadTop = false;
                   //  $scope.page -= 10;
               } else {
                   $scope.isLoadEnd = false;
                   $scope.isLoadTop = true;
               }
           });
       }

       function deleteNode(data) {
           var namelest = Object.keys(data);
           angular.forEach(namelest, function(v, i) {
               if (data[v] === '' || data[v] == null) {
                   delete data[v];
               }
           });
           return data
       };


       function load() {
           $scope.page = null;
           $scope.DeviceField = DeviceField;
           getData();
       }

       function getData() {
           map.filter().then(function(data) {
               var objList = data.data;
               var _data = new treeMenu(objList).init();
               $scope.showData = _data;
               $scope.showAreaData = _data[null];
           });
       }


       $scope.getSelectedText = function(obj) {
           if (obj !== undefined) {
               return obj;
           } else {
               return "Please select an item";
           }
       };

       function treeMenu(a) {
           this.tree = a || [];
           this.groups = {};
       };
       treeMenu.prototype = {
           init: function() {
               this.group();
               return this.groups;
           },
           group: function() {
               for (var i = 0; i < this.tree.length; i++) {
                   if (this.groups[this.tree[i].mapno]) {
                       this.groups[this.tree[i].mapno].push(this.tree[i]);
                   } else {
                       this.groups[this.tree[i].mapno] = [];
                       this.groups[this.tree[i].mapno].push(this.tree[i]);
                   }
               }
           }
       };

       // 自定义设备 删除按钮
       $scope.remove = function(o) {
           if (!o) return;
           o._status = 'deleted';
           map.deleteOne(o).then(function() {
               getData();
           });
       };

       $scope.search = function() {
           $scope.selectedIndex = null;
           getData()
       };
       // 自定义设备 重新保存按钮
       $scope.resave = function(o) {
           var obj = angular.copy(o);
           obj._status = 'modify';
           map.saveOne('reSave', obj).then(function() {
               getData();
           });
       };

       $scope.toggleRight = function(obj) {
           if (obj) {
               $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.MAP_NO] });
               $scope.showData.null.data = obj[DeviceField.MAP_ID];
           } else {
               $state.go("ibuildweb.category.content.create");

           }
           // 'No instance found for handle'
           $mdComponentRegistry.when('right').then(function(it) {
               it.toggle();
           });
           $scope.groupFieldName = angular.copy(obj);
           $scope._groupFieldName = angular.copy(obj);
       };


       // 自定义设备 保存按钮
       $scope.save = function(o) {
           var obj = angular.copy(o);
           $scope.exists = false;
           $scope.isSave = false;
           console.log('saving...');
           obj[DeviceField.MAP_NO] = angular.copy($scope.showData.null.data);
           obj._status = 'modify';
           map.saveOne('save', obj).then(function() {
               getData();
           });

       };


   }
