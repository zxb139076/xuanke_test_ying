//app.js
const config = require('./config')
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
         traceUser: true,
         // 生产环境
         // env: 'xuankeying-ykwz0',
         // 开发环境
         // env: 'xuankeying-ykwz0'
         env: config.baseEnv
      })
    }
    this.globalData = {
      config: config
    }
  }
})
