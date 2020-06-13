Page({

  /**
   * data
   */
  data: {
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
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'getReadyFinishedCourseArrange',
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list,
        isLoad: true
      });
    }).catch(err => {
      console.error(err)

    })
  },

  /**
   * onShow
   */
  onShow: function () {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'getReadyFinishedCourseArrange',
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list,
        isLoad: true
      });
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    })
  },

  // 显示课程排课详细信息
  showCourseArrangeDetail: function (event) {
    wx.navigateTo({
      url: '../courseArrangeDetail/courseArrangeDetail?id=' + event.currentTarget.dataset.id
    })
  },

  /**
   * 删除课程信息
   * @param {*} event 
   */
  deleteCourse: function (event) {
    wx.cloud.callFunction({
      name: "course",
      data: {
        requestType: "deleteCourseById",
        id: event.currentTarget.dataset.id
      }
    }).then(res => {
      this.showToast("删除成功！");
      this.onShow();
    }).catch(err => {
      console.log(err);
      this.showToast("操作失败，请重试！");
    });
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