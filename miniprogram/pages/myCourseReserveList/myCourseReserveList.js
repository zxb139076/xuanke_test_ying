// miniprogram/pages/courseQuery/courseQuery.js

const app = getApp()

Page({
  data: {
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
    resultList: null,
  },

  getCourseApply:function(){
    wx.cloud.callFunction({
      name:"courseReserve"
    }).then(res=>{
      this.setData({
        resultList : res.result.data
      });
    }).catch(err=>{
      console.error(err)
    })
  },
  
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})