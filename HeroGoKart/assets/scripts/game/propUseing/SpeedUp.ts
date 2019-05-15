
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import AI from "../AI";
import Player from "../Player";
import { PropUseing } from "../PropUseing";


/**
 * @class 加速
 */
export class SpeedUp extends PropUseing {


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

        role.addChild(prop);
        prop.setPosition(0, 0);

        let type_Class = null;
        let name = role.name;
        if (name === "AI") {
            type_Class = role.getComponent(AI);
        } else if (name === "Player") {
            type_Class = role.getComponent(Player);
        }
        //加速
        type_Class.IsSpeedUp = false;
        let speed_value = type_Class.Speed;
        type_Class.Speed = 300;

        let callback = () => {
            this.Pool_Prop.put(prop);
            type_Class.IsSpeedUp = true;
            type_Class.Speed = speed_value;
        }

        setTimeout(callback, 5000);
    }
}
