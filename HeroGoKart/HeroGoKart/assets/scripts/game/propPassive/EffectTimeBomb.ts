import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Role from "../Role";

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
        // GameManage.Instance.StopTargetAction(role);

        let collider = role.getComponent(cc.BoxCollider);
        collider.enabled = false;

        let type_C: Role = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
            GameManage.Instance.IsUseingProp = false;
            GameManage.Instance.IsTouchClick = false;
            this.Game.Horizontal = 0;
        }
        if (!type_C.IsSky) {
            type_C.IsSky = true;
        } else if (type_C.IsSlowDown || type_C.IsSky || type_C.IsLightning || type_C.IsWaterPolo || type_C.IsFrozen || type_C.IsSpeedUping) {
            if (type_C.IsSlowDown) {
                type_C.IsSlowDown = false;
            }
            if (type_C.IsSky) {
                type_C.IsSky = false;
            }
            if (type_C.IsFrozen) {
                role.getChildByName("5").destroy();
                type_C.IsFrozen = false;
            }
            if (type_C.IsWaterPolo) {
                role.getChildByName("4").destroy();
                type_C.IsWaterPolo = false;
            }
            if (type_C.IsLightning) {
                role.getChildByName("9").destroy();
                type_C.IsWaterPolo = false;
            }
            if (type_C.IsSpeedUping) {
                role.getChildByName("7").destroy();
                role.getChildByName("win").destroy();
                type_C.IsSpeedUping = false;
            }
            GameManage.Instance.StopTargetAction(role);
            role.stopAllActions();
            type_C.unscheduleAllCallbacks();
        }
        type_C.IsSpeedUp = false;
        type_C.Speed = 0;

        // let act_Scale_big = cc.scaleTo(0.5, 0.8, 0.8);
        // let act_Overturn_big = cc.scaleTo(0.5, 0.8, -0.8);
        // let act_spw = cc.spawn(act_Scale_big, act_Overturn_big);
        // let act_dt = cc.delayTime(2);
        // let act_Scale_small = cc.scaleTo(0.3, 0.4, 0.4);
        let act_Scale_big = cc.scaleTo(1, 1.5);
        let act_Scale_small = cc.scaleTo(0.3, 1);
        let callback = () => {
            // GameManage.Instance.StopTargetAction(role);

            if (role.name === "Player") {
                GameManage.Instance.IsUseingProp = true;
                GameManage.Instance.IsTouchClick = true;
            }
            type_C.IsSky = false;
            collider.enabled = true;
            type_C.TimeBomb = null;
            type_C.IsSpeedUp = true;
        }
        let act_Seq = cc.sequence(act_Scale_big, act_Scale_small, cc.callFunc(callback));
        let box = role.getChildByName("Box");
        box.runAction(act_Seq);
        console.log("道具------------------>定时炸弹");
    }
}
