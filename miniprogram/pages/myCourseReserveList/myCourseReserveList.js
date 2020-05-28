// miniprogram/pages/courseQuery/courseQuery.js

const app = getApp()

Page({
  data: {
    counterId: '',
    openid: '',
    resultList: null
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
        openid: 'oJEfM4iya6jPgen2M9oV65-WQ8bY'
      }
    }).then(res => {
      console.log("rrrrr" + res.result.list);
      this.setData({
        resultList: res.result.list
      });
    }).catch(err => {
      console.error(err)
    })
  },

})