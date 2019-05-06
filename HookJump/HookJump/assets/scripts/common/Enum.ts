/**@enum 缓存类型 */
export enum CacheType {
    /**金币 */
    Coin = "Coin",
    /**当前获得金币数 */
    Current_Coin = "Current_Coin",
    /**已购买角色商品 */
    Pur_Role = "Pur_Role",
    /**角色皮肤ID */
    Role_SkinId = "Role_SkinId",
    /**已购买钩子商品 */
    Pur_Hook = "Pur_Hook",
    /**钩子皮肤ID */
    Hook_SkinId = "Hook_SkinId",
    /**关卡数 */
    Level_Num = "Level_Num",
    /**是否首次进入 */
    IsFirst = "IsFirst",
    /**音效 */
    BGM = "BGM",
    /**分享次数 */
    Share_Count = "Share_Count",
    /**上次领取时间 */
    Last_Receive_Time = "Last_Receive_Time",
    /**上次上线时间 */
    Last_Time = "Last_Time",
    /**红包数 */
    Red_Num = "Red_Num",
    /**是否授权 */
    IsAuthorization = "IsAuthorization",
    /**游戏模式 */
    GameMode = "GameMode",
    /**碎片数 */
    FragmentNum = "FragmentNum",
}

/**@enum 事件类型 */
export enum EventType {
    /**更新金币 */
    Update_Coin,
}

/**@enum 音效类型 */
export enum SoundType {
    /**点击 */
    Click,
    /**
     * 金币音效
     */
    Coin_Audio,
    /**
     *  礼包音效
     */
    Gift_Audio,
    /**
     * 奖品音效
     */
    Prize_Audio,
    /**
     * 钩中音效
     */
    Hooking_Audio,
    /**
     * 抽奖音效
     */
    Luck_Audio,
    /**
     *  绳子音效
     */
    Rope_Audio,
    /**
    *  弹框音效
    */
    Popout_Audio,
    /**
    *  死亡音效
    */
    Death_Audio,
    /**
     * ReadyGo
     */
    Ready_Go,
    /**
     * 跳跃音效
     */
    Jump_Audio,
    /**碎片音效 */
    Fragment_Audio,
    /**奖品音效 */
    Award_Audio,
}

/**@enum 道具 */
export enum Prop {
    /**反转 */
    Reversal,
    /**台阶移动 */
    StageMove,
    /**无敌 */
    Invincible,
    /**双倍金币 */
    DoubleCoin,
    /**底部停止 */
    DownStop,
    /**三个钩子 */
    HookThree,
    /**长度 */
    Length,
}