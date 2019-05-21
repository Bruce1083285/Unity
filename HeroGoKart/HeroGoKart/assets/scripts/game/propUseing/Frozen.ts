
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
        let arr_y: cc.Node[] = [];
        for (let i = 0; i < GameManage.Instance.Roles.length; i++) {
            let patch_node = GameManage.Instance.Roles[i];
            if (patch_node.position.y > role.position.y) {
                arr_y.push(patch_node);
            }
        }
        if (arr_y.length <= 0) {
            return;
        }

        let type_Class = null;
        let ran = Math.floor(Math.random() * arr_y.length);
        let ran_node: cc.Node = arr_y[ran];

        let arr = ran_node.children;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === "6") {
                arr[i].destroy();
                return;
            }
        }

        let prop: cc.Node = null;
        let parent = role.parent;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === skin_id) {
                prop = cc.instantiate(this.Props[i]);
                parent.addChild(prop);
                break;
            }
        }
        let istrue = type_Class.GetPretection(prop);
        if (istrue) {
            return
        }

        let box_Collider = prop.getComponent(cc.BoxCollider);
        box_Collider.enabled = false;

        prop.setPosition(ran_node.position);
        let frozen = prop.getComponent(Animation_Frozen);
        frozen.PlayBegin(ran_node);

        let callback = () => {
            frozen.PlayEnd();
        }

        setTimeout(callback, 3000);
    }
}
