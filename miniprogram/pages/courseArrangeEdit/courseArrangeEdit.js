Page({
  data: {
    id: '',
    startTime: "19:00",
    endTime: "21:00",
    currentData: "",
    currentWeek: "",
    coursename: ""
  },

  bindCourseChange: function (e) {
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
    if (this.data.id == "") {
      wx.cloud.callFunction({
        name: "courseArrange",
        data: {
          requestType: 'courseArrangeAdd',
          courseName: this.data.courseName,
          currentData: this.data.currentData,
          currentWeek: this.data.currentWeek,
          startTime: this.data.startTime,
          endTime: this.data.endTime
        }
      }).then(res => {
        wx.navigateTo({
          url: '../courseArrange/courseArrange?currentData=' + this.data.currentData,
          complete: (res) => {
            wx.showToast({
              title: '保存成功',
            });
          },
        })
      }).catch(err => {
        console.error(err)
      });
    } else {
      wx.cloud.callFunction({
        name: "courseArrange",
        data: {
          requestType: 'editCourseArrangeById',
          id: this.data.id,
          courseName: this.data.courseName,
          startTime: this.data.startTime,
          endTime: this.data.endTime
        }
      }).then(res => {
        wx.navigateTo({
          url: '../courseArrange/courseArrange?currentData=' + this.data.currentData,
          complete: (res) => {
            wx.showToast({
              title: '保存成功',
            });
          },
        })
      }).catch(err => {
        console.error(err)
      });
    }
  },

  onReady: function () {

  },

  onLoad: function (options) {
    if (options.id && options.id != "") {
      wx.cloud.callFunction({
        name: "courseArrange",
        data: {
          requestType: 'getCourseArrangeById',
          id: options.id
        }
      }).then(res => {
        this.setData({
          startTime: res.result.data[0].startTime,
          endTime: res.result.data[0].endTime,
          courseName: res.result.data[0].courseName,
          currentData: res.result.data[0].currentData,
          currentWeek: res.result.data[0].currentWeek,
          id: res.result.data[0]._id
        });
      }).catch(err => {
        console.error(err)
      })
    } else {
      this.setData({
        currentData: options.currentData,
        currentWeek: options.currentWeek
      })
    }
  }
})