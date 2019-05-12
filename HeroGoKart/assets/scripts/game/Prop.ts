
export abstract class Prop {
    /**
        * 道具效果
        * @param target 被影响目标
        * @param target_class 被影响目标所属类型
        * @param value_Speed 速度值
        */
    public abstract Effect(target: cc.Node, target_class: any, value_Speed: number);
}
