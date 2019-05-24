
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
        // GameManage.Instance.StopTargetAction(role);

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

        let prop: cc.Node = null;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === skin_id) {
                prop = cc.instantiate(this.Props[i]);
                role.addChild(prop);
                prop.scale = 3;
                prop.setPosition(0, 400);
                break;
            }
        }

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
                if ((speed_icon.name === "7" && speed_icon.uuid !== prop.uuid) || (speed_icon.name === "win" && speed_icon.uuid !== speed_Effect.uuid)) {
                    speed_icon.destroy();
                }
            }
            // role.getChildByName("7").destroy();
            // role.getChildByName("win").destroy();
            // type_Class.IsSpeedUping = false;
            GameManage.Instance.StopTargetAction(role);
            role.stopAllActions();
            role_Class.unscheduleAllCallbacks();
        }
        role_Class.IsSpeedUp = false;
        let role_Speed_value = role_Class.Speed;
        role_Class.Speed = 1500;

        let callback = () => {
            // GameManage.Instance.StopTargetAction(role);

            target.stopAllActions();
            prop.destroy();
            speed_Effect.destroy();

            target_Class.IsSpeedUp = true;
            target_Class.Speed = target_Speed_value;

            role_Class.IsSpeedUping = false;
            role_Class.IsSpeedUp = true;
            role_Class.Speed = role_Speed_value;
            console.log("道具------------------>吸铁石");
        }

        role_Class.scheduleOnce(callback, 3000);
    }
}
