import { Prop } from "../Prop";

/**
 * @class 雷击
 */
export class Lightning extends Prop {
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
        target_Class.Speed = target_Speed * 0.6;

        let act_Scale = cc.scaleTo(3, 0.2);
        let callback = () => {
            target_Class.Speed = target_Speed;
        }
        let act_Sequ = cc.sequence(act_Scale, cc.callFunc(callback));
        target.runAction(act_Sequ);
    }
}