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
     * @property 灰色格子
     */
    @property(cc.Prefab)
    private Pre_GrayGrid: cc.Prefab = null;
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
     * @property 警报器
     */
    private Alarm: cc.Node = null;
    /**
     * @property 警报器是否开启
     */
    private IsOpenAlarm: boolean = false;
    /**
     * @property 时间
     */
    private Time: number = 0;
    /**
     * @property 当前时间
     */
    private Time_Current: number = 0;


    update(dt) {
        this.UpdateTime(dt);
        this.ListenterCurrentMaxTier();
    }

    /**
     * 更新时间
     * @param dt 时间区间
     */
    private UpdateTime(dt: number) {
        this.Time += dt;
        if (this.Time - this.Time_Current >= GameManager.Instance.AIGameSpeed_Value) {
            GameManager.Instance.Time_AIInterval = GameManager.Instance.Time_AIInterval / 2;
            this.Time_Current = this.Time;
        }
    }

    /**
     * 监听当前最高层
     */
    private ListenterCurrentMaxTier() {
        if (GameManager.Instance.AICurrent_MaxTier >= GameManager.Instance.AIAlarm_Value && !this.IsOpenAlarm) {
            this.Alarm.active = true;
            this.IsOpenAlarm = true;
            let dt: number = 0.3;
            let act_Fout = cc.fadeOut(dt);
            let act_Fin = cc.fadeIn(dt);
            let act_seq = cc.sequence(act_Fout, act_Fin).repeatForever();
            this.Alarm.runAction(act_seq);
        }
        if (GameManager.Instance.AICurrent_MaxTier < GameManager.Instance.AIAlarm_Value && this.IsOpenAlarm) {
            this.Alarm.stopAllActions();
            this.Alarm.active = false;
            this.IsOpenAlarm = false;
        }
    }

    /**
     * 初始化
     */
    public Init() {
        this.Point_Begin = this.node.parent.getChildByName("BeginPoint");
        this.StarSmall_Target = this.node.parent.parent.getChildByName("Area_BigDevil");
        this.StarBig_Target = this.node.parent.parent.getChildByName("Area_Game");
        this.Alarm = this.node.parent.getChildByName("Alarm");

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

        //监听设置障碍灰格子
        EventCenter.AddListenter(EventType.SetAIObstacleGrid, () => {
            this.SetObstacleGrid();
        }, "AreaAIGame");

        //事件监听--->移除监听
        EventCenter.AddListenter(EventType.RemoveListenter, () => {
            this.RemoveListenter();
        }, "AreaAIGame");
    }

    /**
     * 移除事件监听
     */
    private RemoveListenter() {
        EventCenter.RemoveListenter(EventType.CreatorAIStarMove, "AreaAIGame");

        //监听设置障碍灰格子
        EventCenter.RemoveListenter(EventType.SetAIObstacleGrid, "AreaAIGame");

        //移除监听
        EventCenter.RemoveListenter(EventType.RemoveListenter, "AreaAIGame");
    }

    /**
     * 更新游戏开始点
     * @param pre_Cubes [Array]方块预制体
     * @param cube_ID 方块
     */
    public UpdatePointBegin(pre_Cubes: cc.Prefab[], cube_ID?: string) {
        if (GameManager.Instance.IsGameOver) {
            return;
        }
        if (cube_ID) {
            for (let i = 0; i < pre_Cubes.length; i++) {
                let pre: cc.Prefab = pre_Cubes[i];
                if (pre.name !== cube_ID) {
                    continue;
                }
                this.SetCubeBeginPos(pre, this.node, this.Point_Begin);
                return;
            }
        }
        for (let i = 0; i < pre_Cubes.length; i++) {
            let pre: cc.Prefab = pre_Cubes[i];
            if (pre.name !== GameManager.Instance.AIStandbyCubesID[0]) {
                continue;
            }
            // if (pre.name !== "4") {
            //     continue;
            // }
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
        GameManager.Instance.Current_AICube = cube;
        this.UpdateSave();
    }

    /**
     * 更新暂存
     */
    private UpdateSave() {
        let ind = GameManager.Instance.AIStandbyCubesID.indexOf("1");
        if (ind === -1) {
            let ran = Math.floor(Math.random() * 100);
            if (ran <= 20) {
                let callback = () => {
                    EventCenter.Broadcast(EventType.UpdateAISave);
                }
                this.scheduleOnce(callback, 3);
            }
        } else {
            if (GameManager.Instance.Current_AICube.name === "1") {
                let callback = () => {
                    EventCenter.Broadcast(EventType.UpdateAISave);
                }
                this.scheduleOnce(callback, 3);
            }
        }
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

    /**
    * 设置障碍格子
    */
    private SetObstacleGrid() {
        if (GameManager.Instance.AIActtackCube_Num <= 0) {
            return;
        }
        this.SetNowCubeGrids();
        this.SetGaryGrids();
        GameManager.Instance.AIActtackCube_Num = 0;
    }

    /**
     * 设置现有方块格子
     */
    private SetNowCubeGrids() {
        let arr_Record: cc.Node[] = [];
        let num = GameManager.Instance.AIActtackCube_Num;
        for (let y = GameManager.Instance.AIGame_Grid.length - 1; y >= 0; y--) {
            for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
                let grid = GameManager.Instance.AIGame_Grid[y][x];
                if (grid !== null && grid.parent !== GameManager.Instance.Current_AICube) {
                    let ind = arr_Record.indexOf(grid);
                    if (ind !== -1) {
                        continue;
                    }
                    let max_y: number = y + num;
                    if (max_y >= GameManager.Instance.Grid_Height) {
                        max_y = GameManager.Instance.Grid_Height - 1;
                    }
                    GameManager.Instance.AIGame_Grid[y][x] = null;
                    GameManager.Instance.AIGame_Grid[max_y][x] = grid;
                    grid.setPosition(grid.position.x, grid.position.y + GameManager.Instance.Interval_AIValue * num);

                    arr_Record.push(grid);
                }
            }
        }
    }

    /**
     * 设置灰色格子
     */
    private SetGaryGrids() {
        let i_Value = GameManager.Instance.Interval_AIValue
        for (let y = 0; y < GameManager.Instance.AIActtackCube_Num; y++) {
            let ran = Math.floor(Math.random() * GameManager.Instance.AIGame_Grid[y].length);
            for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
                if (x === ran) {
                    continue;
                }
                let grid = cc.instantiate(this.Pre_GrayGrid);
                this.node.addChild(grid);
                grid.setPosition(x * i_Value + i_Value / 2, y * i_Value + i_Value / 2);
                GameManager.Instance.AIGame_Grid[y][x] = grid;
            }
        }
    }
}
