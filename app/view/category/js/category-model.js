angular.module('ibuildweb.models.category', ['ibuildweb.monitor.factorys','ibuildweb.factorys'])
    .service('category', category);

function category($http, DeviceSysTypeList, DeviceTypeList,MonitorGroup) {
    var menuModel = this;
    menuModel.getMenu = function() {
        var data = [{
            label: '上海中心大厦点位部署',
            iconClasses: 'fa',
            url: '#/'
        }, {
            label: "系统类别",
            iconClasses: "fa",
            children: [{
                label: "大类",
                iconClasses: "fa",
                url: "systype"
            }, {
                label: "小类",
                iconClasses: "fa",
                url: "type"
            }]
        },{
            label: "监控点位类型",
            iconClasses: "fa",
            children: [{
                label: "组类型",
                iconClasses: "fa",
                url: "monitorgroup"
            }, {
                label: "常规类型",
                iconClasses: "fa",
                url: "monitortype"

            }]
        }];
        return data;
    };


}
