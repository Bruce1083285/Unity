import Game from "../Game";

/**
 * @class 道具使用类
 */
export abstract class PropUseing {

    /**
     * @property 游戏类
     */
    protected Game: Game = null;
    /**
     * @property 道具对象池
     */
    protected Pool_Prop: cc.NodePool = null;
    /**
     * @property [Array]主动道具预制体
     */
    protected Props: cc.Prefab[] = [];

    /**
     * 构造函数
     * @param props [Array]道具预制体
     */
    constructor(props: cc.Prefab[], game: Game) {
        this.Props = props;
        this.Game = game;
    }

    /**
     * 道具使用
     * @param role 角色节点
     * @param skin_id 皮肤ID
     */
    public abstract Useing(role: cc.Node, skin_id: string);
}
