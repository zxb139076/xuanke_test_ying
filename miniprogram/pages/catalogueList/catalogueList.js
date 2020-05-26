// pages/courseAdd/courseAdd.js
var app = getApp()
Page({
    data: {
        hiddenmodalput: true,
        projectName: '',
        projectDetail: '',
        projectGroups: '',
        resultList: null,
        addImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/add2.png?sign=628ec5a02762a8e81a91287a91b9d91d&t=1590133101",
        editImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/edit2.png?sign=ef6e1aba71848b80bc8a0ec3a5cf6938&t=1590133258",
        deleteImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/delete2.png?sign=1b5f6dc4dd932c7fe7aea760163a189f&t=1590133125",
        headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=9184ee1dd0a51f9965bb7fccd2598df3&t=1590470115",

    },
    //获取项目名称
    projectNameInput: function (e) {
        this.setData({
            projectName: e.detail.value
        })
        console
    },
    //获取项目描述
    projectDetailInput: function (e) {
        this.setData({
            projectDetail: e.detail.value
        })
    },
    //获取项目适合人群
    projectGroupsInput: function (e) {
        this.setData({
            projectGroups: e.detail.value
        })
    },
    // 显示项目添加面板
    modalinput: function () {
        this.setData({
            hiddenmodalput: !this.data.hiddenmodalput
        })
    },
    //取消按钮 
    cancel: function () {
        this.setData({
            hiddenmodalput: true
        });
    },
    //确认 
    confirm: function () {
        if (this.data.projectName == '') {
            wx.showToast({
                title: '请填写项目名称',
            });
            return false;
        }
        if (this.data.projectDetail == '') {
            wx.showToast({
                title: '请填写项目描述',
            });
            return false;
        }
        if (this.data.projectGroups == '') {
            wx.showToast({
                title: '请填写适合人群',
            });
            return false;
        }
        wx.cloud.callFunction({
            name: "catalogue",
            data: {
                requestType: 'catalogueAdd',
                projectName: this.data.projectName,
                projectDetail: this.data.projectDetail,
                projectGroups: this.data.projectGroups
            }
        }).then(res => {
            this.setData({
                hiddenmodalput: true,
                projectName: '',
                projectDetail: '',
                projectGroups: '',
            });
            this.cataLogueList();
            wx.showToast({
                title: '新增课程成功',
            });
        }).catch(err => {
            console.error(err)
        });
    },
    /**
      * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        wx.cloud.callFunction({
            name: "catalogue",
            data: {
                requestType: 'catalogueGetList'
            }
        }).then(res => {
            this.setData({
                resultList: res.result.data
            });
        }).catch(err => {
            console.error(err)
        })
    },
    /**
      * 生命周期函数--监听页面显示
    */
    onShow: function () {
        wx.cloud.callFunction({
            name: "catalogue",
            data: {
                requestType: 'catalogueGetList'
            }
        }).then(res => {
            this.setData({
                resultList: res.result.data
            });
        }).catch(err => {
            console.error(err)
        })
    },
    cataLogueList: function () {
        wx.cloud.callFunction({
            name: "catalogue",
            data: {
                requestType: 'catalogueGetList'
            }
        }).then(res => {
            this.setData({
                resultList: res.result.data
            });
        }).catch(err => {
            console.error(err)
        })
    },
    showEditCatalogue: function (event) {
        wx.navigateTo({
            url: '../catalogueEdit/catalogueEdit?id=' + event.currentTarget.dataset.id,
        })
    },
    showAddCatalogue: function (event) {
        wx.navigateTo({
            url: '../courseList/courseList?id=' + event.currentTarget.dataset.id,
        })
    }
})