import { PropPassive } from "../PropPassive";
import AI from "../AI";
import Player from "../Player";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Role from "../Role";

/**
 * @class 水滩效果
 */
export class EffectWater extends PropPassive {


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
        GameManage.Instance.StopTargetAction(role);

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
        } else if (type_C.IsBorder||type_C.IsSlowDown || type_C.IsSky || type_C.IsLightning || type_C.IsWaterPolo || type_C.IsFrozen) {
            if (type_C.IsBorder) {
                type_C.IsBorder = false;
            }
            if (type_C.IsSlowDown) {
                type_C.Horizontal_Sensitivity = 100;
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
            role.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            type_C.unscheduleAllCallbacks();
        }
        if (type_C.IsSpeedUping) {
            let magnet = role.getChildByName("8");
            if (magnet) {
                magnet.destroy();
            }
            let speed = role.getChildByName("7");
            if (speed) {
                speed.destroy();
            }
            let win = role.getChildByName("win");
            if (win) {
                win.destroy();
            }
            type_C.IsSpeedUping = false;
            role.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            type_C.unscheduleAllCallbacks();
        }
        type_C.IsSpeedUp = false;
        type_C.Horizontal_Sensitivity = 200;
        let speed_Value = type_C.Speed;
        type_C.Speed = speed_Value * 0.5;

        let callback = () => {
            // type_C.Speed = speed_Value;
            type_C.IsSlowDown = false;
            type_C.IsSpeedUp = true;
            type_C.Horizontal_Sensitivity = 100;
            GameManage.Instance.StopTargetAction(role);
            console.log("道具------------------>水滩");
        }
        type_C.scheduleOnce(callback, 2);
    }
}
