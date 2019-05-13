import { Prop } from "../Prop";

/**
 * @class 加速
 */
export class SpeedUp extends Prop {

    /**
     * 道具效果
     * @param target 被影响目标
     * @param target_class 被影响目标所属类型
     */
    public Effect(target: cc.Node, target_Class: any, self?: cc.Node) {
        this.EffectRealize(target, target_Class, self);
    }

    /**
     * 效果实现
     * @param target 被影响目标
     * @param target_class 被影响目标所属类型
     * @param value_Speed 速度值
     */
    private EffectRealize(target: cc.Node, target_Class: any, self_Class: any) {
        let target_Speed = target_Class.Speed;
        target_Class.Speed = target_Speed - target_Speed * 0.2;

        let self_Speed = self_Class.Speed;
        self_Class.Speed = self_Speed + self_Speed * 0.3;

        let callback = () => {
            target_Class.Speed = target_Speed;
            self_Class.Speed = self_Speed;
        }
        setTimeout(callback, 3000);
    }
}
