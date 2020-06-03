const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'courseGetAllList') { // 获取全部课程列表
      return await db.collection("course").get();
    } else if (event.requestType == 'courseGetList') { // 获取课程列表
      return await db.collection("course").where({
        catalogueId: event.catalogueId
      }).get();
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
            courseDetail: event.courseDetail
          },
        })
      } else {
        return await db.collection('course').add({
          data: {
            catalogueId: event.catalogueId,
            courseName: event.courseName,
            courseDetail: event.courseDetail
          }
        });
      }
    }
  } catch (e) {
    console.error(e)
  }
}