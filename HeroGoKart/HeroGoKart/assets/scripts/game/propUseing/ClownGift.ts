import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { PropUseing } from "../PropUseing";



/**
 * @class 小丑礼包
 */
export class ClownGift extends PropUseing {

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
     * @param target 目标节点
     * @param pool_prop 道具对象池
     * @param prop_skins [Array]道具皮肤
     * @param skin_id 皮肤ID
     */
    public SetProp(role: cc.Node, skin_id: string) {
        let box_Collider = role.getComponent(cc.BoxCollider);
        box_Collider.enabled = false;

        let skin: cc.SpriteFrame = null;
        for (let i = 0; i < this.Prop_Skins.length; i++) {
            let prop = this.Prop_Skins[i];
            if (skin_id === prop.name) {
                skin = prop;
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

        let parent = role.parent.parent.getChildByName("Area_Prop");;
        parent.addChild(prop);
        let world_pos = role.parent.convertToWorldSpaceAR(role.position);
        let node_pos = parent.convertToNodeSpaceAR(world_pos);
        prop.setPosition(node_pos);

        let y = Math.floor(Math.random() * 500 + role.position.y);
        let size_Width = parent.getContentSize().width;
        let x = Math.floor(Math.random() * (size_Width - 100));

        let act_Move = cc.moveBy(0.3, x, y);
        let callback = () => {
            box_Collider.enabled = true;
        }
        let act_Seq = cc.sequence(act_Move, cc.callFunc(callback));
        prop.runAction(act_Seq);
    }
}