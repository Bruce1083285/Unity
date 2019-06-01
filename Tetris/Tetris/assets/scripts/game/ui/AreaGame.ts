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
     * @property 灰色格子预制体
     */
    @property(cc.Prefab)
    private Pre_GrayGrid: cc.Prefab = null;
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

    onLoad() {
        this.Init();
    }

    /**
     * 初始化
     */
    private Init() {
        this.StarSmall_Target = this.node.parent.parent.getChildByName("Area_BigDevil");
        this.StarBig_Target = this.node.parent.parent.getChildByName("Area_OtherGame");

        this.AddListenter();
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {
        //创建星星移动
        EventCenter.AddListenter(EventType.CreatorStarMove, () => {
            this.SetStarMove(this.Pre_Star_Big, this.StarBig_Target, 0.5);
            this.SetStarMove(this.Pre_Star_Small, this.StarSmall_Target, 0.5);
        }, "AreaGame");

        //监听设置障碍灰格子
        EventCenter.AddListenter(EventType.SetObstacleGrid, () => {
            this.SetObstacleGrid();
        }, "AreaGame");
    }

    /**
     * 移除事件监听
     */
    private RemoveListenter() {
        //创建星星移动
        EventCenter.RemoveListenter(EventType.CreatorStarMove, "AreaGame");

        //设置障碍灰格子
        EventCenter.RemoveListenter(EventType.SetObstacleGrid, "AreaGame");
    }

    /**
     * 更新游戏开始点
     * @param point_Begin 开始点节点
     * @param pre_Cubes [Array]方块预制体
     * @param cube_ID 方块
     */
    public UpdatePointBegin(point_Begin: cc.Node, pre_Cubes: cc.Prefab[], cube_ID: string) {
        if (GameManager.Instance.IsGameOver) {
            return;
        }

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
        star.setPosition(0, 0);

        let act_Move = cc.moveTo(dt, target.position);
        let callback = () => {
            star.destroy();
        }
        let act_Sea = cc.sequence(act_Move, cc.callFunc(callback));
        star.runAction(act_Sea);
    }

    /**
     * 设置障碍格子
     */
    private SetObstacleGrid() {
        if (GameManager.Instance.ActtackCube_Num <= 0) {
            return;
        }
        this.SetNowCubeGrids();
        this.SetGaryGrids();
    }

    /**
     * 设置现有方块格子
     */
    private SetNowCubeGrids() {
        let arr_Record: cc.Node[] = [];
        let num = GameManager.Instance.ActtackCube_Num;
        for (let y = GameManager.Instance.Game_Grid.length - 1; y >= 0; y--) {
            for (let x = 0; x < GameManager.Instance.Game_Grid[y].length; x++) {
                let grid = GameManager.Instance.Game_Grid[y][x];
                if (grid !== null && grid.parent !== GameManager.Instance.Current_Cube) {
                    let ind = arr_Record.indexOf(grid);
                    if (ind !== -1) {
                        continue;
                    }
                    let max_y: number = y + num;
                    if (max_y >= GameManager.Instance.Grid_Height) {
                        max_y = GameManager.Instance.Grid_Height - 1;
                    }
                    GameManager.Instance.Game_Grid[y][x] = null;
                    GameManager.Instance.Game_Grid[max_y][x] = grid;
                    grid.setPosition(grid.position.x, grid.position.y + GameManager.Instance.Interval_Value * num);

                    arr_Record.push(grid);
                }
            }
        }
    }

    /**
     * 设置灰色格子
     */
    private SetGaryGrids() {
        let i_Value = GameManager.Instance.Interval_Value
        for (let y = 0; y < GameManager.Instance.ActtackCube_Num; y++) {
            let ran = Math.floor(Math.random() * GameManager.Instance.Game_Grid[y].length);
            for (let x = 0; x < GameManager.Instance.Game_Grid[y].length; x++) {
                if (x === ran) {
                    continue;
                }
                let grid = cc.instantiate(this.Pre_GrayGrid);
                this.node.addChild(grid);
                grid.setPosition(x * i_Value + i_Value / 2, y * i_Value + i_Value / 2);
                GameManager.Instance.Game_Grid[y][x] = grid;
            }
        }
    }
}
