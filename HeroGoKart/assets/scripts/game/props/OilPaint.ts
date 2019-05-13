import { Prop } from "../Prop";

/**
 * @class 油漆
 */
export class OilPaint extends Prop {

    /**
     * 道具效果
     * @param target 被影响目标
     * @param target_class 被影响目标所属类型
     */
    public Effect(target: cc.Node, target_Class: any) {
        this.EffectRealize(target, target_Class);
    }

    /**
     * 效果实现
     * @param target 被影响目标
     * @param target_class 被影响目标所属类型
     * @param value_Speed 速度值
     */
    private EffectRealize(target: cc.Node, target_Class: any) {
        //左右按钮禁用

        let target_Speed = target_Class.Speed;
        target_Class.Speed = target_Speed * 0.5;

        let callback = () => {
            target_Class.Speed = target_Speed;
        }
        setTimeout(callback, 2000);
    }
}
