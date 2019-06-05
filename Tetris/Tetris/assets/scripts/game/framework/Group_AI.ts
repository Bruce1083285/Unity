import { GameManager } from "../../commont/GameManager";
import { Cubes, EventType, Click_FunManage } from "../../commont/Enum";
import { EventCenter } from "../../commont/EventCenter";

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
export default class Group extends cc.Component {

    //#region 
    /**
     * @property [Array]方块预制体
     */
    @property([cc.Prefab])
    private Pre_Cubes: cc.Prefab[] = [];
    /**
     * @property 方块初始位置
     */
    private Cube_Init_Pos: cc.Vec2 = null;
    /**
     * @property 是否加速
     */
    private IsSpeedUp: boolean = false;
    /**
     * @property 是否开始游戏
     */
    private IsStartGame: boolean = false;
    /**
     * @property 时间
     */
    private Time: number = 0;
    /**
     * @property 当前时间
     */
    private Time_Current: number = 0;
    /**
     * @property 宽度
     */
    private Max_Width: number = 0;
    /**
     * @property 高度
     */
    private Max_Height: number = 0;
    /**
     * @property 连消数
     */
    private Continuous_Count: number = 0;
    /**
     * @property 随机移动值
     */
    private Move_RandomValue: number = 0;
    /**
     * @property 非空洞X轴Y轴
     */
    private NotCavity_XandY = []
    /**
     * @property [Array]空洞X轴Y轴记录
     */
    private Record_Cavity_XandY = [];
    /**
     * @property [Array]自身子节点
     */
    private Childers: cc.Node[] = [];
    /**
     * @property [Array]旋转度数
     */
    private Rotate_Value: number[] = [90, 180, 270, 360];
    /**
     * @property [Array]路线
     */
    private AI_Path: any[] = [];
    /**
     * @property 最佳路线
     */
    private TheBestRoute: any = {}
    // /**
    //  * @property 路径对象
    //  */
    // private Path = {
    //     /**X轴 */
    //     x: null,
    //     /**Y轴 */
    //     y: null,
    //     /**高度 */
    //     height: null,
    //     /**旋转 */
    //     rotation: null,
    //     /**消除层数 */
    //     eliminate_tier: null,
    //     /**贡献方块数 */
    //     contribution_Num: null,
    //     /**行变换数 */
    //     conversion_Row: null,
    //     /**列变换数 */
    //     conversion_Line: null,
    //     /**空洞数 */
    //     cavity_Num: null,
    //     /**井数 */
    //     well_Num: null,
    //     /**权重值 */
    //     weight: null,
    // };

    onLoad() {

    }

    start() {
        this.Init();
    }

    update(dt) {
        this.UpdateMoveDown(dt);
        this.ListenterContinuous();
        this.ListenterCurrentMaxTier();
    }

    /**
    * 监听连消数
    */
    private ListenterContinuous() {
        if (this.Continuous_Count >= 1) {
            EventCenter.Broadcast(EventType.CreatorAIStarMove);
            EventCenter.BroadcastOne(EventType.SetActtackCube, this.Continuous_Count);
            EventCenter.BroadcastOne(EventType.UpdateAIBarAttack, this.Continuous_Count);

            GameManager.Instance.AIAddUpAttack_Value += this.Continuous_Count;
            this.Continuous_Count = 0;
        }
    }

    /**
     * 监听当前最高层数
     */
    private ListenterCurrentMaxTier() {
        for (let y = GameManager.Instance.AIGame_Grid.length - 1; y >= 0; y--) {
            let isHave = this.IsHaveCube(y);
            if (isHave) {
                GameManager.Instance.AICurrent_MaxTier = y;
                return;
            }
        }
    }

    /**
     * 是否存在方块
     * @param y Y轴
     * @returns 是否存在方块
     */
    private IsHaveCube(y: number): boolean {
        for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            if (grid && grid.parent !== this.node) {
                return true;
            }
        }

        return false;
    }

    /**
     * 初始化
     */
    Init() {
        this.Childers = this.node.children;
        this.Max_Width = this.node.parent.getContentSize().width;
        this.Max_Height = this.node.parent.getContentSize().height;
        this.Cube_Init_Pos = this.node.position;

        let isOver = this.GameOver();
        if (isOver) {
            return;
        }
        this.AddListenter();
        this.UpdateGameGrid();
        this.AI(GameManager.Instance.Interval_AIValue / 2, 0);
        console.log(GameManager.Instance.AIGame_Grid);
        this.Move_RandomValue = this.GetRandom();
        this.TheBestRoute = this.GetTheBestRoute();
    }

    /**
     * 游戏结束
     * @returns 游戏是否结束
     */
    private GameOver(): boolean {
        if (!this.IsValidGridPos()) {
            // console.log("游戏结束");
            this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_AIValue);
            GameManager.Instance.IsGameOver = true;
            EventCenter.BroadcastOne(EventType.PlayGameOver, true);
            return true;
        }
        return false;
    }

    /**
     * 获取最佳路线
     * @returns 最佳路线
     */
    private GetTheBestRoute() {
        let best_Path = this.AI_Path[0];
        for (let i = 0; i < this.AI_Path.length; i++) {
            if (best_Path.weight < this.AI_Path[i].weight) {
                best_Path = this.AI_Path[i];
            }
        }
        return best_Path;
    }

    /**
     * 获取随机值
     * @returns 随机值
     */
    private GetRandom(): number {
        let ran = Math.floor(Math.random() * 100);
        return ran;
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {
        //添加事件监听--->销毁预知位置方块
        EventCenter.AddListenter(EventType.ResetAIGameGrid, () => {
            this.ResetGameGrid();
        }, "Group_AI");

        //事件监听--->移除监听
        EventCenter.AddListenter(EventType.RemoveListenter, () => {
            this.RemoveListenter();
        }, "Group_AI");
    }

    /**
     * 添加事件监听
     */
    private RemoveListenter() {
        //移除事件监听--->销毁预知位置方块
        EventCenter.RemoveListenter(EventType.ResetAIGameGrid, "Group_AI");

        //移除监听
        EventCenter.RemoveListenter(EventType.RemoveListenter, "Group_AI");
    }

    /**
     * 重置游戏格子
     */
    private ResetGameGrid() {
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
                let grid = GameManager.Instance.AIGame_Grid[y][x];
                if (grid && grid.parent === GameManager.Instance.Current_AICube) {
                    GameManager.Instance.AIGame_Grid[y][x] = null;
                }
            }
        }
    }

    /**
     * 更新向下移动
     * @param dt 更新时间
     */
    private UpdateMoveDown(dt: number) {
        this.Time += dt;
        if (this.Time - this.Time_Current >= GameManager.Instance.Time_AIInterval) {
            // if (this.IsSpeedUp) {
            //     return;
            // }
            this.Move_RandomValue = this.GetRandom();
            this.node.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_AIValue);
            if (this.IsValidGridPos()) {
                this.UpdateGameGrid();
            } else {
                this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_AIValue);
                this.ForbiddenScript();
            }
            if (this.Move_RandomValue <= 50) {
                this.node.rotation = this.TheBestRoute.rotation;
                this.MoveDirLeft();

                this.MoveDirRight();

            }
            // let ran = this.GetRandom();
            // if (ran <= 5) {
            //     this.MoveDirUp();
            // }

            this.Time_Current = this.Time;
        }
    }

    /**
     * AI
     */
    private AI(pos_x: number, rotation: number) {
        while (true) {
            //路径对象
            let Path = {
                /**X轴 */
                x: null,
                /**Y轴 */
                y: null,
                /**高度 */
                height: null,
                /**旋转 */
                rotation: null,
                /**消除层数 */
                eliminate_tier: null,
                /**贡献方块数 */
                contribution_Num: null,
                /**行变换数 */
                conversion_Row: null,
                /**列变换数 */
                conversion_Line: null,
                /**空洞数 */
                cavity_Num: null,
                /**井数 */
                well_Num: null,
                /**权重值 */
                weight: null,
            };
            this.node.rotation = this.node.rotation + rotation;
            if (this.node.rotation > 360) {
                this.node.rotation = 0;
                break;
            }
            this.node.setPosition(pos_x, this.Cube_Init_Pos.y);
            let isBorder = this.IsBorder_Right();
            if (isBorder) {
                this.RemoveGameGrid();
                this.node.setPosition(this.Cube_Init_Pos);
                this.IsStartGame = true;
                return;
            }
            let dir = this.GetDirX();
            if (dir) {
                this.node.setPosition(this.node.x + dir, this.node.position.y);
            }
            Path.x = this.node.position.x;
            Path.y = this.node.position.y;
            Path.rotation = this.node.rotation;
            Path.height = this.GetCurrentYToDownYHeight();
            while (true) {
                this.node.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_AIValue);
                if (this.IsValidGridPos()) {
                    this.UpdateGameGrid();
                    console.log(GameManager.Instance.AIGame_Grid);
                } else {
                    console.log(GameManager.Instance.AIGame_Grid);
                    this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_AIValue);
                    Path.eliminate_tier = this.GetFullRowNum();
                    Path.contribution_Num = this.GetContributionCount();
                    Path.conversion_Row = this.GetConversion_Row();
                    Path.conversion_Line = this.GetConversion_Line();
                    Path.cavity_Num = this.GetCavity();
                    Path.well_Num = this.GetWellNum();
                    Path.weight = 10 * Path.eliminate_tier * Path.contribution_Num - 1 * Path.conversion_Row - 0.6 * Path.conversion_Line - 1 * Path.height - 0.3 * Path.cavity_Num - 0.5 * Path.well_Num;
                    let isHave: boolean = false;
                    for (let i = 0; i < this.AI_Path.length; i++) {
                        let obj = this.AI_Path[i];
                        if (Path.x === obj.x) {
                            isHave = true;
                            break;
                        }
                    }
                    if (!isHave) {
                        this.AI_Path.push(Path);
                    }
                    this.AI_Path.push(Path);
                    break;
                }
            }
            this.Record_Cavity_XandY = [];
            this.NotCavity_XandY = [];
            rotation = 90;
        }
        // while (true) {
        //     //路径对象
        //     let Path = {
        //         /**X轴 */
        //         x: null,
        //         /**Y轴 */
        //         y: null,
        //         /**高度 */
        //         height: null,
        //         /**旋转 */
        //         rotation: null,
        //         /**消除层数 */
        //         eliminate_tier: null,
        //         /**贡献方块数 */
        //         contribution_Num: null,
        //         /**行变换数 */
        //         conversion_Row: null,
        //         /**列变换数 */
        //         conversion_Line: null,
        //         /**空洞数 */
        //         cavity_Num: null,
        //         /**井数 */
        //         well_Num: null,
        //         /**权重值 */
        //         weight: null,
        //     };
        //     this.node.rotation = this.node.rotation + rotation;
        //     if (this.node.rotation > 360) {
        //         this.node.rotation = 0;
        //         break;
        //     }
        //     this.node.setPosition(pos_x, this.Cube_Init_Pos.y);
        //     let isBorder = this.IsBorder_Right();
        //     if (isBorder) {
        //         this.RemoveGameGrid();
        //         this.node.setPosition(this.Cube_Init_Pos);
        //         this.IsStartGame = true;
        //         return;
        //     }
        //     let dir = this.GetDirX();
        //     if (dir) {
        //         this.node.setPosition(this.node.x + dir, this.node.position.y);
        //     }
        //     Path.x = this.node.position.x;
        //     Path.y = this.node.position.y;
        //     Path.rotation = this.node.rotation;
        //     Path.height = this.GetCurrentYToDownYHeight();
        //     // console.log("模拟方块");
        //     // console.log(GameManager.Instance.AIGame_Grid_Simulation);
        //     while (true) {
        //         this.node.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_AIValue);
        //         if (this.IsValidGridPos()) {
        //             this.UpdateGameGrid();
        //         } else {
        //             this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_AIValue);
        //             Path.eliminate_tier = this.GetFullRowNum();
        //             Path.contribution_Num = this.GetContributionCount();
        //             Path.conversion_Row = this.GetConversion_Row();
        //             Path.conversion_Line = this.GetConversion_Line();
        //             Path.cavity_Num = this.GetCavity();
        //             Path.well_Num = this.GetWellNum();
        //             Path.weight = 10 * Path.eliminate_tier * Path.contribution_Num - 1 * Path.conversion_Row - 0.6 * Path.conversion_Line - 1 * Path.y - 0.3 * Path.cavity_Num - 0.5 * Path.well_Num;
        //             this.AI_Path.push(Path);
        //             break;
        //         }
        //     }
        //     this.Record_Cavity_XandY = [];
        //     rotation += 90;
        // }

        this.AI(this.node.position.x + GameManager.Instance.Interval_AIValue*2, 0);
    }

    /**
     * 移除模拟游戏格子中自身节点位置
     */
    private RemoveGameGrid() {
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
                let grid = GameManager.Instance.AIGame_Grid[y][x];
                if (grid && grid.parent === this.node) {
                    GameManager.Instance.AIGame_Grid[y][x] = null;
                }
            }
        }
    }

    /**
     * 右边是否越界
     * @returns 是否越界
     */
    private IsBorder_Right(): boolean {
        let arr_child = this.node.children;
        for (let i = 0; i < arr_child.length; i++) {
            let child = arr_child[i];

            let world_pos = this.node.convertToWorldSpaceAR(child.position);
            let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);

            if (node_pos.x > 450) {
                return true;
            }
        }

        return false;
    }

    /**
     * 获取当前Y轴到底部Y轴位置
     * @returns 距离最小的Y轴
     */
    private GetCurrentYToDownYHeight(): number {
        // //距离
        // let dir_y: number[] = [];
        // for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
        //     for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
        //         let grid = GameManager.Instance.AIGame_Grid[y][x];
        //         if (grid && grid.parent === this.node) {
        //             let ind = dir_y.indexOf(y);
        //             if (ind !== -1) {
        //                 continue;
        //             }
        //             dir_y.push(y);
        //         }
        //     }
        // }

        // let min_y: number = dir_y[0];
        // for (let i = 0; i < dir_y.length; i++) {
        //     if (min_y > dir_y[i]) {
        //         min_y = dir_y[i];
        //     }
        // }

        let height = Math.floor(this.node.position.y / GameManager.Instance.Interval_AIValue);

        return height;
    }

    /**
     * 获取满员行数
     */
    private GetFullRowNum(): number {
        let count: number = 0;
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            let isFull = this.IsFullGrid_Simulation(y);
            if (isFull) {
                count++;
            }
        }

        return count;
    }

    /**
     * 获取贡献数
     * @returns 贡献数
     */
    private GetContributionCount(): number {
        let count: number = 0;
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
                let grid = GameManager.Instance.AIGame_Grid[y][x];
                if (grid && grid.parent === this.node) {
                    let isFull = this.IsFullGrid_Simulation(y);
                    if (isFull) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    /**
     * 获取空洞数
     * @returns 空洞数
     */
    private GetCavity(): number {
        //获取非空洞和空洞的X轴和Y轴
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
                let grid = GameManager.Instance.AIGame_Grid[y][x];
                if (grid) {
                    continue;
                }

                let obj = {
                    x: x,
                    y: y,
                }
                let isCavity_Up = this.IsCavity_UP(x, y);
                if (!isCavity_Up) {
                    let isLeft = this.IsHaveCube_Left(x, y);
                    if (isLeft) {
                        let isHave: boolean = this.IsHave(obj, this.NotCavity_XandY);
                        if (!isHave) {
                            this.NotCavity_XandY.push(obj);
                        }
                        continue;
                    }
                    let isRight = this.IsHaveCube_Right(x, y);
                    if (isRight) {
                        let isHave: boolean = this.IsHave(obj, this.NotCavity_XandY);
                        if (!isHave) {
                            this.NotCavity_XandY.push(obj);
                        }
                        continue;
                    }
                    continue;
                }
                let isHave: boolean = this.IsHave(obj, this.Record_Cavity_XandY);
                if (!isHave) {
                    this.Record_Cavity_XandY.push(obj);
                }
            }
        }

        //获取所有非空洞的X轴和Y轴
        for (let i = 0; i < this.NotCavity_XandY.length; i++) {
            let obj = this.NotCavity_XandY[i];
            this.SelectNotCavity_Left(obj.x, obj.y);
            this.SelectNotCavity_Right(obj.x, obj.y);
        }

        for (let i = 0; i < this.Record_Cavity_XandY.length; i++) {
            let obj = this.Record_Cavity_XandY[i];
            let isHave: boolean = this.IsHave(obj, this.NotCavity_XandY);
            if (!isHave) {
                continue;
            }
            this.Record_Cavity_XandY.splice(i, 1);
        }

        let count: number = this.Record_Cavity_XandY.length;
        return count;
    }

    /**
     * 向上是否为空洞
     * @param x X轴
     * @param start_y 开始Y轴
     * @returns 是否为空洞
     */
    private IsCavity_UP(target_x: number, start_y: number): boolean {
        for (let y = start_y + 1; y < GameManager.Instance.AIGame_Grid.length; y++) {
            let grid = GameManager.Instance.AIGame_Grid[y][target_x];
            if (grid && grid.parent !== this.node) {
                return true;
            }
        }

        return false;
    }

    /**
     * 数组中是否已存在
     * @param obj 包含X轴和Y轴的对象
     * @returns 是否已存在
     */
    private IsHave(obj, cavity): boolean {
        for (let i = 0; i < cavity.length; i++) {
            let notCavity = cavity[i];
            if (obj.x === notCavity.x && obj.y === notCavity.y) {
                return true;
            }
        }

        return false;
    }

    /**
     * 向左是否有方块
     * @param start_x 开始X轴
     * @param y Y轴
     * @returns 是否为空洞
     */
    private IsHaveCube_Left(start_x: number, y: number): boolean {
        if (start_x - 1 < 0) {
            return false;
        }
        for (let x = start_x - 1; x >= 0; x--) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            if (grid) {
                return true;
            }
        }
        return false;
    }

    /**
     * 向右是否有方块
     * @param start_x 开始X轴
     * @param y Y轴
     * @returns 是否为空洞
     */
    private IsHaveCube_Right(start_x: number, y: number): boolean {
        if (start_x + 1 >= GameManager.Instance.Grid_Width) {
            return false;
        }
        for (let x = start_x + 1; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            if (grid) {
                return true;
            }
        }
        return false;
    }

    /**
     * 查找非空洞--->左
     * @param start_x 开始点X轴
     * @param y Y轴
     */
    private SelectNotCavity_Left(start_x: number, y: number) {
        if (start_x - 1 < 0) {
            return;
        }
        for (let x = start_x - 1; x >= 0; x--) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            if (grid) {
                return
            }
            let obj = {
                x: x,
                y: y,
            }
            let isHave = this.IsHave(obj, this.NotCavity_XandY);
            if (isHave) {
                continue;
            }
            this.NotCavity_XandY.push(obj);
        }
    }

    /**
    * 查找非空洞--->右
    * @param start_x 开始点X轴
    * @param y Y轴
    */
    private SelectNotCavity_Right(start_x: number, y: number) {
        if (start_x + 1 >= GameManager.Instance.AIGame_Grid[y].length) {
            return;
        }
        for (let x = start_x + 1; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            if (grid) {
                return
            }
            let obj = {
                x: x,
                y: y,
            }
            let isHave = this.IsHave(obj, this.NotCavity_XandY);
            if (isHave) {
                continue;
            }
            this.NotCavity_XandY.push(obj);
        }
    }

    /**
     * 空洞是否存在
     * @param x X轴
     * @param y Y轴
     * @returns 是否存在
     */
    private IsHaveCavity(x: number, y: number): boolean {
        for (let i = 0; i < this.Record_Cavity_XandY.length; i++) {
            let cavity_XandY = this.Record_Cavity_XandY[i]
            if (cavity_XandY.x === x && cavity_XandY.y === y) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取井的总数
     */
    private GetWellNum(): number {
        let arr: number[] = [];
        //获取每列所有井的深度递加之和
        for (let x = 0; x < GameManager.Instance.Grid_Width; x++) {
            let num = this.GetWellHeightByX(x);
            if (num !== 0) {
                arr.push(num);
            }
        }

        /**
         * 获取所有列所有井的神帝递加总和
         */
        let sum: number = 0;
        for (let i = 0; i < arr.length; i++) {
            sum = sum + arr[i];
        }

        return sum;
    }

    /**
     * 通过X轴获取每一列所有井的深度之和
     * @param x X轴
     * @returns 所有井的深度之和
     */
    private GetWellHeightByX(x: number): number {
        let height: number = 0;
        let arr: number[] = [];
        //获取每一个井的深度
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            let grid: cc.Node = GameManager.Instance.AIGame_Grid[y][x];
            if (grid) {
                let num = this.DecreasingHeight(height);
                if (num !== 0) {
                    arr.push(num);
                }
                height = 0;
                continue;
            }
            let isHave_Left: boolean = this.IsHaveCubeToOneByHorizontal(x - 1, y);
            if (!isHave_Left) {
                let num = this.DecreasingHeight(height);
                if (num !== 0) {
                    arr.push(num);
                }
                height = 0;
                continue;
            }
            let isHave_Right: boolean = this.IsHaveCubeToOneByHorizontal(x + 1, y);
            if (!isHave_Right) {
                let num = this.DecreasingHeight(height);
                if (num !== 0) {
                    arr.push(num);
                }
                height = 0;
                continue;
            }
            height++;
        }

        //计算当前列所有井的深度之和
        let sum: number = 0;
        for (let i = 0; i < arr.length; i++) {
            sum = sum + arr[i];
        }

        return sum;
    }

    /**
     * 深度(高度)递加
     * @param height 高度
     * @returns 递加结果
     */
    private DecreasingHeight(height: number): number {
        let sum: number = 0;
        for (let i = 0; i < height; i++) {
            sum = sum + (height - i);
        }
        return sum;
    }

    /**
     * 通过水平移动一个格子的位置是否存在方块
     * @param x X轴
     * @param y Y轴
     * @returns 是否存在方块
     */
    private IsHaveCubeToOneByHorizontal(x: number, y: number): boolean {
        if (x < 0 || x >= GameManager.Instance.Grid_Width) {
            return true;
        }
        let grid = GameManager.Instance.AIGame_Grid[y][x];
        if (grid) {
            return true
        }
        return false;
    }

    /**
     * 获取井的高度
     * @param x X轴
     * @param start_y 开始Y轴
     * @returns 井的高度
     */
    private GetWellHeight(x: number, start_y: number): number {
        let height: number = 0;
        for (let y = start_y; y < GameManager.Instance.AIGame_Grid.length; y++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            if (grid) {
                continue
            }

            if (x + 1 < GameManager.Instance.Grid_Width) {
                //右查找
                let grid_right = GameManager.Instance.AIGame_Grid[y][x + 1];
                if (!grid_right) {
                    return height;
                }
            }

            //左查找
            if (x - 1 >= 0) {
                let grid_Left = GameManager.Instance.AIGame_Grid[y][x - 1];
                if (!grid_Left) {
                    return height;
                }
            }
            height++;
        }

        return height;
    }

    /**
     * 获取行变换数
     * @returns 行变换数
     */
    private GetConversion_Row(): number {
        let count: number = 0;
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            let isFull = this.IsFullGrid_Simulation(y);
            if (isFull) {
                continue;
            }
            let isNull = this.IsNullGrid_Simulation(y);
            if (isNull) {
                continue;
            }
            let num = this.GetConversionRow_Count(0, y, true);
            count += num;
        }

        return count;
    }

    /**
     * 获取变换次数--->行
     * @param start_x 开始X轴
     * @param y Y轴
     * @param result 是否为空的结果
     */
    private GetConversionRow_Count(start_x: number, y: number, result: boolean): number {
        let count: number = 0;
        for (let x = start_x; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            let isNull: boolean = false;
            if (!grid) {
                isNull = true;
            }
            if (isNull === result) {
                count++;
                let num: number = this.GetConversionRow_Count(x + 1, y, !result);
                let sum = count + num;
                return sum;
            }
        }
        let sum: number = 0;
        if (!result) {
            sum = count + 1;
        }
        return sum;
    }

    /**
     * 获取列变换数
     * @returns 列变换数
     */
    private GetConversion_Line(): number {
        let count: number = 0;
        for (let x = 0; x < GameManager.Instance.Grid_Width; x++) {
            let isFull = this.IsFullGrid_Line(x);
            if (isFull) {
                continue;
            }

            let isNull = this.IsNullGrid_Line(x);
            if (isNull) {
                continue;
            }

            let num = this.GetConversionLine_Count(0, x, true);
            count += num;
        }

        return count;
    }

    /**
     * 是否为满员格子--->列
     * @param x X轴
     * @returns 是否为满员列
     */
    private IsFullGrid_Line(x: number): boolean {
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            if (!grid) {
                return false;
            }
        }
        return true;
    }

    /**
     * 是否为空格子--->列
     * @param x X轴
     * @returns 是否为空格列
     */
    private IsNullGrid_Line(x: number): boolean {
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            if (grid) {
                return false;
            }
        }
        return true;
    }

    /**
     * 获取变换次数--->列
     * @param start_y 开始Y轴
     * @param x X轴
     * @param result 是否为空的结果
     */
    private GetConversionLine_Count(start_y: number, x: number, result: boolean) {
        let count: number = 0;
        for (let y = start_y; y < GameManager.Instance.AIGame_Grid.length; y++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            let isNull: boolean = false;
            if (!grid) {
                isNull = true;
            }
            if (isNull === result) {
                count++;
                let num: number = this.GetConversionLine_Count(y + 1, x, !result);
                let sum = count + num;
                return sum;
            }
        }
        let sum: number = 0;
        if (!result) {
            sum = count + 1;
        }
        return sum;
    }

    /**
     * 通过Y轴查找X轴是否满员
     * @param y Y轴
     * @returns 是否满员
     */
    private IsFullGrid_Simulation(y: number): boolean {
        for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x]
            if (!grid) {
                return false;
            }
        }
        return true;
    }

    /**
     * 通过Y轴查找X轴是否为空行
     * @param y Y轴
     * @returns 是否为空行
     */
    private IsNullGrid_Simulation(y: number): boolean {
        for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x]
            if (grid) {
                return false;
            }
        }
        return true;
    }

    /**
     * 获取越界距离--->右
     */
    private GetDirRightX() {
        let arr_childs = this.node.children;
        let arr_x: number[] = [];
        for (let i = 0; i < arr_childs.length; i++) {
            let grid = arr_childs[i];
            let world_pos = this.node.convertToWorldSpaceAR(grid.position);
            let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
            if (node_pos.x > GameManager.Instance.Interval_AIValue * 10) {
                let x = Math.abs(node_pos.x);
                arr_x.push(x);
            }
        }

        if (arr_x.length <= 0) {
            return null;
        }

        let max_dir: number = arr_x[0];
        for (let i = 0; i < arr_x.length; i++) {
            if (max_dir < arr_x[i]) {
                max_dir = arr_x[i];
            }
        }

        return max_dir + GameManager.Instance.Interval_AIValue / 2;
    }

    /**
     * 获取越界距离--->左
     */
    private GetDirX(): number {
        let arr_childs = this.node.children;
        let arr_x: number[] = [];
        for (let i = 0; i < arr_childs.length; i++) {
            let grid = arr_childs[i];
            let world_pos = this.node.convertToWorldSpaceAR(grid.position);
            let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
            if (node_pos.x <= 0) {
                let x = Math.abs(node_pos.x);
                arr_x.push(x);
            }
        }

        if (arr_x.length <= 0) {
            return null;
        }

        let max_dir: number = arr_x[0];
        for (let i = 0; i < arr_x.length; i++) {
            if (max_dir < arr_x[i]) {
                max_dir = arr_x[i];
            }
        }

        return max_dir + GameManager.Instance.Interval_AIValue / 2;
    }

    /**
     * 下移
     */
    private MoveDown() {
        let ran = Math.floor(Math.random() * 100);
        if (ran <= 50) {
            GameManager.Instance.Click_AIFunManage = Click_FunManage.Up;
        } else {
            GameManager.Instance.Click_AIFunManage = Click_FunManage.Down;
        }
    }

    /**
     * 移动--->上：瞬间移动到底部
     */
    private MoveDirUp() {
        GameManager.Instance.Time_AIInterval = 0.00001;
        this.IsSpeedUp = true;
    }

    /**
     * 移动--->下
     */
    private MoveDirDown() {
        this.node.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_AIValue);
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_AIValue);
            this.ForbiddenScript();
        }
    }


    /**
    * 移动--->左
    * @returns 是否移动完成
    */
    private MoveDirLeft(): boolean {
        if (this.TheBestRoute.x < this.node.position.x) {
            this.node.setPosition(this.node.position.x - GameManager.Instance.Interval_AIValue, this.node.position.y);
        }
        // this.node.setPosition(this.node.position.x - GameManager.Instance.Interval_AIValue, this.node.position.y);
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.setPosition(this.node.position.x + GameManager.Instance.Interval_AIValue, this.node.position.y);
        }
        return
    }

    /**
    * 移动--->右
    * @returns 是否移动完成
    */
    private MoveDirRight(): boolean {
        if (this.TheBestRoute.x > this.node.position.x) {
            this.node.setPosition(this.node.position.x + GameManager.Instance.Interval_AIValue, this.node.position.y);
        }
        // this.node.setPosition(this.node.position.x + GameManager.Instance.Interval_AIValue, this.node.position.y);
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.setPosition(this.node.position.x - GameManager.Instance.Interval_AIValue, this.node.position.y);
        }
        return;
    }

    /**
     * 顺时针旋转
     */
    private RotateClockwise() {
        if (this.node.name === Cubes.CO) {
            return;
        }
        // console.log("预知方块为空------>6");
        // console.log(this.Cube_Foresee);
        this.node.rotation += 90;
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.rotation -= 90;
        }
        if (this.node.rotation >= 360) {
            this.node.rotation = 360;
        }
    }

    /**
     * 逆时针旋转
     */
    private RotateAnticlockwise() {
        if (this.node.name === Cubes.CO) {
            return;
        }
        // console.log("预知方块为空------>5");
        // console.log(this.Cube_Foresee);
        this.node.rotation -= 90;
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.rotation += 90;
        }
        if (this.node.rotation <= -360) {
            this.node.rotation = -360;
        }
    }

    /**
     * 是否为有效位置
     * @returns 位置是否有效
     */
    private IsValidGridPos(): boolean {
        let arr_child = this.node.children;
        for (let i = 0; i < arr_child.length; i++) {
            let child = arr_child[i];

            let world_pos = this.node.convertToWorldSpaceAR(child.position);
            let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
            // let pos = this.PosRound(node_pos);
            if (!this.IsBorder(node_pos)) {
                return false;
            }

            let y: number = Math.floor(node_pos.y / GameManager.Instance.Interval_AIValue);
            if (y <= 0) {
                y = 0;
            }
            if (y >= 20) {
                y = 19;
            }
            let x: number = Math.floor(node_pos.x / GameManager.Instance.Interval_AIValue);
            if (x <= 0) {
                x = 0;
            }
            // console.log(x + "<-----X轴");
            // console.log(y + "<-----Y轴");
            if (GameManager.Instance.AIGame_Grid[y][x] !== null && GameManager.Instance.AIGame_Grid[y][x].parent !== this.node) {
                return false;
            }
        }

        return true;
    }

    /**
     * 将位置坐标四舍五入为最接近的整数
     * @param pos 坐标位置
     * @returns 四舍五入后的坐标位置
     */
    private PosRound(pos: cc.Vec2): cc.Vec2 {
        let x = Math.floor(pos.x);
        let y = Math.floor(pos.y);
        let v2: cc.Vec2 = new cc.Vec2(x, y);
        return v2;
    }

    /**
     * 是否越出边界
     * @returns 是否越出边界
     */
    private IsBorder(pos: cc.Vec2): boolean {
        if (pos.x >= 0 && pos.x < this.Max_Width && pos.y >= 0) {
            return true;
        }
        return false;
    }

    /**
     * 更新游戏格子
     */
    private UpdateGameGrid() {
        //清除上一次方块所在格子二维数组中的位置
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
                let grid = GameManager.Instance.AIGame_Grid[y][x];
                if (grid && grid.parent === this.node) {
                    GameManager.Instance.AIGame_Grid[y][x] = null;
                }
            }
        }

        //更新方块现在在格子二维数组中的位置
        let arr: cc.Node[] = this.node.children;
        for (let i = 0; i < arr.length; i++) {
            let child = arr[i];
            let world_pos = this.node.convertToWorldSpaceAR(child.position);
            let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
            let pos = this.PosRound(node_pos);
            let x = Math.floor(pos.x / GameManager.Instance.Interval_AIValue);
            if (x <= 0) {
                x = 0;
            }
            let y = Math.floor(pos.y / GameManager.Instance.Interval_AIValue);
            if (y <= 0) {
                y = 0;
            }
            if (y >= 20) {
                y = 19;
            }
            GameManager.Instance.AIGame_Grid[y][x] = child;
        }
    }

    /**
     * 禁用脚本
     */
    private ForbiddenScript() {
        if (!this.IsStartGame) {
            return;
        }
        this.getComponent(Group).enabled = false;
        this.RemoveListenter();

        EventCenter.Broadcast(EventType.UpdateAIPointBegin);
        EventCenter.Broadcast(EventType.UpdateAIStandbyCube);
        GameManager.Instance.IsAISave = true;

        if (this.IsSpeedUp) {
            GameManager.Instance.Time_AIInterval = 0.2;
            this.IsSpeedUp = false;
        }
        this.RemoveParnet();
        this.ClearFullGridByRow();
        EventCenter.BroadcastOne(EventType.DestoryAIActtackCubeByNum, this.Continuous_Count);
        EventCenter.Broadcast(EventType.SetAIObstacleGrid);
        // console.log("预知方块为空------>4");
        // console.log(this.Cube_Foresee);
        // console.log(GameManager.Instance.AIGame_Grid);
    }

    /**
     * 从父节点中移除
     */
    private RemoveParnet() {
        let arr = this.node.children;
        for (let i = 0; i < arr.length; i++) {
            let child = arr[i];
            let world_pos = this.node.convertToWorldSpaceAR(child.position);
            let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
            child.removeFromParent(false);
            this.node.parent.addChild(child);
            child.setPosition(node_pos);
            i--;
        }
    }

    /**
     * 通过行清除满员格子
     */
    private ClearFullGridByRow() {
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            let isFull = this.IsFullGrid(y);
            if (isFull) {
                this.Continuous_Count++;
                this.ClearFullGrid(y);
                this.GridMove(y);
                y--;
                continue;
            }
        }
    }

    /**
     * 格子是否满员
     * @param y Y轴
     * @returns 是否满员
     */
    private IsFullGrid(y: number): boolean {
        for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            if (!grid) {
                return false;
            }
        }
        return true;
    }

    /**
     * 清除满员格子
     * @param y Y轴
     */
    private ClearFullGrid(y: number) {
        for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            grid.destroy();
            GameManager.Instance.AIGame_Grid[y][x] = null;
        }
    }

    /**
     * 格子下移
     * @param min_yy Y轴
     */
    private GridMove(min_y: number) {
        for (let y = min_y + 1; y < GameManager.Instance.AIGame_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
                let grid: cc.Node = GameManager.Instance.AIGame_Grid[y][x];
                if (grid !== null) {
                    GameManager.Instance.AIGame_Grid[y][x] = null;
                    GameManager.Instance.AIGame_Grid[y - 1][x] = grid;
                    grid.setPosition(grid.position.x, grid.position.y - GameManager.Instance.Interval_AIValue);
                }
            }
        }
    }
    //#endregion
}
