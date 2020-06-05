Page({
  data: {
    isLoad: false,
    array: null,
    id: '0',
    startTime: "19:00",
    endTime: "21:00",
    currentData: "",
    currentWeek: "",
    courseName: ""
  },

  CourseNameChange: function (e) {
    this.setData({
      courseName: this.data.array[e.detail.value]
    })
  },

  StartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  EndTimeChange: function (e) {
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
    if ((this.data.startTime) > (this.data.endTime)) {
      wx.showToast({
        title: '开始时间大于结束时间',
        icon: 'none'
      })
      return;
    }
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        id: this.data.id,
        requestType: 'checkCourseArrangeByTime',
        currentData: this.data.currentData,
        startTime: this.data.startTime,
        endTime: this.data.endTime
      }
    }).then(res => {
      if (res.result.list.length < 1) {
        wx.cloud.callFunction({
          name: "courseArrange",
          data: {
            requestType: 'saveCourseArrange',
            id: this.data.id,
            courseName: this.data.courseName,
            currentData: this.data.currentData,
            currentWeek: this.data.currentWeek,
            startTime: this.data.startTime,
            endTime: this.data.endTime,
          }
        }).then(res => {
          wx.navigateBack({
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
        wx.showToast({
          title: '该时段已有课程',
        })
      }
    }).catch(err => {
      console.error(err)
    });
  },

  onLoad: function (options) {
    if (options.id != "0") {
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
    wx.cloud.callFunction({
      name: "course",
      data: {
        requestType: 'courseGetAllList',
      }
    }).then(res => {
      var array = [];
      for (var i = 0; i < res.result.data.length; i++) {
        array[i] = res.result.data[i].courseName;
      }
      this.setData({
        array: array,
        isLoad: true
      });
    }).catch(err => {
      console.error(err)
    })
  }

})