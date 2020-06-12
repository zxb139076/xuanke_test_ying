Page({

  /**
   * data
   */
  data: {
    id: '0', //当前课程类目Id
    catalogueName: '', //课程类目名称
    catalogueDetail: '', //课程类目描述
    catalogueGroups: '',
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
      title: '课程类目编辑',
    });
  },

  /**
   * onLoad
   * @param {*} options 
   */
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
        console.error(err);
        this.showToast("操作失败，请重试");
      })
    }
  },

  /**
   * 获得用户输入的课程类目名称
   * @param {*} e 
   */
  catalogueNameBlur: function (e) {
    this.setData({
      catalogueName: e.detail.value
    })
  },

  /**
   * 获得用户输入的课程类目描述
   * @param {*} e 
   */
  catalogueDetailBlur: function (e) {
    this.setData({
      catalogueDetail: e.detail.value
    })
  },

  /**
   * 获得用户输入的课程类目适合人群
   * @param {*} e 
   */
  catalogueGroupsBlur: function (e) {
    this.setData({
      catalogueGroups: e.detail.value
    })
  },

  /**
   * 用户点击保存课程类目
   */
  saveEditCatalogue: function () {
    if (this.data.catalogueName == '') {
      this.showToast("请填写课程类目名称");
      return false;
    }
    if (this.data.catalogueDetail == '') {
      this.showToast("请填写课程类目描述");
      return false;
    }
    if (this.data.catalogueGroups == '') {
      this.showToast("请填写课程类目适合人群");
      return false;
    }
    this.checkCatalogueIsExisted(this.data.catalogueName, this.data.catalogueName, this.data.catalogueGroups);
  },

  /**
   * 检查课程类目信息是否存在
   * @param {课程类目名称} catalogueName 
   * @param {课程类目描述} catalogueDetail 
   * @param {课程类目适合人群} catalogueGroups 
   */
  checkCatalogueIsExisted: function (catalogueName, catalogueDetail, catalogueGroups) {
    wx.cloud.callFunction({
      name: "catalogue",
      data: {
        requestType: "checkCatalogueIsExited",
        id: this.data.id,
        catalogueName: catalogueName
      }
    }).then(res => {
      if (res.result.list < 1) {
        this.updateCatalogue(catalogueName, catalogueDetail, catalogueGroups);
      } else {
        this.showToast("课程类目名称已存在，请重试！");
      }
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 更新或保存课程类目信息
   * @param {课程类目名称} catalogueName 
   * @param {课程类目描述} catalogueDetail 
   * @param {课程类目适合人群} catalogueGroups 
   */
  updateCatalogue: function (catalogueName, catalogueDetail, catalogueGroups) {
    wx.cloud.callFunction({
      name: "catalogue",
      data: {
        requestType: 'saveCatalogue',
        id: this.data.id,
        catalogueName: catalogueName,
        catalogueDetail: catalogueDetail,
        catalogueGroups: catalogueGroups
      }
    }).then(res => {
      wx.navigateBack({
        complete: (res) => {
          this.showToast("保存课程类目名称成功！");
        }
      })
    }).catch(err => {
      console.error(err);
      this.showToast("操作失败，请重试！");
    });
  },

  /**
   * 封装弹窗代码
   * @param {弹窗提示信息} title 
   */
  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    });
  }
})