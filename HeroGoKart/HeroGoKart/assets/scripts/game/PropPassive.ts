import Game from "../Game";

/**
 * @class 被动道具
 */
export abstract class PropPassive {

    /**
     * @property 游戏类
     */
    protected Game: Game = null;
    /**
     * @property 被动道具对象池
     */
    protected Pool_PassiveProp: cc.NodePool = null;

    /**
     * 构造函数
     * @param pool_PassiveProp 被动道具对象池
     */
    constructor(pool_PassiveProp: cc.NodePool, game: Game) {
        this.Pool_PassiveProp = pool_PassiveProp;
        this.Game = game;
    }

    public abstract Effect(role: cc.Node, prop: cc.Node);
}
