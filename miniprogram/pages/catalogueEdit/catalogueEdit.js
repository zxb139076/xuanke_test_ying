Page({
  data: {
    id: '0', //当前课程类目Id
    catalogueName: '', //课程类目名称
    catalogueDetail: '', //课程类目描述
    catalogueGroups: '',
  },

  onLoad: function (options) {
    // 如果当前id不为空，则是编辑模式
    if (options.id != "0") {
      this.setData({
        id: options.id
      });
      // 获取课程类目信息
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
        //onLoad方法，获取课程类目信息失败
        console.error(err)
        wx.showToast({
          title: '操作失败，请重试',
          icon: 'none'
        })
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

  //保存课程类目
  saveEditCatalogue: function () {
    if (this.data.catalogueName == '') {
      wx.showToast({
        title: '请填写类目名称',
        icon: 'none'
      });
      return false;
    }
    if (this.data.catalogueDetail == '') {
      wx.showToast({
        title: '请填写类目描述',
        icon: 'none'
      });
      return false;
    }
    if (this.data.catalogueGroups == '') {
      wx.showToast({
        title: '请填写适合人群',
        icon: 'none'
      });
      return false;
    }
    // 检查课程类目信息是否存在
    wx.cloud.callFunction({
      name: "catalogue",
      data: {
        requestType: "checkCatalogueIsExited",
        id: this.data.id,
        catalogueName: this.data.catalogueName
      }
    }).then(res => {
      // 如果该课程类目信息不存在
      if (res.result.list < 1) {
        // 保存课程类目信息
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
                title: '保存课程类目成功',
                icon: 'none'
              });
            }
          })
        }).catch(err => {
          //saveEditCatalogue方法，保存课程类目失败
          console.error(err);
          wx.showToast({
            title: '操作失败，请重试',
            icon: 'none'
          })
        });
      } else {
        wx.showToast({
          title: '课程类目名称已存在，请重试！',
          icon: 'none'
        });
      }
    }).catch(err => {
      //saveEditCatalogue方法，检查课程类目信息是否存在
      console.error(err);
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      });
    });
  }
})