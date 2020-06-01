// pages/my/my.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function () {
    var value = wx.getStorageSync('login');
    if (value && value == '1') {
      console.log("当前登陆状态:" + value);
      // 获取用户信息
      wx.getSetting({
        success: res => {
          // 判断是否获得了用户授权
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  userInfo: res.userInfo,
                  logged: true
                })
              }
            })
          }
        }
      })
    }
  },

  onShow: function() {
    var value = wx.getStorageSync('login');
    if (value && value == '1') {
      console.log("当前登陆状态:" + value);
      // 获取用户信息
      wx.getSetting({
        success: res => {
          // 判断是否获得了用户授权
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  userInfo: res.userInfo,
                  logged: true
                })
              }
            })
          }
        }
      })
    }
  },

  userlogin: function () {
    // 还未获取到用户授权，返回到登陆界面
    if (!this.data.logged) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      // 提示是否退出登陆
      wx.showModal({
        cancelColor: 'true',
        title: '提示',
        content: '是否退出登陆',
        success: function (res) {
          // 用户取消，不作任何操作
          if (!res.confirm) {
            return;
          }
          wx.setStorageSync('login', '0');
          wx.navigateTo({
            url: '../login/login'
          })
        }
      })
    }
  }

})
