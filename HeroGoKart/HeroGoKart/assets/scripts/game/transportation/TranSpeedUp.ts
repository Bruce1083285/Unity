import { Transportation } from "../Transportation";
import Player from "../Player";
import AI from "../AI";

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
        let role_type = null;
        if (role.name === "AI") {
            role_type = role.getComponent(AI);
        }
        if (role.name === "Player") {
            role_type = role.getComponent(Player);
        }
        let speed_value = role_type.Speed;
        role_type.IsSpeedUp = false;
        role_type.Speed = 500;
        let callback = () => {
            role_type.IsSpeedUp = true;
            role_type.Speed = speed_value;
        }
        setTimeout(callback, 10000);
    }
}
