/**
 * 集中管理整个应用要用到的所有接口地址：
 *   1. 整个应用用到了哪些接口一目了然
 *   2. 接口地址很可能会发生格式变化，集中起来方便修改
 *
 * 文档地址：
 *   https://dev.zhongfl.com/mizar/static/wiki/index.html
 */

const prefix = window.__CONFIG__.apiPath
export default (config => {
  return Object.keys(config).reduce((copy, name) => {
    copy[name] = `${prefix}${config[name]}`
    return copy
  }, {})
})({
  // 个人中心目标
  'userAims': '/mizar/m/user/aims',
  // 触点统计数据
  'tentacleStatics': '/mizar/m/channel/statis',
  // 各类型触点级别数据统计
  'tentacleGstatics': '/mizar/m/channel/gstatis',
  // 触点查询
  'tentacleList': '/mizar/m/channel/list',
  // 触点详情
  'tentacleDetail': '/mizar/m/channel/detail',
  // 触点新增
  'tentacleAdd': '/mizar/m/channel/add',
  // 触点修改
  'tentacleEditor': '/mizar/m/channel/editor',
  // 触点释放
  'tentacleRelease': '/mizar/m/channel/commonality/release',
  // 查询公海
  'commonalityList': '/mizar/m/channel/commonality/list',
  // 认领触点
  'tentacleClaim': '/mizar/m/channel/commonality/claim',
  // 查询机构
  'institutionList': '/mizar/m/channel/institution/list',
  // 添加机构
  'institutionAdd': '/mizar/m/channel/institution/add',
  // 查询机构详情
  'institutionDetail': '/mizar/m/channel/institution/detail',
  // 查询业务类型
  'industryList': '/mizar/m/channel/industry/list',
  // 查询标签
  'labelList': '/mizar/m/channel/label/list',
  // 城市列表
  'cityList': '/mizar/m/tool/citylist',
  // 区域列表
  'areaList': '/mizar/m/tool/arealist',
  // 查询线索
  'clueList': '/mizar/m/clue/list',
  // 编辑线索
  'clueEdit': '/mizar/m/clue/editor',
  // 关闭线索
  'clueClose': '/mizar/m/clue/close',
  // 线索详情
  'clueDetail': '/mizar/m/clue/detail',
  // 线索操作日志
  'clueLogs': '/mizar/m/clue/log',
  // 添加线索
  'clueAdd': '/mizar/m/clue/add',
  // 线索统计数据
  'clueStatis': '/mizar/m/clue/statis',
  // 待办事项新增
  'taskAdd': '/mizar/m/task/add',
  // 待办事项查询
  'taskList': '/mizar/m/task/list',
  // 待办事项详情
  'taskDetail': '/mizar/m/task/detail',
  // 修改待办事项
  'taskEdit': '/mizar/m/task/up',
  // 拜访日志新增
  'visitlogAdd': '/mizar/m/channel/visitlog/add',
  // 拜访日志查询
  'visilogList': '/mizar/m/channel/visitlog/list',
  // 触点操作日志查询
  'operationlog': '/mizar/m/channel/operationlog',
  // 添加金融方案
  'addLoanScheme': '/mizar/m/clue/solutions/add',
  // 修改金融方案
  'editLoanScheme': '/mizar/m/clue/solutions/editor',
  // 预约面签
  'makeInterview': '/mizar/m/clue/interview',
  // 待办事项
  'todoEdit': '/mizar/m/task/up',

  /**
   * 用户相关
   * ============================================== */

  // 发送短信验证码
  'sendcode': '/mizar/m/tool/sendcode',
  // 用户登录
  'login': '/mizar/m/user/bind'
})
