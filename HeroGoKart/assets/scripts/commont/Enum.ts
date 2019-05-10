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