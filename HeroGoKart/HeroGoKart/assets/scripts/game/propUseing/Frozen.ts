
import AI from "../AI";
import Player from "../Player";
import { EventCenter } from "../../commont/EventCenter";
import { EventType, Special_Car } from "../../commont/Enum";
import { PropUseing } from "../PropUseing";
import Game from "../../Game";
import { GameManage } from "../../commont/GameManager";
import Animation_Frozen from "../../animation/Animation_Frozen";
import Role from "../Role";

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

        let arr_car = ran_node.getChildByName("Box").getChildByName("SpecialCar").children;
        let car_name: string = null;
        for (let i = 0; i < arr_car.length; i++) {
            let car = arr_car[i];
            if (car.active) {
                car_name = car.name;
                break;
            }
        }
        if (car_name && car_name === Special_Car.StreetRoller) {
            // this.node.destroy();
            return;
        }

        let prop: cc.Node = null;
        let parent = role.parent;
        for (let i = 0; i < this.Props.length; i++) {
            if (this.Props[i].name === skin_id) {
                prop = cc.instantiate(this.Props[i]);
                break;
            }
        }

        let type_c: Role = null;
        if (ran_node.name === "AI") {
            type_c = ran_node.getComponent(AI);
        }
        if (ran_node.name === "Player") {
            type_c = ran_node.getComponent(Player);
        }

        let callback_1_time: number = 0;
        let callback_2_time: number = 3000;
        if (ran_node.name === "Player") {
            let act_fOut = cc.fadeOut(0.2);
            let act_fIn = cc.fadeIn(0.2);
            let act_seq = cc.sequence(act_fOut, act_fIn).repeatForever();
            GameManage.Instance.Page_Alarm.active = true;
            GameManage.Instance.Page_Alarm.runAction(act_seq);
            callback_1_time = 1;
            callback_2_time = 4;
        }

        let box_Collider = prop.getComponent(cc.BoxCollider);
        box_Collider.enabled = false;

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
        frozen.scheduleOnce(callback_1, callback_1_time);

    }
}
