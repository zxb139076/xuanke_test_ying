const app = getApp()
Page({

  /**
   * 用户页面数据
   * @param {account} 用户填写的账号
   * @param {username} 用户填写的密码
   */
  data: {
    account: "",
    password: "",
  },

  /**
   * 获取用户填写的账号
   * @param {*} e 
   */
  usernameBlur: function (e) {
    this.setData({
      account: e.detail.value
    })
  },

  /**
   * 获取用户填写的密码
   * @param {*} e 
   */
  passwordBlur: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 更新账号的openid
   * @param {微信用户的openid} wx_openid 
   * @param {账号的用户名} username 
   */
  updateOpenid: function (wx_openid, username) {
    wx.cloud.callFunction({
      name: "users",
      data: {
        requestType: "updateOpenid",
        account: username,
        openid: wx_openid
      }
    }).then(res => {
      this.saveUsernameAndJump(username);
    }).catch(err => {
      console.log(err);
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 检查微信用户的openid是否已经绑定到了其它账号上
   * @param {微信用户的openid} wx_openid 
   * @param {账号的用户名} username 
   */
  checkOpenidIsExisted: function (wx_openid, username) {
    wx.cloud.callFunction({
      name: "users",
      data: {
        requestType: "checkOpenidIsExisted",
        openid: wx_openid
      }
    }).then(res => {
      // 如果当前微信号没有绑定其他账号
      if (res.result.data.length < 1) {
        this.updateOpenid(wx_openid, username);
      } else {
        this.showToast("你使用的微信账号已经绑定到了其它账号，请重新检查输入的账号！");
      }
    }).catch(err => {
      console.log(err);
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 检查账号信息,检查openid的绑定情况
   * @param {微信用户的openid} wx_openid
   * @param {账号的用户名} username 
   * @param {账号的openid} openid 
   */
  checkAccoutInfo(wx_openid, username, openid) {
    // 如果当前账号绑定了微信号openid
    if (openid != "0") {
      // 检查当前用户微信号的openid是否与账号绑定的openid相同
      if (wx_openid == openid) {
        this.saveUsernameAndJump(username);
      } else {
        this.showToast("当前账号已被其它微信用户所绑定，请重试！");
      }
    } else { // 如果当前账号没有绑定openid，则检查微信用户的openid是否已经绑定了其它账号
      this.checkOpenidIsExisted(wx_openid, username);
    }
  },

  /**
   * 
   * 验证登陆的账号和密码是否正确
   * @param {微信用户的openid} wx_openid
   * @param {用户的账号} account 
   * @param {用户的密码} password 
   */
  checkSignIn: function (wx_openid, account, password) {
    wx.cloud.callFunction({
      name: "users",
      data: {
        requestType: "checkSignIn",
        account: account,
        password: password
      }
    }).then(res => {
      //如果账号密码存在
      if (res.result.list.length > 0) {
        this.checkAccoutInfo(wx_openid, res.result.list[0].username, res.result.list[0].openid);
      } else {
        this.showToast("用户名或密码不正确，请重试！");
      }
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 用户登录
   */
  signIn: function () {
    if (this.data.account == "") {
      this.showToast("账号不能为空");
    }
    if (this.data.password == "") {
      this.showToast("密码不能为空")
    }
    console.log("微信用户的openid:" + app.globalData.openid);
    console.log("登陆的账号:" + this.data.account);
    console.log("登陆的密码:" + this.data.password);
    this.checkSignIn(app.globalData.openid, this.data.account, this.data.password);
  },

  /**
   * 保存用户名到本地并跳转
   */
  saveUsernameAndJump: function (username) {
    wx.setStorageSync('username', username);
    wx.switchTab({
      url: '../index/index',
    });
    this.showToast("登陆成功");
  },

  /**
   * 封装弹出窗口方法
   * @param {*} value 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  }

})