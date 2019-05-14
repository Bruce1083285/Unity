import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";

/**
 * @class 路障
 */
export  class EffectRoadblock extends PropPassive {

     /**
     * 构造函数
     * @param pool_PassiveProp 被动道具对象池
     */
    constructor(pool_PassiveProp: cc.NodePool) {
        super(pool_PassiveProp);
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
        let type_C = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
        }
        type_C.IsSpeedUp = false;
        let speed_Value = type_C.Speed;
        type_C.Speed = 0;

        let callback = () => {
            type_C.Speed = speed_Value * 0.2;
            type_C.IsSpeedUp = true;
        }
        setTimeout(callback, 10000);
    }
}
