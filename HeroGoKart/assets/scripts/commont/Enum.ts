/**@enum 事件类型 */
export enum EventType {
    /**商城显示--->角色 */
    ShopShow_Role,
    /**商城关闭--->角色 */
    ShopColse_Role,
    /**商城显示--->汽车 */
    ShopShow_Car,
    /**商城关闭--->汽车 */
    ShopColse_Car,
}

/**@enum 缓存类型 */
export enum CacheType {
    /**金币总数 */
    Coin_Amount = "Coin_Amount",
    /**当前角色ID */
    Current_Role_ID = "Current_Role_ID",
}