import { Prop } from "../Prop";

/**
 * @class 香蕉
 */
export class Banana extends Prop {

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
        //修改目标移动速度
        target_Class.Speed = 0;
        let act_Rotate = cc.rotateBy(1, 1080);
        let act_callback = () => {
            //重置速度值
            target_Class.Speed = target_Speed;
        }
        let act_seq = cc.sequence(act_Rotate, cc.callFunc(act_callback));

        target.runAction(act_seq);
    }
}
