import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { PropUseing } from "../PropUseing";



/**
 * @class 香蕉皮
 */
export class BananaSkin extends PropUseing {

    /**
      * 构造函数
      * @param prop_skins [Array]道具皮肤
      * @param pool_prop 道具对象池
      */
    constructor(prop_skins: cc.SpriteFrame[], pool_prop: cc.NodePool) {
        super(prop_skins, pool_prop);
    }

    /**
     * 道具使用
     * @param role 角色节点
     * @param skin_id 皮肤ID
     */
    public Useing(role: cc.Node, skin_id: string) {
        this.SetProp(role, skin_id);
    }

    /**
     * 设置道具
     * @param role 角色
     * @param pool_prop 道具对象池
     * @param skin_id 皮肤ID
     */
    public SetProp(role: cc.Node, skin_id: string) {
        let box_Collider = role.getComponent(cc.BoxCollider);
        box_Collider.enabled = false;

        let skin: cc.SpriteFrame = null;
        for (let i = 0; i < this.Prop_Skins.length; i++) {
            let prop_ID = this.Prop_Skins[i];
            if (skin_id === prop_ID.name) {
                skin = prop_ID;
                break;
            }
        }

        let prop = this.Pool_Prop.get();
        if (!prop) {
            EventCenter.Broadcast(EventType.Game_SetPoolProp);
            prop = this.Pool_Prop.get();
        }
        let sprite = prop.getChildByName("prop").getComponent(cc.Sprite);
        sprite.spriteFrame = skin;

        let parent = role.parent;
        parent.addChild(prop);
        prop.setPosition(role.position);

        let act_Move = cc.moveBy(0.3, 0, -100);
        let callback = () => {
            box_Collider.enabled = true;
        }
        let act_Seq = cc.sequence(act_Move, cc.callFunc(callback));
        prop.runAction(act_Seq);
    }
}
