
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
        let ai: AI = null;
        let player: Player = null;
        if (ran_node.name === "AI") {
            ai = ran_node.getComponent(AI);
            let istrue = ai.GetPretection(prop);
            if (istrue) {
                return
            }
        }
        if (ran_node.name === "Player") {
            player = ran_node.getComponent(Player);
            let istrue = player.GetPretection(prop);
            if (istrue) {
                return
            }
        }

        let callback_1_time: number = 0;
        let callback_2_time: number = 3000;
        if (ran_node.name === "Player") {
            let act_fOut = cc.fadeOut(0.2);
            let act_fIn = cc.fadeIn(0.2);
            let act_seq = cc.sequence(act_fOut, act_fIn).repeatForever();
            GameManage.Instance.Page_Alarm.active = true;
            GameManage.Instance.Page_Alarm.runAction(act_seq);
            callback_1_time = 1000;
            callback_2_time = 4000;
        }

        let box_Collider = prop.getComponent(cc.BoxCollider);
        box_Collider.enabled = false;

        prop.setPosition(ran_node.position.x, ran_node.position.y);
        // console.log("冰冻是否成功");
        // console.log(ran_node.position);
        // console.log(prop.position);
        // console.log(prop.active);
        let frozen = prop.getComponent(Animation_Frozen);
        let callback_1 = () => {
            if (GameManage.Instance.Page_Alarm.active) {
                GameManage.Instance.Page_Alarm.stopAllActions();
                GameManage.Instance.Page_Alarm.active = false;
            }
            frozen.PlayBegin(ran_node);
        }

        let callback_2 = () => {
            frozen.PlayEnd();
        }
        setTimeout(callback_1, callback_1_time);
        setTimeout(callback_2, callback_2_time);
    }
}
