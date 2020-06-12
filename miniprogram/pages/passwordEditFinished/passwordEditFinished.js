Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false
  },

  /**
   * 返回到账户设置界面
   */
  returnToAccountManager: function() {
    wx.navigateBack({
      delta: 2
    })
  }

})