
import { EventCenter } from "../../commont/EventCenter";
import { EventType, Special_Car } from "../../commont/Enum";
import AI from "../AI";
import Player from "../Player";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Role from "../Role";
/**
 * @class 吸铁石
 */
export class Magnet extends PropUseing {

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
        GameManage.Instance.StopTargetAction(role);

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
        let target: cc.Node = arr_y[ran];

        let arr_car = target.getChildByName("Box").getChildByName("SpecialCar").children;
        let car_name: string = null;
        for (let i = 0; i < arr_car.length; i++) {
            let car = arr_car[i];
            if (car.active) {
                car_name = car.name;
                break;
            }
        }
        if (car_name && (car_name === Special_Car.Pickup || car_name === Special_Car.StreetRoller || car_name === Special_Car.CementTruck)) {
            return;
        }

        let arr = target.children;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === "6") {
                arr[i].destroy();
                return;
            }
        }

        skin_id = "7"

        let target_Class: Role = null;
        let target_name = target.name;
        if (target_name === "AI") {
            target_Class = target.getComponent(AI);
        } else if (target_name === "Player") {
            target_Class = target.getComponent(Player);
        }

        let prop_1: cc.Node = null;
        let prop_target: cc.Node = null;
        let prop_self: cc.Node = null;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === "7") {
                prop_1 = cc.instantiate(this.Props[i]);
            }
            if (this.Props[i].name === "8") {
                prop_target = cc.instantiate(this.Props[i]);
                prop_self = cc.instantiate(this.Props[i]);
            }
        }

        target.addChild(prop_target);
        prop_target.setPosition(0, 0);
        prop_target.zIndex = 1;
        let act_move_up_1 = cc.moveBy(0.07, 10, 10);
        let act_move_down_1 = cc.moveBy(0.07, -10, -10);
        let act_dt_1 = cc.delayTime(1);
        let act_seq_1 = cc.sequence(act_move_up_1, act_move_down_1, act_dt_1, act_move_up_1, act_move_down_1).repeatForever();
        prop_target.runAction(act_seq_1);

        role.addChild(prop_self);
        prop_self.setPosition(0, 300);
        prop_self.zIndex = 1;
        let act_move_up_2 = cc.moveBy(0.07, 10, 10);
        let act_move_down_2 = cc.moveBy(0.07, -10, -10);
        let act_dt_2 = cc.delayTime(1);
        let act_seq_2 = cc.sequence(act_move_up_2, act_move_down_2, act_dt_2, act_move_up_2, act_move_down_2).repeatForever();
        prop_self.runAction(act_seq_2);

        let speed_Effect = cc.instantiate(this.Game.Pre_SpeedEffects);
        role.addChild(speed_Effect);
        speed_Effect.setPosition(0, 0);
        speed_Effect.scale = 2;
        speed_Effect.zIndex = -1;
        let partic = speed_Effect.getComponent(cc.ParticleSystem);
        partic.resetSystem();

        target_Class.IsSpeedUp = false;
        let target_Speed_value = target_Class.Speed;
        target_Class.Speed = target_Speed_value - target_Speed_value * 0.2;
        // let act_fadeOut = cc.fadeOut(0.5);
        // let act_fadeIn = cc.fadeIn(0.5);
        // let act_seq = cc.sequence(act_fadeOut, act_fadeIn).repeatForever();
        // target.runAction(act_seq);

        let role_Class: Role = null;
        let role_name = role.name;
        if (role_name === "AI") {
            role_Class = role.getComponent(AI);
        } else if (role_name === "Player") {
            role_Class = role.getComponent(Player);
        }
        if (!role_Class.IsSpeedUping) {
            role_Class.IsSpeedUping = true;
        } else {
            let arr = role.children;
            for (let i = 0; i < arr.length; i++) {
                let speed_icon = arr[i];
                if ((speed_icon.name === "7" && speed_icon.uuid !== prop_1.uuid) || (speed_icon.name === "win" && speed_icon.uuid !== speed_Effect.uuid)) {
                    speed_icon.destroy();
                }
                if (speed_icon.name === "8") {
                    speed_icon.destroy();
                }
            }
            // role.getChildByName("7").destroy();
            // role.getChildByName("win").destroy();
            // type_Class.IsSpeedUping = false;
            role.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            role_Class.unscheduleAllCallbacks();
        }
        role_Class.IsSpeedUp = false;
        let role_Speed_value = role_Class.Speed;
        role_Class.Speed = 1500;

        role.addChild(prop_1);
        prop_1.scale = 3;
        prop_1.setPosition(0, 400);

        let callback = () => {


            target_Class.IsSpeedUp = true;
            target_Class.Speed = target_Speed_value;

            role_Class.IsSpeedUping = false;
            role_Class.IsSpeedUp = true;
            role_Class.Speed = role_Speed_value;
            target.stopAllActions();
            GameManage.Instance.StopTargetAction(role);
            prop_1.destroy();
            prop_target.destroy();
            prop_self.destroy();
            speed_Effect.destroy();
            console.log("道具------------------>吸铁石");
        }

        role_Class.scheduleOnce(callback, 3);
    }
}
