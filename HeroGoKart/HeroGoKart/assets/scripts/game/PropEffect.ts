
/**
 * @class 道具影响效果
 */
export abstract class PropEffect {

    /**
     * @property 道具对象池
     */
    protected Pool_Prop: cc.NodePool = null;

    /**
     * 构造函数
     * @param pool_prop 道具对象池
     */
    constructor(pool_prop: cc.NodePool) {
        this.Pool_Prop = pool_prop;
    }

    /**
     * 影响效果
     * @param role 被影响角色
     */
    public abstract Effect(role: cc.Node, prop: cc.Node);
}
