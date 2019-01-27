// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//阵营枚举导入
import { CampAllocation, Cmap } from "./common/EnumManageScript";
//阵营目标枚举导入
import { CampTarget } from "./common/EnumManageScript"
//导入脚本管理器
import ScriptManage from "./common/ScriptManageScript";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    //-----------------节点
    //玩家身份label
    @property(cc.Label)
    public Player_ID: cc.Label = null;
    //玩家目标label
    @property(cc.Label)
    public Player_Target: cc.Label = null;
    //指引页
    @property(cc.Node)
    public Guide_Page: cc.Node = null;
    //规则页
    @property(cc.Node)
    public Rule_Page: cc.Node = null;
    //暂停页
    @property(cc.Node)
    public Pause_Page: cc.Node = null;
    //失败页
    @property(cc.Node)
    public Failure_Page: cc.Node = null;
    //胜利页
    @property(cc.Node)
    public Victory_Page: cc.Node = null;
    //棋盘
    @property(cc.Node)
    public Chessboard: cc.Node = null;
    //背景音效开关
    @property(cc.Node)
    public Music_Show: cc.Node = null;
    //口
    @property(cc.Node)
    public Mouth: cc.Node = null;
    //-----------------音效
    //背景音效
    @property(cc.AudioSource)
    public BGM: cc.AudioSource = null;
    //-----------------预制体
    //光效
    @property(cc.Prefab)
    public Lighting: cc.Prefab = null;
    //选中框
    @property(cc.Prefab)
    public Checked_Box: cc.Prefab = null;
    //棋盘格子
    @property(cc.Prefab)
    public Grid: cc.Prefab = null;
    //羊牌
    @property(cc.Prefab)
    public Sheep: cc.Prefab = null;
    //狼牌
    @property([cc.Prefab])
    public Wolf: cc.Prefab[] = [];
    //-----------------属性
    //行
    @property
    public Row: number = 0;
    //列
    @property
    public Line: number = 0;
    //狼数量
    @property
    public Wolf_Num: number = 0;
    //羊数量
    @property
    public Sheep_Num: number = 0;
    //-----------------数组
    // LIFE-CYCLE CALLBACKS:
    //脚本管理器
    private ScriptManage: ScriptManage = null;
    //背景音效开关
    private BGM_Num: number = 0;
    //-----------------悔棋
    //玩家位置
    Undo_Player_Pos: cc.Vec2 = null;
    //玩家节点
    Undo_Player_Node: cc.Node = null;
    //被玩家回收的对象
    Undo_Player_Rec_Node: cc.Node = null;
    //AI位置
    Undo_AI_Pos: cc.Vec2 = null;
    //AI节点
    Undo_AI_Node: cc.Node = null;
    //被AI回收的对象
    Undo_AI_Rec_Node: cc.Node = null;
    //-------------AI
    //AI羊牌数组
    public AI_Sheep_Array: cc.Node[] = [];
    //AI狼牌数组
    public AI_Wolf_Array: cc.Node[] = [];
    //-------------Player
    //玩家-羊牌数组
    public Player_Sheep_Array: cc.Node[] = [];
    //玩家-狼牌数组
    public Player_Wolf_Array: cc.Node[] = [];
    //游戏状态
    public Game_Status: Cmap = Cmap.player;
    //阵营随机数组
    private Camp_Ran: number[] = [];
    //棋盘二维数组
    public Chessboard_Array: cc.Node[][] = [];
    onLoad() {
        let rul = cc.sys.localStorage.getItem("Rule");
        if (rul === "false") {
            this.Rule_Page.active = true;
            cc.sys.localStorage.setItem("Rule", "true");
        }
        //获取缓存
        let bgm = cc.sys.localStorage.getItem("Music");
        if (bgm === "开") {
            this.Music_Show.getChildByName("music_on").active = true;
            this.Music_Show.getChildByName("music_off").active = false;
            //播放音效
            this.BGM.play();
        }
        if (bgm === "关") {
            this.Music_Show.getChildByName("music_on").active = false;
            this.Music_Show.getChildByName("music_off").active = true;
            //暂停音效
            this.BGM.pause();
            this.BGM_Num = 2;
        }
    }

    start() {
        this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
        //初始化
        this.Init();
    }
    //初始化
    Init(): void {
        //阵营分配
        this.CampAllocation();
    }
    //阵营分配
    CampAllocation(): void {
        //取随机数
        for (let i = 0; i < CampAllocation.length; i++) {
            //随机数
            let ran = Math.floor(Math.random() * CampAllocation.length);
            let ind = this.Camp_Ran.indexOf(ran);
            if (ind === -1) {
                this.Camp_Ran.push(ran);
            } else {
                i--;
            }
        }
        //玩家身份
        this.Player_ID.string = CampAllocation[this.Camp_Ran[0]];
        //玩家目标
        this.Player_Target.string = CampTarget[this.Camp_Ran[0]];
        //阵营初始化
        this.ScriptManage.ChessboardManage.CmapInit(CampAllocation[this.Camp_Ran[0]]);
        //清空阵营随机数组
        this.Camp_Ran = [];
    }
    //坐标转换
    PosConversion(self: cc.Node, target: cc.Node, options: number): cc.Vec2 {
        let world_pos = self.parent.convertToWorldSpaceAR(self.position);
        let node_pos = target.parent.convertToNodeSpaceAR(world_pos);
        if (options === 0) {
            return world_pos
        }
        if (options === 1) {
            return node_pos;
        }
    }
    //获取棋牌坐标Y轴
    GetChessboardPos_y(target: cc.Node): number {
        for (let y = 0; y < this.ScriptManage.GameManage.Line; y++) {
            if (this.ScriptManage.GameManage.Chessboard_Array[y][0].position.y === target.position.y) {
                return y;
            }
        }
    }
    //悔棋
    UndoMod(): void {
        if (this.Game_Status === Cmap.player && this.Undo_Player_Node) {
            //AI
            this.UndoAI();
            //重置悔棋
            this.Undo_AI_Node = null;
            this.Undo_AI_Pos = null;
            this.Undo_AI_Rec_Node = null;
            this.Undo_Player_Node = null;
            this.Undo_Player_Pos = null;
            this.Undo_Player_Rec_Node = null;
        }
    }
    //AI悔棋
    UndoAI(): void {
        //需要返回棋盘的都节点
        let need_node: cc.Node = null;
        //对象池获取羊牌
        if (this.Undo_AI_Rec_Node.name === "yp") {
            need_node = this.ScriptManage.ChessboardManage.Sheep_Pool.get();
            need_node.getChildByName("speak").active = false;
            this.Player_Sheep_Array.push(need_node);
        }
        //对象池获取格子
        if (this.Undo_AI_Rec_Node.name === "grid") {
            need_node = this.ScriptManage.ChessboardManage.Grid_Pool.get();
        }
        this.Chessboard.addChild(need_node);
        //将回收节点放回原位置
        need_node.setPosition(this.Undo_AI_Node.position);
        //获取Y轴
        let undo_y = this.GetChessboardPos_y(this.Undo_AI_Node);
        //获取X轴
        let undo_x = this.Chessboard_Array[undo_y].indexOf(this.Undo_AI_Node);
        //将回收节点放回数组中原位置
        this.Chessboard_Array[undo_y].splice(undo_x, 1, need_node);
        //将节点返回原位置
        this.Undo_AI_Node.setPosition(this.Undo_AI_Pos);
        //获取原位置节点Y轴
        let rec_y = this.Get_YofPos(this.Undo_AI_Pos);
        //获取原位置节点X轴
        let rec_x = this.Get_XofPos(this.Undo_AI_Pos);
        //对象池回收格子
        this.ScriptManage.ChessboardManage.Grid_Pool.put(this.Chessboard_Array[rec_y][rec_x]);
        //将节点放回数组中原位置
        this.Chessboard_Array[rec_y].splice(rec_x, 1, this.Undo_AI_Node);
        //玩家
        this.UndoPlayer();
    }
    //玩家悔棋
    UndoPlayer(): void {
        //需要返回棋盘的都节点
        let need_node: cc.Node = null;
        //对象池获取羊牌
        if (this.Undo_Player_Rec_Node.name === "yp") {
            need_node = this.ScriptManage.ChessboardManage.Sheep_Pool.get();
            need_node.getChildByName("speak").active = false;
            this.AI_Sheep_Array.push(need_node);
        }
        //对象池获取格子
        if (this.Undo_Player_Rec_Node.name === "grid") {
            need_node = this.ScriptManage.ChessboardManage.Grid_Pool.get();
        }
        this.Chessboard.addChild(need_node);
        //将回收节点放回原位置
        need_node.setPosition(this.Undo_Player_Node.position);
        //获取Y轴
        let need_y = this.GetChessboardPos_y(this.Undo_Player_Node);
        //获取X轴
        let need_x = this.Chessboard_Array[need_y].indexOf(this.Undo_Player_Node);
        //将回收节点放回数组中原位置
        this.Chessboard_Array[need_y].splice(need_x, 1, need_node);
        //将节点返回原位置
        this.Undo_Player_Node.setPosition(this.Undo_Player_Pos);
        //获取原位置节点Y轴
        let ori_y = this.Get_YofPos(this.Undo_Player_Pos);
        //获取原位置节点X轴
        let ori_x = this.Get_XofPos(this.Undo_Player_Pos);
        //对象池回收格子
        this.ScriptManage.ChessboardManage.Grid_Pool.put(this.Chessboard_Array[ori_y][ori_x]);
        //将节点放回数组中原位置
        this.Chessboard_Array[ori_y].splice(ori_x, 1, this.Undo_Player_Node);
        //检测AI狼牌
        if (this.AI_Wolf_Array.length > 0) {
            //狼牌状态检测
            this.WolfStatusDetection(this.AI_Wolf_Array);
        }
        //检测玩家狼牌
        if (this.Player_Wolf_Array.length > 0) {
            //狼牌状态检测
            this.WolfStatusDetection(this.Player_Wolf_Array);
        }
    }
    //狼牌状态检测
    WolfStatusDetection(wolf_array: cc.Node[]): void {
        for (let i = 0; i < wolf_array.length; i++) {
            let islock_num: number = 0;
            //获取Y轴
            let y = this.GetChessboardPos_y(wolf_array[i]);
            //获取X轴
            let x = this.Chessboard_Array[y].indexOf(wolf_array[i]);
            //向上
            if (y + 1 >= this.Line || this.Chessboard_Array[y + 1][x].name != "grid") {
                islock_num++;
            }
            //向下
            if (y - 1 < 0 || this.Chessboard_Array[y - 1][x].name != "grid") {
                islock_num++;
            }
            //向右
            if (x + 1 >= this.Row || this.Chessboard_Array[y][x + 1].name != "grid") {
                islock_num++;
            }
            //向左
            if (x - 1 < 0 || this.Chessboard_Array[y][x - 1].name != "grid") {
                islock_num++;
            }
            let islock = wolf_array[i].getChildByName("suo").active;
            //解锁
            if (islock && islock_num < 4) {
                wolf_array[i].getChildByName("suo").active = false;
            }
        }
    }
    //根据位置获取Y轴
    Get_YofPos(pos: cc.Vec2) {
        for (let y = 0; y < this.Line; y++) {
            if (this.Chessboard_Array[y][0].position.y === pos.y) {
                return y;
            }
        }
    }
    //根据位置获取X轴
    Get_XofPos(pos: cc.Vec2) {
        for (let x = 0; x < this.Row; x++) {
            if (this.Chessboard_Array[0][x].position.x === pos.x) {
                return x;
            }
        }
    }
    //按钮管理
    ButtonManage(lv: any, name: string): void {
        //重新开始
        if (name === "resume") {
            cc.director.loadScene("GameScene");
        }
        //退出游戏
        if (name === "quit") {
            cc.director.loadScene("StartScene");
        }
        //悔棋
        if (name === "undo") {
            this.UndoMod();
        }
        if (name === "failure") {
            //暂停背景音效
            this.ScriptManage.GameManage.BGM.pause();
            //播放失败音效
            cc.audioEngine.play(this.ScriptManage.MusicManage.Failure_Audio, false, 1);
            this.Failure_Page.active = true;
        }
    }
    //显示
    Show(lv: any, name: string): void {
        //显示规则页
        if (name === "ruleshow") {
            this.Rule_Page.active = true;
        }
        //显示暂停页
        if (name === "pauseshow") {
            this.Pause_Page.active = true;
        }
    }
    //关闭
    Close(lv: any, name: string): void {
        //关闭指引页
        if (name === "guideclose") {
            this.Guide_Page.active = false;
        }
        //关闭规则页
        if (name === "ruleclose") {
            this.Rule_Page.active = false;
        }
        //关闭暂停页
        if (name === "pauseclose") {
            this.Pause_Page.active = false;
        }
    }
    //背景音效按钮
    MusicButton() {
        if (this.BGM_Num === 0) {
            this.Music_Show.getChildByName("music_on").active = false;
            this.Music_Show.getChildByName("music_off").active = true;
            //暂停音效
            this.BGM.pause();
            //修改缓存
            cc.sys.localStorage.setItem("Music", "关");
        }
        this.BGM_Num++;
        if (this.BGM_Num >= 2) {
            this.Music_Show.getChildByName("music_on").active = true;
            this.Music_Show.getChildByName("music_off").active = false;
            //播放音效
            this.BGM.play();
            //修改缓存
            cc.sys.localStorage.setItem("Music", "开");
            //重置背景音效开关
            this.BGM_Num = 0;
        }
    }
    // update (dt) {}
}