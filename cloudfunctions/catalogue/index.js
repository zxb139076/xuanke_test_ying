const cloud = require('wx-server-sdk');
// cloud.init();
cloud.init({
   // API 调用都保持和云函数当前所在环境一致
   // env: 'xuankeying-ykwz0'
   env: 'xuankeoutline-kve8u'
});
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'catalogueGetList') { // 获取课程类目列表
      return await db.collection("catalogue").get();
    } else if (event.requestType == 'getCatalogueById') { // 查询课程类目信息
      return await db.collection("catalogue").where({
        _id: event.id
      }).get();
    } else if (event.requestType == 'saveCatalogue') { // 保存课程类目信息
      if (event.id != "0") {
        return await db.collection("catalogue").where({
          _id: event.id
        }).update({
          data: {
            catalogueName: event.catalogueName,
            catalogueDetail: event.catalogueDetail,
            catalogueGroups: event.catalogueGroups
          },
        })
      } else {
        return await db.collection('catalogue').add({
          data: {
            catalogueName: event.catalogueName,
            catalogueDetail: event.catalogueDetail,
            catalogueGroups: event.catalogueGroups
          }
        });
      }
    } else if (event.requestType == "checkCatalogueIsExited") { // 检查课程类目信息是否存在
      if (event.id != "0") {
        return await db.collection("catalogue").aggregate().match(_.expr(
          $.neq(['$_id', event.id]),
        )).match({
          catalogueName: event.catalogueName
        }).end();
      } else {
        return await db.collection("catalogue").aggregate().match({
          catalogueName: event.catalogueName
        }).end();
      }
    } else if (event.requestType == "deleteCatalogueById") { // 删除课程信息
      return await db.collection("catalogue").doc(event.id).remove({
        success: function (res) {
          console.log(res.data)
        }
      });
    }
  } catch (e) {
    console.error(e)
  }
}