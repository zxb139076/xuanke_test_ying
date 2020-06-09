Page({
  data: {
    username: "",
    realname: "",
    password: "",
    phone: "",
  },

  // 获取用户名信息
  usernameBlur: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 获取密码信息
  passwordBlur: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 获取真实姓名
  realnameBlur: function (e) {
    this.setData({
      realname: e.detail.value
    })
  },

  // 获取手机号
  phoneBlur: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 注册
  register: function () {
    if (this.data.username == "") {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      });
    }
    if (this.data.realname == "") {
      wx.showToast({
        title: '真实姓名不能为空',
        icon: 'none'
      });
    }
    if (this.data.password == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      });
    }
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      });
    }
    console.log("账号：" + this.data.username + "真实姓名：" + this.data.realname + "密码：" + this.data.password + "电话号码：" + this.data.phone);

  }

  //   // 注册用户信息
  //   wx.cloud.callFunction({
  //     name: "users",
  //     data: {
  //       requestType: "checkSignIn",
  //       account: this.data.account,
  //       password: this.data.password
  //     }
  //   }).then(res => {
  //     //如果账号存在则跳转否则提示错误
  //     if (res.result.list.length > 0) {
  //       // 将用户名保存在本地
  //       wx.setStorageSync('username', this.data.account);
  //       wx.switchTab({
  //         url: '../index/index',
  //       });
  //       wx.showToast({
  //         title: '登陆成功',
  //         icon: 'none'
  //       });
  //     } else {
  //       wx.showToast({
  //         title: '用户名或密码不正确，请重试！',
  //         icon: 'none'
  //       });
  //     }
  //   }).catch(err => {
  //     //signin方法，验证账号和密码失败
  //     console.error(err);
  //     wx.showToast({
  //       title: '操作失败，请重试',
  //       icon: 'none'
  //     })
  //   });
  // }

})