import { Transportation } from "../Transportation";
import Player from "../Player";

/**
 * @class 空投奖励--->加速卡
 */
export class TranSpeedUp extends Transportation {

    /**
     * 设置空投
     * @param role 角色节点
     */
    public SetTransportation(role: cc.Node) {
        this.SetSpeedUp(role);
    }

    /**
     * 设置加速卡
     * @param role  角色节点
     */
    private SetSpeedUp(role: cc.Node) {
        let player = role.getComponent(Player);
        let speed_value = player.Speed;
        player.IsSpeedUp = false;
        player.Speed = speed_value + speed_value * 0.5;
        let callback = () => {
            player.IsSpeedUp = true;
            player.Speed = speed_value;
        }
        setTimeout(callback, 10000);
    }
}
