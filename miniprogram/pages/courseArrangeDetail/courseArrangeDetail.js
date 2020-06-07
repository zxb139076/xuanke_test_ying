// 获取当前时间点
import {
  formatTime
} from '../util/util.js';
// 获取当前的日期
import {
  formatCurrentDate
} from '../util/util.js';

Page({
  data: {
    id: "0", //当前课程id
    isLoad: false,//页面加载是否完成
    courseInfo: '',//当前课程信息
    resultList: null,//当前选课人的信息
    headImgUrl: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=97e5614693d26e39f7f91d50980fcb80&t=1590716495"
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '课程排课详情',
    });
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    // 获取课程详情信息
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
      // onLoad方法，获取课程详情信息失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试！',
      });
    })
  },

  onShow: function () {
    if (this.data.id != "0") {
      // 获取课程详情信息
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
        //onshow方法，获取课程详情信息
        console.error(err);
        wx.showToast({
          title: '操作失败，请重试！',
        });
      })
    }
  },

  // 确认课程为完成状态
  confirmCourseArrange: function () {
    // 获取当前时间
    var currentTime = formatTime(new Date());
    // 获取当前日期
    var currentData = formatCurrentDate(new Date());
    // 获取当前课程是否可以确认完成
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseArrangeUpdateFinished",
        currentTime: currentTime,
        currentData: currentData,
        id: this.data.courseInfo._id
      }
    }).then(res => {
      if (res.result.list.length > 0) {
        // 更新课程为完成状态
        wx.cloud.callFunction({
          name: "courseArrange",
          data: {
            requestType: "updateCourseArrange",
            id: this.data.courseInfo._id
          }
        }).then(res => {
          // 更新预定课程的人员为完成状态
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
             // confirmCourseArrange方法，课程预定人员更新为完成状态失败
            console.error(err);
            wx.showToast({
              title: '操作失败，请重试',
              icon: 'none'
            });
          })
        }).catch(err => {
          // confirmCourseArrange方法，课程更新为完成状态失败
          console.error(err)
          wx.showToast({
            title: '操作失败，请重试',
            icon: 'none'
          });
        })
      } else {
        wx.showToast({
          title: '当前课程还没结束，不能确认完成',
          icon: 'none'
        })
      }
    }).catch(err => {
      //confirmCourseArrange方法，获取当前课程能否确认完成
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      });
    })
  },

  // 显示课程确认详情
  showConfirmDetail: function () {
    wx.navigateTo({
      url: '../courseArrangeConfirmFinished/courseArrangeConfirmFinished?id=' + this.data.id,
    })
  }

})