const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false
  },

  onShow: function () {
    var value = wx.getStorageSync('login');
    if (value && value == '1') {
      // 获取用户信息
      wx.getSetting({
        success: res => {
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
          } else {
            this.setData({
              avatarUrl: './user-unlogin.png',
              logged: false
            });
          }
        }
      })
    } else {
      this.setData({
        avatarUrl: './user-unlogin.png',
        logged: false
      });
    }
  },

  userlogin: function () {
    // 还未获取到用户授权，返回到登陆界面
    if (!this.data.logged) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.showModal({
        cancelColor: 'true',
        title: '提示',
        content: '是否退出登陆',
        success: function (res) {
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
