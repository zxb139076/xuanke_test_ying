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
      name: "courseReserve"
    }).then(res => {
      var success = false;
      for (var i = 0; i < res.result.data.length; i++) {
        var item = res.result.data[i];
        wx.cloud.callFunction({
          name: "courseArrange",
          data: {
            requestType: 'getCourseArrangeById',
            id: item.applyId
          }
        }).then(res2 => {
          item["courseName"] = res2.result.data[0].courseName;
          res.result.data[i - 1] = item;
          if (i == res.result.data.length - 1) {
            success = true;
          }
        }).catch(err => {
          console.error(err)
        })
      }

          this.setData({
            resultList: res.result.data
          });

    }).catch(err => {
      console.error(err)
    })
  },

})