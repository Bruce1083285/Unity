
import AI from "../AI";
import Player from "../Player";
import { EventCenter } from "../../commont/EventCenter";
import { EventType, Special_Car, SoundType } from "../../commont/Enum";
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
        EventCenter.BroadcastOne(EventType.Sound, SoundType.Lightning);
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
                } else {
                    arr_role.push(target);
                }
                continue role;
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

        if (arr_role.length <= 0) {
            return;
        }

        for (let i = 0; i < arr_role.length; i++) {
            let arr_car = arr_role[i].getChildByName("Box").getChildByName("SpecialCar").children;
            let car_name: string = null;
            for (let i = 0; i < arr_car.length; i++) {
                let car = arr_car[i];
                if (car.active) {
                    car_name = car.name;
                    break;
                }
            }
            if (car_name && (car_name === Special_Car.Pickup || car_name === Special_Car.CementTruck || car_name === Special_Car.StreetRoller)) {
                return;
            }
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

            let callbalc_time = 10000;
            let target_Class = null;
            let name = target.name;
            if (name === "AI") {
                target_Class = target.getComponent(AI);
            } else if (name === "Player") {
                target_Class = target.getComponent(Player);
                let act_fOut = cc.fadeOut(0.2);
                let act_fIn = cc.fadeIn(0.2);
                let act_seq = cc.sequence(act_fOut, act_fIn).repeatForever();
                GameManage.Instance.Page_Alarm.active = true;
                GameManage.Instance.Page_Alarm.runAction(act_seq);
                callbalc_time = 11000;
                let callback_1 = () => {
                    if (GameManage.Instance.Page_Alarm.active) {
                        GameManage.Instance.Page_Alarm.stopAllActions();
                        GameManage.Instance.Page_Alarm.active = false;
                    }
                }
                setTimeout(callback_1, 1000);
            }
            target_Class.IsLightning = true;
            target_Class.IsSpeedUp = false;
            let target_Speed_value = target_Class.Speed;
            target_Class.Speed = target_Speed_value * 0.5;
            let callback_2 = () => {
                prop.destroy();
                target.scale = 0.4;
                target_Class.IsLightning = false;
                target_Class.IsSpeedUp = true;
                target_Class.Speed = target_Speed_value;
            }
            setTimeout(callback_2, callbalc_time);
        }
    }
}
