Page({
  data: {
    avatarUrl: './user-unlogin.png',
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
  },

  showCourseReserve: function () {
    wx.navigateTo({
      url: '../courseReserve/courseReserve',
    });
  },

})
