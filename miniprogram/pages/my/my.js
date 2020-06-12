const app = getApp()

Page({

  data: {
    avatarUrl: '../../images/user-unlogin.png', //未登陆时的用户头像
    nickName: '',  // 用户的昵称
    userInfo: {},  // 用户信息
    logged: false, // 页面是否加载完成
    isAdmin: false,
    myReserve: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/myReserve.png?sign=34828c33d8235586b62ac8e666eeead3&t=1591061409",
    info: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/info.png?sign=7bc8e16f73afc10ad9edd4836e2a68fa&t=1591062818",
    clientServices: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/clientServices.png?sign=f013de6d5862c470b78bf55e9a336271&t=1591062986",
    course: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/course.png?sign=5039e0c324cdeed4de63c52f00fac65d&t=1591063046",
    courseManager: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/courseManager.png?sign=4c49e022a75f3f46047dbac810ab2264&t=1591063718",
    courseArrange: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/courseArrange.png?sign=37423aa41059e292f278a853a2d214d6&t=1591063734",
    userManager: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/users.png?sign=b7ecb66dd2e48b7a7e51cd8cf5f1298d&t=1591932464"
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '我的',
    });
  },

  onShow: function () {
    if (this.checkUserIsLogin2()) {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
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
      });
      this.checkIsAdmin();
    } else {
      this.setData({
        avatarUrl: './user-unlogin.png',
        logged: false
      });
    }
  },

  /**
   * 检查是否有管理员权限
   */
  checkIsAdmin: function () {
    const username = wx.getStorageSync('username');
    wx.cloud.callFunction({
      name: "userRights",
      data: {
        requestType: "checkIsAdmin",
        username: username
      }
    }).then(res => {
      // 如果该用户是管理员
      if (res.result.data.length > 0) {
        this.setData({
          isAdmin: true
        })
      }
    }).catch(err => {
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 点击用户头像时触发
   */
  userlogin: function () {
    // 用户未登陆，返回到登陆界面
    if (!this.checkUserIsLogin2()) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.navigateTo({
              url: '../login2/login2',
            })
          } else {
            wx.navigateTo({
              url: '../login_wx/login_wx',
            });
          }
        }
      });
    } else {
      wx.showModal({
        cancelColor: 'true',
        title: '提示',
        content: '是否退出登陆',
        success: function (res) {
          if (!res.confirm) {
            return;
          }
          wx.setStorageSync('username', '');
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                wx.navigateTo({
                  url: '../login2/login2',
                })
              } else {
                wx.navigateTo({
                  url: '../login_wx/login_wx',
                });
              }
            }
          });
        }
      })
    }
  },

  /**
   * 跳转到课程管理界面
   */
  showCatalogueManager: function () {
    wx.navigateTo({
      url: '../catalogueList/catalogueList',
    })
  },

  /**
   * 跳转到课程排课界面
   */
  showCourseArrange: function () {
    wx.navigateTo({
      url: '../courseArrange/courseArrange',
    })
  },

  /**
   * 跳转到用户管理界面
   */
  showUserList: function () {
    wx.navigateTo({
      url: '../userList/userList',
    })
  },

  /**
   * 跳转到我的预约界面
   */
  showCourseReserve: function () {
    if (this.checkUserIsLogin()) {
      wx.navigateTo({
        url: '../myCourseReserveList/myCourseReserveList',
      });
    }
  },

  /**
   * 跳转到关于选课界面
   */
  showCourseInfo: function () {
    wx.showToast({
      title: '正在开发中',
    })
  },

  /**
   * 跳转到我的客服页面
   */
  showClientServices: function () {
    wx.showToast({
      title: '正在开发中',
    })
  },

  /**
   * 跳转到账号管理界面
   */
  showAccountManager: function () {
    wx.navigateTo({
      url: '../accountManager/accountManager',
    })
  },

  /**
   * 空字符串处理
   * @param {需要处理的字符串} value 
   */
  nullToEmpty: function (value) {
    if (value == undefined) {
      return "";
    } else if (value == null) {
      return "";
    } else if (value == "") {
      return "";
    }
  },

  /**
   * 检查用户登陆状态
   */
  checkUserIsLogin: function () {
    const username = wx.getStorageSync('username');
    if (this.nullToEmpty(username) == "") {
      wx.showToast({
        title: '未登陆',
        icon: 'none'
      })
      return false;
    } else {
      return true;
    }
  },

  /**
   * 检查用户登陆状态2
   */
  checkUserIsLogin2: function () {
    const username = wx.getStorageSync('username');
    if (this.nullToEmpty(username) == "") {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 弹窗代码封装
   * @param {弹窗标题} title 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
    })
  }

})
