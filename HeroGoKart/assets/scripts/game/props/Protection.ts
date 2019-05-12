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
        //获取保护罩节点
        let act_dt = cc.delayTime(5);
        let act_callback = () => {
            //判断保护罩是否开启
        }
        let act_sequ = cc.sequence(act_dt, cc.callFunc(act_callback));
        target.runAction(act_sequ);
    }
}