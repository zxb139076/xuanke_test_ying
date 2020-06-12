var app = getApp()
Page({
    data: {
        isLoad: false, //页面是否加载完成      
        resultList: null, //课程类目列表
        addImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/add2.png?sign=628ec5a02762a8e81a91287a91b9d91d&t=1590133101",
        editImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/edit2.png?sign=ef6e1aba71848b80bc8a0ec3a5cf6938&t=1590133258",
        deleteImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/delete2.png?sign=1b5f6dc4dd932c7fe7aea760163a189f&t=1590133125",
        headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=9184ee1dd0a51f9965bb7fccd2598df3&t=1590470115",
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
            title: '课程类目列表',
        });
    },

    /**
     * onLoad
     * @param {*} options 
     */
    onLoad: function (options) {
        // 获取课程类目列表
        wx.cloud.callFunction({
            name: "catalogue",
            data: {
                requestType: 'catalogueGetList'
            }
        }).then(res => {
            this.setData({
                resultList: res.result.data,
                isLoad: true
            });
        }).catch(err => {
            console.error(err);
            this.showToast("操作失败，请重试！");
        })
    },

    /**
     * onShow
     */
    onShow: function () {
        // 获取课程类目列表
        wx.cloud.callFunction({
            name: "catalogue",
            data: {
                requestType: 'catalogueGetList'
            }
        }).then(res => {
            this.setData({
                resultList: res.result.data,
                isLoad: true
            });
        }).catch(err => {
            console.error(err);
            this.showToast("操作失败，请重试！");
        })
    },

    /**
     * 显示编辑课程类目界面
     * @param {*} event 
     */
    showEditCatalogue: function (event) {
        wx.navigateTo({
            url: '../catalogueEdit/catalogueEdit?id=' + event.currentTarget.dataset.id,
        })
    },

    /**
     * 显示课程列表界面
     * @param {*} event 
     */
    showCourseList: function (event) {
        wx.navigateTo({
            url: '../courseList/courseList?id=' + event.currentTarget.dataset.id,
        })
    },

    /**
     * 删除课程类目
     * @param {*} event 
     */
    deleteCatalogue: function (event) {
        var catalogueId = event.currentTarget.dataset.id;
        // 检查该课程类目下是否存在课程
        wx.cloud.callFunction({
            name: "course",
            data: {
                requestType: "courseGetList",
                catalogueId: catalogueId
            }
        }).then(res => {
            if (res.result.data.length < 1) {
                this.deleteCatalogueById(catalogueId);
            } else {
                this.showToast("该课程类目下存在课程，不能删除！");
            }
        }).catch(err => {
            console.log(err);
            this.showToast("操作失败，请重试！");
        });
    },

    /**
     * 根据课程类目ID删除
     * @param {课程类目Id} catalogueId 
     */
    deleteCatalogueById: function (catalogueId) {
        wx.cloud.callFunction({
            name: "catalogue",
            data: {
                requestType: "deleteCatalogueById",
                id: catalogueId
            }
        }).then(res => {
            this.showToast("删除课程类目成功！");
            this.onShow();
        }).catch(err => {
            console.log(err);
            this.showToast("操作失败，请重试！");
        });
    },

    /**
     * 弹窗代码封装
     * @param {弹窗提示消息} title 
     */
    showToast: function (title) {
        wx.showToast({
            title: title,
            icon: 'none'
        })
    }
})