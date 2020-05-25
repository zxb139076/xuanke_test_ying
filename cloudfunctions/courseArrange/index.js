const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'courseArrangeAdd') { // 添加课程排课信息
      return await db.collection('courseArrange').add({
        data: {
          courseName: event.courseName,
          currentData: event.currentData,
          startTime: event.startTime,
          endTime: event.endTime,
          currentWeek: event.currentWeek
        }
      });
    } else if (event.requestType == 'courseArrangeGetList') { // 获取课程排课列表
      return await db.collection("courseArrange").where({
        currentData: event.currentData
      }).get();
    } else if (event.requestType == 'getCourseArrangeById') { // 查询课程排课信息
      return await db.collection("courseArrange").where({
        _id: event.id
      }).get();
    } else if (event.requestType == 'editCourseArrangeById') { // 保存课程排课信息
      return await db.collection("courseArrange").where({
        _id: event.id
      }).update({
        data: {
          courseName: event.courseName,
          currentData: event.currentData,
          startTime: event.startTime,
          endTime: event.endTime,
          currentWeek: event.currentWeek
        },
      })
    }
  } catch (e) {
    console.error(e)
  }
}