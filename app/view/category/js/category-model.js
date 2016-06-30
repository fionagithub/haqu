angular.module('ibuildweb.models.category', [])
    .service('category', category);

function category() {
    var menuModel = this;
    menuModel.getMenu = function() {
        var data = [{
            label: '点位部署',
            iconClasses: 'fa',
            url: '#'
        }, {
            label: "系统类别",
            iconClasses: "fa",
            children: [{
                label: "大类",
                iconClasses: "fa",
                url: "#/systype"
            }, {
                label: "小类",
                iconClasses: "fa",
                url: "#/type"
            }]
        }, {
            label: "监控点位类型",
            iconClasses: "fa",
            children: [{
                label: "组类型",
                iconClasses: "fa",
                url: "#/monitorgroup"
            }, {
                label: "常规类型",
                iconClasses: "fa",
                url: "#/monitortype"

            }, {
                label: "关联设备类型与监控点组类型",
                iconClasses: "fa",
                url: "#/device_monitor"

            }]
        }, {
            label: "电子地图",
            iconClasses: "fa",
            url: "#/map"
        }, {
            label: "电子地图",
            iconClasses: "fa",
            children: [{
                label: "TS_DeviceInfo ｜ 设备表",
                iconClasses: "fa",
                url: "#/deviceinfo"

            }, {
                label: " 点位表",
                iconClasses: "fa",
                url: "#/devicepoint"

            }]
        }];
        return data;
    };


}
