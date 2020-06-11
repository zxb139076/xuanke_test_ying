// 获得当前的时钟分钟
import {
  formatTime
} from '../util/util.js';
// 获得当前的时间点 2020-01-01 12:00:01
import {
  formatCurrentDate
} from '../util/util.js';
// 获得当前日期
const app = getApp()
Page({
  data: {
    isLoad: false, // 页面是否加载完成
    openid: '', //用户的openid
    resultList: null, // 获取我的预定课程列表
    headImgUrl: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=97e5614693d26e39f7f91d50980fcb80&t=1590716495",
    currentData: "",
    currentTime: ""
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '课程预约列表',
    });
  },

  onLoad: function (options) {
    // 获取用户的账号信息
    const username = wx.getStorageSync('username');
    var currentData = formatCurrentDate(new Date());
    var currentTime = formatTime(new Date());
    this.setData({
      currentData: currentData,
      currentTime: currentTime
    });
    // 获取我的课程预定列表
    wx.cloud.callFunction({
      name: "courseReserve",
      data: {
        requestType: 'showMyCourseReserveList',
        username: username
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

  // 获取当前选择的课程ID
  getCourseId: function (event) {
    // 获取当前选择的课程Id
    this.setData({
      courseId: event.currentTarget.dataset.id
    });
  },

  // 取消当前预定的课程
  cancelCourseReserve: function (event) {
    var currentTime = formatTime(new Date());
    var currentData = formatCurrentDate(new Date());
    // 检查当前时间点是否可以取消预约该课程
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'checkCourseReserveCancel',
        id: this.data.courseId,
        currentTime: currentTime,
        currentData: currentData
      }
    }).then(res => {
      // 如果该课程满足条件可以取消
      if (res.result.list.length > 0) {
        // 取消当前课程的预约记录
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
          //cancelCourseReserve方法，取消当前预定的课程失败
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
  },

  // 将为null或undefined的字段转换
  nullToEmpty: function (value) {
    if (value == undefined) {
      return "";
    } else if (value == null) {
      return "";
    } else if (value == "") {
      return "";
    }
  }

})