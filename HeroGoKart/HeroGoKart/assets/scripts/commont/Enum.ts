/**@enum 事件类型 */
export enum EventType {
    /**金币总数 */
    Coin_Amount,
    /**商城显示--->角色 */
    ShopShow_Role,
    /**商城关闭--->角色 */
    ShopColse_Role,
    /**商城显示--->汽车 */
    ShopShow_Car,
    /**商城关闭--->汽车 */
    ShopColse_Car,
    /**关卡页显示 */
    Page_LevelShow,
    /**关卡页关闭 */
    Page_LevelClose,
    /**首页显示 */
    Page_StartShow,
    /**首页关闭 */
    Page_StartClose,
    /**游戏页显示 */
    Page_GameShow,
    /**游戏页关闭 */
    Page_GameClose,
    /**设置当前赛道 */
    Game_SetCurrentPath,
    /**设置当前玩家皮肤 */
    Game_SetCurrentPlayerSkin,
    /**抽取道具 */
    Game_ExtractProp,
    /**设置速度条 */
    Game_SetSpeedBar,
    /**设置道具对象池 */
    Game_SetPoolProp,
    /**游戏结束*/
    Game_GameOver,
    /**清空道具盒子 */
    Game_ClearPropBox,
    /**音效 */
    Sound,
    /**注销延时回调 */
    UnSchedule,
}

/**@enum 缓存类型 */
export enum CacheType {
    /**金币总数 */
    Coin_Amount = "Coin_Amount",
    /**当前角色ID */
    Current_Role_ID = "Current_Role_ID",
    /**已购买商品--->角色ID */
    HaveCommodity_RoleIDs = "HaveCommodity_RoleIDs",
    /**当前汽车ID */
    Current_Car_ID = "Current_Car_ID",
    /**已购买商品--->汽车ID */
    HaveCommodity_CarIDs = "HaveCommodity_CarIDs",
}

/**@enum 龙骨动画名称--->角色 */
export enum DragonBonesAnimation_Role {
    /**默认动画 */
    a1 = "a1",
    a2 = "a2",
    a3 = "a3",
    a4 = "a4",
    a5 = "a5",
    a6 = "a6",
    a7 = "a7",
    a8 = "a8",
    a9 = "a9",
    a10 = "a10",
    a11 = "a11",
}

/**@enum 龙骨动画名称--->汽车 */
export enum DragonBonesAnimation_Car {
    /**默认动画 */
    a1 = "a1",
    a2 = "a2",
    a3 = "a3",
    a4 = "a4",
    a5 = "a5",
    a6 = "a6",
    a7 = "a7",
    a8 = "a8",
}

/**@enum 龙骨动画执行次数 */
export enum DragonBonesAnimation_PlayTimes {
    /**使用配置文件中的默认值 */
    Default_Value = -1,
    /**无限循环，大于0表示循环次数 */
    Loop = 0,
}

/**@enum 被动道具 */
export enum Prop_Passive {
    /**加速带 */
    AreaSpeedUp = "AreaSpeedUp",
    /**传送门 */
    Portal = "Portal",
    /**集装箱 */
    Container = "Container",
    /**龙卷风 */
    Tornado = "Tornado",
    /**栏杆 */
    Handrail = "Handrail",
    /**路障 */
    Roadblock = "Roadblock",
    /**大石头 */
    Boulder = "Boulder",
    /**石墩 */
    Piers = "Piers",
    /**水滩 */
    Water = "Water",
    /**定时炸弹 */
    TimeBomb = "TimeBomb",
    /**油漆 */
    Paint = "Paint",
    /**金币--->1 */
    Coin_1 = "Coin_1",
    /**金币--->2 */
    Coin_2 = "Coin_2",
    /**金币--->3 */
    Coin_3 = "Coin_3",
    /**金币--->4 */
    Coin_4 = "Coin_4",
    /**金币--->5 */
    Coin_5 = "Coin_5",
    /**金币--->6 */
    Coin_6 = "Coin_6",
    /**金币--->7 */
    Coin_7 = "Coin_7",
    /**金币--->8 */
    Coin_8 = "Coin_8",
}

/**@enum 音效 */
export enum SoundType {
    /**播放背景音效--->首页 */
    PlayBGM_Start,
    /**停止背景音效--->首页 */
    StopBGM_Start,
    /**播放背景音效--->游戏页 */
    PlayBGM_Game,
    /**停止背景音效--->游戏页 */
    StopBGM_Game,
    /**出发音效 */
    Go,
    /**购买道具成功音效 */
    Buy_Yes,
    /**点击音效 */
    Click,
    /**金币不足音效 */
    Coin_insufficient,
    /**刹车音效 */
    Brake,
    /**完成音效 */
    Complete,
    /**开始游戏倒计时 */
    StartTime,
    /**游戏结束倒计时 */
    EndTime,
    /**道具--->问号 */
    Question,
    /**香蕉皮 */
    BananaSkin,
    /**导弹 */
    Bomb,
    /**小丑礼包 */
    ClownGift,
    /**水球 */
    WaterPolo,
    /**冰冻 */
    Frozen,
    /**保护罩 */
    Protection,
    /**加速 */
    SpeedUp,
    /**吸铁石 */
    Mangnet,
    /**雷击 */
    Lightning,
    /**金币 */
    Coin,
    /**龙卷风 */
    Tornado,
    /**传送门 */
    Portal,
    /**油漆 */
    Paint,
    /**路障 */
    Roadblock,
    /**石墩 */
    Piers,
    /**水滩 */
    Water,
    /**定时炸弹 */
    TimeBomb,
}

/**@enum 特殊汽车 */
export enum Special_Car {
    /**皮卡车 */
    Pickup = "Pickup",
    /**水泥集装车 */
    CementTruck = "CementTruck",
    /**压路车 */
    StreetRoller = "StreetRoller",
    /**是否为空 */
    Null = "null",
}