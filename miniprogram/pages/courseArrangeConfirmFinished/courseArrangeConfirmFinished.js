Page({
  data: {
    id: "0",
    isLoad: false,
    courseInfo: '',
    headImgUrl: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=97e5614693d26e39f7f91d50980fcb80&t=1590716495"
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '课程排课确认详情',
    });
  },

  onLoad: function (options) {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "getCourseArrangeById",
        id: options.id
      }
    }).then(res => {
      this.setData({
        courseInfo: res.result.data[0],
        id: options.id,
        isLoad: true
      });
    }).catch(err => {
      console.error(err)
    })
  },

  returnToHome: function () {
    wx.switchTab({
      url: '../homePage/homePage',
    });
  },

  returnToList: function () {
    wx.redirectTo({
      url: '../courseArrange/courseArrange?currentData=' + this.data.courseInfo.currentData,
    })
  }
})