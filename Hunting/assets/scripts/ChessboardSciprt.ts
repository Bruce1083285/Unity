import ScriptManage from "./common/ScriptManageScript";

//导入脚本管理层


// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Chessboard extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    //脚本管理器
    private ScriptManage: ScriptManage = null;
    //格子对象池
    public Grid_Pool: cc.NodePool = null;
    //羊牌对象池
    public Sheep_Pool: cc.NodePool = null;
    //狼牌对象池
    public Wolf_Pool: cc.NodePool = null;
    //选中框对象池
    public Checked_Pool: cc.NodePool = null;
    //光效对象池
    public Lighting_Pool: cc.NodePool = null;
    start() {
        this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
        //初始化
        this.Init();
    }
    //初始化
    Init(): void {
        //实例化获取格子
        this.Grid_Pool = new cc.NodePool();
        //实例化获取羊牌对象池
        this.Sheep_Pool = new cc.NodePool();
        //实例化获取狼牌对象池
        this.Wolf_Pool = new cc.NodePool();
        //选中框对象池
        this.Checked_Pool = new cc.NodePool();
        //光效对象池
        this.Lighting_Pool = new cc.NodePool();
        //初始化存储对象池
        this.PoolStore();
        //初始化桌面
        this.ChessboardCreate();
    }
    //对象池
    PoolStore(): void {
        //获取格子对象池
        this.GetGridPool();
        //获取羊牌对象池
        this.GetSheepPool();
        //获取狼牌对象池
        this.GetWolfPool();
        //获取选中框对象池
        this.GetCheckedPool();
        //获取光效对象池
        this.GetLightingPool();
    }
    //获取光效对象池
    GetLightingPool() {
        for (let i = 0; i < 5; i++) {
            let light = cc.instantiate(this.ScriptManage.GameManage.Lighting);
            this.Lighting_Pool.put(light);
        }
    }
    //获取选中框对象池
    GetCheckedPool() {
        for (let i = 0; i < 5; i++) {
            let chec_box = cc.instantiate(this.ScriptManage.GameManage.Checked_Box);
            this.Checked_Pool.put(chec_box);
        }
    }
    //获取格子对象池
    GetGridPool(): void {
        for (let y = 0; y < this.ScriptManage.GameManage.Line; y++) {
            for (let x = 0; x < this.ScriptManage.GameManage.Row; x++) {
                let grid = cc.instantiate(this.ScriptManage.GameManage.Grid);
                //注册事件
                this.ScriptManage.EventManage.TouchOn(grid);
                this.Grid_Pool.put(grid);
            }
        }
    }
    //获取羊牌对象池
    GetSheepPool(): void {
        for (let i = 0; i < this.ScriptManage.GameManage.Sheep_Num; i++) {
            let sheep = cc.instantiate(this.ScriptManage.GameManage.Sheep);
            //注册事件
            this.ScriptManage.EventManage.TouchOn(sheep);
            this.Sheep_Pool.put(sheep);
        }
    }
    //获取狼牌对象池
    GetWolfPool(): void {
        for (let i = 0; i < this.ScriptManage.GameManage.Wolf_Num; i++) {
            let wolf = cc.instantiate(this.ScriptManage.GameManage.Wolf[i]);
            //注册事件
            this.ScriptManage.EventManage.TouchOn(wolf);
            this.Wolf_Pool.put(wolf);
        }
    }
    //桌面生成
    ChessboardCreate(): void {
        //临时数组
        let patch_array = [];
        for (let y = 0; y < this.ScriptManage.GameManage.Line; y++) {
            for (let x = 0; x < this.ScriptManage.GameManage.Row; x++) {
                //获取格子
                let grid = this.Grid_Pool.get();
                if (!grid) {
                    //获取格子对象池
                    this.GetGridPool();
                    grid = this.Grid_Pool.get();
                }
                this.node.addChild(grid);
                patch_array.push(grid);
                grid.setPosition(x * 107 + 53.5, y * 105 + 52.5);
            }
            this.ScriptManage.GameManage.Chessboard_Array.push(patch_array);
            //清空临时数组
            patch_array = [];
        }
    }
    //阵营初始化
    CmapInit(player_id: string): void {
        if (player_id === "wolf") {
            //玩家-狼牌位置分配
            this.ScriptManage.GameManage.Player_Wolf_Array = this.WolfAllocation(Math.floor((this.ScriptManage.GameManage.Row - 1) / 2), 0);
            //AI-羊牌位置分配
            this.ScriptManage.GameManage.AI_Sheep_Array = this.SheepAllocation(0, this.ScriptManage.GameManage.Line - 2);
        }
        if (player_id === "sheep") {
            //玩家-羊位置分配
            this.ScriptManage.GameManage.Player_Sheep_Array = this.SheepAllocation(0, 0);
            //AI-狼位置分配
            this.ScriptManage.GameManage.AI_Wolf_Array = this.WolfAllocation(Math.floor((this.ScriptManage.GameManage.Row - 1) / 2), this.ScriptManage.GameManage.Line - 1);
        }
    }
    //狼牌位置分配
    WolfAllocation(start_x: number, start_y: number): cc.Node[] {
        //临时数组
        let patch_array: cc.Node[] = [];
        for (let x = start_x; x <= start_x + 1; x++) {
            //获取狼牌
            let wolf = this.Wolf_Pool.get();
            if (!wolf) {
                //获取狼牌对象池
                this.GetWolfPool();
                wolf = this.Wolf_Pool.get();
            }
            this.node.addChild(wolf);
            //设置位置
            wolf.setPosition(this.ScriptManage.GameManage.Chessboard_Array[start_y][x].position);
            //格子对象池回收节点
            this.Grid_Pool.put(this.ScriptManage.GameManage.Chessboard_Array[start_y][x]);
            //二维坐标添加狼牌
            this.ScriptManage.GameManage.Chessboard_Array[start_y].splice(x, 1, wolf);
            patch_array.push(wolf);
        }
        return patch_array;
    }
    //羊牌位置分配
    SheepAllocation(start_x: number, start_y: number): cc.Node[] {
        //临时数组
        let patch_array: cc.Node[] = [];
        for (let y = start_y; y <= start_y + 1; y++) {
            for (let x = start_x; x < this.ScriptManage.GameManage.Row; x++) {
                //获取羊牌
                let sheep = this.Sheep_Pool.get();
                if (!sheep) {
                    //获取羊牌对象池
                    this.GetSheepPool();
                    sheep = this.Wolf_Pool.get();
                }
                this.node.addChild(sheep);
                sheep.setPosition(this.ScriptManage.GameManage.Chessboard_Array[y][x].position);
                //格子对象池回收节点
                this.Grid_Pool.put(this.ScriptManage.GameManage.Chessboard_Array[y][x]);
                //二维坐标添加羊牌
                this.ScriptManage.GameManage.Chessboard_Array[y].splice(x, 1, sheep);
                patch_array.push(sheep);
            }
        }
        return patch_array;
    }

    // update (dt) {}
}
//export let chessboard = new Chessboard();