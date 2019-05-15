import { PropEffect } from "../PropEffect";

/**
 * @class 香蕉皮效果
 */
export class EffectBananaSkin extends PropEffect {

    /**
        * 构造函数
        * @param pool_prop 道具对象池
        */
    constructor(pool_prop: cc.NodePool) {
        super(pool_prop);
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
        this.Pool_Prop.put(prop);

        let name = role.name;
        let type_Class = null;
        if (name === "AI") {
            type_Class = role.getComponent("AI");
        } else if (name === "Player") {
            type_Class = role.getComponent("Player");
        }
        let speed_Value = type_Class.Speed;
        type_Class.IsSpeedUp = false;
        type_Class.Speed = speed_Value - speed_Value * 0.3;
        let act_Rotate = cc.rotateTo(1, 1080);
        let act_callback = () => {
            type_Class.IsSpeedUp = true;
            type_Class = speed_Value;
        }
        let act_Seq = cc.sequence(act_Rotate, cc.callFunc(act_callback));
        role.runAction(act_Seq);
    }
}
