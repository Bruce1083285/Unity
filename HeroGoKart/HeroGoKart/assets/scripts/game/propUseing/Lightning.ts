
import AI from "../AI";
import Player from "../Player";
import { EventCenter } from "../../commont/EventCenter";
import { EventType, Special_Car, SoundType } from "../../commont/Enum";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Role from "../Role";


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
        // GameManage.Instance.StopTargetAction(role);

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
            arr_role.push(target);

            // let arr = target.children;
            // for (let i = 0; i < arr.length; i++) {
            //     if (arr[i].name === "6") {
            //         arr[i].destroy();
            //     } else {
            //         arr_role.push(target);
            //     }
            //     continue role;
            // }

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
            if (car_name && car_name === Special_Car.StreetRoller) {
                arr_role.splice(i, 1);
            }
        }

        if (arr_role.length <= 0) {
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

            let callbalc_time = 5;
            let prop = cc.instantiate(pre_prop);
            let target_Class: Role = null;
            let name = target.name;
            if (name === "AI") {
                target_Class = target.getComponent(AI);
            } else if (name === "Player") {
                target_Class = target.getComponent(Player);
            }
            let callback = () => {
                if (!target_Class.IsLightning) {
                    target_Class.IsLightning = true;
                } else if (target_Class.IsSlowDown || target_Class.IsSky || target_Class.IsLightning || target_Class.IsWaterPolo || target_Class.IsFrozen ) {
                    if (target_Class.IsSlowDown) {
                        target_Class.Horizontal_Sensitivity=100;
                        target_Class.IsSlowDown = false;
                    }
                    if (target_Class.IsSky) {
                        target_Class.IsSky = false;
                    }
                    if (target_Class.IsFrozen) {
                        let frozen = target.getChildByName("5");
                        if (frozen) {
                            frozen.destroy();
                        }
                        target_Class.IsFrozen = false;
                    }
                    if (target_Class.IsWaterPolo) {
                        let water_Polo = target.getChildByName("4");
                        if (water_Polo) {
                            water_Polo.destroy();
                        }
                        target_Class.IsWaterPolo = false;
                    }
                    if (target_Class.IsLightning) {
                        // console.log(role.children);
                        // let arr = role.children;
                        // for (let i = 0; i < arr.length; i++) {
                        //     let light = arr[i];
                        //     if (light.name === "9") {
                        //         light.destroy();
                        //     }
                        // }
                        let light = target.getChildByName("9");
                        if (light) {
                            light.destroy();
                        }
                        // target_Class.IsLightning = false;
                    }
                    GameManage.Instance.StopTargetAction(target);
                    target.stopAllActions();
                    target_Class.unscheduleAllCallbacks();
                }
                if (target_Class.IsSpeedUping) {
                    role.getChildByName("7").destroy();
                    role.getChildByName("win").destroy();
                    target_Class.IsSpeedUping = false;
                    GameManage.Instance.StopTargetAction(role);
                    role.stopAllActions();
                    target_Class.unscheduleAllCallbacks();
                }
                target_Class.IsSpeedUp = false;
                let target_Speed_value = target_Class.Speed;
                target_Class.Speed = target_Speed_value * 0.5;

                target.addChild(prop);
                target.scale = 0.2;
                prop.scale = 2;
                prop.setPosition(0, 400);

                let callback_2 = () => {
                    // GameManage.Instance.StopTargetAction(role);

                    prop.destroy();
                    target.scale = 0.4;
                    target_Class.IsLightning = false;
                    target_Class.IsSpeedUp = true;
                    // target_Class.Speed = target_Speed_value;
                    console.log("道具------------------>雷击");
                }
                target_Class.scheduleOnce(callback_2, callbalc_time);
            }

            if (target.name === "Player") {
                let act_fOut = cc.fadeOut(0.2);
                let act_fIn = cc.fadeIn(0.2);
                let act_seq = cc.sequence(act_fOut, act_fIn).repeatForever();
                GameManage.Instance.Page_Alarm.active = true;
                GameManage.Instance.Page_Alarm.runAction(act_seq);
                callbalc_time = 6.5;
                let callback_1 = () => {
                    if (GameManage.Instance.Page_Alarm.active) {
                        GameManage.Instance.Page_Alarm.stopAllActions();
                        GameManage.Instance.Page_Alarm.active = false;
                    }
                    let prote = target.getChildByName("6");
                    if (prote) {
                        prote.destroy();
                        prop.destroy();
                        return
                    }
                    callback();
                }
                target_Class.scheduleOnce(callback_1, 1);
            } else {
                let prote = target.getChildByName("6");
                if (prote) {
                    prote.destroy();
                    prop.destroy();
                    return
                }
                target_Class.scheduleOnce(callback, 0);
            }
        }

    }
}
