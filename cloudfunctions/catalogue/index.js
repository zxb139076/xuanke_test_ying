const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'catalogueAdd') { // 添加课程类目信息
      return await db.collection('catalogue').add({
        data: {
          catalogueName: event.catalogueName,
          catalogueDetail: event.catalogueDetail,
          catalogueGroups: event.catalogueGroups
        }
      });
    } else if (event.requestType == 'catalogueGetList') { // 获取课程类目列表
      return await db.collection("catalogue").get();
    } else if (event.requestType == 'getCatalogueById') { // 查询课程类目信息
      return await db.collection("catalogue").where({
        _id: event.id
      }).get();
    } else if (event.requestType == 'editCatalogueById') { // 保存课程类目信息
      return await db.collection("catalogue").where({
        _id: event.id
      }).update({
        data: {
          catalogueName: event.catalogueName,
          catalogueDetail: event.catalogueDetail,
          catalogueGroups: event.catalogueGroups
        },
      })
    }
  } catch (e) {
    console.error(e)
  }
}