Page({
  data: {
    isLoad: false,
    id: '0', //课程id
    username: '', //用户账号
    realname: '', //用户真实名称
    password: '', //用户密码
    phone: '', //用户手机号
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '学生信息编辑',
    });
  },

  onLoad: function (options) {
    //如果学生id不为0
    if (options.id != "0") {
      //保存学生id
      this.setData({
        id: options.id
      });
      //获取学生信息
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
          phone: res.result.data[0].phone.detail,
          isLoad: true
        });
      }).catch(err => {
        console.error(err)
      })
    } else { //如果课程id存在
      wx.showToast({
        title: '学生ID不存在，请重试！',
        icon: 'none'
      })
    }
  },

  onShow: function () {
    //获取学生信息
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
        isLoad: true
      });
    }).catch(err => {
      console.error(err)
    })
  },

  onHide: function () {
    this.setData({
      isLoad: false
    })
  },

  //获取学生账号
  usernameBlur: function (e) {
    this.setData({
      username: e.detail.value
    });
  },

  //获取学生真实姓名
  realnameBlur: function (e) {
    this.setData({
      realname: e.detail.value
    });
  },

  //获取学生密码
  passwordBlur: function (e) {
    this.setData({
      password: e.detail.value
    });
  },

  //获取学生手机号
  phoneBlur: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 保存课程信息
  saveEditUser: function () {
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
        id: this.data.id,
        username: this.data.username,
        phone: this.data.phone
      }
    }).then(res => {
      // 如果账号信息不存在，则可以保存编辑用户信息
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
          wx.navigateBack({
            complete: (res) => {
              wx.showToast({
                title: '保存用户信息成功！',
                icon: 'none'
              });
            },
          })
        }).catch(res => {
          // saveEditUser方法，编辑保存信息失败
          wx.showToast({
            title: '操作失败，请重试',
            icon: 'none'
          });
        });
      } else {
        wx.showToast({
          title: '账号信息已存在，请重新编辑！',
          icon: 'none'
        });
      }
    }).catch(res => {
      // saveEditUser方法，验证注册信息失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      });
    });
  },
})