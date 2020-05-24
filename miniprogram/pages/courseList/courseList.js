// pages/courseAdd/courseAdd.js
var app = getApp()
Page({
  data: {
    hiddenmodalput: true,
    catalogueId: '',
    courseName: '',
    courseDetail: '',
    resultList: null,
    addImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/add2.png?sign=628ec5a02762a8e81a91287a91b9d91d&t=1590133101",
    editImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/edit2.png?sign=ef6e1aba71848b80bc8a0ec3a5cf6938&t=1590133258",
    deleteImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/delete2.png?sign=1b5f6dc4dd932c7fe7aea760163a189f&t=1590133125",
    headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/che_piano.jpg?sign=09874cc485520cc6434bf31e2ec25e28&t=1590126475",
  },
  //获取项目名称
  courseNameInput: function (e) {
    this.setData({
      courseName: e.detail.value
    })
    console
  },
  //获取项目描述
  courseDetailInput: function (e) {
    this.setData({
      courseDetail: e.detail.value
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
  //确认 
  confirm: function () {
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
        requestType: 'courseAdd',
        catalogueId: this.data.catalogueId,
        courseName: this.data.courseName,
        courseDetail: this.data.courseDetail
      }
    }).then(res => {
      this.setData({
        hiddenmodalput: true,
        courseName: '',
        courseDetail: '',
      });
      this.courseList();
      wx.showToast({
        title: '新增课程成功',
      });
    }).catch(err => {
      console.error(err)
    });
  },

  onLoad: function (options) {
    this.setData({
      catalogueId: options.id
    });
    wx.cloud.callFunction({
      name: "course",
      data: {
        requestType: 'courseGetList',
        catalogueId: options.id
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data
      });
    }).catch(err => {
      console.error(err)
    })
  },

  courseList: function () {
    wx.cloud.callFunction({
      name: "course",
      data: {
        requestType: 'courseGetList',
        catalogueId: this.data.catalogueId
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data
      });
    }).catch(err => {
      console.error(err)
    })
  },
  showEditCourse: function (event) {
    wx.navigateTo({
      url: '../courseEdit/courseEdit?id=' + event.currentTarget.dataset.id,
    })
  }
})