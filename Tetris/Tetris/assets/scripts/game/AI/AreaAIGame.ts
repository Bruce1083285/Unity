import { GameManager } from "../../commont/GameManager";
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";

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
     * @property 大星星
     */
    @property(cc.Prefab)
    private Pre_Star_Big: cc.Prefab = null;
    /**
    * @property 小星星
    */
    @property(cc.Prefab)
    private Pre_Star_Small: cc.Prefab = null;
    /**
     * @property 大星星目标节点
     */
    private StarBig_Target: cc.Node = null;
    /**
     * @property 小星星目标节点
     */
    private StarSmall_Target: cc.Node = null;
    /**
     * @property 游戏开始节点
     */
    private Point_Begin: cc.Node = null;

    /**
     * 初始化
     */
    public Init() {
        this.Point_Begin = this.node.parent.getChildByName("BeginPoint");
        this.StarSmall_Target = this.node.parent.parent.getChildByName("Area_BigDevil");
        this.StarBig_Target = this.node.parent.parent.getChildByName("Area_Game");

        this.AddListenter();
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {
        //监听创建AI星星移动
        EventCenter.AddListenter(EventType.CreatorAIStarMove, () => {
            this.SetStarMove(this.Pre_Star_Big, this.StarBig_Target, 0.5);
            this.SetStarMove(this.Pre_Star_Small, this.StarSmall_Target, 0.5);
        }, "AreaAIGame");
    }

    /**
     * 移除事件监听
     */
    private RemoveListenter() {
        EventCenter.RemoveListenter(EventType.CreatorAIStarMove, "AreaAIGame");
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
            let pre: cc.Prefab = pre_Cubes[i];
            if (pre.name !== GameManager.Instance.AIStandbyCubesID[0]) {
                continue;
            }
            this.SetCubeBeginPos(pre, this.node, this.Point_Begin);
            GameManager.Instance.AIStandbyCubesID.splice(0, 1);
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

    /**
    * 设置星星移动
    * @param pre_Star 星星预制体
    * @param target 目标节点
    * @param dt 持续时间
    */
    private SetStarMove(pre_Star: cc.Prefab, target: cc.Node, dt: number) {
        let star = cc.instantiate(pre_Star);
        let parent = this.node.parent.parent;
        parent.addChild(star);
        star.setPosition(this.node.parent.position);

        let act_Move = cc.moveTo(dt, target.position);
        let callback = () => {
            star.destroy();
        }
        let act_Sea = cc.sequence(act_Move, cc.callFunc(callback));
        star.runAction(act_Sea);
    }
}
