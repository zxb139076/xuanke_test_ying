// miniprogram/pages/courseQuery/courseQuery.js

const app = getApp()

Page({
  data: {
    openid: '',
    resultList: null,
    headImgUrl: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=97e5614693d26e39f7f91d50980fcb80&t=1590716495"
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    wx.cloud.callFunction({
      name: "courseReserve",
      data: {
        requestType: "showMyCourseReserveList",
        openid: this.data.openid
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list
      });
    }).catch(err => {
      console.error(err)
    })
  },

  // 取消当前课程的预定
  cancelCourseReserve: function (event) {
    wx.cloud.callFunction({
      name: "courseReserve",
      data: {
        requestType: "deleteCourseReserveById",
        id: event.currentTarget.dataset.id
      }
    }).then(res => {
      wx.redirectTo({
        url: '../myCourseReserveList/myCourseReserveList',
      })
      wx.showToast({
        title: '取消预定成功',
        icon: 'none'
      });
    }).catch(err => {
      console.error(err)
    })
  }

})