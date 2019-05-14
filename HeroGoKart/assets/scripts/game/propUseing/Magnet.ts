
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import AI from "../AI";
import Player from "../Player";
import { PropUseing } from "../PropUseing";
/**
 * @class 吸铁石
 */
export class Magnet extends PropUseing {

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

        let prop = this.Pool_Prop.get();
        if (!prop) {
            EventCenter.Broadcast(EventType.Game_SetPoolProp);
            prop = this.Pool_Prop.get();
        }
        let sprite = prop.getChildByName("prop").getComponent(cc.Sprite);
        sprite.spriteFrame = skin;
        let arr = role.parent.children;
        let patch_arr: cc.Node[] = [];
        for (let i = 0; i < arr.length; i++) {
            let node = arr[i];
            if (node.name === "AI" || node.name === "Player") {
                patch_arr.push(node);
            }
        }

        let ran_node: cc.Node = null;
        for (let i = 0; i < patch_arr.length; i++) {
            let ran = Math.floor(Math.random() * patch_arr.length);
            ran_node = patch_arr[ran];
            if (ran_node.position.y > role.position.y) {
                break;
            } else {
                i--;
                ran_node = null;
            }
        }
        role.addChild(prop);
        prop.setPosition(0, 0);

        let target_Class = null;
        let target_name = ran_node.name;
        if (target_name === "AI") {
            target_Class = ran_node.getComponent(AI);
        } else if (target_name === "Player") {
            target_Class = ran_node.getComponent(Player);
        }
        let target_Speed_value = target_Class.Speed;
        target_Class.Speed = target_Speed_value - target_Speed_value * 0.2;

        let role_Class = null;
        let role_name = role.name;
        if (role_name === "AI") {
            role_Class = role.getComponent(AI);
        } else if (role_name === "Player") {
            role_Class = role.getComponent(Player);
        }
        let role_Speed_value = role_Class.Speed;
        role_Class.Speed = role_Speed_value + role_Speed_value * 0.3;

        let callback = () => {
            this.Pool_Prop.put(prop);
            target_Class.Speed = target_Speed_value;
            role_Class.Speed = role_Speed_value;
        }

        setTimeout(callback, 3000);
    }
}
