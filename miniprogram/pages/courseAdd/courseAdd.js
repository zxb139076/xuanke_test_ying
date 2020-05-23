// pages/courseAdd/courseAdd.js
var app = getApp()
Page({
    data: {
        hiddenmodalput: true,
        projectName: '',
        projectDetail: '',
        projectGroups: '',
        resultList: null,
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
    }
})