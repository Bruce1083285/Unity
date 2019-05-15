
/**
 * @class 游戏管理
 */
export class GameManage {
    /**
     * @property 单例
     */
    public static Instance: GameManage = new GameManage();
    /**
     * @property 游戏是否开始
     */
    public IsGameStart: boolean = false;
    /**
     * @property 游戏是否开始
     */
    public IsGameEnd: boolean = false;
    /**
     * @property 是否更新进度
     */
    public IsUpdateProgress: boolean = true;
    /**
     * @property 游戏中是否可以点击
     */
    public IsGameClick: boolean = true;
    /**
     * @property 是否可以触摸点击
     */
    public IsTouchClick: boolean = true;
    /**
     * @property 移动速度
     */
    public Speed: number = 0;
    /**
     * @property 排名
     */
    public Ranking: string[] = [];

}
