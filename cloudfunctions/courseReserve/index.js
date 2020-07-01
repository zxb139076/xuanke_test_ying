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
    if (event.requestType == 'showMyCourseReserveList') { // 取得我预定的课程列表信息，包含个人预定信息
      return await db.collection("courseReserve").aggregate().lookup({
        from: 'courseArrange',
        let: {
          applyId: '$applyId', // arrange_id为排课的ID，将_id映射为其上
        },
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(['$_id', '$$applyId']), // 排课的ID对应选课表中相应的applyId
          ])))
          .project({
            _id: 1,
            courseName: 1,
            currentData: 1,
            currentWeek: 1,
            endTime: 1,
            courseIsFinished: 1,
            startTime: 1
          })
          .done(),
        as: 'arrangeInfo'
      }).replaceRoot({
        newRoot: $.mergeObjects([$.arrayElemAt(['$arrangeInfo', 0]), '$$ROOT'])
      }).sort({
        currentData: -1,
        startTime: -1
      }).match({
        username: event.username
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