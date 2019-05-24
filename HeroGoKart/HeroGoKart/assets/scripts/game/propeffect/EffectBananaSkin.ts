import { PropEffect } from "../PropEffect";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Role from "../Role";

/**
 * @class 香蕉皮效果
 */
export class EffectBananaSkin extends PropEffect {


    /**
     * 构造函数
     */
    constructor(game: Game) {
        super(game);
    }
    /**
     * 影响效果
     * @param role 被影响角色
     */
    public Effect(role: cc.Node, prop: cc.Node) {
        this.RunEffect(role, prop);
    }

    /**
     * 执行影响
     * @param role 被影响角色
     */
    private RunEffect(role: cc.Node, prop: cc.Node) {

        prop.destroy();
        // let collider = role.getComponent(cc.BoxCollider);
        // collider.enabled = false;

        let name = role.name;
        let type_Class: Role = null;
        if (name === "AI") {
            type_Class = role.getComponent("AI");
        } else if (name === "Player") {
            type_Class = role.getComponent("Player");
        }
        if (!type_Class.IsSlowDown) {
            type_Class.IsSlowDown = true;
        } else if (type_Class.IsSlowDown || type_Class.IsSky || type_Class.IsLightning || type_Class.IsWaterPolo || type_Class.IsFrozen) {
            if (type_Class.IsSlowDown) {
                type_Class.Horizontal_Sensitivity=100;
                // type_Class.IsSlowDown = false;
            }
            if (type_Class.IsSky) {
                type_Class.IsSky = false;
            }
            if (type_Class.IsFrozen) {
                role.getChildByName("5").destroy();
                type_Class.IsFrozen = false;
            }
            if (type_Class.IsWaterPolo) {
                role.getChildByName("4").destroy();
                type_Class.IsWaterPolo = false;
            }
            if (type_Class.IsLightning) {
                role.getChildByName("9").destroy();
                type_Class.IsLightning = false;
            }
            GameManage.Instance.StopTargetAction(role);
            role.stopAllActions();
            type_Class.unscheduleAllCallbacks();
        }
        if (type_Class.IsSpeedUping) {
            role.getChildByName("7").destroy();
            role.getChildByName("win").destroy();
            type_Class.IsSpeedUping = false;
            GameManage.Instance.StopTargetAction(role);
            role.stopAllActions();
            type_Class.unscheduleAllCallbacks();
        }

        let speed_Value = type_Class.Speed;
        let sens = type_Class.Horizontal_Sensitivity;
        type_Class.Horizontal_Sensitivity = 20;
        type_Class.IsSpeedUp = false;
        type_Class.Speed = speed_Value * 0.5;

        let act_Rotate = cc.rotateTo(1, 1080);
        let act_callback = () => {


            console.log("道具------------------>香蕉");
            // GameManage.Instance.StopTargetAction(role);
            // collider.enabled = true;
            type_Class.IsSlowDown = false;
            type_Class.Horizontal_Sensitivity = sens;
            type_Class.IsSpeedUp = true;
            // type_Class.Speed = speed_Value;
        }
        let act_Seq = cc.sequence(act_Rotate, cc.callFunc(act_callback));
        let box = role.getChildByName("Box");
        box.runAction(act_Seq);
    }
}
