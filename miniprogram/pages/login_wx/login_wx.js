const app = getApp()
Page({

  data: {
    logged: false
  },

  onGetUserInfo: function (e) {
    wx.getUserInfo({
      success: function (res) {
        wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            app.globalData.openid = res.result.openid;
            wx.navigateTo({
              url: '../login2/login2',
            })
          },
          fail: err => {
            console.error(err)
          }
        })
      }
    })
  },

})