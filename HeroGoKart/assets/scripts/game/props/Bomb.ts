import { Prop } from "../Prop";

export class Bomb extends Prop {

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

        let act_Scale_big = cc.scaleTo(2, 1);
        let act_Rotate = cc.rotateBy(2, 1080);
        let act_spawn = cc.spawn(act_Scale_big, act_Rotate);
        let act_Scale_small = cc.scaleTo(0.1, 0.4);
        let act_callback = () => {
            //重置速度值
            target_Class.Speed = value_Speed;
        }
        let act_seq = cc.sequence(act_spawn, act_Scale_small, cc.callFunc(act_callback));

        target.runAction(act_seq);
    }
}
