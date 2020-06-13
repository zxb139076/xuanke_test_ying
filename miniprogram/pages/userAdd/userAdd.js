Page({

  /**
   * data
   */
  data: {
    id: "0",
    username: "",
    realname: "",
    password: "123456",
    phone: "",
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
      title: '添加学员信息',
    });
  },

  /**
   * onLoad
   */
  onLoad: function() {
    this.setData({
      isLoad: true
    })
  },

  /**
   * onShow
   */
  onShow: function () {
    this.setData({
      username: "",
      realname: "",
      password: "123456",
      phone: "",
      isLoad: true
    });
  },

  /**
   * onHide
   */
  onHide: function() {
    this.setData({
      isLoad: false
    })
  },

  /**
   * 获取输入的用户名
   * @param {*} e 
   */
  usernameBlur: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  /**
   * 获取输入的用户密码
   * @param {*} e 
   */
  passwordBlur: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 获取用户输入的真实姓名
   * @param {*} e 
   */
  realnameBlur: function (e) {
    this.setData({
      realname: e.detail.value
    })
  },

  /**
   * 获取用户输入的手机号
   * @param {*} e 
   */
  phoneBlur: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 注册用户信息
   */
  register: function () {
    if (this.data.username == "") {
      this.showToast("用户名不能为空！");
    }
    if (this.data.realname == "") {
      this.showToast("真实姓名不能为空！");
    }
    if (this.data.password == "") {
      this.showToast("密码不能为空！");
    }
    if (this.data.phone == "") {
      this.showToast("手机号不能为空！");
    }
    console.log("账号：" + this.data.username + "真实姓名：" + this.data.realname + "密码：" + this.data.password + "电话号码：" + this.data.phone);
    this.checkAccountIsExisted();
  },

  /**
   * 检查用户信息是否存在
   */
  checkAccountIsExisted: function () {
    wx.cloud.callFunction({
      name: 'users',
      data: {
        requestType: "checkAccountIsExisted",
        id: "0",
        username: this.data.username,
        phone: this.data.phone
      }
    }).then(res => {
      if (res.result.list.length < 1) {
        this.registerAccount();
      } else {
        this.showToast("账号信息已存在，请重试！");
      }
    }).catch(res => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 注册用户信息
   */
  registerAccount: function () {
    wx.cloud.callFunction({
      name: 'users',
      data: {
        requestType: 'registerAccount',
        id: this.data.id,
        username: this.data.username,
        realname: this.data.realname,
        password: this.data.password,
        phone: this.data.phone
      }
    }).then(res => {
      wx.navigateBack({
        complete: (res) => {
          this.showToast("注册用户信息成功！");
        },
      })
    }).catch(res => {
      this.showToast("操作失败，请重试！");
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