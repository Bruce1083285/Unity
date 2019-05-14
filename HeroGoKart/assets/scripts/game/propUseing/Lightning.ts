
import AI from "../AI";
import Player from "../Player";
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { PropUseing } from "../PropUseing";


/**
 * @class 雷击
 */
export class Lightning extends PropUseing {

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

    private SetProp(role: cc.Node, skin_id: string) {
        let skin: cc.SpriteFrame = null;
        for (let i = 0; i < this.Prop_Skins.length; i++) {
            let prop = this.Prop_Skins[i];
            if (skin_id === prop.name) {
                skin = prop;
                break;
            }
        }

        let arr = role.parent.children;
        let patch_arr: cc.Node[] = [];
        for (let i = 0; i < arr.length; i++) {
            let node = arr[i];
            if (node.name === "AI" || node.name === "Player") {
                if (node.uuid !== role.uuid) {
                    patch_arr.push(node);
                }
            }
        }

        for (let i = 0; i < patch_arr.length; i++) {
            let target = patch_arr[i];
            let prop = this.Pool_Prop.get();
            if (!prop) {
                EventCenter.Broadcast(EventType.Game_SetPoolProp);
                prop = this.Pool_Prop.get();
            }
            let sprite = prop.getChildByName("prop").getComponent(cc.Sprite);
            sprite.spriteFrame = skin;

            target.addChild(prop);
            prop.setPosition(0, 0);

            let target_Class = null;
            let name = target.name;
            if (name === "AI") {
                target_Class = target.getComponent(AI);
            } else if (name === "Player") {
                target_Class = target.getComponent(Player);
            }
            let target_Speed_value = target_Class.Speed;
            target_Class.Speed = target_Speed_value * 0.6;

            let act_Scale_big = cc.scaleTo(0.3, 0.2);
            let act_Scale_small = cc.scaleTo(0.3, 0.4);
            let act_dt = cc.delayTime(3);
            let callback = () => {
                this.Pool_Prop.put(prop);
                target_Class.Speed = target_Speed_value;
            }
            let act_Seq = cc.sequence(act_Scale_big, act_dt, act_Scale_small, cc.callFunc(callback));
            target.runAction(act_Seq);
        }

    }
}
