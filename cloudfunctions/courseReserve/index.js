// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'showMyCourseReserveList') { // 获取我预定的课程列表,含课程信息
      return await db.collection("courseReserve").aggregate().lookup({
          from: 'courseArrange',
          localField: 'applyId',
          foreignField: '_id',
          as: 'arrangeInfo'
        }).sort({
          currentData: -1,
        })
        .match({
          _openid: event.openid
        }).end();
    } else if (event.requestType == 'deleteCourseReserveById') { //取消我预定的课程
      return await db.collection("courseReserve").doc(event.id).remove({
        success: function (res) {
          console.log(res.data)
        }
      });
    } else if (event.requestType == 'getMyCourseReserveById') { // 根据排课ID和用户openid获取用户是否有预约该课程
      return await db.collection("courseReserve").where({
        applyId: event.applyId,
        _openid: event.openid
      }).get();
    }
  } catch (e) {
    console.error(e)
  }
}