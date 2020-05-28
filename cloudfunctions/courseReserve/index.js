// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("courseReserve").aggregate().lookup({
    from: 'courseArrange',
    localField: 'applyId',
    foreignField: '_id',
    as: 'arrangeInfo'
  }).match({
    _openid: event.openid
  }).end();
}