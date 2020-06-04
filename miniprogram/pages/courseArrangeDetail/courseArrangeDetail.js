const app = getApp()

Page({
  data: {
    id: "0",
    isLoad: false,
    openid: '',
    courseInfo: '',
    resultList: null,
    headImgUrl: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=97e5614693d26e39f7f91d50980fcb80&t=1590716495"
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "showCourseArrangeDetail",
        id: options.id
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list[0].courseReserveList,
        courseInfo: res.result.list[0],
        isLoad: true,
        id: options.id
      });
    }).catch(err => {
      console.error(err)
    })
  },

  onShow: function () {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "showCourseArrangeDetail",
        id: this.data.id
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list[0].courseReserveList,
        courseInfo: res.result.list[0],
        isLoad: true
      });
    }).catch(err => {
      console.error(err)
    })
  },

  confirmCourseArrange: function () {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "updateCourseArrangeFinished",
        id: this.data.courseInfo._id
      }
    }).then(res => {
      wx.showToast({
        title: '更新成功',
      })
      wx.navigateTo({
        url: '../courseArrangeConfirmFinished/courseArrangeConfirmFinished?id=' + this.data.id,
      })
    }).catch(err => {
      console.error(err)
    })
  },

  showConfirmDetail: function() {
    wx.navigateTo({
      url: '../courseArrangeConfirmFinished/courseArrangeConfirmFinished?id=' + this.data.id,
    })
  }

})