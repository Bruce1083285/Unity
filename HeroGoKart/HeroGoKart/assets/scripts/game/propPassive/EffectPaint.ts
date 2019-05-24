import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import Game from "../../Game";
import Role from "../Role";
import { GameManage } from "../../commont/GameManager";

/**
 * @class 油漆效果
 */
export class EffectPaint extends PropPassive {

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
        // this.Pool_PassiveProp.put(prop);

        let arr = role.children;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === "6") {
                arr[i].destroy();
                return;
            }
        }

        let type_C: Role = null;
        if (role.name === "AI") {
            type_C = role.getComponent(AI);
        } else if (role.name === "Player") {
            type_C = role.getComponent(Player);
        }
        if (!type_C.IsSlowDown) {
            type_C.IsSlowDown = true;
        } else if (type_C.IsSlowDown || type_C.IsSky || type_C.IsLightning || type_C.IsWaterPolo || type_C.IsFrozen ) {
            if (type_C.IsSlowDown) {
                type_C.Horizontal_Sensitivity=100;
                // type_C.IsSlowDown = false;
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
                type_C.IsLightning = false;
            }
            GameManage.Instance.StopTargetAction(role);
            role.stopAllActions();
            type_C.unscheduleAllCallbacks();
        }
        if (type_C.IsSpeedUping) {
            role.getChildByName("7").destroy();
            role.getChildByName("win").destroy();
            type_C.IsSpeedUping = false;
            GameManage.Instance.StopTargetAction(role);
            role.stopAllActions();
            type_C.unscheduleAllCallbacks();
        }
        let sens = type_C.Horizontal_Sensitivity;
        type_C.Horizontal_Sensitivity = 20;
        type_C.IsSpeedUp = false;
        type_C.Speed = type_C.Speed * 0.5;

        let callback = () => {
            // GameManage.Instance.StopTargetAction(role);
            type_C.IsSlowDown=false;
            type_C.Horizontal_Sensitivity = sens;
            // type_C.IsHorizontal = true;
            type_C.IsSpeedUp = true;
            console.log("道具------------------>油漆");
        }
        type_C.scheduleOnce(callback, 2);
    }

}
