const cloud = require('wx-server-sdk');
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == "checkIsAdmin") {
      return await db.collection("userRights").where({// 检查是否有管理员权限
        username: event.username
      }).get();
    }
  } catch (e) {
    console.error(e)
  }
}