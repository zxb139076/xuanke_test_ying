import {
  formatDate
} from '../util/util.js';
import {
  getDates
} from '../util/util.js';
import {
  formatTime
} from '../util/util.js';
import {
  formatCurrentDate
} from '../util/util.js';

const app = getApp();
Page({
  data: {
    isLoad: false,
    dataList: [],
    index: 0,
    currentData: '',
    currentWeek: '',
    resultList: null,
    countList: null,
    headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=9184ee1dd0a51f9965bb7fccd2598df3&t=1590470115"
  },

  // 确认预约课程
  confirmReserve: function (event) {
    this.setData({
      applyId: event.currentTarget.dataset.id
    });
    // 获取当前日期和时间
    var currentTime = formatTime(new Date());
    var currentData = formatCurrentDate(new Date());
    // 检查该时段能否预定该课程
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseReserveConfirm",
        currentData: currentData,
        currentTime: currentTime,
        applyId: this.data.applyId
      }
    }).then(res => {
      // 如果该课程可以预约
      if (res.result.list.length > 0) {
        // 检查是否预约过课程
        wx.cloud.callFunction({
          name: "courseReserve",
          data: {
            requestType: "getMyCourseReserveById",
            applyId: this.data.applyId,
            openid: app.globalData.openid
          }
        }).then(res => {
          if (res.result.data.length > 0) {
            wx.showToast({
              title: '你已预约过',
            })
            return false;
          } else {
            // 检查当前预约人数是否已满
            var lentgh = event.currentTarget.dataset.length;
            if (lentgh >= 1) {
              wx.showToast({
                title: '当前预约已满',
              })
              return false;
            } else {
              // 获取用户信息
              wx.getUserInfo({
                complete: (res) => {
                  this.setData({
                    nickName: res.userInfo.nickName,
                    headimgurl: res.userInfo.avatarUrl
                  })
                  const time = formatDate(new Date());
                  const db = wx.cloud.database()
                  // 增加预约课程记录
                  db.collection('courseReserve').add({
                    data: {
                      applyId: this.data.applyId,
                      nickName: res.userInfo.nickName,
                      headimgurl: res.userInfo.avatarUrl,
                      updateTime: time,
                      isFinished: 0
                    },
                    success: res => {
                      this.setData({
                        counterId: res._id
                      })
                      wx.showToast({
                        title: '预约课程成功',
                        icon: 'none'
                      })
                      // 完成课程预约并跳转页面
                      console.log('[数据库] [预约课程] 成功，记录 _id: ', res._id);
                      wx.navigateTo({
                        url: '../courseReserveFinished/courseReserveFinished?id=' + this.data.applyId
                      })
                    },
                    fail: err => {
                      wx.showToast({
                        icon: 'none',
                        title: '预约课程失败'
                      })
                      console.error('[数据库] [预约课程] 失败：', err)
                    }
                  })
                },
              })
            }
          }
        }).catch(err => {
          console.error(err)
        });
      } else {
        wx.showToast({
          title: '该课程已经开课，不能预约',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.error(err)
    });
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
  },

  onLoad: function (options) {
    // 获取当前的时间，如果没有则不赋值
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
      currentWeek: currentWeek,
      currentData: currentData,
    })
    wx.cloud.callFunction({
      name: "courseArrange",
      //检查我当前有没有预约过该课程
      data: {
        requestType: 'courseArrangeGetListByOrder',
        currentData: this.data.currentData,
        openid: app.globalData.openid
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list
      });
      // 获取当前预约的人数
      wx.cloud.callFunction({
        name: "courseArrange",
        data: {
          requestType: 'getCountOfCourseArrange',
          currentData: this.data.currentData,
        }
      }).then(res => {
        this.setData({
          countList: res.result.list,
          dataList: dataSet,
          index: index,
          isLoad: true
        });
      }).catch(err => {
        console.error(err)
      })
    }).catch(err => {
      console.error(err)
    })
  },

  onShow: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    // 获取我当前有没有预约过该课程
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetListByOrder',
        currentData: this.data.currentData,
        openid: app.globalData.openid
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list
      });
      // 获取当前选课的人数
      wx.cloud.callFunction({
        name: "courseArrange",
        data: {
          requestType: 'getCountOfCourseArrange',
          currentData: this.data.currentData,
        }
      }).then(res => {
        this.setData({
          countList: res.result.list,
          isLoad: true
        });
      }).catch(err => {
        console.error(err)
      })
    }).catch(err => {
      console.error(err)
    })
  },

  onHide: function () {
    this.setData({
      isLoad: false
    });
  },

  // 选择当前排课的日期(星期几)
  dataSelect: function (e) {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    var index = e.currentTarget.dataset.index;
    var currentData = this.data.dataList[index].time;
    var currentWeek = this.data.dataList[index].week;
    this.setData({
      currentWeek: currentWeek,
      currentData: currentData,
      index: index,
      isLoad: false
    })
    // 获取我当前有没有预约过该课程
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetListByOrder',
        currentData: this.data.currentData,
        openid: app.globalData.openid
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list
      });
      // 获取当前选课的人数
      wx.cloud.callFunction({
        name: "courseArrange",
        data: {
          requestType: 'getCountOfCourseArrange',
          currentData: this.data.currentData,
        }
      }).then(res => {
        this.setData({
          countList: res.result.list,
          isLoad: true
        });
      }).catch(err => {
        console.error(err)
      })
    }).catch(err => {
      console.error(err)
    })
  },

  // 跳转到预定详情页
  showCourseReserveFinished: function (event) {
    wx.navigateTo({
      url: '../courseReserveFinished/courseReserveFinished?id=' + event.currentTarget.dataset.id
    })
  },

})