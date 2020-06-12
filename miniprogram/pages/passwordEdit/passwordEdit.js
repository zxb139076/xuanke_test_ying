Page({

  /**
   * data
   */
  data: {
    isLoad: false,
    originPassword: "",
    newPassword: "",
    newPassword2: "",
    username: ""
  },

  /**
   * onReady
   */
  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '设置密码',
    });
  },

  /**
   * onLoad
   * @param {*} e 
   */
  onLoad: function(e) {
    var username = wx.getStorageSync('username');
    this.setData({
      isLoad: true,
      username: username
    })
  },

  /**
   * 获取原密码
   * @param {*} e 
   */
  originPasswordBlur: function (e) {
    this.setData({
      originPassword: e.detail.value
    })
  },

  /**
   * 获取新密码
   * @param {*} e 
   */
  newPasswordBlur: function (e) {
    this.setData({
      newPassword: e.detail.value
    })
  },

  /**
   * 获取新密码确认
   * @param {}} e 
   */
  newPassword2Blur: function (e) {
    this.setData({
      newPassword2: e.detail.value
    })
  },

})