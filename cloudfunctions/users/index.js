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
    } else if (event.requestType == 'registerAccount') { //注册用户信息
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
    } else if (event.requestType == 'checkAccountIsExisted') { // 检查用户信息是否存在
      if (event.id != "0") {
        return await db.collection("users").aggregate().match(_.expr(
          $.neq(['$_id', event.id]),
        )).match(_.expr(
          $.or([
            $.and([
              $.eq(['$username', event.username])
            ]),
            $.and([
              $.eq(['$phone', event.phone])
            ])
          ])
        )).end();
      } else {
        return await db.collection("users").aggregate().match(_.expr(
          $.or([
            $.and([
              $.eq(['$username', event.username])
            ]),
            $.and([
              $.eq(['$phone', event.phone])
            ])
          ])
        )).end();
      }
    } else if (event.requestType == 'usersGetList') { // 获取用户列表
      return await db.collection("users").get();
    } else if (event.requestType == 'getUserById') {// 根据Id获取用户信息
      return await db.collection("users").where({
        _id: event.id
      }).get();
    } else if (event.requestType == 'getUserINFO') {// 根据用户名或手机号获取用户信息
      return await db.collection("users").aggregate().match(_.expr(
        $.or([
          $.and([
            $.eq(['$username', event.account]),
          ]),
          $.and([
            $.eq(['$phone', event.account]),
          ])
        ])
      )).end();
    }
  } catch (e) {
    console.error(e)
  }
}