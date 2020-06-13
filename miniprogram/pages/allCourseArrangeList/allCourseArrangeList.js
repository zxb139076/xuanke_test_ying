Page({

  /**
   * data
   */
  data: {
    startData: "2020-01-01",
    endData: "2030-12-31",
    courseBeginData: "",
    courseEndData: "",
    isFinished: 0,
    isLoad: false,
    resultList: null,
    editImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/edit2.png?sign=ef6e1aba71848b80bc8a0ec3a5cf6938&t=1590133258",
    deleteImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/delete2.png?sign=1b5f6dc4dd932c7fe7aea760163a189f&t=1590133125",
    headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=9184ee1dd0a51f9965bb7fccd2598df3&t=1590470115",
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
      title: '课程列表',
    });
  },

  /**
   * onLoad
   * @param {*} options 
   */
  onLoad: function (options) {
    this.getCourseArrangeList();
  },

  /**
   * onShow
   */
  onShow: function () {
    this.getCourseArrangeList();
  },

  /**
   * 获取课程排课列表
   */
  getCourseArrangeList: function() {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'getReadyFinishedCourseArrange',
        courseBeginData: this.data.courseBeginData,
        courseEndData: this.data.courseEndData
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list,
        isLoad: true
      });
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 用户点击查询课程排课列表
   */
  showCourseArrangeListQuery: function() {
    this.getCourseArrangeList();
  },

  /**
   * 获取用户输入的开始时间
   * @param {*} e 
   */
  bindCourseBeginDataChange: function (e) {
    this.setData({
      courseBeginData: e.detail.value
    })
  },

  /**
   * 获取用户输入的结束时间
   * @param {*} e 
   */
  bindCourseEndDataChange: function (e) {
    this.setData({
      courseEndData: e.detail.value
    })
  },

  bindIsFinishedChange: function (e) {
    this.setData({
      isFinished: e.detail.value
    })
  },

  /**
   * 显示排课详情信息页面
   * @param {*} event 
   */
  showCourseArrangeDetail: function (event) {
    wx.navigateTo({
      url: '../courseArrangeDetail/courseArrangeDetail?id=' + event.currentTarget.dataset.id
    })
  },

  /**
   * 弹窗代码封装
   * @param {弹窗的标题} title 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }
})