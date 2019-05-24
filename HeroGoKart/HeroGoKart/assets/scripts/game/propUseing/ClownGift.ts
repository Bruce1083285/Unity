import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";



/**
 * @class 小丑礼包
 */
export class ClownGift extends PropUseing {

    /**
    * 构造函数
    * @param props [Array]道具预制体
    */
    constructor(props: cc.Prefab[], game: Game) {
        super(props, game);
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
        let prop: cc.Node = null;
        let parent = role.parent;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === skin_id) {
                prop = cc.instantiate(this.Props[i]);
                parent.addChild(prop);
                prop.setPosition(role.position);
                break;
            }
        }
        let box_Collider = prop.getComponent(cc.BoxCollider);
        box_Collider.enabled = false;

        let dir = 0;
        let ran = Math.floor(Math.random() * 100);
        if (ran > 50) {
            dir = 1;
        } else {
            dir = -1;
        }
        let y = Math.floor(Math.random() * 500 * dir + (role.position.y + 500 * dir));
        let x = Math.floor(Math.random() * 300 + 100);
        let act_Move = cc.moveTo(0.3, x, y);
        let callback = () => {
            box_Collider.enabled = true;
        }
        let act_Seq = cc.sequence(act_Move, cc.callFunc(callback));
        prop.runAction(act_Seq);
    }
}
