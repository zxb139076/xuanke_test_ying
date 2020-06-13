const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.requestType == 'checkSignIn') { // 验证登陆信息，用户登录时使用
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
    } else if (event.requestType == 'registerAccount') { //注册用户信息，教师注册学生信息时使用
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
            phone: event.phone,
            openid: "",
            headImg: ""
          }
        });
      }
    } else if (event.requestType == 'checkAccountIsExisted') { // 检查用户信息是否存在，教师注册用户信息时用于检验
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
    } else if (event.requestType == 'getUserList') { // 获取用户列表，教师获取学生列表时使用
      return await db.collection("users").get();
    } else if (event.requestType == 'getUserById') { // 根据Id获取用户信息，教师编辑用户信息时使用
      return await db.collection("users").where({
        _id: event.id
      }).get();
    } else if (event.requestType == 'getUserINFO') { // 根据用户名或手机号获取用户信息
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
    } else if (event.requestType == 'updateOpenid') { // 更新用户账号绑定的openid，绑定用户的openid时使用
      return await db.collection("users").where(_.expr(
        $.or([
          $.and([
            $.eq(['$username', event.account])
          ]),
          $.and([
            $.eq(['$phone', event.account])
          ])
        ])
      )).update({
        data: {
          headImg: event.headImg,
          openid: event.openid
        },
      });
    } else if (event.requestType == 'updatePassword') { // 更新用户账号密码，用户修改密码时使用
      return await db.collection("users").where(_.expr(
        $.or([
          $.and([
            $.eq(['$username', event.account])
          ]),
          $.and([
            $.eq(['$phone', event.account])
          ])
        ])
      )).update({
        data: {
          password: event.password
        },
      });
    } else if (event.requestType == 'checkOpenidIsExisted') { // 检查openid是否已经绑定到其它账号，用户登陆时使用
      return await db.collection("users").where({
        openid: event.openid
      }).get();
    }
  } catch (e) {
    console.error(e)
  }
}