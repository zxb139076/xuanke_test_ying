Page({

  /**
   * data
   */
  data: {
    isLoad: false,
    originPassword: "",
    newPassword: "",
    newPassword2: "",
    username: "",
    passwordError: false,
    errorMessage: ""
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
      title: '设置密码',
    });
  },

  /**
   * onLoad
   * @param {*} e 
   */
  onLoad: function (e) {
    var username = wx.getStorageSync('username');
    this.setData({
      isLoad: true,
      username: username
    })
  },

  /**
   * 获取原密码
   * @param {*} e 
   */
  originPasswordBlur: function (e) {
    this.setData({
      originPassword: e.detail.value
    })
  },

  /**
   * 获取新密码
   * @param {*} e 
   */
  newPasswordBlur: function (e) {
    this.setData({
      newPassword: e.detail.value
    })
    if (!(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,20}$/.test(e.detail.value))) {
      wx.showToast({
        title: '密码必须由8-20位数字/字母/字符任意两种组合！',
        icon: 'none'
      });
    }
  },

  /**
   * 获取新密码确认
   * @param {*} e 
   */
  newPassword2Blur: function (e) {
    this.setData({
      newPassword2: e.detail.value
    });
    if (this.data.newPassword != this.data.newPassword2) {
      this.setData({
        passwordError: true,
        errorMessage: "两次输入的密码不一致"
      });
    } else {
      this.setData({
        passwordError: false,
        errorMessage: ""
      });
    }
  },

  /**
   * 检测密码的格式
   * @param {*} e 
   */
  checkNewPassword: function (e) {
    if (!(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,20}$/.test(e.detail.value))) {
      this.setData({
        passwordError: true,
        errorMessage: "密码必须由8-20位数字/字母/字符的任意组合"
      });
    } else {
      this.setData({
        passwordError: false
      });
    }
  },

  /**
   * 提交密码修改
   */
  saveEditPassword: function () {
    var username = this.data.username;
    var originPassword = this.data.originPassword;
    var newPassword = this.data.newPassword;
    var newPassword2 = this.data.newPassword2;
    // 判断新密码和原密码是否不一致
    if (originPassword == newPassword) {
      this.showToast("新密码不能设置的和原密码一样！");
      return false;
    }
    // 判断两次输入的密码是否一致
    if (newPassword != newPassword2) {
      this.showToast("两次输入的密码不一致");
      return false;
    }
    // 判断密码是否符合规范
    if (!(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,20}$/.test(newPassword))) {
      this.showToast("密码必须由8-20位数字/字母/字符任意两种组合！");
      return false;
    }
    // 检查原密码是否和数据库中原先的密码一致
    this.checkOriginPassword(username, originPassword, newPassword);
  },

  /**
   * 检查用户的账号和密码
   * @param {*} username 
   * @param {*} originPassword
   * @param {*} newPassword 
   */
  checkOriginPassword: function (username, originPassword, newPassword) {
    wx.cloud.callFunction({
      name: "users",
      data: {
        requestType: "checkSignIn",
        account: username,
        password: originPassword
      }
    }).then(res => {
      // 如果当前的原密码是正确的，则继续后面的操作流程
      if (res.result.list.length > 0) {
        this.updatePassword(username, newPassword);
      } else {
        this.showToast("原密码不正确，请重试！");
      }
    }).catch(err => {
      // 检查原密码是否一致出错
      console.log(err);
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 更新用户账号的密码
   * @param {*} username 
   * @param {*} newPassword 
   */
  updatePassword: function (username, newPassword) {
    wx.cloud.callFunction({
      name: "users",
      data: {
        requestType: "updatePassword",
        account: username,
        password: newPassword
      }
    }).then(res => {
      this.showToast("密码更新成功");
    }).catch(err => {
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 封装弹窗代码
   * @param {提示内容} title 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }

})