import { SpecialCar } from "../SpecialCar";
import Player from "../Player";
import { GameManage } from "../../commont/GameManager";

/**
 * @class 皮卡车
 */
export class Pickup extends SpecialCar {

    public Effect(role: any) {
        this.SetEffect(role);
    }

    private SetEffect(role: any) {
        let speed_value = role.Speed;
        role.IsSpeedUp = false;
        role.Speed = 1500;
        let callback = () => {
            role.IsSpeedUp = true;
            role.Speed = 1000;
            GameManage.Instance.Current_SpecialCar = null;

            role.node.getChildByName("Car").active = true;
            let arr = role.node.getChildByName("SpecialCar").children;
            for (let i = 0; i < arr.length; i++) {
                arr[i].active = false;
            }
        }
        role.scheduleOnce(callback, 15);
    }
}
