import ScriptManage from "../common/ScriptManageScript";
//导入枚举
import { PlayerNo, SoundType } from "../common/EnumManageScript";

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
export default class Game extends cc.Component {

    //----------------------节点
    /**
     * @property 规则页
     */
    @property(cc.Node)
    public Rule_Page: cc.Node = null;
    /**
     * @property 结束页
     */
    @property(cc.Node)
    public Over_Page: cc.Node = null;
    /**
     * @property 结束页标题
     */
    @property(cc.Node)
    public Over_Title: cc.Node = null;
    /**
     * @property 结束页分数
     */
    @property(cc.Label)
    public Over_Score: cc.Label = null;
    /**
     * @property 牌堆
     */
    @property(cc.Node)
    public Cards_Pile: cc.Node = null;
    /**
     * @property 牌堆数记录
     */
    @property(cc.Label)
    public Cards_Pile_Record: cc.Label = null;
    /**
     * @property 公共区域
     */
    @property(cc.Node)
    public Cards_Common: cc.Node = null;
    /**
     * @property 玩家1
     */
    @property(cc.Node)
    public Player_1: cc.Node = null;
    /**
     * @property 玩家2——AI
     */
    @property(cc.Node)
    public Player_2: cc.Node = null;
    /**
     * @property 玩家3——AI
     */
    @property(cc.Node)
    public Player_3: cc.Node = null;
    /**
     * @property 分数
     */
    @property(cc.Label)
    public Score: cc.Label = null;
    /**
     * @property 计分板
     */
    @property(cc.Node)
    public Scoreboard_Box: cc.Node = null;
    //----------------------音效
    /**
     * @property 按钮音效
     */
    @property({ url: cc.AudioClip })
    public Button_Audio: string = null;
    /**
     * @property 出牌音效
     */
    @property({ url: cc.AudioClip })
    public Play_Audio: string = null;
    /**
     * @property 发牌音效
     */
    @property({ url: cc.AudioClip })
    public Deal_Audio: string = null;
    /**
     * @property 背景音效
     */
    @property(cc.AudioSource)
    public BGM: cc.AudioSource = null;
    //----------------------预制体
    /**
     * @property 卡牌
     */
    @property(cc.Prefab)
    public Card: cc.Prefab = null;
    //----------------------组件属性
    /**
     * @property 卡牌总数
     */
    @property
    public Cards_Sum: number = 0;
    /**
     * @property 玩家手牌数
     */
    @property
    public Player_Cards_Num: number = 0;
    /**组件属性
     * @property 牌堆数
     */
    @property
    public Cards_Pile_Num: number = 0;
    /**
     * @property 公共区域牌数
     */
    @property
    public Common_Num: number = 0;
    /**
     * @property 花色分类数
     */
    @property
    public Suit_Num: number = 0;
    /**
     * @property 点数总数
     */
    @property
    public Count_Num: number = 0;
    //----------------------数组
    // LIFE-CYCLE CALLBACKS:
    /**
     * @Attribute 脚本管理器
     */
    private ScriptManage: ScriptManage = null;
    public test: boolean = false;
    /**
     * @Attribute 游戏状态
     */
    public Game_State: PlayerNo = PlayerNo.Plyaer_1;
    /**
     * @Attribute 游戏模式
     */
    public Game_Mod: string = null;
    /**
     * @Attribute 移动是否结束
     */
    public IsMove_Over: boolean = false;
    /**
     * @Attribute 花色大小记录
     */
    public Suit_Size_Record: string[] = [];
    /**
     * @Attribute 玩家1手牌牌组
     */
    public Player_1_Cards_Array: cc.Node[] = [];
    /**
     * @Attribute 玩家2手牌牌组——AI
     */
    public Player_2_Cards_Array: cc.Node[] = [];
    /**
     * @Attribute 玩家3手牌牌组——AI
     */
    public Player_3_Cards_Array: cc.Node[] = [];
    /**
     * @Attribute 玩家出牌区域卡牌
     */
    public Player_Play_Area: cc.Node[] = [];
    /**
     * @Attribute 计时器执行次数
     */
    private Time_Count = 0;

    // onLoad () {}
    start() {
        //获取模式
        this.Game_Mod = cc.sys.localStorage.getItem("Mod");
        if (this.Game_Mod === "drill") {
            this.Scoreboard_Box.active = false;
            cc.sys.localStorage.setItem("Mod", null);
        }
        //获取昵称
        let nic_data = cc.sys.localStorage.getItem("NickName");
        //更新昵称
        if (nic_data) {
            this.Player_1.getChildByName("HeadPortraits").getChildByName("name_label").getComponent(cc.Label).string = nic_data;
        }
        //初始化音效
        this.Music();
        //获取脚本管理器脚本
        this.ScriptManage = ScriptManage.GetScriptManage();
    }
    /**
     * 背景音效
     */
    Music() {
        //背景音效
        let bgm = cc.sys.localStorage.getItem("BGM");
        if (!bgm || bgm === "开") {
            this.BGM.play();
        }
        if (bgm === "关") {
            this.BGM.pause();
        }
    }
    /**
     * 音效
     * @type 枚举：音效类型
     */
    SoundShow(type: SoundType) {
        //音效
        let sound = cc.sys.localStorage.getItem("Sound");
        if (!sound || sound === "开") {
            //按钮
            if (type === SoundType.Button_Audio) {
                cc.audioEngine.play(this.Button_Audio, false, 1);
            }
            //出牌
            if (type === SoundType.Play_Audio) {
                cc.audioEngine.play(this.Play_Audio, false, 1);
            }
            //发牌
            if (type === SoundType.Deal_Audio) {
                cc.audioEngine.play(this.Deal_Audio, false, 1);
            }
        }
    }
    /**
     * 延时调用回调函数
     */
    CallBackFunc() {
        //游戏是否结束
        let isOver: boolean = false;
        //记录执行次数
        this.Time_Count++;
        if (this.Time_Count === 1) {
            if (this.Game_State === PlayerNo.Plyaer_2 && this.Player_2_Cards_Array.length > 0) {
                //出牌音效
                this.SoundShow(SoundType.Play_Audio);
                this.ScriptManage.AI_1.SelectCommonCard(this.ScriptManage.DesktopManage.Cards_Common_Array);
                //修改游戏状态
                this.Game_State = PlayerNo.Plyaer_3;
            } else {
                //修改游戏状态
                this.Game_State = PlayerNo.Plyaer_3;
            }
        }
        if (this.Time_Count === 2) {
            if (this.Game_State === PlayerNo.Plyaer_3 && this.Player_3_Cards_Array.length > 0) {
                //出牌音效
                this.SoundShow(SoundType.Play_Audio);
                this.ScriptManage.AI_2.SelectCommonCard(this.ScriptManage.DesktopManage.Cards_Common_Array);
            }
        }
        if (this.Time_Count === 3) {
            // 规则判定
            isOver = this.ScriptManage.RuleJudgeManage.RuleJudge(this.Player_Play_Area, this.ScriptManage.DesktopManage.Cards_Common_Array);
        }
        //移动是否结束
        if (this.IsMove_Over) {
            //卡牌回收
            this.ScriptManage.DesktopManage.CardRecycle();
            isOver = this.SettlementJudge();
            if (!isOver) {
                //重新发牌
                this.ScriptManage.DesktopManage.CommonDeal();
                //修改游戏状态
                this.Game_State = PlayerNo.Plyaer_1;
            }
            //重置计时器执行次数
            this.Time_Count = 0;
            //重置移动是否结束
            this.IsMove_Over = false;
            //停止指定计时器
            this.unschedule(this.CallBackFunc);
        }
    }
    /**
     * 结算判定
     * @returns 布尔值
     */
    SettlementJudge(): boolean {
        //判断牌堆数
        let card_pile_num = parseInt(this.ScriptManage.GameManage.Cards_Pile_Record.string);
        if (card_pile_num <= 0) {
            //玩家分数对比
            this.ScriptManage.RuleJudgeManage.PlayerCountContrast(this.ScriptManage.GameManage.Player_1_Cards_Array, this.ScriptManage.GameManage.Player_2_Cards_Array, this.ScriptManage.GameManage.Player_3_Cards_Array);
            //游戏结束
            return true;
        }
        //玩家1手牌数
        if (this.ScriptManage.GameManage.Player_1_Cards_Array.length <= 0) {
            //激活结束页
            this.ScriptManage.GameManage.Over_Page.active = true;
            //训练模式游戏结束
            if (this.ScriptManage.GameManage.Game_Mod === "drill") {
                //游戏结束
                this.ScriptManage.GameManage.Over_Title.getChildByName("youxijiehsu").active = true;
                //游戏分数
                this.ScriptManage.GameManage.Over_Page.getChildByName("Score").active = false;
                this.ScriptManage.GameManage.Over_Page.getChildByName("youxijiehsu").active = true;
            } else {
                //玩家失败
                this.ScriptManage.GameManage.Over_Title.getChildByName("shibai").active = true;
                //计算玩家分数
                this.ScriptManage.RuleJudgeManage.ComputePlayerScore(this.ScriptManage.GameManage.Player_1_Cards_Array);
            }
            return true;
        }
        //失败记录
        let failure_record: number = 0;
        //玩家2手牌数
        if (this.ScriptManage.GameManage.Player_2_Cards_Array.length <= 0) {
            //失败记录
            failure_record++;
        }
        //玩家3手牌数
        if (this.ScriptManage.GameManage.Player_3_Cards_Array.length <= 0) {
            //失败记录
            failure_record++;
        }
        //是否结束游戏
        if (failure_record >= 2) {
            //激活结束页
            this.ScriptManage.GameManage.Over_Page.active = true;
            //训练模式游戏结束
            if (this.ScriptManage.GameManage.Game_Mod === "drill") {
                //游戏结束
                this.ScriptManage.GameManage.Over_Title.getChildByName("youxijiehsu").active = true;
                //游戏分数
                this.ScriptManage.GameManage.Over_Page.getChildByName("Score").active = false;
                this.ScriptManage.GameManage.Over_Page.getChildByName("youxijiehsu").active = true;
            } else {
                //玩家失败
                this.ScriptManage.GameManage.Over_Title.getChildByName("shengli").active = true;
                //计算分数
                this.ScriptManage.RuleJudgeManage.ComputePlayerScore(this.ScriptManage.GameManage.Player_1_Cards_Array);
            }
            return true;
        }
    }
    /**
     * 游戏回合控制
     * @param game_state 游戏状态：PlayerNo枚举类型
     */
    GameRoundControl(game_state: PlayerNo) {
        //延时调用
        this.schedule(this.CallBackFunc, 1);
    }
    /**
     * 事件回调管理
     * @param lv 任意值
     * @param callname 事件名
     */
    EventCallManage(lv: any, callname: string) {
        //按钮音效
        this.SoundShow(SoundType.Button_Audio);
        //打开规则页
        if (callname === "rule") {
            this.Rule_Page.active = true;
        }
        //返回大厅
        if (callname === "back") {
            cc.director.loadScene("LobbyScene");
        }
        //继续游戏
        if (callname === "goon") {
            if (this.Game_Mod === "drill") {
                cc.sys.localStorage.setItem("Mod", "drill");
            }
            cc.director.loadScene("GameScene");
        }
    }
    /**
     * 关闭
     * @param lv 任意值
     * @param close 关闭节点名
     */
    Close(lv: any, close: string) {
        //按钮音效
        this.SoundShow(SoundType.Button_Audio);
        //关闭规则页
        if (close === "rule") {
            this.Rule_Page.active = false;
        }
    }
    // update (dt) {}
}
