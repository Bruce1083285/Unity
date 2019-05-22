import { PropPassive } from "../PropPassive";
import Player from "../Player";
import AI from "../AI";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";

/**
 * @class 大石头效果
 */
export class EffectBoulder extends PropPassive {

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
    public Effect(role: cc.Node, prop?: cc.Node) {
        this.SetProp(role, prop);
    }

    /**
      * 设置道具
      * @param role 角色节点
      * @param prop 道具节点
      */
    private SetProp(role: cc.Node, prop?: cc.Node) {
        GameManage.Instance.IsTouchClick = true;
        GameManage.Instance.StopTargetAction(role);

        let collider = role.getComponent(cc.BoxCollider);
        // GameManage.Instance.IsTouchClick = false;
        collider.enabled = false;
        role.scaleX = 0.6;

        let arr = role.children;
        for (let i = 0; i < arr.length; i++) {
            let chi = arr[i];
            if (chi.name === "7" || chi.name === "win") {
                chi.destroy();
            }
        }

        let type_C = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
        }
        type_C.IsSpeedUp = false;
        let speed_Value = type_C.Speed;
        type_C.Speed = speed_Value * 0.5;

        let callback_1 = () => {
            // GameManage.Instance.IsTouchClick = true;
            // type_C.Speed = speed_Value;
            type_C.IsSpeedUp = true;
            role.scaleX = 0.4;
        }
        let callback_2 = () => {
            collider.enabled = true;
        }
        setTimeout(callback_1, 3000);
        setTimeout(callback_2, 1000);
    }
}
