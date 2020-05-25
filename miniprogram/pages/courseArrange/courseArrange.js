// pages/courseArrange/courseArrange.js
import {
  formatDate
} from '../util/util.js';
import {
  getDates
} from '../util/util.js';

Page({
  data: {
    dataList: [],
    index: 0,
    currentData: '',  
    currentWeek: '',
    resultList: null,
    headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/che_piano.jpg?sign=09874cc485520cc6434bf31e2ec25e28&t=1590126475"
  },

  // 页面准备渲染
  onReady: function () {
    var time = formatDate(new Date());
    var dateSet = getDates(7, time);
    this.setData({
      dataList: dateSet,
      currentWeek: dateSet[0].week,
      currentData: dateSet[0].time
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

  // 选择当前排课的日期(星期几)
  dataSelect: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentWeek: this.data.dataList[index].week,
      currentData: this.data.dataList[index].time,
      index: index
    })
    console.log(this.data.currentData);
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

  // 显示编辑课程排课页面
  showCourseArrangeEdit: function (event) {
    wx.navigateTo({
      url: '../courseArrangeEdit/courseArrangeEdit?time=' + event.currentTarget.dataset.time + "&week=" + event.currentTarget.dataset.week,
    })
  }

})