Page({

  /**
   * data
   */
  data: {
    isLoad: false,
    catalogueId: '', 
    resultList: null, 
    addImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/add2.png?sign=628ec5a02762a8e81a91287a91b9d91d&t=1590133101",
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
    this.setData({
      catalogueId: options.id
    });
    wx.cloud.callFunction({
      name: "course",
      data: {
        requestType: 'courseGetList',
        catalogueId: this.data.catalogueId
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data,
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
      name: "course",
      data: {
        requestType: 'courseGetList',
        catalogueId: this.data.catalogueId
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data,
        isLoad: true
      });
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    })
  },

  /**
   * 跳转到编辑课程页面
   * @param {*} event 
   */
  showEditCourse: function (event) {
    wx.navigateTo({
      url: '../courseEdit/courseEdit?id=' + event.currentTarget.dataset.id + "&catalogueId=" + this.data.catalogueId,
    })
  },

  /**
   * 删除课程信息
   * @param {*} event 
   */
  deleteCourse: function(event) {
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