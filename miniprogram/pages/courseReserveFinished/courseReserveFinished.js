// 获得当前的时分
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
Page({
  data: {
    id: "0", //当前课程信息Id
    isLoad: false,
    courseInfo: '',
    myReserveInfo: null,
    courseIsFinished: "10", //从时间点判断当前课程是否结束
    headImgUrl: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=97e5614693d26e39f7f91d50980fcb80&t=1590716495"
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
      title: '课程预定详情',
    });
  },

  /**
   * onLoad
   * @param {*} options 
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    var currentTime = formatTime(new Date());
    var currentData = formatCurrentDate(new Date());
    // 检查当前时间点能否取消课程
    this.checkCourseReserveConfirm(currentData, currentTime);
  },

  /**
   * 检查当前时间能否取消课程
   * @param {当前日期} currentData 
   * @param {当前时间} currentTime 
   */
  checkCourseReserveConfirm: function (currentData, currentTime) {
    console.log("取消预约：当前日期：");
    console.log("取消预约：当前时间：");
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseReserveConfirm",
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
      // 获取当前课程的预定信息
      this.getCourseArrangeById();
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 获取当前预定的课程信息
   */
  getCourseArrangeById: function () {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "getCourseArrangeById",
        id: this.data.id
      }
    }).then(res => {
      this.setData({
        courseInfo: res.result.data[0]
      });
      this.getCourseReserveById();
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 获取当前用户对于该课程的预定信息
   */
  getCourseReserveById: function () {
    var username = wx.getStorageSync('username');
    wx.cloud.callFunction({
      name: "courseReserve",
      data: {
        requestType: "getMyCourseReserveById",
        applyId: this.data.id,
        username: username
      }
    }).then(res => {
      this.setData({
        myReserveInfo: res.result.data[0],
        isLoad: true
      });
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 用户点击取消当前课程的预定
   * @param {*} event 
   */
  cancelCourseReserve: function (event) {
    var currentTime = formatTime(new Date());
    var currentData = formatCurrentDate(new Date());
    // 检查当前时间能否取消课程预定
    this.checkCourseReserveConfirm2(currentData, currentTime);
  },

  /**
   * 检查当前时间点能否取消课程预定
   * @param {当前的日期} currentData 
   * @param {当前的时间} currentTime 
   */
  checkCourseReserveConfirm2: function (currentData, currentTime) {
    console.log("取消预约：当前日期：" + currentData);
    console.log("取消预约：当前时间：" + currentTime);
    console.log("课程id:" + this.data.id);
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseReserveConfirm",
        applyId: this.data.id,
        currentData: currentData,
        currentTime: currentTime,
      }
    }).then(res => {
      if (res.result.list.length > 0) {
        // 取消当前课程的预定信息
        this.deleteCourseReserveById();
      } else {
        this.showToast("当前课程已开始，不能取消！");
      }
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 取消当前的课程预定信息
   */
  deleteCourseReserveById: function () {
    wx.cloud.callFunction({
      name: "courseReserve",
      data: {
        requestType: "deleteCourseReserveById",
        id: this.data.myReserveInfo._id,
      }
    }).then(res => {
      wx.navigateBack({
        complete: (res) => {
          this.showToast("课程预定取消成功");
        },
      })
    }).catch(err => {
      console.error(err)
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 返回课程首页
   */
  returnToHome: function () {
    wx.switchTab({
      url: '../index/index',
    });
  },

  /**
   * 返回预定课程界面
   */
  returnToList: function () {
    wx.navigateBack({
      complete: (res) => {
        console.log("返回课程预定界面成功")
      },
    })
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