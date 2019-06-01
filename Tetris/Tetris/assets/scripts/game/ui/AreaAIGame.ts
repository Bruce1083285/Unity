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
export default class AreaAIGame extends cc.Component {

    /**
     * @property 游戏开始节点
     */
    private Point_Begin: cc.Node = null;

    // onLoad() {
    //     this.Init();
    // }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    public Init() {
        this.Point_Begin = this.node.parent.getChildByName("BeginPoint");
    }

    /**
     * 更新游戏开始点
     * @param pre_Cubes [Array]方块预制体
     * @param cube_ID 方块
     */
    public UpdatePointBegin(pre_Cubes: cc.Prefab[]) {
        if (GameManager.Instance.IsGameOver) {
            return;
        }

        for (let i = 0; i < pre_Cubes.length; i++) {
            let ran = Math.floor(Math.random() * pre_Cubes.length);
            let pre: cc.Prefab = pre_Cubes[ran];
            this.SetCubeBeginPos(pre, this.node, this.Point_Begin);
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
    }
}
