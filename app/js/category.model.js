angular.module('ams.models.category', [])
    .service('category', category);

function category($location) {
    var sections = [{
        name: "系统类别",
        type: 'toggle',
        icon: "fa fa-suitcase",
        pages: [{
            name: "大类",
            icon: "fa",
            type: 'link',
            state: "device-systype"
        }, {
            name: "小类",
            icon: "fa",
            type: 'link',
            state: "device-type"
        }]
    }, {
        name: "监控点位类型",
        icon: "fa fa-eye",
        type: 'toggle',
        pages: [{
            name: "组类型",
            icon: "fa",
            type: 'link',
            state: "monitor-group"
        }, {
            name: "常规类型",
            icon: "fa",
            type: 'link',
            state: "monitor-type"

        }, {
            name: "关联设备与监控",
            icon: "fa",
            type: 'link',
            state: "device-monitor"

        }]
    }, {
        name: "电子地图",
        icon: "fa fa-sitemap",
        type: 'link',
        state: "map"
    }, {
        name: "设备维护",
        type: 'toggle',
        icon: "fa fa-edit",
        pages: [{
            name: "设备表",
            icon: "fa",
            type: 'link',
            state: "device-info"

        }, {
            name: " 点位表",
            icon: "fa",
            type: 'link',
            state: "device-point"

        }, {
            name: " 设备点位状态",
            icon: "fa",
            type: 'link',
            state: "device-define"

        }, {
            name: "设备组",
            icon: "fa",
            type: 'link',
            state: "devicegroup-define"

        }]
    }];

    var self;
    return self = {
        sections: sections,
        toggleSelectSection: function(section) {
            self.openedSection = (self.openedSection === section ? null : section);
        },
        isSectionSelected: function(section) {
            return self.openedSection === section;
        },
        setSelectPage: function(page) {
            page && page.state && $location.path('/' + page.state);
            self.currentPage = (self.currentPage === page ? null : page);
        },
        isPageSelected: function(page) {
            return page && self.currentPage === page;
        }
    };

    function sortByHumanName(a, b) {
        return (a.humanName < b.humanName) ? -1 :
            (a.humanName > b.humanName) ? 1 : 0;
    }
}
