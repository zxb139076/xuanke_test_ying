Page({

  /**
   * data
   */
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
      title: '课程排课编辑',
    });
  },

  /**
   * onLoad
   * @param {*} options 
   */
  onLoad: function (options) {
    if (options.id != "0") {
      this.getCourseArrangeById(options.id);
    } else {
      this.setData({
        currentData: options.currentData,
        currentWeek: options.currentWeek
      })
    }
    this.getAllCourseList();
  },

  /**
   * 根据ID获取课程排课详细信息
   * @param {课程排课id} id 
   */
  getCourseArrangeById: function (id) {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'getCourseArrangeById',
        id: id
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
    });
  },

  /**
   * 获取全部课程列表
   */
  getAllCourseList: function () {
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
    });
  },

  /**
   * 获取用户课程名称的输入
   * @param {*} e 
   */
  CourseNameChange: function (e) {
    this.setData({
      courseName: this.data.array[e.detail.value]
    })
  },

  /**
   * 获取用户输入的课程开始时间
   * @param {*} e 
   */
  StartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  /**
   * 获取用户输入的课程结束时间
   * @param {*} e 
   */
  EndTimeChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  /**
   * 保存课程排课信息
   */
  saveCourseArrange: function () {
    if (this.data.courseName == '') {
      this.showToast("请填写课程名称");
      return false;
    }
    if (this.data.startTime == '') {
      this.showToast("请填写课程开始时间");
      return false;
    }
    if (this.data.endTime == '') {
      this.showToast("请填写课程结束时间")
      return false;
    }
    if ((this.data.startTime) >= (this.data.endTime)) {
      this.showToast("课程开始时间大于等于课程结束时间");
      return;
    }
    this.checkCourseArrangeByTime(this.data.currentData, this.data.startTime, this.data.endTime);
  },

  /**
   * 检查当前日期当前时间是否有课程存在
   * @param {当前的日期} currentData 
   * @param {课程开始时间} startTime 
   * @param {课程结束时间} endTime 
   */
  checkCourseArrangeByTime: function (currentData, startTime, endTime) {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        id: this.data.id,
        requestType: 'checkCourseArrangeByTime',
        currentData: currentData,
        startTime: startTime,
        endTime: endTime
      }
    }).then(res => {
      if (res.result.list.length < 1) {
        this.updateCourseArrange(currentData, startTime, endTime);
      } else {
        this.showToast("该时段已经有课程，请重新填写时间！");
      }
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 更新课程排课信息
   * @param {当前的日期} currentData 
   * @param {课程开始时间} startTime 
   * @param {课程结束时间} endTime 
   */
  updateCourseArrange: function (currentData, startTime, endTime) {
    wx.cloud.callFunction({
      name: "courseArrange",
      data: {
        requestType: 'saveCourseArrange',
        id: this.data.id,
        courseName: this.data.courseName,
        currentData: currentData,
        currentWeek: this.data.currentWeek,
        startTime: startTime,
        endTime: endTime,
      }
    }).then(res => {
      wx.navigateBack({
        complete: (res) => {
          this.showToast("保存成功！");
        },
      })
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 弹窗代码封装
   * @param {弹窗的标题} title 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }

})