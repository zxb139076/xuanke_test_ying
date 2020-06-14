const app = getApp()
Page({

  /**
   * onData
   */
  data: {
    isLoad: false,
  },
  
  /**
   * onShow
   */
  onShow() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              app.globalData.openid = res.result.openid;
              wx.navigateTo({
                url: '../login/login',
              })
            },
            fail: err => {
              console.error(err)
            }
          });
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          this.setData({
            isLoad: true
          });
        }
      }
    });
  },

  /**
   * 用户授权信息
   * @param {*} e 
   */
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
              url: '../login/login',
            })
          },
          fail: err => {
            console.error(err)
          }
        });
      }
    })
  },

})