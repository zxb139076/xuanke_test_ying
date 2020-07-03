const cloud = require('wx-server-sdk');
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'courseGetAllList') { // 获取全部课程列表
      return await db.collection("course").get();
    } else if (event.requestType == 'courseGetList') { // 根据课程类目ID获取课程列表
      return await db.collection("course").where({
        catalogueId: event.catalogueId
      }).orderBy('courseOrder', 'asc').get();
    } else if (event.requestType == 'getCourseById') { // 查询课程项目信息
      return await db.collection("course").where({
        _id: event.id
      }).get();
    } else if (event.requestType == 'saveCourse') { // 保存课程信息
      if (event.id != "0") {
        return await db.collection("course").where({
          _id: event.id
        }).update({
          data: {
            courseName: event.courseName,
            courseDetail: event.courseDetail,
            courseOrder: event.courseOrder
          },
        })
      } else {
        return await db.collection('course').add({
          data: {
            catalogueId: event.catalogueId,
            courseName: event.courseName,
            courseDetail: event.courseDetail,
            courseOrder: event.courseOrder
          }
        });
      }
    } else if (event.requestType == "checkCourseIsExited") { // 检查课程信息是否存在
      if (event.id != "0") {
        return await db.collection("course").aggregate().match(_.expr(
          $.neq(['$_id', event.id]),
        )).match(_.expr(
          $.or([
            $.eq(['$courseName', event.courseName]),
            $.eq(['$courseOrder', event.courseOrder])
          ])
        )).end();
      } else {
        return await db.collection("course").aggregate().match(_.expr(
          $.or([
            $.eq(['$courseName', event.courseName]),
            $.eq(['$courseOrder', event.courseOrder])
          ])
        )).end();
      }
    } else if (event.requestType == "deleteCourseById") { // 删除课程信息
      return await db.collection("course").doc(event.id).remove({
        success: function (res) {
          console.log(res.data)
        }
      });
    }
  } catch (e) {
    console.error(e)
  }
}