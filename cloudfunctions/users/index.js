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
            $.eq(['$password', event.password])
          ]),
          $.and([
            $.eq(['$phone', event.account]),
            $.eq(['$password', event.password])
          ])
        ])
      )).end();
    } else if (event.requestType == 'register') { //注册用户信息
      if (event.id != "0") {
        return await db.collection("users").where({
          _id: event.id
        }).update({
          data: {
            username: event.username,
            realname: event.realname,
            password: event.password,
            phone: event.phone
          }
        })
      } else {
        return await db.collection('users').add({
          data: {
            username: event.username,
            realname: event.realname,
            password: event.password,
            phone: event.phone
          }
        });
      }
    }
  } catch (e) {
    console.error(e)
  }
}