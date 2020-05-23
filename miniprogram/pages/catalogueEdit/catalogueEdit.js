// pages/catalogueEdit/catalogueEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    projectName: '',
    projectDetail: '',
    projectGroups: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { //此处接收传递过来的参数wx.navigateTo跳转时传递的参数
    this.setData({
      id: options.id
    });
    // 查询数据库记录
    wx.cloud.callFunction({
      name: "catalogue",
      data: {
        requestType: 'getCatalogueById',
        id: options.id
      }
    }).then(res => {
      this.setData({
        projectName: res.result.data[0].projectName,
        projectDetail: res.result.data[0].projectDetail,
        projectGroups: res.result.data[0].projectGroups
      });
    }).catch(err => {
      console.error(err)
    })
  },

  //获取课程类目名称
  projectNameBlur: function (e) {
    this.setData({
      projectName: e.detail.value
    })
  },
  //获取课程类目描述
  projectDetailBlur: function (e) {
    this.setData({
      projectDetail: e.detail.value
    })
  },
  //获取课程类目适合人群
  projectGroupsBlur: function (e) {
    this.setData({
      projectGroups: e.detail.value
    })
  },

  //清除课程类目名称
  projectNameClear: function (e) {
    this.setData({
      projectName: ''
    })
  },
  //清除课程类目描述
  projectDetailClear: function (e) {
    this.setData({
      projectDetail: ''
    })
  },
  //清除课程类目适合人群
  projectGroupsClear: function (e) {
    this.setData({
      projectGroups: ''
    })
  },

  //调用云函数保存类目信息
  saveEditCatalogue: function () {
    setTimeout(() => {
      
    }, 2000);
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
        requestType: 'editCatalogueById',
        id: this.data.id,
        projectName: this.data.projectName,
        projectDetail: this.data.projectDetail,
        projectGroups: this.data.projectGroups
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