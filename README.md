# AMS项目 
项目英文全称：administrator management system ， 主要有设备类别，监控，地图与设备基础信息模块，维护对应模块的数据。对数据的操作主要有以下功能：增加，删除，查找，更新，浏览。

## 安装引用包
设置私有镜像npm set registry http://r.npm.jkr3.com
+ `npm install`
+ `bower install`

## 启动项目
`node .`

## loopback提供数据接口
根据环境变量调用不同资源，参考：[如何使用本地模拟数据开发？](#develop-event)。关于 loopback 相关说明，请参考 [loopback-example-angular](https://github.com/strongloop/loopback-example-angular)。
## 配置

### 如何配置loopback数据对象？
1. loopback模型的配置文件：`server/model-config.json`
2. 配置数据源：`/server/datasources.json` 
3. 存储自己定义数据模型，字段名称也要和数据库中相同:`/common/models/{modelname}.json`

最快捷的方式是使用 slc (StrongLoop Controller) 命令来快速配置数据对象，`slc loopback:model`
[详细教程](https://docs.strongloop.com/display/public/LB/Tutorial%3A+model+relations#Tutorial:modelrelations-Createmodels)


### 如何使用本地模拟数据开发？
在项目启动文件中，将环境变量 `NODE_ENV` 设置成 `develop`（ process.env.NODE_ENV = 'develop'; ）;或者使用命令设置临时变量 `SET NODE_ENV=develop` ，然后启动 AMS项目 `node .`。loopback根据配置的环境变量调用common文件夹对应的数据源文件。数据源文件的命名规则为：`datasources.{NODE_ENV}.json`。

### 如何将真实数据导入到模拟库？
按以下步骤操作：

1. 通过正式库 api explorer 获取api列表，例如：`http://api.hostname.com:3000/explorer` 
2. 通过正式库 api 获得数据（一般为JSON格式的数组），保存备用
3. 通过本地 api explorer（如：`http://localhost:3000/explorer` ） 将之前保存的数据`post`到开发库中，
4. 重启AMS系统

### StrongLoop API 过滤器语法
1、查询范例
  `_params={"limit":10,"offset":10,"where":{"deviceid":{"like":"0301%"}}};`
` $http.get(options.uri,{ params: { filter:  _params } } ) ` 
## 框架
基于Material Design 的应用在外观、交互性和动画效果等方面都有很好的用户体验。angular-material 是 AngularJS 的一个子项目，用来提供实现了 Material Design 风格的组件.[详细教程][http://material.angularjs.org]

## ui-router路由管理 

ui-router 的工作原理非常类似于 Angular 的路由控制器，但它只关注状态。

+ 在应用程序的整个用户界面和导航中，一个状态对应于一个页面位置
+ 通过定义controller、template和view等属性，来定义指定位置的用户界面和界面行为
+ 通过嵌套的方式来解决页面中的一些重复出现的部位 

[详细教程]

1. [ https://github.com/angular-ui/ui-router/wiki]
2. [ http://bubkoo.com/2014/01/01/angular/ui-router/guide/state-manager/] 

## 插件

#### ​Express文件上传插件 
[详细教程] [https://www.npmjs.com/package/express-fileupload]
#### 调用不用资源插件ez-config-loader
根据环境变量 `NODE_ENV` 加载不同的配置文件，用于方便开发环境与生产环境调用不同的资源.
[详细教程][https://www.npmjs.com/package/ez-config-loader]

## 帮助文档

[http://www.baidu.com]