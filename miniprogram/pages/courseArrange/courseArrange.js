// pages/courseArrange/courseArrange.js
import {
  formatDate
} from '../util/util.js';
import {
  getDates
} from '../util/util.js';
Page({
  data: {
    id: '1',
    dataList: []
  },

  onLoad: function (options) {
    
  },

  onReady: function () {
    var time = formatDate(new Date());
    var date = getDates(7, time);
    console.log(date);
    this.setData({
      dataList: date,
    })
  },



})