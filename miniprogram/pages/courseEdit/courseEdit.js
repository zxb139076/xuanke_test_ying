// pages/catalogueEdit/catalogueEdit.js
Page({
  data: {
    id: '',
    catalogueId: '',
    courseName: '',
    courseDetail: '',
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    // 查询数据库记录
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
  //清除课程类目描述
  courseDetailClear: function (e) {
    this.setData({
      courseDetail: ''
    })
  },

  //调用云函数保存类目信息
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
        requestType: 'editCourseById',
        id: this.data.id,
        courseName: this.data.courseName,
        courseDetail: this.data.courseDetail,
      }
    }).then(res => {
      wx.navigateTo({
        url: '../courseList/courseList?id=' + this.data.catalogueId,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})