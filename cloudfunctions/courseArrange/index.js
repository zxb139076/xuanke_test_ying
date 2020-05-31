const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'courseArrangeAdd') { // 添加课程排课信息
      return await db.collection('courseArrange').add({
        data: {
          courseName: event.courseName,
          currentData: event.currentData,
          currentWeek: event.currentWeek,
          startTime: event.startTime,
          endTime: event.endTime,
        }
      });
    } else if (event.requestType == 'courseArrangeGetList') { // 获取课程排课列表
      return await db.collection("courseArrange").where({
        currentData: event.currentData
      }).get();
    } else if (event.requestType == 'courseArrangeGetListByOrder') { //获取课程排课列表，并检查是否已经预约过
      return await db.collection("courseArrange").aggregate().lookup({
        from: 'courseReserve',
        let: {
          arrange_id: '$_id',
        },
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(['$applyId', '$$arrange_id']),
          ]))).match({
            _openid: event.openid
          })
          .project({
            _id: 0,
            _openid: 1,
            applyId: 1,
            headimgurl: 1,
            isFinished: 1,
            nickName: 1,
            updateTime: 1
          })
          .done(),
        as: 'arrangeList'
      }).match({
        currentData: event.currentData
      }).end();
    } else if (event.requestType == 'getCountOfCourseArrange') {
      return await db.collection("courseArrange").aggregate().lookup({
        from: 'courseReserve',
        let: {
          arrange_id: '$_id',
        },
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(['$applyId', '$$arrange_id']),
          ])))
          .project({
            _id: 0,
            _openid: 1,
            applyId: 1,
            headimgurl: 1,
            isFinished: 1,
            nickName: 1,
            updateTime: 1
          })
          .done(),
        as: 'arrangeList'
      }).match({
        currentData: event.currentData
      }).end();
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
          startTime: event.startTime,
          endTime: event.endTime
        },
      })
    } else if (event.requestType == 'showCourseArrangeDetail') { // 
      return await db.collection("courseArrange").aggregate().lookup({
        from: 'courseReserve',
        localField: '_id',
        foreignField: 'applyId',
        as: 'courseReserveList'
      }).match({
        _id: event.id
      }).end();
    }
  } catch (e) {
    console.error(e)
  }
}