import {
  formatTime
} from '../util/util.js';

Page({
  data: {
    id: "0",
    isLoad: false,
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
    if (this.data.id != "0") {
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
    }
  },

  confirmCourseArrange: function () {
    var currentTime = formatTime(new Date());
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseArrangeUpdateFinished",
        currentTime: currentTime,
        id: this.data.courseInfo._id
      }
    }).then(res => {
      if (res.result.list.length < 1) {
        wx.cloud.callFunction({
          name: "courseArrange",
          data: {
            requestType: "updateCourseArrange",
            id: this.data.courseInfo._id
          }
        }).then(res => {
          wx.cloud.callFunction({
            name: "courseArrange",
            data: {
              requestType: "updateCourseArrangeFinished",
              id: this.data.courseInfo._id
            }
          }).then(res => {
            wx.showToast({
              title: '确认课程完成成功',
              icon: 'none'
            })
            wx.navigateTo({
              url: '../courseArrangeConfirmFinished/courseArrangeConfirmFinished?id=' + this.data.id,
            })
          }).catch(err => {
            console.error(err)
          })
        }).catch(err => {
          console.error(err)
        })
      } else {
        wx.showToast({
          title: '当前课程还没结束，不能确认完成',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },

  showConfirmDetail: function () {
    wx.navigateTo({
      url: '../courseArrangeConfirmFinished/courseArrangeConfirmFinished?id=' + this.data.id,
    })
  }

})