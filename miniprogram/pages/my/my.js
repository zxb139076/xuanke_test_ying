const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    myReserve: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/myReserve.png?sign=34828c33d8235586b62ac8e666eeead3&t=1591061409",
    info: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/info.png?sign=7bc8e16f73afc10ad9edd4836e2a68fa&t=1591062818",
    clientServices: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/clientServices.png?sign=f013de6d5862c470b78bf55e9a336271&t=1591062986",
    course: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/course.png?sign=5039e0c324cdeed4de63c52f00fac65d&t=1591063046",
    courseManager: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/courseManager.png?sign=4c49e022a75f3f46047dbac810ab2264&t=1591063718",
    courseArrange: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/courseArrange.png?sign=37423aa41059e292f278a853a2d214d6&t=1591063734"
  },

  onShow: function () {
    var value = wx.getStorageSync('login');
    if (value && value == '1') {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  userInfo: res.userInfo,
                  logged: true
                })
              }
            })
          } else {
            this.setData({
              avatarUrl: './user-unlogin.png',
              logged: false
            });
          }
        }
      })
    } else {
      this.setData({
        avatarUrl: './user-unlogin.png',
        logged: false
      });
    }
  },

  // 用户登陆处理
  userlogin: function () {
    // 还未获取到用户授权，返回到登陆界面
    if (!this.data.logged) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.showModal({
        cancelColor: 'true',
        title: '提示',
        content: '是否退出登陆',
        success: function (res) {
          if (!res.confirm) {
            return;
          }
          wx.setStorageSync('login', '0');
          wx.navigateTo({
            url: '../login/login'
          })
        }
      })
    }
  },

  // 跳转到课程管理界面
  showCatalogueManager: function () {
    wx.navigateTo({
      url: '../catalogueList/catalogueList',
    })
  },

  // 跳转到课程排课界面
  showCourseArrange: function () {
    wx.navigateTo({
      url: '../courseArrange/courseArrange',
    })
  },

  // 显示我预定的课程列表
  showCourseReserve: function() {
    wx.navigateTo({
      url: '../myCourseReserveList/myCourseReserveList',
    })
  },

  // 显示关于选课界面
  showCourseInfo: function() {
    wx.showToast({
      title: '正在开发中',
    })
  },

  // 显示我的客服页面
  showClientServices: function() {
    wx.showToast({
      title: '正在开发中',
    })
  },

  // 显示课程预览
  showCoursePreview: function() {
    wx.showToast({
      title: '正在开发中',
    })
  }

})
