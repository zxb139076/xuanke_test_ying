Page({
  data: {
    isLoad: false,
    resultList: null,
    editImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/edit2.png?sign=ef6e1aba71848b80bc8a0ec3a5cf6938&t=1590133258",
    headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/users/man_blank3.png?sign=5e31073993dd3a2fc7888b27706ba7ad&t=1591709607",
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
      title: '学生列表',
    });
  },

  /**
   * onLoad
   * @param {*} options 
   */
  onLoad: function (options) {
    this.getUserList();
  },

  /**
   * onShow
   */
  onShow: function () {
    this.getUserList();
  },

  /**
   * onHide
   */
  onHide: function () {
    this.setData({
      isLoad: false
    });
  },

  getUserList: function () {
    wx.cloud.callFunction({
      name: "users",
      data: {
        requestType: 'getUserList',
      }
    }).then(res => {
      this.setData({
        resultList: res.result.data,
        isLoad: true
      });
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 显示编辑学员信息界面
   * @param {*} event 
   */
  showEditUser: function (event) {
    wx.navigateTo({
      url: '../userEdit/userEdit?id=' + event.currentTarget.dataset.id,
    });
  },

  /**
   * 显示添加学员界面
   */
  showAddUser: function () {
    wx.navigateTo({
      url: '../userAdd/userAdd',
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