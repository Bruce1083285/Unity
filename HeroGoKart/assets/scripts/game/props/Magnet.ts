import { Prop } from "../Prop";

/**
 * @class 磁铁
 */
export class Magnet extends Prop {
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
     */
    private EffectRealize(target: cc.Node, target_Class: any) {
        let target_Speed = target_Class.Speed;
        target_Class.Speed = target_Speed + target_Speed * 0.5;
        let act_dt = cc.delayTime(5);
        let act_callback = () => {
            target_Class.Speed = target_Speed;
        }
        let act_sequ = cc.sequence(act_dt, cc.callFunc(act_callback));
        target.runAction(act_sequ);
    }
}
