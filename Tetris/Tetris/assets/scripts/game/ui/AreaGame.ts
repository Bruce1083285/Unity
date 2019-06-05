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
    private Pre_OverStar: cc.Prefab = null;
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
    /**
     * @property 结束动画节点
     */
    private Anima_Over: cc.Node = null;
    /**
     * @property 警报器
     */
    private Alarm: cc.Node = null;
    /**
     * @property 警报是否开启
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

    onLoad() {
        this.Init();
    }

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
        if (this.Time - this.Time_Current >= GameManager.Instance.GameSpeed_Value) {
            GameManager.Instance.Time_Interval = GameManager.Instance.Time_Interval / 2;
            this.Time_Current = this.Time;
        }
    }

    /**
     * 监听当前最高层
     */
    private ListenterCurrentMaxTier() {
        if (GameManager.Instance.Current_MaxTier >= GameManager.Instance.Alarm_Value && !this.IsOpenAlarm) {
            this.Alarm.active = true;
            this.IsOpenAlarm = true;
            let dt: number = 0.3;
            let act_Fout = cc.fadeOut(dt);
            let act_Fin = cc.fadeIn(dt);
            let act_seq = cc.sequence(act_Fout, act_Fin).repeatForever();
            this.Alarm.runAction(act_seq);
        }
        if (GameManager.Instance.Current_MaxTier < GameManager.Instance.Alarm_Value && this.IsOpenAlarm) {
            this.Alarm.stopAllActions();
            this.Alarm.active = false;
            this.IsOpenAlarm = false;
        }
    }

    /**
     * 初始化
     */
    private Init() {
        this.StarSmall_Target = this.node.parent.parent.getChildByName("Area_BigDevil");
        this.StarBig_Target = this.node.parent.parent.getChildByName("Area_OtherGame");
        this.Alarm = this.node.parent.getChildByName("Alarm");
        this.Anima_Over = this.node.parent.getChildByName("Over");

        this.AddListenter();
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {

        //播放游戏结束
        EventCenter.AddListenter(EventType.PlayGameOver, (isPlayerWin: boolean) => {
            this.PlayGameOver(isPlayerWin);
        }, "AreaGame");

        //创建星星移动
        EventCenter.AddListenter(EventType.CreatorStarMove, () => {
            this.SetStarMove(this.Pre_Star_Big, this.StarBig_Target, 0.5);
            this.SetStarMove(this.Pre_Star_Small, this.StarSmall_Target, 0.5);
        }, "AreaGame");

        //监听设置障碍灰格子
        EventCenter.AddListenter(EventType.SetObstacleGrid, () => {
            this.SetObstacleGrid();
        }, "AreaGame");

        //事件监听--->移除监听
        EventCenter.AddListenter(EventType.RemoveListenter, () => {
            this.RemoveListenter();
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

        //移除监听
        EventCenter.RemoveListenter(EventType.RemoveListenter, "AreaGame");
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
        GameManager.Instance.ActtackCube_Num = 0;
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

    /**
     * 播放游戏结束
     * @param isPlayerWin 玩家是否胜利
     */
    private PlayGameOver(isPlayerWin: boolean) {
        EventCenter.Broadcast(EventType.CubeForeseeDestory);

        this.Anima_Over.active = true;
        this.Anima_Over.getChildByName("Victory").active = isPlayerWin;;
        this.Anima_Over.getChildByName("Failure").active = !isPlayerWin;

        GameManager.Instance.Star_Over = cc.instantiate(this.Pre_OverStar);
        this.node.addChild(GameManager.Instance.Star_Over);
        let width = this.node.getContentSize().width;
        let height = this.node.getContentSize().height;
        GameManager.Instance.Star_Over.setPosition(width / 2, 0);
        let act_move = cc.moveBy(1, 0, height);
        let callback = () => {
            this.Anima_Over.active = false;
            GameManager.Instance.Star_Over.destroy();
            EventCenter.BroadcastOne<boolean>(EventType.SetPageOver, isPlayerWin);
        }
        let act_seq = cc.sequence(act_move, cc.callFunc(callback));
        GameManager.Instance.Star_Over.runAction(act_seq);
    }
}
