   angular.module('content.map', ['ibuildweb.factorys.services', 'ibuildweb.factorys', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
       .controller('mapCtrl', mapCtrl)
       .directive('jscrollpane', jscrollpane)
       .directive('mapInlineTools', mapInlineTools)

   function mapCtrl(Paginator, $rootScope, $mdDialog, $scope, $log, $mdSidenav, $state, map, deviceInfo, $mdComponentRegistry, DeviceField) {

       $scope.$on('$stateChangeSuccess', function() {
           if ($state.current.name == "ibuildweb.category.content") {
               load();
           }
           $rootScope.query = null;
       });
       $scope.$on("loadFromParrent", load);
       load();

       // 用来检测报警列表滚动
       /*     $scope.onJspScrollY = function() {
                if ($scope.isLoadTop) {
                    $scope.page += 10;
                    showMore();
                }
            };*/

       var query = {};

       $scope.search = function() {
           query[DeviceField.MNT_GROUP_ID] = $scope.sysTypeData;
           $rootScope.query = query;

       };
       $scope.$watch('sysTypeData', function() {});


       // 自定义设备 查看列表数据 remove
       $scope.selectedRow = function(index, obj) {
           obj.open = obj.open === false;
           var o = {};
           o[DeviceField.MAP_NO] = obj[DeviceField.MAP_ID];
           if (obj[DeviceField.MAP_NO] == null) {
               $rootScope.query = o;
               map.filter(null, null, function(data) {
                   $rootScope.query = null;
                   $scope.isDel = data.length == 0;
               });
           }
       };



       /* $scope.showDataList = [];
              function showMore() {
                  deviceInfo.filter(null, null, function(data) {
                      $scope.showDataList = data;
                  });
              }*/

       function load() {
           map.filter(null, null, function(data) {
               var _data = new treeMenu(data).init();
               $scope.showData = _data;
               $scope.showAreaData = _data[null];
           });

           $scope.DeviceField = DeviceField;
       }

       function treeMenu(o) {
           this.tree = o || [];
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


       function deleteNode(data) {
           var namelest = Object.keys(data);
           angular.forEach(namelest, function(v, i) {
               if (data[v] === '' || data[v] == null) {
                   delete data[v];
               }
           });
           return data
       };

       $scope.getSelectedText = function(obj) {
           if (obj !== undefined) {
               return obj;
           } else {
               return " ";
           }
       };


       $scope.cancel = function() {
           $mdSidenav('right').close();
       };

       $scope.delete = function(ev, obj) {
           var confirm = $mdDialog.confirm()
               .title('确定要删除这条数据么?')
               .ok('确定')
               .cancel('取消');

           $mdDialog.show(confirm).then(function() {
               console.log('delete...');
               map.deleteOne(obj).then(function(data) {
                   load();
               })
           }, function() {
               console.log('cancel...');
           });
       };
       $scope.toggleRight = function(obj) {
           if (obj) {
               $state.go("ibuildweb.category.content.edit", { systype: obj[DeviceField.MAP_NO] });
               $scope.showData.null.data = obj[DeviceField.MAP_NO];
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

       $scope.save = function(obj, type) {
           if (type === 'save') {
               map.isExists(obj).then(function(data) {
                   if (data.data.exists) {
                       console.log('数据已存在...')
                   } else {
                       save(obj, type);
                   }
               })
           } else {
               save(obj, type);
           }
       }

       function save(obj, type) {
           obj[DeviceField.MAP_ID] = $scope.showData.null.data;
           map.saveOne(obj, type, function() { load(); });
       }


   }

   function mapInlineTools($templateRequest, $compile) {
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
   }

   function jscrollpane($timeout) {
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
   }
