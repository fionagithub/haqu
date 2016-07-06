angular.module('ibuildweb.models.category', [])
    .service('category', category);

function category() {

    return [{
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
            label: "关联设备与监控",
            iconClasses: "fa",
            url: "#/device_monitor"

        }]
    }, {
        label: "电子地图",
        iconClasses: "fa",
        url: "#/map"
    }, {
        label: "设备维护",
        iconClasses: "fa",
        children: [{
            label: "设备表",
            iconClasses: "fa",
            url: "#/deviceinfo"

        }, {
            label: " 点位表",
            iconClasses: "fa",
            url: "#/devicepoint"

        }, {
            label: " 设备点位状态",
            iconClasses: "fa",
            url: "#/devicedefine"

        }, {
            label: "设备组",
            iconClasses: "fa",
            url: "#/devicegroupdefine"

        }]
    }];
};
