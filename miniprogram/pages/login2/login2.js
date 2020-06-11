Page({
  data: {
    account: "",
    password: "",
  },

  usernameBlur: function (e) {
    this.setData({
      account: e.detail.value
    })
  },

  passwordBlur: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登陆
  signin: function () {
    if (this.data.account == "") {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      });
    } else if (this.data.password == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      });
    }
    console.log("账号：" + this.data.account + "密码：" + this.data.password);
    // 验证账号和密码信息
    wx.cloud.callFunction({
      name: "users",
      data: {
        requestType: "checkSignIn",
        account: this.data.account,
        password: this.data.password
      }
    }).then(res => {
      //如果账号存在
      if (res.result.list.length > 0) {
        // 将用户名保存在本地
        wx.setStorageSync('username', res.result.list[0].username);
        wx.switchTab({
          url: '../index/index',
        });
        wx.showToast({
          title: '登陆成功',
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: '用户名或密码不正确，请重试！',
          icon: 'none'
        });
      }
    }).catch(err => {
      //signin方法，验证账号和密码失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      })
    });
  }

})