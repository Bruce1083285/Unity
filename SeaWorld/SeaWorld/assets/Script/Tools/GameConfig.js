
var GameConfig = {

    // TicketLobby-售票厅
    // Guest-游客
    // Submarine-潜艇
    // FishBowl-鱼缸
    // Fish-鱼

    BaseUrl: 'wepker.com', // 网络地址

    Version: '0.0.1',          // 版本号
    APPID: 'wxcea6a78a2566a45b',
    APPKEY: '9b87aaaf122175fbebed80308656713a',

    DEVICE_WIDTH: 720,         // 屏幕宽度
    DEVICE_HEIGHT: 1280,       // 屏幕高度

    Game_OpenNum: 1,            // 解锁等级
    Game_Type: 1,              // 1浅海 2深海 3未知区域

    Base_Ticket: 1,          // 初始门票(A类游客初始门票价格)
    Base_Capacity: 1,           // 潜艇初始容量

    // Base_Speed: 4,              // 游戏初始速度
    Base_Times_Speed: 1,         // 游戏速度倍数
    Base_Times_Price: 1,         // 游戏收益倍数

    LEVEL_TL: 0,               // 售票厅等级
    LEVEL_FB: 0,               // 鱼缸等级
    LEVEL_GUEST: 0,            // 游客等级

    HEIGHT_FB: 303,             // 鱼缸高度
    HEIGHT_SB: 147,             // 潜艇高度

    OffLineInCome: 0,          // 离线收益

    UserBaseInfo: {
        uid: 0,
        headImg: '',
        sex: 1,                // 1男2女
        gold: 0,               // 金币
        money: 0,              // 现金
    },

    // 奖励类型
    Reward_Type: {
        Gold: 1,
        Money: 2,
        Gem_1: 3,
        Gem_2: 4,
        Gem_3: 5,
        Gem_4: 6,
        Gem_5: 7,
        Bone: 8,
    },

    BasePrice_FishBowl: 10,                                      // 升级鱼缸基础价格
    BasePrice_Guest: [10, 12, 15, 18, 20, 25, 28, 30, 35, 40],   // 游客门票价格系数
    BasePrice_TransBar: 10,                                      // 传送带基础价格
    BasePrice_Submarine: 10,                                     // 潜艇基础价格

    BaseXiShu_Guest: [10, 12, 15, 18, 20, 25, 28, 30, 35, 40, 40],      // 游客门票价格系数
    BaseXiShu_Submarine: [3, 16, 17, 18, 24, 25, 28, 45, 50, 80, 80],   // 潜艇价格系数
    BaseXiShu_Bowl_TS: [1.5, 6, 7, 8, 12, 13, 15, 30, 40, 40],          // 鱼缸-提升系数
    BaseXiShu_Bowl_JC: [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 5.5],      // 鱼缸-加成系数
    BaseXiShu_TransBar: [2, 12, 13, 14, 20, 21, 24, 40, 45, 70, 70],      // 鱼缸-加成系数

    Guest_Show_QH: [0.6, 0.25, 0.1, 0.05],                       // 浅海游客出现概率
    Guest_Show_SH: [0.4, 0.3, 0.15, 0.15],                       // 深海游客出现概率
    Guest_Show_SH: [0.4, 0.3, 0.15, 0.15],                       // 未知海域游客出现概率
    Guest_Show_WZ: [0.1, 0.5, 0.2, 0.2],

    UpFishBowlMoney: [100, 500, 1000, 2000, 3000, 4000, 6000, 8000, 10000],

    // SubmarineLevels: [1, 10, 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 800, 900, 1000],

    ZiMu: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],

}

module.exports = GameConfig;