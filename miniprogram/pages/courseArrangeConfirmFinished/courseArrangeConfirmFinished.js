Page({
  data: {
    id: "0",
    isLoad: false,
    courseInfo: '',
    resultList: null,
    headImgUrl: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=97e5614693d26e39f7f91d50980fcb80&t=1590716495"
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
      title: '课程排课确认详情',
    });
  },

  /**
   * onLoad
   */
  onLoad: function (options) {
    // 获取课程排课详情信息
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "showCourseArrangeDetail",
        id: options.id
      }
    }).then(res => {
      this.setData({
        courseInfo: res.result.list[0],
        resultList: res.result.list[0].courseReserveList,
        id: options.id,
        isLoad: true
      });
    }).catch(err => {
      console.error(err)
    })
  },

  /**
   * 返回设置界面
   */
  returnToHome: function () {
    wx.switchTab({
      url: '../my/my',
    });
  },

  /**
   * 返回课程排课界面
   */
  returnToList: function () {
    wx.redirectTo({
      url: '../courseArrange/courseArrange?currentData=' + this.data.courseInfo.currentData,
    })
  }
})