// 云函数入口文件
const cloud = require('wx-server-sdk')
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
    if (event.requestType == 'courseArrangeGetList') { // 获取当前日期的课程排课列表，教师在课程排课列表界面使用
      return await db.collection("courseArrange").where({
        currentData: event.currentData
      }).get();
    } else if (event.requestType == 'getCourseArrangeById') { // 查询课程排课信息，教师在课程排课编辑界面使用
      return await db.collection("courseArrange").where({
        _id: event.id
      }).get();
    } else if (event.requestType == 'showCourseArrangeDetail') { // 显示课程排课详细信息，教师在课程排课详情界面使用
      return await db.collection("courseArrange").aggregate().lookup({
        from: 'courseReserve',
        localField: '_id',
        foreignField: 'applyId',
        as: 'courseReserveList'
      }).match({
        _id: event.id
      }).end();
    } else if (event.requestType == 'saveCourseArrange') { // 保存课程排课信息，教师在排课编辑界面保存时使用
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
            courseIsFinished: 0
          }
        });
      }
    } else if (event.requestType == 'courseArrangeGetListByOrder') { //获取课程列表，用户在课程预约列表界面使用
      return await db.collection("courseArrange").aggregate().lookup({
        from: 'courseReserve',
        let: {
          arrange_id: '$_id',
        },
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(['$applyId', '$$arrange_id']),
          ]))).match({
            username: event.username
          })
          .project({
            _id: 0,
            _openid: 1,
            applyId: 1,
            isFinished: 1,
            phone: 1,
            realname: 1,
            updateTime: 1,
            username: 1
          })
          .done(),
        as: 'arrangeList'
      }).match({
        currentData: event.currentData
      }).end();
    } else if (event.requestType == 'getCountOfCourseArrange') { // 获取当前选课的人数，用户在课程预约列表界面使用
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
    } else if (event.requestType == 'checkCourseArrangeByTime') { // 检查该日期该时间段是否有课程，教师在保存排课信息编辑时使用
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
    } else if (event.requestType == 'updateCourseArrangeFinished') { // 更新预定人的课程为完成状态，教师在更新课程完成状态时使用
      return await db.collection("courseReserve").where({
        applyId: event.id
      }).update({
        data: {
          isFinished: 1
        },
      });
    } else if (event.requestType == 'updateCourseArrange') { // 更新课程为完成状态，教师在更新课程完成状态时使用
      return await db.collection("courseArrange").where({
        _id: event.id
      }).update({
        data: {
          courseIsFinished: 1
        },
      });
    } else if (event.requestType == 'checkCourseArrangeUpdateFinished') { // 检查课程是否可以更新为完成状态，教师在更新课程完成状态时使用
      return await db.collection("courseArrange").aggregate().match({
        _id: event.id
      }).match(_.expr(
        $.or([
          $.lt(['$currentData', event.currentData]),
          $.and([
            $.eq(['$currentData', event.currentData]),
            $.lt(['$endTime', event.currentTime])
          ])
        ])
      )).end();
    } else if (event.requestType == 'checkCourseReserveConfirm') { // 检查当前是否可以预约该课程，用户在预约功能时使用
      return await db.collection("courseArrange").aggregate().match({
        _id: event.applyId
      }).match(_.expr(
        $.or([
          $.gt(['$currentData', event.currentData]),
          $.and([
            $.eq(['$currentData', event.currentData]),
            $.gt(['$startTime', event.currentTime])
          ])
        ])
      )).end();
    } else if (event.requestType == 'getReadyFinishedCourseArrange') { // 根据查询条件获取课程列表
      // 开始时间不为空
      if (event.courseBeginData != "") {
        if (event.courseEndData != "") {
          return await db.collection("courseArrange").aggregate().sort({
            isFinished: 1,
            currentData: -1,
            startTime: -1
          }).match(_.expr(
            $.and([
              $.gte(['$currentData', event.courseBeginData]),
              $.lte(['$currentData', event.courseEndData])
            ])
          )).end();
        } else {
          return await db.collection("courseArrange").aggregate().sort({
            isFinished: 1,
            currentData: -1,
            startTime: -1
          }).match(_.expr(
            $.and([
              $.gte(['$currentData', event.courseBeginData]),
            ])
          )).end();
        }
      } else { // 开始时间为空
        if (event.courseEndData != "") {
          return await db.collection("courseArrange").aggregate().sort({
            isFinished: 1,
            currentData: -1,
            startTime: -1
          }).match(_.expr(
            $.and([
              $.lte(['$currentData', event.courseEndData])
            ])
          )).end();
        } else {
          return await db.collection("courseArrange").aggregate().sort({
            isFinished: 1,
            currentData: -1,
            startTime: -1
          }).end();
        }
      }
    } else if (event.requestType == 'cancelCourseArrangeById') { // 根据课程ID取消课程
      return await db.collection("courseArrange").where({
        _id: event.id
      }).update({
        data: {
          courseIsCancel: 1
        },
      });
    }
  } catch (e) {
    console.error(e)
  }
}