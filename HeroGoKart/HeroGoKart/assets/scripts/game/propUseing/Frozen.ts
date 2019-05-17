
import AI from "../AI";
import Player from "../Player";
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Animation_Frozen from "../../animation/Animation_Frozen";

/**
 * @class 冰冻
 */
export class Frozen extends PropUseing {

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

    private SetProp(role: cc.Node, skin_id: string) {
        let prop: cc.Node = null;
        let parent = role.parent;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === skin_id) {
                prop = cc.instantiate(this.Props[i]);
                parent.addChild(prop);
                break;
            }
        }
        let box_Collider = prop.getComponent(cc.BoxCollider);
        box_Collider.enabled = false;

        let ran_node: cc.Node = null;
        for (let i = 0; i < GameManage.Instance.Roles.length; i++) {
            let ran = Math.floor(Math.random() * GameManage.Instance.Roles.length);
            ran_node = GameManage.Instance.Roles[ran];
            if (ran_node.position.y > role.position.y) {
                let type_Class = null;
                let name = ran_node.name;
                if (name === "AI") {
                    type_Class = ran_node.getComponent(AI);
                } else if (name === "Player") {
                    type_Class = ran_node.getComponent(Player);
                }
                if (!type_Class.IsWaterPolo) {
                    break;
                }
            }
            i--;
            ran_node = null;
        }

        if (!ran_node) {
            return;
        }
        prop.setPosition(ran_node.position);
        let frozen = prop.getComponent(Animation_Frozen);
        frozen.PlayBegin(ran_node);

        let callback = () => {
            frozen.PlayEnd();
        }

        setTimeout(callback, 3000);
    }
}
