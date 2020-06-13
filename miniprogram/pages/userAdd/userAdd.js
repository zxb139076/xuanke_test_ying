Page({
  data: {
    id: "0",
    username: "",
    realname: "",
    password: "123456",
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
    // 检查用户信息是否存在
    wx.cloud.callFunction({
      name: 'users',
      data: {
        requestType: "checkAccountIsExisted",
        id: "0",
        username: this.data.username,
        phone: this.data.phone
      }
    }).then(res => {
      // 如果账号信息不存在，则可以添加用户信息
      if (res.result.list.length < 1) {
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
          wx.showToast({
            title: '注册用户成功！',
            icon: 'none'
          })
        }).catch(res => {
          // register方法，注册用户失败
          wx.showToast({
            title: '操作失败，请重试',
            icon: 'none'
          });
        });
      } else {
        wx.showToast({
          title: '账号信息已存在，请重试！',
          icon: 'none'
        });
      }
    }).catch(res => {
      // register方法，验证注册信息失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      });
    });
  }

})