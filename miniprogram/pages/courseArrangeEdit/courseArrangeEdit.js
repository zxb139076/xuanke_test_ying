Page({
  data: {
    index: 0,
    date: "2016-09-01",
    startTime: "19:00",
    endTime: "21:00",
    currentData: "",
    currentWeek: "",
    coursename: ""
  },

  bindCourseChange: function(e) {
    this.setData({
      courseName: e.detail.value
    })
  },

  bindStartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  bindEndTimeChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  saveCourseArrange: function () {
    if (this.data.courseName == '') {
      wx.showToast({
        title: '请填写课程名称',
      });
      return false;
    }
    if (this.data.startTime == '') {
      wx.showToast({
        title: '请填写课程开始时间',
      });
      return false;
    }
    if (this.data.endTime == '') {
      wx.showToast({
        title: '请填写课程结束时间',
      });
      return false;
    }
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'courseArrangeAdd',
        courseName: this.data.courseName,
        currentData: this.data.currentData,
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        currentWeek: this.data.currentWeek
      }
    }).then(res => {
      wx.navigateBack({
        complete: (res) => {
          console.log("保存成功");
        },
      })
    }).catch(err => {
      console.error(err)
    });
  },

  onReady: function () {

  },

  onLoad: function (options) {
    console.log(options.time);
    console.log(options.week);
    this.setData({
      currentData: options.time,
      currentWeek: options.week
    })
  }
})