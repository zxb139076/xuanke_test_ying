import {
  formatDate
} from '../util/util.js';
import {
  getDates
} from '../util/util.js';

Page({
  data: {
    isLoad: false,
    dataList: [],
    resultList: null,
    index: 0,
    currentData: '',
    currentWeek: '',
    headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=9184ee1dd0a51f9965bb7fccd2598df3&t=1590470115"
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
      currentData: currentData,
      currentWeek: currentWeek
    })
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetList',
        currentData: this.data.currentData,
        isLoad: true
      }
    }).then(res => {
      this.setData({
        dataList: dataSet,
        resultList: res.result.data,
        index: index,
        isLoad: true
      });
    }).catch(err => {
      console.error(err)
    })
  },

  onShow: function () {
    this.setData({
      isLoad: false
    });
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetList',
        currentData: this.data.currentData
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data,
        isLoad: true
      });
    }).catch(err => {
      console.error(err)
    })
  },

  // 选择当前排课的日期(星期几)
  dataSelect: function (e) {
    var index = e.currentTarget.dataset.index;
    var currentData = this.data.dataList[index].time;
    wx.redirectTo({
      url: '../courseArrange/courseArrange?currentData=' + currentData,
    })
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
  }

})