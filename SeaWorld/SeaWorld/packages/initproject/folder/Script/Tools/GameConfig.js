
var GameConfig = {

    SOCKET: {
        // HOST: '192.168.31.113',
        // PORT: '54326',

        HOST: '47.104.141.78',
        PORT: '54326',
    },

    // 网络地址
    HTTP: {
        BASE_URL: '47.104.205.116',
        LOGIN_IP: "192.168.31.113",
        LOGIN_PORT: 93,
    },

    // 版本号
    VERSION: '0.0.1',

    // 游戏类型
    GAMETYPE: {
        NIUNIU: 1,                  // 牛牛
        ZHAJINHUA: 2,               // 炸金花
        LONGHUDOU: 3,               // 龙争虎斗
        BAIJIALE: 4,                // 百家乐
    },

    // 场次类型
    PLAYTYPE: {
        CHUJI: 1,            // 初级
        ZHONGJI: 2,          // 中级
        GAOJI: 3             // 高级
    },

    // 聊天快捷语
    QUICKMSG: [
        '不要吵了,专心玩游戏吧',
        '不要走决战到天亮',
        '各位真不好意思，我得离开一会',
        '和你合作真是太愉快了',
        '快点啊，我等到花都谢了',
        '你的牌打得也太好啦',
        '你是妹妹还是哥哥啊',
        '怎么又断线了，网络怎么这么差啊'
    ],
}
module.exports = GameConfig;