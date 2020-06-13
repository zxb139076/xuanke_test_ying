// 获得当前时间点
import {
  formatDate
} from '../util/util.js';
// 获得近7天的日期列表
import {
  getDates
} from '../util/util.js';

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
      title: '课程排课',
    });
  },

  /**
   * onLoad
   * @param {*} options 
   */
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
    // 获取当前的时间
    var currentData = null;
    // 获取当前是星期几
    var currentWeek = null;
    // 获取当前的时间点
    var time = formatDate(new Date());
    // 获取当前近7天的日期列表
    var dataSet = getDates(7, time);
    var index = -1;
    if (this.data.currentData == '') {
      currentData = dataSet[0].time;
      currentWeek = dataSet[0].week;
    } else {
      currentData = this.data.currentData;
      currentWeek = this.data.currentWeek;
    }
    // 获取当前的索引值
    for (var i = 0; i < dataSet.length; i++) {
      if (currentData == dataSet[i].time) {
        index = i;
        break
      }
    }
    this.setData({
      currentData: currentData,
      currentWeek: currentWeek,
      dataList: dataSet,
      index: index
    })
    this.getCourseArrangeList(this.data.currentData);
  },

  /**
   * onShow
   */
  onShow: function () {
    // 获取当前的课程列表
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    this.getCourseArrangeList(this.data.currentData);
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
   * dataSelect
   * @param {*} e 
   */
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
      currentData: currentData,
      currentWeek: currentWeek,
      index: index,
      isLoad: false
    });
    // 获取课程排课列表
    this.getCourseArrangeList(currentData);
  },

  /**
   * 根据当前日期获取课程排课列表
   * @param {当前日期} currentData 
   */
  getCourseArrangeList: function (currentData) {
    // 获取课程排课列表
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetList',
        currentData: currentData,
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data
      });
      this.getCountOfCourseArrange(currentData);
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 获取当前课程的选课人数
   * @param {当前日期} currentData 
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

  // 显示添加课程排课页面
  showCourseArrangeAdd: function (event) {
    wx.navigateTo({
      url: '../courseArrangeEdit/courseArrangeEdit?currentData=' + this.data.currentData + "&currentWeek=" + this.data.currentWeek + "&id=0",
    })
  },

  // 显示编辑课程排课页面
  showEditCourseArrange: function (event) {
    wx.navigateTo({
      url: '../courseArrangeEdit/courseArrangeEdit?currentData=' + this.data.currentData + "&currentWeek=" + this.data.currentWeek + "&id=" + event.currentTarget.dataset.id,
    })
  },

  // 显示课程排课详细信息
  showCourseArrangeDetail: function (event) {
    wx.navigateTo({
      url: '../courseArrangeDetail/courseArrangeDetail?id=' + event.currentTarget.dataset.id,
    })
  },

  // 将为null或undefined的字段转换
  nullToEmpty: function (value) {
    if (value == undefined) {
      return "";
    } else if (value == null) {
      return "";
    }
  },

  /**
   * 封装弹窗代码
   * @param {弹窗标题} title 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }

})