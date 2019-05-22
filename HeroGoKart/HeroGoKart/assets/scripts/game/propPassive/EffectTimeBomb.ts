import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";

/**
 * @class 定时炸弹效果
 */
export class EffectTimeBomb extends PropPassive {


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
        let box = role.getChildByName("Box");
        box.stopAllActions();
        box.scale = 1;

        if (role.name === "Player") {
            GameManage.Instance.IsTouchClick = false;
            this.Game.Horizontal = 0;
        }
        let collider = role.getComponent(cc.BoxCollider);
        collider.enabled = false;

        let type_C = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
        }
        type_C.IsSpeedUp = false;
        type_C.Speed = 0;

        GameManage.Instance.IsUseingProp=true;

        let act_Scale_big = cc.scaleTo(0.5, 0.8, 0.8);
        let act_Overturn_big = cc.scaleTo(0.5, 0.8, -0.8);
        let act_spw = cc.spawn(act_Scale_big, act_Overturn_big);
        // let act_dt = cc.delayTime(2);
        let act_Scale_small = cc.scaleTo(0.3, 0.4, 0.4);
        let callback = () => {
            GameManage.Instance.IsUseingProp=false;
            if (role.name === "Player") {
                GameManage.Instance.IsTouchClick = true;
            }
            collider.enabled = true;
            type_C.TimeBomb = null;
            type_C.Speed = 0.1;
            type_C.IsSpeedUp = true;
        }
        let act_Seq = cc.sequence(act_spw, act_Scale_small, cc.callFunc(callback));
        box.runAction(act_Seq);
    }
}
