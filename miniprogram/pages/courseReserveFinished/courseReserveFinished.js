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
const app = getApp();
Page({
  data: {
    id: "0", //当前课程信息Id
    isLoad: false, //当前页面是否加载完成
    courseInfo: '', //当前课程信息
    myReserveInfo: null, //用户预订课程的信息
    courseIsFinished: "10", //从时间点判断当前课程是否结束
    headImgUrl: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=97e5614693d26e39f7f91d50980fcb80&t=1590716495"
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '课程预定详情',
    });
  },

  onLoad: function (options) {
    // 设置当前课程的Id
    this.setData({
      id: options.id 
    });
    // 检查当前是否可以取消预约该课程
    var currentTime = formatTime(new Date());
    var currentData = formatCurrentDate(new Date());
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseReserveCancel",
        id: this.data.id,
        currentTime: currentTime,
        currentData: currentData
      }
    }).then(res => {
      // 如果该课程满足取消条件
      if (res.result.list.length > 0) {
        this.setData({
          courseIsFinished: "0"
        });
      } else {
        this.setData({
          courseIsFinished: "1"
        });
      }
      // 取得当前预定的课程信息
      wx.cloud.callFunction({
        name: "courseArrange",
        data: {
          requestType: "getCourseArrangeById",
          id: this.data.id
        }
      }).then(res => {
        this.setData({
          courseInfo: res.result.data[0],
          id: this.data.id,
        });
        // 获取用户课程预定信息
        wx.cloud.callFunction({
          name: "courseReserve",
          data: {
            requestType: "getMyCourseReserveById",
            applyId: this.data.id,
            openid: app.globalData.openid
          }
        }).then(res => {
          this.setData({
            myReserveInfo: res.result.data[0],
            isLoad: true
          });
        }).catch(err => {
          //onLoad方法，取得用户预订信息失败
          console.error(err);
          wx.showToast({
            title: '操作失败，请重试！',
            icon: 'none'
          });
        })
      }).catch(err => {
        // onLoad方法：取得课程信息失败
        console.error(err);
        wx.showToast({
          title: '操作失败，请重试！',
          icon: 'none'
        });
      })
    }).catch(err => {
      // onLoad方法：检查当前时间点是否可以取消预约课程失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试！',
        icon: 'none'
      });
    })
  },

  // 取消当前课程的预定
  cancelCourseReserve: function (event) {
    var currentTime = formatTime(new Date());
    var currentData = formatCurrentDate(new Date());
    // 检查当前时间点是否可以取消预约该课程
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseReserveCancel",
        id: this.data.id,
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
            id: this.data.myReserveInfo._id,
          }
        }).then(res => {
          wx.navigateBack({
            complete: (res) => {
              wx.showToast({
                title: '取消课程预定成功',
                icon: 'none'
              });
            },
          })
        }).catch(err => {
          //cancelCourseReserve方法，取消当前课程的预约记录失败
          console.error(err)
          wx.showToast({
            title: '操作失败，请重试',
            icon: 'none'
          });
        })
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

  // 返回首页
  returnToHome: function () {
    wx.switchTab({
      url: '../index/index',
    });
    console.log("返回首页成功")
  },

  // 返回预定课程界面
  returnToList: function () {
    wx.navigateBack({
      complete: (res) => {
        console.log("返回课程预定界面成功")
      },
    })
  }
})