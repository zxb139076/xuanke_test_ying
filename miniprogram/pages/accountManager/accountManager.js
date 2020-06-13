Page({

  /**
   * data
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    nickName: '',
    userInfo: {},
    logged: false,
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
      title: '账户设置',
    });
  },

  /**
   * onShow
   */
  onShow: function () {
    if (this.checkUserIsLogin()) {
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
    } else {
      this.setData({
        avatarUrl: './user-unlogin.png',
        logged: false
      });
    }
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
   * 检查用户登陆状态2
   */
  checkUserIsLogin: function () {
    const username = wx.getStorageSync('username');
    if (this.nullToEmpty(username) == "") {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 跳转到密码编辑界面
   */
  showPasswordEdit: function() {
    wx.navigateTo({
      url: '../passwordEdit/passwordEdit',
    })
  }
 
})