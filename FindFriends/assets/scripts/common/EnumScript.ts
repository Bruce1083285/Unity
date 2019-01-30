/**@enum 格子 */
export enum Grid {
    /**格子牌 */
    grid_card,
    /**障碍牌 */
    obstacle_card,
    /**卡牌 */
    card,
}

/**@enum 颜色 */
export enum Color {
    /**红色 */
    red,
    /**黄色 */
    yellow,
    /**蓝色 */
    blue,
    /**绿色 */
    green,
    /**任意颜色 */
    any,
}

/**@enum 花色位置 */
export enum SuitPos {
    /**右上 */
    rightAndup,
    /**左下 */
    leftAnddown
}

/**@enum 音效数据 */
export enum AudioD {
    /**BGM */
    bgm,
    /**按钮点击 */
    click_but,
    /**刷新点击 */
    click_refresh,
    /**移动 */
    move,
    /**失败 */
    failure,
    /**胜利 */
    victory,
}

/**@enum 场景数据 */
export enum SceneD{
    /**加载场景 */
    loading,
    /**游戏场景 */
    game,
}