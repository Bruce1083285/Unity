
/**
 * @class 道具
 */
export abstract class Prop {
    /**
        * 道具效果
        * @param target 被影响目标
        * @param target_class 被影响目标所属类型
        */
    public abstract Effect(target: cc.Node, target_Class: any);
}
