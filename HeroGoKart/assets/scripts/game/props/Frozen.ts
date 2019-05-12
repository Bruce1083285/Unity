import { Prop } from "../Prop";

export class Frozen extends Prop {

    /**
      * 道具效果
      * @param target 被影响目标
      * @param target_class 被影响目标所属类型
      * @param value_Speed 速度值
      */
    public Effect(target: cc.Node, target_Class: any, value_Speed: number) {
        this.EffectRealize(target, target_Class, value_Speed);
    }

    /**
     * 效果实现
     * @param target 被影响目标
     * @param target_class 被影响目标所属类型
     * @param value_Speed 速度值
     */
    private EffectRealize(target: cc.Node, target_Class: any, value_Speed: number) {
        //修改目标移动速度
        target_Class.Speed = 0;

        let act_dt = cc.delayTime(3);
        let act_callback = () => {
            //重置速度值
            target_Class.Speed = value_Speed;
        }
        let act_seq = cc.sequence(act_dt, cc.callFunc(act_callback));

        target.runAction(act_seq);
    }
}
