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
          var avatarUrl = wx.getStorageSync('avatarUrl');
          if (this.nullToEmpty(avatarUrl) != "") {
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
          } else {
            this.setData({
              isLoad: true
            });
          }
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
    });
  },

  // 将为null或undefined的字段转换
  nullToEmpty: function (value) {
    if (value == undefined) {
      return "";
    } else if (value == null) {
      return "";
    } else if (value == "") {
      return ""
    }
  },

  /**
   * 封装弹窗代码
   * @param {弹窗的标题} title 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }

})