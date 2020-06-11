const app = getApp()
Page({

  data: {
    logged: false
  },

  onGetUserInfo: function (e) {
    // 获取授权的用户信息
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        console.log("nickName:" + nickName);
        console.log("avatarUrl:" + avatarUrl);
        wx.login({
          success: function (res) {
            console.log('loginCode:', res.code)
          }
        });
        // 调用云函数
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            console.log('[云函数] [login] user openid: ', res.result.openid)
            app.globalData.openid = res.result.openid;
            // 跳转到登陆界面
            wx.navigateTo({
              url: '../login2/login2',
            })
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
    })
    /**
      if (!this.data.logged && e.detail.userInfo) {
        wx.setStorageSync('login', '1');
        wx.switchTab({
          url: '../my/my'
        })
      }
    **/
  },

})