const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'courseArrangeGetList') { // 获取课程排课列表
      return await db.collection("courseArrange").where({
        currentData: event.currentData
      }).get();
    } else if (event.requestType == 'getCourseArrangeById') { // 查询课程排课信息
      return await db.collection("courseArrange").where({
        _id: event.id
      }).get();
    } else if (event.requestType == 'showCourseArrangeDetail') { // 显示课程排课详细信息
      return await db.collection("courseArrange").aggregate().lookup({
        from: 'courseReserve',
        localField: '_id',
        foreignField: 'applyId',
        as: 'courseReserveList'
      }).match({
        _id: event.id
      }).end();
    } else if (event.requestType == 'saveCourseArrange') { // 保存课程排课信息
      if (event.id != "0") {
        return await db.collection("courseArrange").where({
          _id: event.id
        }).update({
          data: {
            courseName: event.courseName,
            startTime: event.startTime,
            endTime: event.endTime
          },
        })
      } else {
        return await db.collection('courseArrange').add({
          data: {
            courseName: event.courseName,
            currentData: event.currentData,
            currentWeek: event.currentWeek,
            startTime: event.startTime,
            endTime: event.endTime,
            isFinished: 0
          }
        });
      }
    } else if (event.requestType == 'courseArrangeGetListByOrder') { //检查我当前有没有预约过该课程
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
    } else if (event.requestType == 'getCountOfCourseArrange') { // 获取当前选课的人数
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
    } else if (event.requestType == 'checkCourseArrangeByTime') { // 检查该日期该事件段是否有课程
      if (event.id == "0") {
        return await db.collection("courseArrange").aggregate().match({
          currentData: event.currentData
        }).match(_.expr(
          $.or([
            $.and([
              $.gte(['$startTime', event.startTime]),
              $.lte(['$startTime', event.endTime]),
            ]),
            $.or([
              $.and([
                $.lte(['$startTime', event.startTime]),
                $.gte(['$endTime', event.startTime]),
              ]),
              $.and([
                $.lte(['$startTime', event.endTIme]),
                $.gte(['$endTime', event.endTime]),
              ])
            ])
          ])
        )).end();
      } else {
        return await db.collection("courseArrange").aggregate().match({
          currentData: event.currentData
        }).match(_.expr(
          $.neq(['$_id', event.id])
        )).match(_.expr(
          $.or([
            $.and([
              $.gte(['$startTime', event.startTime]),
              $.lte(['$startTime', event.endTime]),
            ]),
            $.or([
              $.and([
                $.lte(['$startTime', event.startTime]),
                $.gte(['$endTime', event.startTime]),
              ]),
              $.and([
                $.lte(['$startTime', event.endTIme]),
                $.gte(['$endTime', event.endTime]),
              ])
            ])
          ])
        )).end();
      }
    } else if (event.requestType == 'updateCourseArrangeFinished') { // 更新预定人的课程为完成状态
      return await db.collection("courseReserve").where({
        applyId: event.id
      }).update({
        data: {
          isFinished: 1
        },
      });
    } else if (event.requestType == 'updateCourseArrange') { // 更新课程为完成状态
      return await db.collection("courseArrange").where({
        _id: event.id
      }).update({
        data: {
          isFinished: 1
        },
      });
    } else if (event.requestType == 'checkCourseArrangeUpdateFinished') { // 检查课程是否可以更新为完成状态
      return await db.collection("courseArrange").aggregate().match({
        _id: event.id
      }).match(_.expr(
        $.gte(['$endTime', event.currentTime])
      )).end();
    }
  } catch (e) {
    console.error(e)
  }
}