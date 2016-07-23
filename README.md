# AMS
## AMS项目，由loopback提供数据接口

---

> 关于 loopback 相关说明，请参考 [loopback-example-angular](https://github.com/strongloop/loopback-example-angular)。
> 

## 安装
`npm install`
`bower install`

## 启动
`node .`

使用不同配置启动，参考：[如何使用本地模拟数据开发？](#develop-event)

## 配置

### 如何配置loopback数据对象？
数据对象配置涉及到数据源配置文件：`/server/datasources.json` 和模块配置文件`server/model-config.json`、`/common/models/{modelname}.json`

1. 在数据源配置文件中配置数据源
2. 在模块配置文件中配置字段。
3. 每个模块名称对应数据库的一个表名，字段名称也要和数据库中相同。

> 最快捷的方式是使用 slc (StrongLoop Controller) 命令来快速配置数据对象，`slc loopback:model`
> [详细教程](https://docs.strongloop.com/display/public/LB/Tutorial%3A+model+relations#Tutorial:modelrelations-Createmodels)


### <span id = "develop-event">如何使用本地模拟数据开发？</span>
将环境变量 `NODE_ENV` 设置成 `develop`，然后启动 iBuildWeb，或者使用临时设置变量启动 `NODE_ENV=develop node .` 。
>loopback系统会自动根据这个环境变量调用对应的数据源配置文件，配置文件的命名规则为：`datasources.{env}.json`，因此，上述设置会调用`datasources.develop.json`。也就是说，只要将`NODE_ENV`设置成不同的字符串就可调用不同的数据源配置。

### 如何将真实数据导入到模拟库？
按以下步骤操作：

1. 通过正式库 api explorer 获取api列表，例如：`http://api.hostname.com:3000/explorer` 
2. 通过正式库 api 获得数据（一般为JSON格式的数组），保存备用
3. 通过本地 api explorer（如：`http://localhost:3000/explorer` ） 将之前保存的数据`post`到开发库中，
4. 重启AMS系统

### StrongLoop API 过滤器语法
1、查询范例
  `_params={"limit":10,"offset":10,"where":{"deviceid":{"like":"0301%"}}};
   $http.get(options.uri,{ params: { filter:  _params } } ) ` 