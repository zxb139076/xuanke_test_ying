// pages/catalogueEdit/catalogueEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    result: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//此处接收传递过来的参数wx.navigateTo跳转时传递的参数
    console.log("当前页面接收的id为:" + options.id);
    this.setData({
      id: options.id
    });
    // 查询数据库记录
    wx.cloud.callFunction({
      name: "catalogue",
      data: {
        requestType: 'getCatalogueById',
        id: options.id
      }
    }).then(res => {
      console.log(res.result.data[0].projectName);
      this.setData({
        result: res.result.data[0]
      });
    }).catch(err => {
      console.error(err)
    })
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