// pages/catalogueEdit/catalogueEdit.js
Page({
  data: {
    id: '0',
    catalogueId: '',
    courseName: '',
    courseDetail: '',
  },

  onLoad: function (options) {
    if (options.id != "0") {
      this.setData({
        id: options.id
      });
      wx.cloud.callFunction({
        name: "course",
        data: {
          requestType: 'getCourseById',
          id: options.id
        }
      }).then(res => {
        this.setData({
          courseName: res.result.data[0].courseName,
          courseDetail: res.result.data[0].courseDetail,
          catalogueId: res.result.data[0].catalogueId
        });
      }).catch(err => {
        console.error(err)
      })
    } else {
      this.setData({
        catalogueId: options.catalogueId
      });
    }
  },

  //获取课程名称
  courseNameBlur: function (e) {
    this.setData({
      courseName: e.detail.value
    })
  },
  //获取课程描述
  courseDetailBlur: function (e) {
    this.setData({
      courseDetail: e.detail.value
    })
  },

  //清除课程名称
  courseNameClear: function (e) {
    this.setData({
      courseName: ''
    })
  },

  saveEditCourse: function () {
    if (this.data.courseName == '') {
      wx.showToast({
        title: '请填写课程名称',
      });
      return false;
    }
    if (this.data.courseDetail == '') {
      wx.showToast({
        title: '请填写课程描述',
      });
      return false;
    }
    wx.cloud.callFunction({
      name: "course",
      data: {
        requestType: 'saveCourse',
        id: this.data.id,
        catalogueId: this.data.catalogueId,
        courseName: this.data.courseName,
        courseDetail: this.data.courseDetail,
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
  },
})