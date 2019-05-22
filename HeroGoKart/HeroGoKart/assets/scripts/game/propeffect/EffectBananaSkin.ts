import { PropEffect } from "../PropEffect";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";

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
        GameManage.Instance.StopTargetAction(role);

        prop.destroy();
        // let collider = role.getComponent(cc.BoxCollider);
        // collider.enabled = false;

        let name = role.name;
        let type_Class = null;
        if (name === "AI") {
            type_Class = role.getComponent("AI");
        } else if (name === "Player") {
            type_Class = role.getComponent("Player");
        }
        let speed_Value = type_Class.Speed;
        let sens = type_Class.Horizontal_Sensitivity;
        type_Class.Horizontal_Sensitivity = 20;
        type_Class.IsSpeedUp = false;
        type_Class.Speed = speed_Value - speed_Value * 0.3;
        let act_Rotate = cc.rotateTo(1, 1080);
        let act_callback = () => {
            // collider.enabled = true;
            type_Class.Horizontal_Sensitivity = sens;
            type_Class.IsSpeedUp = true;
            type_Class = speed_Value;
        }
        let act_Seq = cc.sequence(act_Rotate, cc.callFunc(act_callback));
        role.runAction(act_Seq);
    }
}
