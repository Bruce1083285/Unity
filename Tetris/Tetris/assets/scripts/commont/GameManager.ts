
/**
 * @class 游戏管理类
 */
export class GameManager {

    /**
     * @property 单例
     */
    public static Instance: GameManager = new GameManager();
    /**
     * @property 备用区域第一个方块ID
     */
    public Standby_FirstID: string = null;

    /**
     * 私有化构造函数
     */
    private constructor() { }
}
