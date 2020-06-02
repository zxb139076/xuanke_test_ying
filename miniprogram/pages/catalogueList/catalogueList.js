var app = getApp()
Page({
    data: {
        hiddenmodalput: true,
        catalogueName: '',
        catalogueDetail: '',
        catalogueGroups: '',
        resultList: null,
        addImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/add2.png?sign=628ec5a02762a8e81a91287a91b9d91d&t=1590133101",
        editImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/edit2.png?sign=ef6e1aba71848b80bc8a0ec3a5cf6938&t=1590133258",
        deleteImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/images/delete2.png?sign=1b5f6dc4dd932c7fe7aea760163a189f&t=1590133125",
        headImage: "https://7875-xuankeying-ykwz0-1256767223.tcb.qcloud.la/catalogue/ipad.jpeg?sign=9184ee1dd0a51f9965bb7fccd2598df3&t=1590470115",
    },
    
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
   
    showEditCatalogue: function (event) {
        wx.navigateTo({
            url: '../catalogueEdit/catalogueEdit?id=' + event.currentTarget.dataset.id,
        })
    },

    showAddCourse: function (event) {
        wx.navigateTo({
            url: '../courseList/courseList?id=' + event.currentTarget.dataset.id,
        })
    }
})