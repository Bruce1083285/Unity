import Game from "../Game";

/**
 * @class 空投
 */
export abstract class Transportation {

    /**
     * @property 游戏类
     */
    protected Game: Game = null;

    constructor(game: Game) {
        this.Game = game;
    }

    /**
     * 设置空投
     * @param role [可选节点]角色节点
     */
    public abstract SetTransportation(role?: cc.Node);
}
