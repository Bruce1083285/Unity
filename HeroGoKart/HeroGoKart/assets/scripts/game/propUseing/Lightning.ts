
import AI from "../AI";
import Player from "../Player";
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";


/**
 * @class 雷击
 */
export class Lightning extends PropUseing {

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
        let arr_role: cc.Node[] = [];

        role:
        for (let i = 0; i < GameManage.Instance.Roles.length; i++) {
            let target = GameManage.Instance.Roles[i];
            let num = role.position.sub(target.position).mag();
            let dis = Math.abs(num);
            if (dis <= 10) {
                continue;
            }

            let arr = target.children;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name === "6") {
                    arr[i].destroy();
                    continue role;
                } else {
                    arr_role.push(target);
                }
            }

            // let target_Class = null;
            // let name = target.name;
            // if (name === "AI") {
            //     target_Class = target.getComponent(AI);
            // } else if (name === "Player") {
            //     target_Class = target.getComponent(Player);
            // }
            // if (target_Class.IsLightning) {
            //     return;
            // }
        }

        if (arr_role.length >= 3) {
            return;
        }

        let pre_prop: cc.Prefab = null;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === skin_id) {
                pre_prop = this.Props[i];
                break;
            }
        }

        // let patch_arr: cc.Node[] = [];
        // for (let i = 0; i < arr_role.length; i++) {
        //     let node = arr_role[i];
        //     if (node.uuid !== role.uuid) {
        //         patch_arr.push(node);
        //     }
        // }

        for (let i = 0; i < arr_role.length; i++) {
            let target = arr_role[i];
            let prop = cc.instantiate(pre_prop);
            target.addChild(prop);
            target.scale = 0.2;
            prop.scale = 2;
            prop.setPosition(0, 400);

            let target_Class = null;
            let name = target.name;
            if (name === "AI") {
                target_Class = target.getComponent(AI);
            } else if (name === "Player") {
                target_Class = target.getComponent(Player);
            }
            target_Class.IsLightning = true;
            target_Class.IsSpeedUp = false;
            let target_Speed_value = target_Class.Speed;
            target_Class.Speed = target_Speed_value * 0.6;

            let callback = () => {
                prop.destroy();
                target.scale = 0.4;
                target_Class.IsLightning = false;
                target_Class.IsSpeedUp = true;
                target_Class.Speed = target_Speed_value;
            }
            setTimeout(callback, 10000);
        }

    }
}
