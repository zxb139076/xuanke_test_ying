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

  onLoad: function(e) {
    this.wxlogin();
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
        // 如果当前账号还没有绑定微信号
        // 检查当前用户绑定的微信号
        if (app.globalData.openid == res.result.list[0].openid) {
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
          // 用户已被其它账号绑定
          wx.showToast({
            title: '当前账号已被其它用户绑定',
            icon: 'none'
          })
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

  wxlogin: function () {//获取用户的openID和sessionKey
    var that = this;
    wx.login({
      //获取code 使用wx.login得到的登陆凭证，用于换取openid
      success: (res) => {
        wx.request({
          method: "GET",
          url: 'https://xxxwx/wxlogin.do',
          data: {
            code: res.code,
            appId: "appIdSbcx",
            appKey: "appKeySbcx"
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: (res) => {
            console.log(res);
            that.setData({
              sessionKey: res.data.session_key
            });
          }
        });
      }
    });
  }

})