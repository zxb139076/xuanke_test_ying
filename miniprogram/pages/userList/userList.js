var app = getApp()
Page({
  data: {
    isLoad: false, //页面是否加载完成
    resultList: null, //课程列表信息
    editImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/edit2.png?sign=ef6e1aba71848b80bc8a0ec3a5cf6938&t=1590133258",
    headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/users/man_blank3.png?sign=5e31073993dd3a2fc7888b27706ba7ad&t=1591709607",
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    });
    wx.setNavigationBarTitle({
      title: '学生列表',
    });
  },

  onLoad: function (options) {
    //获取用户列表信息
    wx.cloud.callFunction({
      name: "users",
      data: {
        requestType: 'usersGetList',
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data,
        isLoad: true
      });
    }).catch(err => {
      //onLoad方法，获取用户列表失败
      console.error(err);
      wx.showToast({
        title: '获取用户列表失败',
        icon: 'none'
      })
    });
  },

  onShow: function () {
    //获取用户列表信息
    wx.cloud.callFunction({
      name: "users",
      data: {
        requestType: 'usersGetList',
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data,
        isLoad: true
      });
    }).catch(err => {
      //onLoad方法，获取用户列表失败
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      })
    });
  },

  onHide: function () {
    this.setData({
      isLoad: false
    });
  },

  // 显示编辑课程信息
  showEditUser: function (event) {
    wx.navigateTo({
      url: '../userEdit/userEdit?id=' + event.currentTarget.dataset.id,
    });
  },

  // 显示添加学生
  showAddUser: function () {
    wx.navigateTo({
      url: '../register/register',
    });
  }
})