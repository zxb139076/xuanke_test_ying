Page({
  data: {
    id: '0',
    catalogueName: '',
    catalogueDetail: '',
    catalogueGroups: '',
  },

  onLoad: function (options) {
    if (options.id != "0") {
      this.setData({
        id: options.id
      });
      wx.cloud.callFunction({
        name: "catalogue",
        data: {
          requestType: 'getCatalogueById',
          id: options.id
        }
      }).then(res => {
        this.setData({
          catalogueName: res.result.data[0].catalogueName,
          catalogueDetail: res.result.data[0].catalogueDetail,
          catalogueGroups: res.result.data[0].catalogueGroups
        });
      }).catch(err => {
        console.error(err)
      })
    }
  },

  //获取课程类目名称
  catalogueNameBlur: function (e) {
    this.setData({
      catalogueName: e.detail.value
    })
  },

  //获取课程类目描述
  catalogueDetailBlur: function (e) {
    this.setData({
      catalogueDetail: e.detail.value
    })
  },

  //获取课程类目适合人群
  catalogueGroupsBlur: function (e) {
    this.setData({
      catalogueGroups: e.detail.value
    })
  },

  saveEditCatalogue: function () {
    if (this.data.catalogueName == '') {
      wx.showToast({
        title: '请填写类目名称',
      });
      return false;
    }
    if (this.data.catalogueDetail == '') {
      wx.showToast({
        title: '请填写类目描述',
      });
      return false;
    }
    if (this.data.catalogueGroups == '') {
      wx.showToast({
        title: '请填写适合人群',
      });
      return false;
    }
    wx.cloud.callFunction({
      name: "catalogue",
      data: {
        requestType: 'saveCatalogue',
        id: this.data.id,
        catalogueName: this.data.catalogueName,
        catalogueDetail: this.data.catalogueDetail,
        catalogueGroups: this.data.catalogueGroups
      }
    }).then(res => {
      wx.navigateBack({
        complete: (res) => {
          wx.showToast({
            title: '保存成功',
          });
        }
      })
    }).catch(err => {
      console.error(err)
    });
  }
})