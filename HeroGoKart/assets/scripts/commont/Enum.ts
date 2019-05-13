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