import { PropPassive } from "../PropPassive";
import Game from "../../Game";

/**
 * @class 传送门效果
 */
export class EffectPortal extends PropPassive {

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
        let collider = prop.getComponent(cc.BoxCollider);
        collider.enabled = false;
        role.setPosition(role.position.x, role.position.y + 500);

        let dragon = prop.getComponent(dragonBones.ArmatureDisplay);
        dragon.playAnimation("a3", 1);

        let callback = () => {
            collider.enabled = true;
            this.Pool_PassiveProp.put(prop);
        }
        setTimeout(callback, 1000);
    }
}
