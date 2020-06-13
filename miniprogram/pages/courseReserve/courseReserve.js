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
    isLoad: false,
    dataList: [],
    index: 0,
    currentData: '',
    currentWeek: '',
    resultList: null,
    countList: null,
    headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=9184ee1dd0a51f9965bb7fccd2598df3&t=1590470115",
    username: ""
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '课程预约',
    });
  },

  /**
   * 获取当前预约课程的人数
   * @param {当前的日期} currentData 
   */
  getCountOfCourseArrange: function (currentData) {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'getCountOfCourseArrange',
        currentData: currentData,
      }
    }).then(res => {
      this.setData({
        countList: res.result.list,
        isLoad: true
      });
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 获取课程排课列表
   * @param {当前的日期} currentData 
   * @param {预约用户的账号} username 
   */
  getCourseArrangeList: function (currentData, username) {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetListByOrder',
        currentData: currentData,
        username: username
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list
      });
      this.getCountOfCourseArrange(currentData);
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * onLoad
   * @param {*} options 
   */
  onLoad: function (options) {
    const username = wx.getStorageSync('username');
    this.setData({
      username: username
    });
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
      dataList: dataSet,
      index: index,
    });
    this.getCourseArrangeList(this.data.currentData, username);
  },

  /**
   * onShow
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    this.getCourseArrangeList(this.data.currentData, this.data.username);
  },

  /**
   * 选择当前的排课日期
   * @param {*} e 
   */
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
    this.getCourseArrangeList(currentData, this.data.username);
  },

  /**
   * onHide
   */
  onHide: function () {
    this.setData({
      isLoad: false
    });
  },

  /**
   * 用户点击确定预约课程
   * @param {*} event 
   */
  confirmReserve: function (event) {
    if (this.data.username == "") {
      wx.navigateTo({
        url: '../login_wx/login_wx',
      });
      this.showToast("当前还没有登录，请先登录！");
      return false;
    };
    this.setData({
      applyId: event.currentTarget.dataset.id,
      length: event.currentTarget.dataset.length
    });
    var currentData = formatCurrentDate(new Date());
    var currentTime = formatTime(new Date());
    // 检查当前时间段能否预约课程
    this.checkCourseReserveConfirmer(this.data.currentData, this.data.currentTime, this.data.username, this.data.applyId, this.data.length);
  },

  /**
   * 检查当前时段能否预约课程
   * @param {当前的日期} currentData 
   * @param {当前的时间} currentTime 
   * @param {当前账号的用户名} username 
   * @param {当前预约课程的Id} applyId
   * @param {当前已选课人数} length
   */
  checkCourseReserveConfirmer: function (currentData, currentTime, username, applyId, length) {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseReserveConfirm",
        currentData: currentData,
        currentTime: currentTime,
        applyId: applyId
      }
    }).then(res => {
      if (res.result.list.length > 0) {
        // 检查我是否预约过该课程
        this.checkMyReserve(username, applyId, length);
      } else {
        this.showToast("课程当前时段不能预约，请重试！");
      }
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 检查我是否预约过该课程
   * @param {当前用户的账号} username 
   * @param {当前选课的ID} applyId 
   * @param {当前预约课程的人数} length 
   */
  checkMyReserve: function (username, applyId, length) {
    wx.cloud.callFunction({
      name: "courseReserve",
      data: {
        requestType: "getMyCourseReserveById",
        applyId: applyId,
        username: username
      }
    }).then(res => {
      if (res.result.data.length > 0) {
        this.showToast("您已预约过该课程，请重试！");
      } else {
        if (length >= 4) {
          this.showToast("当前预约人数已满4人，请重试！");
        } else {
          // 获取用户的账号信息
          this.getUserInfo(applyId, username);
        }
      }
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 获取用户的账号信息
   * @param {当前预约课程的ID} applyId
   * @param {用户的账号名} username 
   */
  getUserInfo: function (applyId, username) {
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
        const headImg = res.result.list[0].headImg;
        const time = formatDate(new Date());
        // 增加课程预约记录
        this.addCourseReserve(applyId, username, realname, phone, headImg, time);
      } else {
        this.showToast("操作失败，请重试");
      }
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 增加预约课程记录
   * @param {当前预约课程的ID} applyId
   * @param {用户的账号名} username 
   * @param {用户的真实姓名} realname
   * @param {用户的手机号} phone
   * @param {用户的头像} headImg
   * @param {用户的预约时间点} time
   */
  addCourseReserve(applyId, username, realname, phone, headImg, time) {
    const db = wx.cloud.database();
    db.collection('courseReserve').add({
      data: {
        applyId: applyId,
        username: username,
        realname: realname,
        phone: phone,
        updateTime: time,
        isFinished: 0,
        headImg: headImg
      },
      success: res => {   
        // 跳转到预约详情页
        wx.navigateTo({
          url: '../courseReserveFinished/courseReserveFinished?id=' + applyId
        });
        this.showToast("预约课程成功");
      },
      fail: err => {
        this.showToast("操作失败，请重试");
      }
    });
  },

  /**
   * 跳转到预定详情页面
   * @param {*} event 
   */
  showCourseReserveFinished: function (event) {
    wx.navigateTo({
      url: '../courseReserveFinished/courseReserveFinished?id=' + event.currentTarget.dataset.id
    })
  },

  /**
   * 将null字符串转换为empty
   * @param {*} value 
   */
  nullToEmpty: function (value) {
    if (value == undefined) {
      return "";
    } else if (value == null) {
      return "";
    } else if (value == "") {
      return "";
    }
  },

  /**
   * 弹窗代码封装
   * @param {*} title 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }

})