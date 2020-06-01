Page({

  data: {
    logged: false
  },

  backToMyPages: function (e) {
    wx.navigateBack();
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      wx.setStorageSync('login', '1');
      wx.switchTab({
        url: '../my/my'
      })
    }
  },

})