// pages/courseArrange/courseArrange.js
import {
  formatDate
} from '../util/util.js';
import {
  getDates
} from '../util/util.js';
Page({
  data: {
    hiddenmodalput: true,
    id: '1',
    dataList: [],
    index: 0,
    time: '',
    week: '',
    startTime: "00:00",
    endTime: "24:00",
    selectTime: "11:30",
    resultList: null
  },

  // 页面准备渲染
  onReady: function () {
    var time = formatDate(new Date());
    var date = getDates(7, time);
    this.setData({
      dataList: date,
    })
    console.log(this.data.dataList[0].time);
    this.setData({
      week: this.data.dataList[0].week,
      time: this.data.dataList[0].time
    })
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetList',
        currentData: this.data.time
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data
      });
    }).catch(err => {
      console.error(err)
    })
  },

  // 选择当前排课的日期
  dataSelect: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      week: this.data.dataList[index].week,
      time: this.data.dataList[index].time,
      index: index
    })
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeGetList',
        currentData: this.data.time
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