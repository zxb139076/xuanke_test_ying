// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'showMyCourseReserveList') { // 取得我预定的课程列表信息，包含个人预定信息
      return await db.collection("courseArrange").aggregate().lookup({
          from: 'courseReserve',
          let: {
            arrange_id: '$_id', // arrange_id为排课的ID，将_id映射为其上
          },
          pipeline: $.pipeline()
            .match(_.expr($.and([
              $.eq(['$applyId', '$$arrange_id']), // 排课的ID对应选课表中相应的applyId
            ]))).match({
              username: event.username
            })
            .project({
              _id: 0,
              _openid: 1,
              applyId: 1,
              headimgurl: 1,
              isFinished: 1,
              phone: 1,
              realname: 1,
              updateTime: 1,
              username: 1,
            })
            .done(),
          as: 'reserveList'
        }).sort({ //按照课程的时间降序排序
          currentData: -1,
          startTime: -1
        }).end();
    } else if (event.requestType == 'deleteCourseReserveById') { //取消我预定的课程
      return await db.collection("courseReserve").doc(event.id).remove({
        success: function (res) {
          console.log(res.data)
        }
      });
    } else if (event.requestType == 'getMyCourseReserveById') { // 根据排课ID和用户username获取用户是否有预约该课程
      return await db.collection("courseReserve").where({
        applyId: event.applyId,
        username: event.username
      }).get();
    }
  } catch (e) {
    console.error(e)
  }
}