const app = getApp()
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
      //如果账号密码存在
      if (res.result.list.length > 0) {
        this.setData({
          username: res.result.list[0].username,
          openid: res.result.list[0].openid
        });
        // 如果当前账号绑定了微信号openid
        if (this.data.openid != "0") {
          // 检查当前用户绑定的微信号
          if (app.globalData.openid == this.data.openid) {
            // 将用户名保存在本地
            wx.setStorageSync('username', this.data.username);
            wx.switchTab({
              url: '../index/index',
            });
            wx.showToast({
              title: '登陆成功',
              icon: 'none'
            });
          } else {
            // 用户已被其它账号绑定
            wx.showToast({
              title: '当前账号已被其它用户绑定',
              icon: 'none'
            })
          }
        } else { // 如果当前账号没有绑定openid
          // 检查当前openid是否已绑定到了其他账号上
          wx.cloud.callFunction({
            name: "users",
            data: {
              requestType: "checkOpenidIsExisted",
              openid: app.globalData.openid
            }
          }).then(res => {
            if (res.result.data.length < 1) {
              wx.cloud.callFunction({
                name: "users",
                data: {
                  requestType: "updateOpenid",
                  account: this.data.account,
                  openid: app.globalData.openid
                }
              }).then(res => {
                // 将用户名保存在本地
                wx.setStorageSync('username', this.data.username);
                wx.switchTab({
                  url: '../index/index',
                });
                wx.showToast({
                  title: '登陆成功',
                  icon: 'none'
                });
              }).catch(err => {
                // signin方法，更新账号信息出错
                console.log(err);
                wx.showToast({
                  title: '操作失败，请重试',
                  icon: 'none'
                })
              });
            } else {
              wx.showToast({
                title: '当前微信已经绑定到了其它账号，请重试！',
              });
            }
          }).catch(err => {
            // signin方法, 检查当前openid是否已绑定到了其他账号上失败
            console.log(err);
            wx.showToast({
              title: '操作失败，请重试！',
              icon: 'none'
            });
          });
        }
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
  },

})