// miniprogram/pages/addCourse/addCourse.js
const util = require('../util/util.js');
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    nickName: '',
    userAvatarUrl: '',
    headimgurl: ''
  },
  getTime: function () {
    var time = util.formatTime(new Date())
    //为页面中time赋值
    this.setData({
      time: time
    })
    //打印
    console.log(time)
  },

  addCourse:function(e){
    wx.getUserInfo({
      complete: (res) => {
        console.log(res.userInfo.avatarUrl);
        this.setData({
          nickName: res.userInfo.nickName,
          headimgurl: res.userInfo.avatarUrl
        })
        const time = util.formatTime();
        //打印
        console.log(time)
        const db = wx.cloud.database()
        db.collection('pianoclass').add({
          data: {
            course: '课程记录',
            remark: '课程备注',
            nickName: res.userInfo.nickName,
            headimgurl: res.userInfo.avatarUrl,
            updateTime: time,
          },
          success: res => {
            this.setData({
              counterId: res._id,
              count: 1
            })
            wx.showToast({
              title: '新增记录成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      },
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})