
/**@点击 功能管理 */
export enum Click_FunManage {
    /**上 */
    Up = "up",
    /**下 */
    Down = "down",
    /**左 */
    Left = "left",
    /**右 */
    Right = "right",
    /**顺时针旋转 */
    Clockwise = "Clockwise",
    /**逆时针旋转 */
    Anticlockwise = "Anticlockwise",
    /**存储 */
    Save = "Save"
}

/**@点击 方向键 */
export enum Click_Directions {
    /**上 */
    Up = "up",
    /**下 */
    Down = "down",
    /**左 */
    Left = "left",
    /**右 */
    Right = "right",
}

/**@点击 功能键 */
export enum Click_Function {
    /**顺时针旋转 */
    Clockwise = "Clockwise",
    /**逆时针旋转 */
    Anticlockwise = "Anticlockwise",
    /**存储 */
    Save = "Save",
}

/**@点击 设置键 */
export enum Click_Set {
    /**设置--->开 */
    Open = "Open",
    /**设置--->关 */
    Close = "Close",
    /**设置--->投像 */
    CastAs = "CastAs",
    /**设置--->音效 */
    Set = "Set",
}


// /**@按钮 方向键 */
// export enum But_Directions {
//     /**上 */
//     Up = "up",
//     /**下 */
//     Down = "down",
//     /**左 */
//     Left = "left",
//     /**右 */
//     Right = "right",
// }

// /**@按钮 功能键 */
// export enum But_Function {
//     /**顺时针旋转 */
//     Clockwise = "Clockwise",
//     /**逆时针旋转 */
//     Anticlockwise = "Anticlockwise",
//     /**存储 */
//     Save = "Save",
// }

// /**@按钮 设置键 */
// export enum But_Set {
//     /**设置--->开 */
//     Open = "Open",
//     /**设置--->关 */
//     Close = "Close",
//     /**设置--->投像 */
//     CastAs = "CastAs",
//     /**设置--->音效 */
//     Set = "Set",
// }

/**@方块 */
export enum Cubes {
    /**方块--->一字型方块 */
    C_ = "1",
    /**方块--->向右延伸方块 */
    CR = "2",
    /**方块--->向左延伸方块 */
    CL = "3",
    /**方块--->方形方块 */
    CO = "4",
    /**方块--->S字型方块 */
    CS = "5",
    /**方块--->反T字型方块 */
    CT = "6",
    /**方块--->Z字型方块 */
    CZ = "7",
}

/**@enum 事件类型 */
export enum EventType {
    /**设置对象池 */
    SetPoolCube,
    /**更新备用待机区 */
    UpdateStandby,
    /**更新开始点 */
    UpdatePointBegin,
    /**更新AI开始点 */
    UpdateAIPointBegin,
    /**更新暂存区方块状态 */
    UpdateSaveCubeStatus,
    /**更新大恶魔激活次数 */
    UpdateBigDevilCount,
    /**更新最高连击数 */
    UpdateMaxDoubleHitCount,
    /**创建星星移动 */
    CreatorStarMove,
    /**创建星星移动 */
    CreatorAIStarMove,
    /**销毁预知位置方块 */
    CubeForeseeDestory,
    /**设置攻击方块 */
    SetActtackCube,
    /**销毁所有攻击方块 */
    DestoryAllActtackCube,
    /**通过连消数销毁攻击方块 */
    DestoryActtackCubeByNum,
    /**设置障碍灰格子 */
    SetObstacleGrid,
    /**更新AI备用待机区 */
    UpdateAIStandbyCube,
    /**更新AI暂存区 */
    UpdateAISave,
    /**重置AI游戏格子 */
    ResetAIGameGrid,
    /**设置AI攻击方块 */
    SetAIActtackCube,
    /**通过连消数销毁AI攻击方块 */
    DestoryAIActtackCubeByNum,
    /**设置AI障碍灰格子 */
    SetAIObstacleGrid,
    /**更新AI能量槽 */
    UpdateAIBarAttack,
    /**更新玩家能量槽 */
    UpdatePlayerBarAttack,
    /**设置结束页 */
    SetPageOver,
}

/**
 * @enum 缓存类型
 */
export enum CacheType{
    /**金币 */
    Coin,
}