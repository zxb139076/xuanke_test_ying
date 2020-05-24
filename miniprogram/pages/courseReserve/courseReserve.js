// miniprogram/pages/addCourse/addCourse.js
import {
  formatDate
} from '../util/util.js';
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

  addCourse: function (e) {
    wx.getUserInfo({
      complete: (res) => {
        this.setData({
          nickName: res.userInfo.nickName,
          headimgurl: res.userInfo.avatarUrl
        })
        const time = formatDate(new Date());
        //打印
        console.log(time)
        const db = wx.cloud.database()
        db.collection('courseReserve').add({
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

})