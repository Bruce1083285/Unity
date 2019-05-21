import { SpecialCar } from "../SpecialCar";
import Player from "../Player";
import { GameManage } from "../../commont/GameManager";

/**
 * @class 皮卡车
 */
export class Pickup extends SpecialCar {

    public Effect(role: Player) {
        this.SetEffect(role);
    }

    private SetEffect(role: Player) {
        let speed_value = role.Speed;
        role.IsSpeedUp = false;
        role.Speed = speed_value + speed_value;
        let callback = () => {
            role.IsSpeedUp = true;
            role.Speed = speed_value;
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
