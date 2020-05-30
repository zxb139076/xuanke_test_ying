// pages/courseArrange/courseArrange.js
import {
  formatDate
} from '../util/util.js';
import {
  getDates
} from '../util/util.js';
const app = getApp();
Page({
  data: {
    dataList: [],
    index: 0,
    currentData: '',
    currentWeek: '',
    resultList: null,
    headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=9184ee1dd0a51f9965bb7fccd2598df3&t=1590470115"
  },

  // 确认预约课程
  confirmReserve: function (event) {
    this.onGetOpenid();
    wx.cloud.callFunction({
      name: "courseReserve",
      data: {
        requestType: "checkCourseReserve",
        applyId: event.currentTarget.dataset.id,
        currentData: this.data.currentData,
        openid: app.globalData.openid
      }
    }).then(res => {
      var isReserve = res.result.data.length
      if (isReserve > 0) {
        wx.showToast({
          title: '你已预约过',
        })
        return false;
      } else {
        wx.getUserInfo({
          complete: (res) => {
            this.setData({
              nickName: res.userInfo.nickName,
              headimgurl: res.userInfo.avatarUrl
            })
            const time = formatDate(new Date());
            const db = wx.cloud.database()
            db.collection('courseReserve').add({
              data: {
                applyId: event.currentTarget.dataset.id,
                nickName: res.userInfo.nickName,
                headimgurl: res.userInfo.avatarUrl,
                updateTime: time,
                isFinished: 0,
                currentData: this.data.currentData
              },
              success: res => {
                this.setData({
                  counterId: res._id
                })
                wx.showToast({
                  title: '预约课程成功',
                })
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '预约课程失败'
                })
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
          },
        })
      }
    }).catch(err => {
      console.error(err)
    });
  },

  // 检查是否预约过该课程
  checkCourseReserve: function (applyId) {
    wx.cloud.callFunction({
      name: "courseReserve",
      data: {
        requestType: "checkCourseReserve",
        applyId: applyId,
        currentData: this.data.currentData,
        openid: app.globalData.openid
      }
    }).then(res => {
      return res.result.data.length;
    }).catch(err => {
      console.error(err)
    });
  },

  // 页面准备渲染
  onReady: function () {
    var currentData = null;
    var currentWeek = null;
    var time = formatDate(new Date());
    var dataSet = getDates(7, time);
    var index = -1;
    if (this.data.currentData == '') {
      currentData = dataSet[0].time;
      currentWeek = dataSet[0].week;
    } else {
      currentData = this.data.currentData;
      currentWeek = this.data.currentWeek;
    }
    for (var i = 0; i < dataSet.length; i++) {
      if (currentData == dataSet[i].time) {
        index = i;
        break
      }
    }
    this.setData({
      dataList: dataSet,
      currentWeek: currentWeek,
      currentData: currentData,
      index: index
    })
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetList',
        currentData: this.data.currentData
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data
      });
    }).catch(err => {
      console.error(err)
    })
  },

  onLoad: function (options) {
    if (options.currentData != undefined) {
      this.setData({
        currentData: options.currentData,
        currentWeek: options.currentWeek,
        index: options.index
      })
    } else {
      this.setData({
        currentData: '',
        currentWeek: '',
        index: -1
      })
    }
  },

  // 选择当前排课的日期(星期几)
  dataSelect: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentWeek: this.data.dataList[index].week,
      currentData: this.data.dataList[index].time,
      index: index
    })
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetList',
        currentData: this.data.currentData
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data
      });
    }).catch(err => {
      console.error(err)
    })
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 显示添加课程排课页面
  showCourseArrangeAdd: function (event) {
    wx.navigateTo({
      url: '../courseArrangeEdit/courseArrangeEdit?currentData=' + this.data.currentData + "&currentWeek=" + this.data.currentWeek,
    })
  },

  // 显示编辑课程排课页面
  showEditCourseArrange: function (event) {
    wx.navigateTo({
      url: '../courseArrangeEdit/courseArrangeEdit?id=' + event.currentTarget.dataset.id,
    })
  }

})