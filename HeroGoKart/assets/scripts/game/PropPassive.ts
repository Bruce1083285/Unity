
/**
 * @class 被动道具
 */
export abstract class PropPassive {

    /**
     * @property 被动道具对象池
     */
    protected Pool_PassiveProp: cc.NodePool = null;

    constructor(pool_PassiveProp: cc.NodePool) {
        this.Pool_PassiveProp = pool_PassiveProp;
    }

    public abstract Effect(role: cc.Node, prop: cc.Node);
}
