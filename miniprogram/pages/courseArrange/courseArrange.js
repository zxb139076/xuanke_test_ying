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
    isLoad: false, //页面是否加载完成
    dataList: [], //近7天的日期队列
    index: 0, //索引值
    currentData: '', //当前日期
    currentWeek: '', //当前是星期几
    resultList: null, //课程列表
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
      title: '课程排课',
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
      currentWeek: currentWeek
    })
    // 获取课程排课列表
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetList',
        currentData: this.data.currentData
      }
    }).then(res => {
      this.setData({
        dataList: dataSet,
        resultList: res.result.data,
        index: index,
        isLoad: true
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
      //onLoad方法，获取课程排课列表失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      })
    })
  },

  onShow: function () {
    console.log("onshow");
    // 获取当前的课程列表
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
      // onShow方法，获取课程列表失败
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
      currentData: currentData,
      currentWeek: currentWeek,
      index: index,
      isLoad: false
    })
    // 获取课程排课列表
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetList',
        currentData: this.data.currentData,
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data
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
      // 获取课程列表失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试！',
        icon: 'none'
      });
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
  },

  // 将为null或undefined的字段转换
  nullToEmpty: function (value) {
    if (value == undefined) {
      return "";
    } else if (value == null) {
      return "";
    }
  }

})