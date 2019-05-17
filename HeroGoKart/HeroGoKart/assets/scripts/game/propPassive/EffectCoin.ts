import { PropPassive } from "../PropPassive";
import { Cache } from "../../commont/Cache";
import { CacheType } from "../../commont/Enum";
import Game from "../../Game";

/**
 * @class 金币影响效果
 */
export class EffectCoin extends PropPassive {


    /**
     * 构造函数
     * @param pool_PassiveProp 被动道具对象池
     */
    constructor(pool_PassiveProp: cc.NodePool, game: Game) {
        super(pool_PassiveProp, game);
    }

    /**
     * 影响效果
     * @param role 角色节点
     * @param prop 道具节点
     */
    public Effect(role: cc.Node, prop: cc.Node) {
        this.SetProp(role, prop);
    }

    /**
      * 设置道具
      * @param role 角色节点
      * @param prop 道具节点
      */
    private SetProp(role: cc.Node, prop: cc.Node) {
        prop.active = false;
        let coin = Cache.GetCache(CacheType.Coin_Amount);
        let num = parseInt(coin);
        let sum = num + 1;
        Cache.SetCache(CacheType.Coin_Amount, sum + "");
    }
}
