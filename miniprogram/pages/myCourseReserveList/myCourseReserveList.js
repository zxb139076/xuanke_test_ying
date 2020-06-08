
// 获得当前的时分秒
import {
  formatTime
} from '../util/util.js';
// 获得当前的时间点 2020-01-01 12:00:01
import {
  formatDate
} from '../util/util.js';
// 获得当前日期
import {
  formatCurrentDate
} from '../util/util.js';
const app = getApp()
Page({
  data: {
    openid: '',
    resultList: null, // 获取我的预定课程列表
    headImgUrl: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=97e5614693d26e39f7f91d50980fcb80&t=1590716495"
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid // 设置openid
      })
    }
    // 获取我的课程预定列表
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
      //onLoad方法，获取我的课程预定列表失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试！',
        icon: 'none'
      })
    })
  },

  // 取消当前预定的课程
  cancelCourseReserve: function (event) {
    var currentTime = formatTime(new Date());
    var currentData = formatCurrentDate(new Date());
    // 检查当前时间点是否可以取消预约该课程
    console.log("当前课程ID:" + event.currentTarget.dataset.courseId);
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseReserveCancel",
        id: event.currentTarget.dataset.courseId,
        currentTime: currentTime,
        currentData: currentData
      }
    }).then(res => {
      if (res.result.length > 0) {
        wx.cloud.callFunction({
          name: "courseReserve",
          data: {
            requestType: "deleteCourseReserveById",
            id: event.currentTarget.dataset.id // 预约课程id
          }
        }).then(res => {
          wx.showToast({
            title: '取消预定成功',
            icon: 'none'
          });
        }).catch(err => {
          //cancelCourseReserve方法，取消当前预定的课程
          console.error(err);
          wx.showToast({
            title: '操作失败，请重试',
            icon: 'none'
          })
        });
      } else {
        wx.showToast({
          title: '当前课程已经开始，不能取消',
          icon: 'none'
        });
      }
    }).catch(err => {
      //cancelCourseReserve方法，检查当前是否可以取消预约该课程失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      });
    })
  }

})