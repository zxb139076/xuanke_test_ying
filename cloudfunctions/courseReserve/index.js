// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'showMyCourseReserveList') {  // 获取我预定的课程列表
      return await db.collection("courseReserve").aggregate().lookup({
        from: 'courseArrange',
        localField: 'applyId',
        foreignField: '_id',
        as: 'arrangeInfo'
      }).match({
        _openid: event.openid
      }).end();
    } else if (event.requestType == 'deleteCourseReserveById') { //取消我预定的课程
      return await db.collection("courseReserve").doc(event.id).remove({
        success: function (res) {
          console.log(res.data)
        }
      });
    } else if (event.requestType == 'checkCourseReserve') { // 检查我是否已经预约该课程
      return await db.collection("courseReserve").where({
        applyId: event.applyId,
        currentData: event.currentData,
        _openid: event.openid
      }).get();
    }
  } catch (e) {
    console.error(e)
  }
}