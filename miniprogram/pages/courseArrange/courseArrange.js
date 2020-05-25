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
  },

  onReady: function () {
    var time = formatDate(new Date());
    var date = getDates(7, time);
    this.setData({
      dataList: date,
    })
    this.setData({
      week: this.data.dataList[0].week,
      time: this.data.dataList[0].time
    })
  },

  dataSelect: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      week: this.data.dataList[index].week,
      time: this.data.dataList[index].time,
      index: index
    })
  },
  
  // 显示项目添加面板
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },

  //取消按钮 
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },

  //取消按钮 
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认 
  confirm: function () {
    if (this.data.projectName == '') {
      wx.showToast({
        title: '请填写项目名称',
      });
      return false;
    }
    if (this.data.projectDetail == '') {
      wx.showToast({
        title: '请填写项目描述',
      });
      return false;
    }
    if (this.data.projectGroups == '') {
      wx.showToast({
        title: '请填写适合人群',
      });
      return false;
    }
    wx.cloud.callFunction({
      name: "catalogue",
      data: {
        requestType: 'catalogueAdd',
        projectName: this.data.projectName,
        projectDetail: this.data.projectDetail,
        projectGroups: this.data.projectGroups
      }
    }).then(res => {
      this.setData({
        hiddenmodalput: true,
        projectName: '',
        projectDetail: '',
        projectGroups: '',
      });
      this.cataLogueList();
      wx.showToast({
        title: '新增课程成功',
      });
    }).catch(err => {
      console.error(err)
    });
  },

})