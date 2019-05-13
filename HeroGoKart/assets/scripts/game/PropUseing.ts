
/**
 * @class 道具使用类
 */
export abstract class PropUseing {

    /**
     * @property 道具对象池
     */
    protected Pool_Prop: cc.NodePool = null;
    /**
     * @property 道具皮肤
     */
    protected Prop_Skins: cc.SpriteFrame[] = [];

    /**
     * 构造函数
     * @param prop_skins [Array]道具皮肤
     * @param pool_prop 道具对象池
     */
    constructor(prop_skins: cc.SpriteFrame[], pool_prop: cc.NodePool) {
        this.Prop_Skins = prop_skins;
        this.Pool_Prop = pool_prop;
    }

    /**
     * 道具使用
     * @param role 角色节点
     * @param skin_id 皮肤ID
     */
    public abstract Useing(role: cc.Node, skin_id: string);
}
