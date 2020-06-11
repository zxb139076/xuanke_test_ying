// 获得当前的时间点 2020-01-01 12:00:01
import {
  formatDate
} from '../util/util.js';
// 获得近7天的日期列表
import {
  getDates
} from '../util/util.js';
// 获得当前的时分秒
import {
  formatTime
} from '../util/util.js';
// 获得当前日期
import {
  formatCurrentDate
} from '../util/util.js';

const app = getApp();
Page({
  data: {
    isLoad: false, // 页面是否加载完成
    dataList: [], // 近七天的日期列表
    index: 0, // 日期索引值
    currentData: '', // 当前日期
    currentWeek: '', // 当前星期几
    resultList: null, // 课程列表
    countList: null, // 课程预定人数列表
    headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=9184ee1dd0a51f9965bb7fccd2598df3&t=1590470115"
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '课程预定',
    });
  },

  onLoad: function (options) {
    // 获取当前的时间，如果没有则不赋值
    if (this.nullToEmpty(options.currentData) != "") {
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
    // 获取当前的日期
    var currentData = null;
    // 获取当前是星期几
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
    // 获取当前的日期索引
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
        //onLoad方法，获取当前预约的人数失败
        console.error(err);
        wx.showToast({
          title: '操作失败，请重试！',
        });
      });
    }).catch(err => {
      //onLoad方法，获取课程列表失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试！',
      });
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
        // onShow方法 获取当前选课人数失败
        console.error(err);
        wx.showToast({
          title: '操作失败，请重试！',
          icon: 'none'
        });
      });
    }).catch(err => {
      //onShow方法 获取课程列表失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试！',
        icon: 'none'
      });
    });
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
    // 获取当前的索引值
    var index = e.currentTarget.dataset.index;
    // 获取当前的日期
    var currentData = this.data.dataList[index].time;
    // 获取当前是星期几
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
        // daSelect方法，获取当前选课人数失败
        console.error(err);
        wx.showToast({
          title: '操作失败，请重试！',
          icon: 'none'
        });
      });
    }).catch(err => {
      // dataSelect方法 获取课程列表失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试！',
        icon: 'none'
      });
    })
  },

  // 确认预约课程
  confirmReserve: function (event) {
    this.setData({
      applyId: event.currentTarget.dataset.id
    });
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
          // 如果存在预约记录
          if (res.result.data.length > 0) {
            wx.showToast({
              title: '你已预约过该课程',
              icon: 'none'
            });
          } else {
            var lentgh = event.currentTarget.dataset.length;
            // 如果当前预约人数已存在4人
            if (lentgh >= 4) {
              wx.showToast({
                title: '当前预约人数已满4人',
                icon: 'none'
              });
            } else {
              // 获取用户名信息
              const username = wx.getStorageSync('username');
              if (this.nullToEmpty(username) == "") {
                // 如果当前没有登陆信息，则跳转到登陆页面
                wx.navigateTo({
                  url: '../login2/login2',
                });
                wx.showToast({
                  title: '当前还没有登陆，请先登陆！',
                  icon: 'none'
                })
                return false;
              };
              wx.cloud.callFunction({
                name: "users",
                data: {
                  requestType: 'getUserINFO',
                  account: username
                }
              }).then(res => {
                if (res.result.list.length > 0) {
                  const realname = res.result.list[0].realname;
                  const phone = res.result.list[0].phone;
                  const time = formatDate(new Date());
                  const db = wx.cloud.database();
                  // 增加预约课程记录
                  db.collection('courseReserve').add({
                    data: {
                      applyId: this.data.applyId,
                      username: username,
                      realname: realname,
                      phone: phone,
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
                      });
                      // 完成课程预约并跳转页面
                      console.log('[数据库] [预约课程] 成功，记录 _id: ', res._id);
                      wx.navigateTo({
                        url: '../courseReserveFinished/courseReserveFinished?id=' + this.data.applyId
                      });
                    },
                    fail: err => {
                      wx.showToast({
                        icon: 'none',
                        title: '预约课程失败'
                      });
                      console.error('[数据库] [预约课程] 失败：', err)
                    }
                  });
                } else { // 如果账号信息不存在
                  wx.showToast({
                    title: '账号信息不存在，请重试',
                    icon: 'none'
                  })
                }
              }).catch(err => {
                //confirmReserve方法， 获取用户信息失败
                console.error(err);
                wx.showToast({
                  title: '预约课程失败，请重试！',
                  icon: 'none'
                });
              })
            }
          }
        }).catch(err => {
          //confirmReserve方法 检查是否预约过该课程失败
          console.error(err);
          wx.showToast({
            title: '预约课程失败，请重试！',
            icon: 'none'
          });
        });
      } else {
        wx.showToast({
          title: '课程已经开课，不能预约',
          icon: 'none'
        });
      }
    }).catch(err => {
      //confirmReserve方法 检查该时段能否预定该课程失败
      console.error(err);
      wx.showToast({
        title: '预约课程失败，请重试！',
        icon: 'none'
      });
    });
  },

  // 跳转到预定详情页
  showCourseReserveFinished: function (event) {
    wx.navigateTo({
      url: '../courseReserveFinished/courseReserveFinished?id=' + event.currentTarget.dataset.id
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