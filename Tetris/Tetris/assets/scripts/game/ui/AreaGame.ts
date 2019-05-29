import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { GameManager } from "../../commont/GameManager";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class AreaGame extends cc.Component {

    /**
     * 更新游戏开始点
     * @param point_Begin 开始点节点
     * @param pre_Cubes [Array]方块预制体
     * @param cube_ID 方块
     */
    public UpdatePointBegin(point_Begin: cc.Node, pre_Cubes: cc.Prefab[], cube_ID: string) {
        for (let i = 0; i < pre_Cubes.length; i++) {
            let pre: cc.Prefab = pre_Cubes[i];
            //获取对应方块预制体
            if (pre.name !== cube_ID) {
                continue;
            }
            this.SetCubeBeginPos(pre, this.node, point_Begin);
            return;
        }
    }

    /**
     * 设置方块开始位置
     * @param pre 方块预制体
     * @param area_Game 游戏区域--->方块父节点
     * @param point_Begin 方块开始位置
     */
    private SetCubeBeginPos(pre: cc.Prefab, area_Game: cc.Node, point_Begin: cc.Node) {
        let cube = cc.instantiate(pre);
        area_Game.addChild(cube);
        let world_pos = point_Begin.convertToWorldSpaceAR(cc.v2(0, 0));
        let node_pos = area_Game.convertToNodeSpaceAR(world_pos);
        cube.setPosition(node_pos);
        GameManager.Instance.Current_Cube = cube;
    }
}
