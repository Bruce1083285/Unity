
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import AI from "../AI";
import Player from "../Player";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Animation_WaterPolo from "../../animation/Animation_WaterPolo";

/**
 * @class 水球
 */
export class WaterPolo extends PropUseing {

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
                prop.setPosition(role.position);
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

        let water_polo = prop.getComponent(Animation_WaterPolo);
        water_polo.Play(ran_node);
        // let type_Class = null;
        // let name = ran_node.name;
        // if (name === "AI") {
        //     type_Class = ran_node.getComponent(AI);
        // } else if (name === "Player") {
        //     type_Class = ran_node.getComponent(Player);
        // }
        // type_Class.IsSpeedUp = false;
        // type_Class.Speed = 0;

        // let act_move=cc.moveTo(0.3,);
        // let callback = () => {
        //     this.Pool_Prop.put(prop);
        //     type_Class.IsSpeedUp = true;
        //     type_Class.Speed = 0;
        // }

        // setTimeout(callback, 2000);
    }

}
