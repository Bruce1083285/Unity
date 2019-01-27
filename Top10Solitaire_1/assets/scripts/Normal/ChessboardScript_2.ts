import Normal from "./NormalScript ";



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
export default class Chessboard_2 extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    //主脚本
    private Game = null;
    //变更的花色
    private ChangeSuit = null;
    //牌组对象池
    private SuitPool: cc.NodePool = null;
    //二维数组——格子
    public GridArray = [];
    //相同节点位置
    public SamePos = [];
    //被消除目标位置
    public Erase_Target_Pos = [];
    //需要移动节点位置
    public Move_Node_Pos = [];
    onLoad() {
        this.Game = cc.find("Game").getComponent(Normal);
        //初始化
        this.Init();
    }

    start() {

    }
    //初始化 
    Init() {
        //实例化对象池
        this.SuitPool = new cc.NodePool();
        //初始化对象池
        this.InitSuitPool();
        //初始棋盘
        this.InitChessboard();
    }
    //初始花色对象池
    InitSuitPool() {
        for (let i = 0; i < this.Game.GridSuit.length; i++) {
            if (this.Game.SuitMax <= 3) {
                this.Game.SuitMax = 3;
            }
            let ran = Math.floor(Math.random() * this.Game.SuitMax);
            //难度控制
            Difficulty:
            if (ran > 3) {
                let bfb = Math.floor(Math.random() * 100);
                if (bfb > 80) {
                    break Difficulty;
                } else {
                    ran = Math.floor(Math.random() * 3);
                }
            }
            if (ran === this.Game.SuitMax) {
                ran -= 1;
            }
            let grid = cc.instantiate(this.Game.GridSuit[ran]);
            this.SuitPool.put(grid);
        }
    }
    //初始棋盘
    InitChessboard() {
        let pararr = [];
        //动态生成棋盘位置
        for (let y = 0; y < this.Game.Line; y++) {
            for (let x = 0; x < this.Game.Row; x++) {
                let grid = this.SuitPool.get();
                if (grid === null) {
                    this.InitSuitPool();
                    grid = this.SuitPool.get();
                }
                this.node.addChild(grid);
                pararr.push(grid);
                grid.setPosition(x * 107 + 53.5, y * 107 + 53.5);
            }
        }
        //二维数组
        for (let y = 0; y < this.Game.Line; y++) {
            let pa = pararr.slice(y * this.Game.Row, y * this.Game.Row + this.Game.Row);
            this.GridArray.push(pa);
        }
        //释放临时数组
        pararr = [];
    }
    //花色变更
    SuitChange(target) {
        let tar = parseInt(target.name);
        this.Game.SuitMax = tar;
        this.ChangeSuit = cc.instantiate(this.Game.GridSuit[tar]);
        this.node.addChild(this.ChangeSuit);
        this.ChangeSuit.setPosition(target.position);
        let y = this.Target_y(target);
        let x = this.GridArray[y].indexOf(target);
        //对象池回收不在使用的节点
        this.SuitPool.put(this.GridArray[y][x]);
        //删除数组中目标位置元素插入新元素
        this.GridArray[y].splice(x, 1, this.ChangeSuit);
        this.Game.VictoryFun(this.ChangeSuit);
        // if (tar > 3) {
        //     //百分比
        //     let bfb = Math.floor(Math.random() * 100);
        //     if (bfb < 30) {
        //         //小王道具增加
        //         this.Game.kinglet_num++;
        //         this.Game.KingLet.string = this.Game.kinglet_num + "";
        //         //大王道具增加
        //         this.Game.king_num++;
        //         this.Game.King.string = this.Game.king_num + "";
        //     }
        // }
        return this.ChangeSuit;
    }
    //目标y轴
    Target_y(target) {
        for (let y = 0; y < this.Game.Line; y++) {
            for (let x = 0; x < this.Game.Row; x++) {
                //判断是否为空
                if (this.GridArray[y][x] === null) {
                    continue;
                }
                let dis = cc.pDistance(this.GridArray[y][x].position, target.position);
                if (Math.abs(dis) <= 1) {
                    return y;
                }
            }
        }
    }
    //目标点向下扫描
    TargetDown(target) {
        let start_y = this.Target_y(target);
        let start_x = this.GridArray[start_y].indexOf(target);
        for (let y = start_y - 1; y >= 0; y--) {
            if (this.GridArray[y][start_x].name !== target.name) {
                let dis = cc.pDistance(this.GridArray[y + 1][start_x].position, target.position);
                if (Math.abs(dis) <= 1) {
                    return false;
                }
                return this.GridArray[y + 1][start_x];
            } else {
                if (y === 0) {
                    return this.GridArray[y][start_x];
                }
            }
        }
    }
    //移除数组中相同节点
    RemoveNode(arr) {
        //遍历相同节点数组
        for (let i = 0; i < arr.length; i++) {
            //遍历整个牌组
            for (let y = 0; y < this.Game.Line; y++) {
                for (let x = 0; x < this.Game.Row; x++) {
                    //为空跳出本次循环开始下次循环
                    if (this.GridArray[y][x] === null) {
                        continue;
                    }
                    let dis = cc.pDistance(arr[i].position, this.GridArray[y][x].position);
                    if (Math.abs(dis) <= 1) {
                        this.Erase_Target_Pos.push(arr[i].position);
                        this.GridArray[y].splice(x, 1, null);
                    }
                }
            }
        }
    }
    //过滤数组
    FilterArray() {
        for (let i = 0; i < this.Erase_Target_Pos.length; i++) {
            for (let j = 0; j < this.Erase_Target_Pos.length; j++) {
                let dis = cc.pDistance(this.Erase_Target_Pos[i], this.Erase_Target_Pos[j]);
                if (Math.abs(dis) <= 1) {
                    continue;
                }
                if (this.Erase_Target_Pos[i].x === this.Erase_Target_Pos[j].x) {
                    //移除最大值
                    if (this.Erase_Target_Pos[i].y < this.Erase_Target_Pos[j].y) {
                        this.Erase_Target_Pos.splice(j, 1);
                        //重置j
                        j--;
                    } else {
                        this.Erase_Target_Pos.splice(i, 1);
                        //重置i
                        i--;
                        break;
                    }
                }
            }
        }
        return this.Erase_Target_Pos;
    }
    //找出每列需要移动的节点
    SelectMoveNode(pos) {
        //临时数组
        let patchArray = [];
        for (let x = 0; x < this.Game.Row; x++) {
            if (this.GridArray[9][x] === null) {
                continue;
            }
            if (this.GridArray[9][x].position.x === pos.x) {
                for (let y = 0; y < this.Game.Line; y++) {
                    if (this.GridArray[y][x] !== null && this.GridArray[y][x].position.y > pos.y) {
                        this.Move_Node_Pos.push(this.GridArray[y][x].position);
                        patchArray.push(this.GridArray[y][x]);
                    }
                }
            }
        }
        return patchArray;
    }
    //找出每列移动的节点在数组中的位置
    ArrayPos_x(pos) {
        for (let x = 0; x < this.Game.Row; x++) {
            if (this.GridArray[9][x] === null) {
                continue;
            }
            if (this.GridArray[9][x].position.x === pos.x) {
                return x;
            }
        }
    }
    ArrayPos_y(x, isprop?: boolean) {
        for (let y = 0; y < this.Game.Row; y++) {
            if (isprop) {
                return 0;
            }
            if (this.GridArray[y][x] === null) {
                return y;
            }
        }
    }
    //每列下移节点从数组中移除
    RemoveArrayLineNode(arr, x) {
        for (let i = 0; i < arr.length; i++) {
            for (let y = 0; y < this.Game.Line; y++) {
                if (this.GridArray[y][x] === null) {
                    continue;
                }
                let dis = cc.pDistance(arr[i].position, this.GridArray[y][x].position);
                if (Math.abs(dis) <= 1) {
                    this.GridArray[y].splice(x, 1, null);
                }
            }
        }
    }
    //重组数组
    ReorganizationArray() {
        for (let x = 0; x < this.Game.Row; x++) {
            for (let y = 5; y < this.Game.Line; y++) {
                if (this.GridArray[y][x] === null) {
                    let grid = this.SuitPool.get();
                    if (grid === null) {
                        this.InitSuitPool();
                        grid = this.SuitPool.get();
                    }
                    this.node.addChild(grid);
                    this.GridArray[y][x] = grid;
                    grid.setPosition(this.GridArray[y - 1][x].position.x, this.GridArray[y - 1][x].position.y + 100);
                }
            }
        }
    }
    // update (dt) {}
}
