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
    isLoad: false,
    courseInfo: '',
    resultList: null,
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
      title: '课程排课详情',
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
    this.showCourseArrangeDetail();
  },

  /**
   * onShow
   */
  onShow: function () {
    this.showCourseArrangeDetail();
  },

  /**
   * 获取课程详情信息
   */
  showCourseArrangeDetail() {
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
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 教师确认完成课程
   */
  confirmCourseArrange: function () {
    var currentData = formatCurrentDate(new Date());
    var currentTime = formatTime(new Date());
    this.checkCourseArrange(currentData, currentTime);
  },

  /**
   * 检查当前课程能否确认完成
   * @param {当前的日期} currentData 
   * @param {当前的时间} currentTime 
   */
  checkCourseArrange: function (currentData, currentTime) {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "checkCourseArrangeUpdateFinished",
        currentData: currentData,
        currentTime: currentTime,
        id: this.data.id
      }
    }).then(res => {
      if (res.result.list.length > 0) {
        // 更新课程为完成状态
        this.updateCourseArrangeStatus();
      } else {
        this.showToast("当前课程没有结束，不能确认完成");
      }
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 更新课程为完成状态
   */
  updateCourseArrangeStatus: function () {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "updateCourseArrange",
        id: this.data.id
      }
    }).then(res => {
      this.updateCourseArrangeReserveStatus();
    }).catch(err => {
      console.error(err)
      this.showToast("操作失败，请重试！");
    })
  },

  /**
   * 更新课程预定人员为完成状态
   */
  updateCourseArrangeReserveStatus: function() {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: "updateCourseArrangeFinished",
        id: this.data.id
      }
    }).then(res => {
      this.showToast("确认课程更新成功！");
      wx.navigateTo({
        url: '../courseArrangeConfirmFinished/courseArrangeConfirmFinished?id=' + this.data.id,
      });
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 显示课程详情信息
   */
  showConfirmDetail: function () {
    wx.navigateTo({
      url: '../courseArrangeConfirmFinished/courseArrangeConfirmFinished?id=' + this.data.id,
    })
  },

  /**
   * 封装弹窗代码
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }

})