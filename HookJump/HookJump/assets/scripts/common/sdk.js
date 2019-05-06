const appinfo = {
  version: '1.0.0',
  request_domain: 'https://api.9xy.cn/Gds/',
}
const request_domain = appinfo.request_domain
var login_status = ''
if (window.wx != undefined) {
  const request = (obj) => {
    //默认配置
    var d_obj = {
      api: '',
      cache: 0,
      back: true,
      data: {},
      pdata: {}, //postdata  post时候有用
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      is_force: false,
      is_login: true, //是否需要登录  提前判断 减少服务器压力
      success: (res) => { },
      fail: (res) => {
        // showModal({
        //   title: '提示',
        //   mask: true,
        //   content: '连接服务器错误！',
        //   showCancel: false,
        // })
      },
      complete: (res) => { },
    };
    var old_obj = Object.assign({}, obj);
    obj = Object.assign({}, d_obj, obj);
    if (obj.cache) {
      if (obj.is_force) {
        obj.is_force = false
        var cache_key = JSON.stringify(obj) + appinfo.version;
      } else {
        var cache_key = JSON.stringify(obj) + appinfo.version;
        var cachesdata = cache(cache_key)
        if (cachesdata) {
          obj.success(cachesdata);
          return
        }
      }
    }
    var sign_data = {}
    sign_data.version = appinfo.version;
    if (!obj.back) {
      wx.showToast({
        title: '请稍等一下下...',
        icon: 'loading',
        duration: 10000,
      });
    }
    sign_data.timestamp = parseInt(new Date().getTime() / 1000); //时间戳
    //随机数
    var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var rand = "";
    for (var i = 0; i < 8; i++) {
      var id = Math.ceil(Math.random() * 52);
      rand += chars[id];
    }
    sign_data.noncestr = rand;
    obj.data = Object.assign({}, obj.data, sign_data)
    if (obj.is_login) {
      if (!obj.data.trd_session) {
        if (false == cache('trd_session')) {
          login(old_obj)
          return
        } else {
          obj.data.trd_session = cache('trd_session')
        }
      }
    }
    obj.data = Object.assign({}, obj.data, sign_data)
    if (appinfo.app_debug === true) {
      obj.data.debug = true;
    }
    //如果是非get请求重新组装api
    if (obj.method.toUpperCase() != 'GET') {
      var param = []
      for (var p in obj.data) {
        param.push(p + '=' + obj.data[p])
      }
      obj.api += '?' + param.join('&')
      obj.send_data = obj.pdata
    } else {
      obj.send_data = obj.data
    }
    wx.request({
      url: request_domain + obj.api,
      data: obj.send_data,
      method: obj.method,
      header: obj.header,
      success: (res) => {
        if (!obj.back) {
          wx.hideToast();
        }
        if (res.statusCode != 200 && typeof obj.fail == 'function') {
          obj.fail(res);
        }

        if (typeof (res.data) != 'object' && res.data) {
          //以后再说要不要上报错误
          // wx.request({
          //   url: request_domain + 'exceptions',
          //   data: { e: JSON.stringify(res) }
          // })
          // 上报错误
          // showModal({
          //   title: '提示',
          //   content: '服务器格式错误',
          //   showCancel: false,
          // })
          return;
        }
        if (0 === res.data.status) {
          if ('unlogin' === res.data.info) {
            login(old_obj)
          } else {
            // showModal({
            //   title: '提示',
            //   mask: true,
            //   content: res.data.info,
            //   showCancel: false,
            // })
          }
          return
        }
        if (obj.cache) {
          cache(cache_key, res.data, obj.cache)
        }
        obj.success(res.data);
      },
      fail: function (res) {
        if (!obj.back) {
          wx.hideToast();
        }
        if (typeof obj.fail == 'function') {
          obj.fail(res);
        }
      },
      complete: obj.complete
    })
  }
  const post = (obj) => {
    if (obj.data === undefined) {
      obj.data = {}
    }
    obj.method = 'post'
    obj.pdata = obj.data
    obj.data = {}
    request(obj)
  }
  const get = (obj) => {
    obj.method = 'get'
    request(obj)
  }

  const showModal = wx.showModal //后期可能扩展
  const cache = (name, value = '', expire = 3600) => {
    name = appinfo.version + name
    //获取缓存
    if ('' === value) {
      var caches = wx.getStorageSync(name) || false
      if (caches && new Date().getTime() < caches.expire * 1000) {
        return caches.data
      }
      else {
        return false
      }
    }
    //删除缓存
    else if (null === value) {
      wx.removeStorageSync(name)
    }
    //设置缓存
    else {
      wx.setStorageSync(name, {
        data: value,
        expire: new Date().getTime() + expire
      });
    }
  }
  const login = (obj) => {
    wx.login({
      success: (res) => {
        logincb({
          res: res,
          cb: (trd_session) => {
            if (!obj.data) {
              obj.data = {}
            }
            request(obj)
          }
        })
      }
    })
  }
  //{encryptedData:encryptedData,iv:iv}
  const getUserInfo = (obj) => {
    if(false!==cache('getUserInfo'))
    {
      return
    }
    cache('getUserInfo',true,3600*24)//同一天不重复请求
    let encryptedData = obj.encryptedData
    let iv = obj.iv
    post({
      api: 'Wxapp/updateUserInfo',
      data: {
        encryptedData: encryptedData,
        iv: iv
      },
      success(data) {
        if (data.info == 'session_key_unlogin') {
          wx.login({
            success: (res) => {
              logincb({
                res: res,
                cb: (trd_session) => {
                  wx.getUserInfo({
                    withCredentials: true,
                    lang: "zh_CN",
                    success(res) {
                      getUserInfo({ encryptedData: res.encryptedData, iv: res.iv })
                    },
                    fail(res) {
                      console.log(res);
                    }
                  });
                }
              })
            }
          })
        }
      }
    })
  }
  //
  const logincb = (obj) => {
    const options = wx.getLaunchOptionsSync()
    const parent_id = options.query.parent_id || ''
    const qd_id = options.query.qd_id || ''
    var times = new Date().getTime();
    if (login_status && login_status > times - 3000) {
      var login_timer = setInterval(() => {
        var trd_session = cache('trd_session') || ''
        if ('' === trd_session) {
          return
        }
        clearInterval(login_timer)
        if (typeof obj.cb === 'function') {
          obj.cb(trd_session)
        }
      }, 500)
      return
    }
    login_status = times
    request({
      api: 'Wxapp/login',
      is_login: false,
      pdata: {
        code: obj.res.code,
        parent_id: parent_id,
        qd_id: qd_id,
      },
      method: "POST",
      success: (data) => {
        login_status = ''
        if (data.status != 1) {
          // showModal({
          //   title: '提示',
          //   mask: true,
          //   content: data.info,
          //   showCancel: false,
          // })
          return false;
        }
        cache('trd_session', data.info, 3600 * 24 * 7)
        if (typeof obj.cb === 'function') {
          obj.cb(data.info)
        }
      }
    })
  }
  const clickAd = (id) => {
    post({
      api: "Member/clickAd",
      data: { id: id, }
    })
  }
  const getCardPwd=(money)=>{
    if(!money)
    {
      throw Error("请传入话费")
    }
    //先获取卡密
    get({
      api:"Member/createCard",
      data:{
        money:money
      },
      success(data){
        let sn=data.info
        console.log(sn)
        wx.openCustomerServiceConversation({
          sessionFrom:sn,
          showMessageCard:true,
          sendMessageTitle:'关注公众号，兑换话费',
          sendMessageImg:'https://cdnfile.zcwx.com/gds/shf/shf.png',
      })
      },      
    })    
    
  }
  const playGame=(guan)=>{
    if(false===cache('playGame'+guan))
    {
      post({
        api:"Member/playGame",
        data:{
          guan:guan
        },
        success(){
          cache('playGame'+guan,'1',3600*24*365)
        }
      })
    }
  }
  const getOpenid=(cb)=>{
    get({
      api:"Member/getOpenid",
      cache:3600*24,
      success(res){
        let openid=res.info
        if(typeof cb=='function')
        {
          cb(openid)
        }
      }
    })
  }
  const openid2minfo=(obj={openids:[],success:()=>{}})=>
  {
    let openids=obj.openids
    get({
      api:"Member/getUserInfoByOpenid",
      cache:3600*24,
      data:{
        openids:openids.join('|')
      },
      success(res){
        obj.success(res)
      }
    })
  }

  module.exports = {
    get: get,
    post: post,
    appinfo: appinfo,
    showModal: showModal,
    cache: cache,
    clickAd: clickAd,
    getUserInfo: getUserInfo,
    getCardPwd:getCardPwd,
    playGame:playGame,
    getOpenid:getOpenid,
    openid2minfo:openid2minfo,
  }
  var visitId = 0
  wx.onShow(() => {
    if (visitId === 0) {
      post({
        api: "Member/onShow",
        success(res) {
          visitId = res.info
        }
      })
    }
  })
  wx.onHide(() => {
    post({
      api: "Member/onHide",
      data: { visitId: visitId },
      success(res) {
        visitId = 0
      }
    })
  })
}