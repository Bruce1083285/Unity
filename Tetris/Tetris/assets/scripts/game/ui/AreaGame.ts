import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { GameManager } from "../../commont/GameManager";

/**
 * @class 游戏区域类
 */
export class AreaGame {

    /**
     * 更新游戏开始点
     * @param point_Begin 开始点节点
     * @param pre_Cubes [Array]方块预制体
     * @param area_Game 游戏区域
     */
    public UpdatePointBegin(point_Begin: cc.Node, pre_Cubes: cc.Prefab[], area_Game: cc.Node) {
        for (let i = 0; i < pre_Cubes.length; i++) {
            let pre = pre_Cubes[i];
            //获取对应方块预制体
            if (pre.name !== GameManager.Instance.Standby_FirstID) {
                continue;
            }

            let cube = cc.instantiate(pre);
            area_Game.addChild(cube);
            let world_pos = point_Begin.convertToWorldSpaceAR(cc.v2(0, 0));
            let node_pos = area_Game.convertToNodeSpaceAR(world_pos);
            cube.setPosition(node_pos);
            return;
        }
    }
}
