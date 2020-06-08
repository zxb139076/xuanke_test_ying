Page({
  data: {
    isLoad: false,
    id: '0', //课程id
    catalogueId: '', //课程类目id
    courseName: '', //课程名称
    courseDetail: '', //课程详情
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '课程编辑',
    });
  },

  onLoad: function (options) {
    //如果课程id不为0
    if (options.id != "0") {
      //保存课程id
      this.setData({
        id: options.id
      });
      //获取课程信息
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
    } else { //如果课程id存在
      this.setData({
        catalogueId: options.catalogueId
      });
    }
    this.setData({
      isLoad: true
    });
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

  // 保存课程信息
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
    //检查课程信息是否存在
    console.log("课程id:" + this.data.id);
    console.log("课程名称:" + this.data.courseName);
    wx.cloud.callFunction({
      name: "course",
      data: {
        requestType: "checkCourseIsExited",
        id: this.data.id,
        courseName: this.data.courseName
      }
    }).then(res => {
      // 如果课程名称没有重复
      if (res.result.list < 1) {
        //保存课程信息
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
          //saveEditCourse方法，保存课程信息失败
          console.error(err);
          wx.showToast({
            title: '操作失败，请重试',
            icon: 'none'
          });
        });
      } else { // 课程名称有重复
        wx.showToast({
          title: '课程名称已存在，请重试',
          icon: 'none'
        });
      }
    }).catch(err => {
      //saveEditCourse方法，检查课程信息是否存在失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      });
    });
  },
})