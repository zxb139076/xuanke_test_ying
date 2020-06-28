// 获得当前的时钟分钟
import {
  formatTime
} from '../util/util.js';
// 获得当前的时间 2020-01-01
import {
  formatCurrentDate
} from '../util/util.js';

const app = getApp()
Page({

  /**
   * data
   */
  data: {
    isLoad: false,
    openid: '',
    resultList: null,
    headImgUrl: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=97e5614693d26e39f7f91d50980fcb80&t=1590716495",
    currentData: "",
    currentTime: "",
    username: ""
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
      title: '课程预约列表',
    });
  },

  /**
   * onLoad
   * @param {*} options 
   */
  onLoad: function (options) {
    const username = wx.getStorageSync('username');
    this.getMyCourseReserveList(username);
  },

  /**
   * onShow
   */
  onShow: function() {
    const username = wx.getStorageSync('username');
    this.getMyCourseReserveList(username);
  },

  /**
   * onHide
   */
  onHide: function () {
    this.setData({
      isLoad: false
    })
  },

  /**
   * 获取我的课程预定列表
   * @param {*} username 
   */
  getMyCourseReserveList: function (username) {
    wx.cloud.callFunction({
      name: "courseReserve",
      data: {
        requestType: 'showMyCourseReserveList',
        username: username
      }
    }).then(res => {
      this.setData({
        resultList: res.result.list,
        isLoad: true
      });
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 用户点击取消当前预定的课程
   * @param {qu} event 
   */
  cancelCourseReserve: function (event) {
    var currentTime = formatTime(new Date());
    var currentData = formatCurrentDate(new Date());
    var applyId = event.currentTarget.dataset.cid;
    var id = event.currentTarget.dataset.id;
    this.checkCourseReserveConfirm(currentData, currentTime, applyId, id);
  },

  /**
   * 检查当前时间能否取消课程
   * @param {当前的日期} currentData 
   * @param {当前的时间} currentTime 
   * @param {当前课程Id} applyId 
   * @param {当前课程预约的id} id 
   */
  checkCourseReserveConfirm: function (currentData, currentTime, applyId, id) {
    console.log(currentData);
    console.log(currentTime);
    console.log(applyId);
    console.log(id);
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'checkCourseReserveConfirm',
        applyId: applyId,
        currentData: currentData,
        currentTime: currentTime,   
      }
    }).then(res => {
      if (res.result.list.length > 0) {
        // 取消当前课程的预定信息
        this.deleteCourseReserveById(id);
      } else {
        this.showToast("当前课程已开课，不能取消！");
      }
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 取消当前课程的预定信息
   * @param {需要取消的预定id} id 
   */
  deleteCourseReserveById: function (id) {
    wx.cloud.callFunction({
      name: "courseReserve",
      data: {
        requestType: "deleteCourseReserveById",
        id: id
      }
    }).then(res => {
      this.showToast("取消课程预定成功！");
      this.onShow();
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 将null值转换为empty
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
   * @param {弹窗的标题} title 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }

})