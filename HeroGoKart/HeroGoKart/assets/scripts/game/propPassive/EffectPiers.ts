import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";

/**
 * @class 石墩效果
 */
export class EffectPiers extends PropPassive {

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

        let collider = role.getComponent(cc.BoxCollider);
        collider.enabled = false;
        // GameManage.Instance.IsTouchClick = false;

        let role_type = null;
        if (role.name === "AI") {
            role_type = role.getComponent(AI);
        } else if (role.name === "Player") {
            role_type = role.getComponent(Player);
            GameManage.Instance.IsTouchClick = false;
            this.Game.Horizontal = 0;
        }
        role_type.IsSpeedUp = false;
        let speed_Value = role_type.Speed;
        role_type.Speed = 0;

        role.stopAllActions();
        let act_Move = cc.moveBy(0.3, 0, -300);
        let callback = () => {
            if (role.name === "Player") {
                GameManage.Instance.IsTouchClick = true;
                // this.Game.Horizontal = 0;
            }
            if (role.name === "AI") {
                role_type.Move(101);
            }
            // GameManage.Instance.IsTouchClick = true;
            collider.enabled = true;
            role_type.Speed = speed_Value;
            role_type.IsSpeedUp = true;
        }
        let act_seq = cc.sequence(act_Move, cc.callFunc(callback));
        role.runAction(act_seq);
    }
}
