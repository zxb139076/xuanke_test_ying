Page({

  /**
   * data
   */
  data: {
    isLoad: false,
    id: '0', 
    username: '',
    realname: '',
    password: '',
    phone: '',
    userOpenid: ''
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
      title: '学员信息编辑',
    });
  },

  /**
   * onLoad
   * @param {*} options 
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    this.getUserById();
  },

  /**
   * onShow
   */
  onShow: function () {
    this.getUserById();
  },

  /**
   * onHide
   */
  onHide: function () {
    this.setData({
      isLoad: false
    })
  },

  /**
   * 获取学员信息
   */
  getUserById: function () {
    wx.cloud.callFunction({
      name: "users",
      data: {
        requestType: 'getUserById',
        id: this.data.id
      }
    }).then(res => {
      this.setData({
        username: res.result.data[0].username,
        realname: res.result.data[0].realname,
        password: res.result.data[0].password,
        phone: res.result.data[0].phone,
        userOpenid: res.result.data[0].openid,
        isLoad: true
      });
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试");
    });
  },

  /**
   * 获取输入的用户名信息
   * @param {*} e 
   */
  usernameBlur: function (e) {
    this.setData({
      username: e.detail.value
    });
  },

  /**
   * 获取输入的真实姓名信息
   * @param {*} e 
   */
  realnameBlur: function (e) {
    this.setData({
      realname: e.detail.value
    });
  },

  /**
   * 获取输入的用户的密码信息
   * @param {*} e 
   */
  passwordBlur: function (e) {
    this.setData({
      password: e.detail.value
    });
  },

  /**
   * 获取输入的手机号信息
   * @param {*} e 
   */
  phoneBlur: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },

  /**
   * 保存学员信息
   */
  saveEditUser: function () {
    if (this.data.username == "") {
      this.showToast("用户名不能为空");
      return false;
    }
    if (this.data.realname == "") {
      this.showToast("真实姓名不能为空");
      return false;
    }
    if (this.data.password == "") {
      this.showToast("密码不能为空");
      return false;
    }
    if (this.data.phone == "") {
      this.showToast("手机号不能为空");
      return false;
    }
    console.log("账号：" + this.data.username + "真实姓名：" + this.data.realname + "密码：" + this.data.password + "电话号码：" + this.data.phone);
    this.checkAccountIsExisted();
  },

  /**
   * 检查用户信息是否存在
   */
  checkAccountIsExisted: function() {
    // 检查用户信息是否存在
    wx.cloud.callFunction({
      name: 'users',
      data: {
        requestType: "checkAccountIsExisted",
        id: this.data.id,
        username: this.data.username,
        phone: this.data.phone
      }
    }).then(res => {
      if (res.result.list.length < 1) {
        // 保存编辑用户信息
        this.saveEditAccount();
      } else {
        this.showToast("账号信息已存在，请重试！");
      }
    }).catch(res => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 保存编辑用户信息
   */
  saveEditAccount: function () {
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
          this.showToast("保存用户信息成功！");
        },
      });
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