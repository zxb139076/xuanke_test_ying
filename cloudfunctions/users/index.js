const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'checkSignIn') { // 验证登陆信息
      return await db.collection("users").aggregate().match(_.expr(
        $.or([
          $.and([
            $.eq(['$username', event.account]),
            $.gt(['$password', event.password])
          ]),
          $.and([
            $.eq(['$phoneNumber', event.account]),
            $.gt(['$password', event.password])
          ])
        ])
      )).end();
    }
  } catch (e) {
    console.error(e)
  }
}