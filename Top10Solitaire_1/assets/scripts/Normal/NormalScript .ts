import Chessboard_2 from "./ChessboardScript_2";
import Rulestodetermine from "../RulestodetermineScript";
import Success from "../Rulestodetermine/SuccessScript";
import Failure from "../Rulestodetermine/FailureScript";

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
export default class Normal extends cc.Component {

    //___________________节点
    //关卡选择
    @property(cc.Node)
    public SelectionLevelPage: cc.Node = null;
    //关卡数
    @property(cc.Label)
    public LevelNum_Label: cc.Label = null;
    //目标分数
    @property(cc.Label)
    public Target_Score_Label: cc.Label = null;
    //分数
    @property(cc.Label)
    public Score_Label: cc.Label = null;
    //道具-小王label
    @property(cc.Label)
    public KingLet: cc.Label = null;
    //道具-大王label
    @property(cc.Label)
    public King: cc.Label = null;
    //胜利分数
    @property(cc.Label)
    public Victory_Score_Label: cc.Label = null;
    //失败分数
    @property(cc.Label)
    public Failure_Score_Label: cc.Label = null;
    //背景音乐
    @property(cc.Node)
    public BGMusic: cc.Node = null;
    //新手指引页
    @property(cc.Node)
    public NovicePage: cc.Node = null;
    //规则页
    @property(cc.Node)
    public RulePage: cc.Node = null;
    //胜利页
    @property(cc.Node)
    public VictoryPage: cc.Node = null;
    //失败页
    @property(cc.Node)
    public FailurePage: cc.Node = null;
    //___________________音效
    //背景音效
    @property(cc.AudioSource)
    public BGM: cc.AudioSource = null;
    //点击音效
    @property({ url: cc.AudioClip })
    public ClickAudio: string = null;
    //失败音效
    @property({ url: cc.AudioClip })
    public FailureAudio: string = null;
    //胜利音效
    @property({ url: cc.AudioClip })
    public victoryAudio: string = null;
    //___________________属性
    //列
    @property
    public Line: number = 0;
    //行
    @property
    public Row: number = 0;
    //初始花色最大值
    @property
    public SuitMax: number = 0;
    //___________________数组
    //格子预制体
    @property([cc.Prefab])
    public GridSuit: cc.Prefab[] = [];
    //关卡
    @property([cc.Node])
    public LevelArray: cc.Node[] = [];
    // LIFE-CYCLE CALLBACKS:
    //道具按钮开关
    private Prop_Show: boolean = true;
    //道具-小王数量
    private kinglet_num: number = 0;
    //道具-大王数量
    private king_num: number = 0;
    //关卡数
    private Level_Num = 0;
    //棋盘管理
    private ChessBoard = null;
    //成功判定
    private Success: Rulestodetermine = null;
    //失败判定
    private Failure: Rulestodetermine = null;
    //判定结果
    private DetermineResults: boolean = null;
    //背景音乐开关
    private BGMShow = 0;
    onLoad() {
        let level = cc.sys.localStorage.getItem("NormalLevel");
        if (level !== null) {
            for (let i = 0; i < this.LevelArray.length; i++) {
                let la = parseInt(this.LevelArray[i].name);
                let le = parseInt(level);
                if (la <= le) {
                    //关闭锁
                    this.LevelArray[i].getChildByName("lock").active = false;
                    //开启关卡数
                    this.LevelArray[i].getChildByName("level").active = true;
                }
            }
        } else { }
        let show = cc.sys.localStorage.getItem("Music");
        if (show === "开") {
            this.BGM.play();
            this.BGMusic.getChildByName("yinyuekai").active = true;
            this.BGMusic.getChildByName("yinyueguan").active = false;
        }
        if (show === "关") {
            this.BGM.pause();
            this.BGMusic.getChildByName("yinyuekai").active = false;
            this.BGMusic.getChildByName("yinyueguan").active = true;
            this.BGMShow = 2;
        }
        // //判断是否第一次进入游戏
        // let rulesh = cc.sys.localStorage.getItem("Rule");
        // if (rulesh === null) {
        //     this.RulePage.active = true;
        // }
        //获取棋盘管理
        this.ChessBoard = cc.find("/Canvas/Chessboard/Chessboard").getComponent(Chessboard_2);
        //初始化
        //this.Init();
    }
    //初始化
    Init() {
        //成功判定实例化
        this.Success = new Success(this.Line, this.Row, this.ChessBoard.GridArray);
        //失败判定实例化
        this.Failure = new Failure(this.Line, this.Row, this.ChessBoard.GridArray);
        //初始化触摸监听
        this.TouchOn();
    }
    start() {

    }
    //注册触摸监听
    TouchOn() {
        for (let y = 0; y < this.Line; y++) {
            for (let x = 0; x < this.Row; x++) {
                this.ChessBoard.GridArray[y][x].on(cc.Node.EventType.TOUCH_START, this.TouchBegin, this);
            }
        }
    }
    TouchOff() {
        for (let y = 0; y < this.Line; y++) {
            for (let x = 0; x < this.Row; x++) {
                this.ChessBoard.GridArray[y][x].off(cc.Node.EventType.TOUCH_START, this.TouchBegin, this);
            }
        }
    }
    //触摸开始
    TouchBegin(event) {
        //播放点击音效
        cc.audioEngine.play(this.ClickAudio, false, 1);
        //成功判定
        let arr = this.Success.Determine(event.target);
        if (arr.length <= 0) {
            return;
        }
        this.TouchOff();
        //清空成功判定中相同获取数组
        this.Success.SameAcquire = [];
        //目标点操作
        this.TargetOperations(arr, event.target);
    }
    //目标点操作
    TargetOperations(arr, target) {
        //分数
        let score = parseInt(this.Score_Label.string);
        score = score + arr.length;
        this.Score_Label.string = score + "";
        //向下扫描
        let targetNode = this.ChessBoard.TargetDown(target)
        //变更花色
        let newNode = this.ChessBoard.SuitChange(target);
        //花色变更后节点下移
        if (targetNode) {
            //移除数组中触摸点位置
            for (let y = 0; y < this.Line; y++) {
                for (let x = 0; x < this.Row; x++) {
                    let dis = cc.pDistance(this.ChessBoard.GridArray[y][x].position, newNode.position);
                    if (Math.abs(dis) <= 1) {
                        this.ChessBoard.Erase_Target_Pos.push(newNode.position);
                        this.ChessBoard.GridArray[y].splice(x, 1, null);
                    }
                }
            }
            //移除数组中下移目标点位置
            let tar = arr.indexOf(targetNode);
            arr.splice(tar, 1);
            newNode.runAction(cc.moveTo(0.1, targetNode.position));
            //修改花色变更后节点坐标
            this.scheduleOnce(function () {
                //修改节点坐标
                newNode.setPosition(targetNode.position);
                //移除数组中相同节点
                this.ChessBoard.RemoveNode(arr);
                //上方需要下移的列
                this.TopMoveLine();
                //数组坐标下移的列
                this.ArrayMoveLine();
            }, 0.1);
            let target_y = this.ChessBoard.Target_y(targetNode);
            let target_x = this.ChessBoard.GridArray[target_y].indexOf(targetNode);
            //移除节点插入花色变更后的节点
            this.ChessBoard.GridArray[target_y].splice(target_x, 1, newNode);
            //对象池回收节点
            this.ChessBoard.SuitPool.put(targetNode);
        } else {
            let newno = arr.indexOf(target);
            arr.splice(newno, 1);
            //移除数组中相同节点
            this.ChessBoard.RemoveNode(arr);
            //上方需要下移的列
            this.TopMoveLine();
            //数组坐标下移的列
            this.ArrayMoveLine()
        }
        //移除相同节点
        for (let i = 0; i < arr.length; i++) {
            //对象池回收节点
            this.ChessBoard.SuitPool.put(arr[i]);
        }
    }
    //上方需要下移的列
    TopMoveLine() {
        let moveline_pos = this.ChessBoard.FilterArray();
        for (let i = 0; i < moveline_pos.length; i++) {
            let moveline = this.ChessBoard.SelectMoveNode(moveline_pos[i]);
            for (let j = 0; j < moveline.length; j++) {
                moveline[j].runAction(cc.sequence(cc.moveTo(0.2, moveline_pos[i].x, 107 * j + moveline_pos[i].y), cc.callFunc(() => {
                    //数组重组
                    this.ChessBoard.ReorganizationArray();
                    //失败判定
                    let fai = this.Failure.Determine();
                    if (fai) {
                        //关闭背景音乐
                        this.BGM.pause();
                        //播放失败音效
                        cc.audioEngine.play(this.FailureAudio, false, 1);
                        this.FailurePage.active = true;
                        //失败分数存储
                        this.Failure_Score_Label.string = this.Score_Label.string;
                        return;
                    }
                    this.Prop_Show = true;
                    this.TouchOn();
                })));
            }
        }
    }
    //数组坐标下移的列
    ArrayMoveLine(isprop?: boolean) {
        let moveline_pos = this.ChessBoard.Erase_Target_Pos;
        //清空位置数组
        this.ChessBoard.Erase_Target_Pos = [];
        for (let i = 0; i < moveline_pos.length; i++) {
            let moveline = this.ChessBoard.SelectMoveNode(moveline_pos[i]);
            let start_x = this.ChessBoard.ArrayPos_x(moveline_pos[i]);
            let start_y = this.ChessBoard.ArrayPos_y(start_x, isprop);
            this.ChessBoard.RemoveArrayLineNode(moveline, start_x);
            for (let j = 0; j < moveline.length; j++) {
                let y = 1 * j + start_y;
                this.ChessBoard.GridArray[y].splice(start_x, 1, moveline[j]);
            }
        }
    }
    //胜利
    VictoryFun(target) {
        let score = parseInt(this.Score_Label.string);
        let target_score = parseInt(this.Target_Score_Label.string);
        //胜利分数存储
        this.Victory_Score_Label.string = this.Score_Label.string
        if (target.name === "10" || score >= target_score) {
            //关闭背景音乐
            this.BGM.pause();
            //播放胜利音效
            cc.audioEngine.play(this.victoryAudio, false, 1);
            this.TouchOff();
            this.VictoryPage.active = true;
        }
    }
    //关闭关卡选择页
    Cloese(lv: any, num: string) {
        // //重置小王道具
        // this.kinglet_num = 0;
        // this.KingLet.string = this.kinglet_num + "";
        // //重置大王道具
        // this.king_num = 0;
        // this.King.string = this.king_num + "";
        this.Level_Num = parseInt(num);
        //关卡执行
        this.LevelExecution(this.Level_Num);
    }
    //关卡选择执行
    LevelExecution(levelNum) {
        this.LevelNum_Label.string = levelNum + "";
        //目标分数
        this.Target_Score_Label.string = 60 + (levelNum - 1) * 20 + "";
        this.Score_Label.string = 0 + "";
        //胜利页关闭
        this.VictoryPage.active = false;
        //失败页关闭
        this.FailurePage.active = false;
        //关闭关卡选择页
        this.SelectionLevelPage.active = false;
        //注销原有触摸监听
        this.TouchOff();
        //对象池回收节点
        for (let y = 0; y < this.Line; y++) {
            for (let x = 0; x < this.Row; x++) {
                this.ChessBoard.SuitPool.put(this.ChessBoard.GridArray[y][x]);
            }
        }
        //清空对象池
        this.ChessBoard.SuitPool.clear();
        //重置二维数组
        this.ChessBoard.GridArray = [];
        //初始化棋盘
        this.ChessBoard.InitChessboard();
        //初始化
        this.Init();
    }
    //返回
    BackPage() {
        let show = cc.sys.localStorage.getItem("Music");
        if (show === "关") {
            this.BGM.pause();
        }
        if (show === "开") {
            //播放背景音乐
            this.BGM.play();
        }
        this.TouchOff();
        this.VictoryPage.active = false;
        this.LevelDetection();
        this.SelectionLevelPage.active = true;
    }
    //下一关
    NextLevelFun() {
        // //重置小王道具
        // this.kinglet_num = 0;
        // this.KingLet.string = this.kinglet_num + "";
        // //重置大王道具
        // this.king_num = 0;
        // this.King.string = this.king_num + "";
        let show = cc.sys.localStorage.getItem("Music");
        if (show === "关") {
            this.BGM.pause();
        }
        if (show === "开") {
            //播放背景音乐
            this.BGM.play();
        }
        this.VictoryPage.active = false;
        this.Level_Num += 1;
        this.LevelNum_Label.string = this.Level_Num + "";
        this.LevelExecution(this.Level_Num);
    }
    BackMainScene() {
        cc.director.loadScene("StartScene");
    }
    //规则显示
    RuleShow() {
        this.RulePage.active = true;
    }
    //规则关闭
    RuleClose() {
        this.RulePage.active = false;
    }
    //新手指引关闭
    NoviceClose() {
        this.NovicePage.active = false;
    }
    //音乐开关
    MusicShow() {
        if (this.BGMShow === 0) {
            this.BGMusic.getChildByName("yinyueguan").active = true;
            this.BGMusic.getChildByName("yinyuekai").active = false;
            this.BGM.pause();
            cc.sys.localStorage.setItem("Music", "关");
        }
        this.BGMShow++;
        if (this.BGMShow >= 2) {
            this.BGMusic.getChildByName("yinyueguan").active = false;
            this.BGMusic.getChildByName("yinyuekai").active = true;
            this.BGM.play();
            cc.sys.localStorage.setItem("Music", "开");
            this.BGMShow = 0;
        }
    }
    //关卡检测
    LevelDetection() {
        cc.sys.localStorage.setItem("NormalLevel", this.Level_Num);
        for (let i = 0; i < this.LevelArray.length; i++) {
            let level = parseInt(this.LevelArray[i].name);
            if (level <= this.Level_Num) {
                //关闭锁
                this.LevelArray[i].getChildByName("lock").active = false;
                //开启关卡数
                this.LevelArray[i].getChildByName("level").active = true;
            }
        }
    }
    // //道具-小王按钮
    // PropsButton(lv: any, name: string) {
    //     if (this.Prop_Show) {
    //         if (name === "kinglet") {
    //             if (this.kinglet_num > 0) {
    //                 this.Prop_Show = false;
    //                 this.kinglet_num--;
    //                 this.KingLet.string = this.kinglet_num + "";
    //                 //播放点击音效
    //                 cc.audioEngine.play(this.ClickAudio, false, 1);
    //                 this.SelectMinCount();
    //             }
    //         }
    //         if (name === "king") {
    //             if (this.king_num > 0) {
    //                 this.Prop_Show = false;
    //                 this.king_num--;
    //                 this.King.string = this.king_num + "";
    //                 //播放点击音效
    //                 cc.audioEngine.play(this.ClickAudio, false, 1);
    //                 this.SelectRandomNodeLine();
    //             }
    //         }
    //     }
    // }
    // //小王道具实现——查找底部点数最小的牌
    // SelectMinCount() {
    //     //最小点数
    //     let mincount = parseInt(this.ChessBoard.GridArray[0][0].name);
    //     //最小点数的节点
    //     let minnode = this.ChessBoard.GridArray[0][0];
    //     //最小点数数组
    //     let mincountArray = [];
    //     for (let x = 0; x < this.ChessBoard.GridArray[0].length; x++) {
    //         let x_count = parseInt(this.ChessBoard.GridArray[0][x].name);
    //         if (mincount > x_count) {
    //             mincount = x_count;
    //             minnode = this.ChessBoard.GridArray[0][x];
    //         }
    //     }
    //     //获取底部所有最小节点
    //     for (let x = 0; x < this.ChessBoard.GridArray[0].length; x++) {
    //         let x_count = parseInt(this.ChessBoard.GridArray[0][x].name);
    //         if (mincount === x_count) {
    //             mincountArray.push(this.ChessBoard.GridArray[0][x]);
    //             this.ChessBoard.Erase_Target_Pos.push(this.ChessBoard.GridArray[0][x].position);
    //             this.ChessBoard.GridArray[0].splice(x, 1, null);
    //         }
    //     }
    //     //上方需要下移的列
    //     this.TopMoveLine();
    //     //数组坐标下移的列
    //     this.ArrayMoveLine();
    //     //对象池回收节点
    //     for (let i = 0; i < mincountArray.length; i++) {
    //         this.ChessBoard.SuitPool.put(mincountArray[i]);
    //     }
    //     //分数
    //     let score = parseInt(this.Score_Label.string);
    //     score = score + mincountArray.length;
    //     this.Score_Label.string = score + "";
    // }
    // //大王道具实现-随机一个节点查找该节点列
    // SelectRandomNodeLine() {
    //     let ran_x = Math.floor(Math.random() * this.Row);
    //     this.ChessBoard.Erase_Target_Pos.push(this.ChessBoard.GridArray[0][ran_x].position);
    //     let line_array = [];
    //     for (let y = 0; y < this.Row; y++) {
    //         line_array.push(this.ChessBoard.GridArray[y][ran_x]);
    //         this.ChessBoard.GridArray[y].splice(ran_x, 1, null);
    //     }
    //     //上方需要下移的列
    //     this.TopMoveLine();
    //     //数组坐标下移的列
    //     this.ArrayMoveLine();
    //     // //对象池回收节点
    //     for (let i = 0; i < line_array.length; i++) {
    //         this.ChessBoard.SuitPool.put(line_array[i]);
    //     }
    //     //分数
    //     let score = parseInt(this.Score_Label.string);
    //     score = score + line_array.length;
    //     this.Score_Label.string = score + "";
    // }
    // update (dt) {}
}
