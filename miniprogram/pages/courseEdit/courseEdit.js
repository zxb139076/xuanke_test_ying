Page({

  /**
   * 初始化数据
   */
  data: {
    isLoad: false,
    id: '0',
    catalogueId: '',
    courseName: '',
    courseDetail: '',
    courseOrder: '',
  },

  /**
   * onReady
   */
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

  /**
   * onLoad
   * @param {*} options 
   */
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
          courseOrder: res.result.data[0].courseOrder,
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

  /**
   * 获得用户输入的课程名称
   * @param {*} e 
   */
  courseNameBlur: function (e) {
    this.setData({
      courseName: e.detail.value
    })
  },

  /**
   * 获得用户输入的课程描述
   * @param {*} e 
   */
  courseDetailBlur: function (e) {
    this.setData({
      courseDetail: e.detail.value
    })
  },

  /**
   * 获得用户输入的课程次序
   * @param {*} e 
   */
  courseOrderBlur: function(e) {
    this.setData({
      courseOrder: e.detail.value
    })
  },

  /**
   * 点击保存课程信息
   */
  saveEditCourse: function () {
    if (this.data.courseName == '') {
      this.showToast("请填写课程名称");
      return false;
    }
    if (this.data.courseDetail == '') {
      this.showToast("请填写课程描述");
      return false;
    }
    if (this.data.courseOrder == '') {
      this.showToast("请填写课程排序");
      return false;
    }
    this.checkCourseIsExited(this.data.courseName, this.data.courseDetail, this.data.courseOrder);
  },

  /**
   * 检查课程信息是否存在
   * @param {课程名称} courseName 
   * @param {课程描述} courseDetail 
   * @param {课程排序} courseOrder
   */
  checkCourseIsExited: function (courseName, courseDetail, courseOrder) {
    wx.cloud.callFunction({
      name: "course",
      data: {
        requestType: "checkCourseIsExited",
        id: this.data.id,
        courseName: courseName,
        courseOrder: courseOrder
      }
    }).then(res => {
      if (res.result.list < 1) {
        this.updateCourseInfo(courseName, courseDetail, courseOrder);
      } else { 
        this.showToast("课程名称已存在，请重试！");
      }
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 更新课程信息
   * @param {课程名称} courseName 
   * @param {课程描述} courseDetail 
   * @param {课程次序} courseOrder
   */
  updateCourseInfo: function(courseName, courseDetail, courseOrder) {
    //保存课程信息
    wx.cloud.callFunction({
      name: "course",
      data: {
        requestType: 'saveCourse',
        id: this.data.id,
        catalogueId: this.data.catalogueId,
        courseName: courseName,
        courseDetail: courseDetail,
        courseOrder: courseOrder
      }
    }).then(res => {
      wx.navigateBack({
        complete: (res) => {
          this.showToast("保存成功");
        },
      })
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 封装弹窗代码
   * @param {*} title 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }
})