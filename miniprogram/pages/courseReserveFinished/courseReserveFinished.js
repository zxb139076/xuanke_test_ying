import {
  formatTime
} from '../util/util.js';
const app = getApp();
Page({
  data: {
    id: "0",
    isLoad: false,
    courseInfo: '',
    myReserveInfo: '',
    courseIsFinished: 0,
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
    // 检查当前是否可以取消预约该课程
    var currentTime = formatTime(new Date());
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseReserveCancel",
        id: options.id,
        currentTime: currentTime
      }
    }).then(res => {
      if (res.result.list.length > 0) {
        this.setData({
          courseIsFinished: 1
        });
      }
      // 取得当前课程信息
      wx.cloud.callFunction({
        name: "courseArrange",
        data: {
          requestType: "getCourseArrangeById",
          id: options.id
        }
      }).then(res => {
        this.setData({
          courseInfo: res.result.data[0],
          id: options.id,
        });
        // 获取我当前的预定信息
        wx.cloud.callFunction({
          name: "courseReserve",
          data: {
            requestType: "getMyCourseReserveById",
            applyId: this.data.id,
            openid: app.globalData.openid
          }
        }).then(res => {
          console.log(res.result.data);
          this.setData({
            myReserveInfo: res.result.data[0],
            isLoad: true
          });
        }).catch(err => {
          console.error(err)
        })
      }).catch(err => {
        console.error(err)
      })
    }).catch(err => {
      console.error(err)
    })
  },

  onHide: function() {
    this.setData({
      isLoad: false;
    })
  },

  // 取消当前课程的预定
  cancelCourseReserve: function (event) {
    console.log("当前要取消的预定信息ID:" + this.data.myReserveInfo._id);
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
            title: '取消预定成功',
            icon: 'none'
          });
        },
      })
    }).catch(err => {
      console.error(err)
    })
  },

  // 返回首页
  returnToHome: function () {
    wx.switchTab({
      url: '../homePage/homePage',
    });
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