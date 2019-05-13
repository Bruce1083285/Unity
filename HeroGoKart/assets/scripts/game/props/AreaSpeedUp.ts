import { Prop } from "../Prop";

/**
 * @class 加速区（加速带）
 */
export default class AreaSpeedUp extends Prop {

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
        let target_Speed = target_Class.Speed;
        //设置速度值
        target_Class.Speed = target_Speed + target_Speed * 0.2;

        let callback = () => {
            target_Class.Speed = target_Speed;
        }
        setTimeout(callback, 2000);
    }
}
