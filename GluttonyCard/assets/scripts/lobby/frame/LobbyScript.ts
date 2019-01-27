import Set from "../mod/SetScript";
import Center from "../mod/CenterScript";
import Mod from "./ModScript";
import SignIn from "../mod/SignInScript";

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
export default class Lobby extends cc.Component {

    //邮件页
    @property(cc.Node)
    public Mail_Page_1: cc.Node = null;
    //邮件二级页
    @property(cc.Node)
    public Mail_Page_2: cc.Node = null;
    //设置页
    @property(cc.Node)
    public Set_Page: cc.Node = null;
    //个人中心页
    @property(cc.Node)
    public Center_Page: cc.Node = null;
    //公告页
    @property(cc.Node)
    public Notice_Page: cc.Node = null;
    //提示页
    @property(cc.Node)
    public Hint_Page: cc.Node = null;
    //顶部游戏名
    @property(cc.Label)
    public Top_Name: cc.Label = null;
    //购买提示
    @property(cc.Node)
    public Buy_Hint: cc.Node = null;
    //活动页
    @property(cc.Node)
    public Acativity_Page: cc.Node = null;
    //签到页
    @property(cc.Node)
    public SignIn_Page: cc.Node = null;
    //商城页
    @property(cc.Node)
    public Shop_Page: cc.Node = null;
    //金币数
    @property(cc.Label)
    public Coin_Label: cc.Label = null;
    //个人中心个人签名
    @property(cc.EditBox)
    public Signature_EditBox: cc.EditBox = null;
    //个人中心游戏昵称
    @property(cc.EditBox)
    public NickName_EditBox: cc.EditBox = null;
    //音乐开关
    @property(cc.Node)
    public Music: cc.Node = null;
    //音效开关
    @property(cc.Node)
    public Sound: cc.Node = null;
    //背景音效
    @property(cc.AudioSource)
    public BGM: cc.AudioSource = null;
    //按钮音效
    @property({ url: cc.AudioClip })
    public Button_Audio: string = null;
    // LIFE-CYCLE CALLBACKS:
    //设置功能模块
    private SetMod: Mod = null;
    //个人中心功能模块
    private CenterMod: Mod = null;
    //签到功能模块
    private SignInMod: Mod = null;
    onLoad() {
        //  cc.sys.localStorage.setItem("SignIn",null);
        //实例化设置模块
        this.SetMod = new Set();
        //实例化个人中心模块
        this.CenterMod = new Center();
        //签到功能模块
        this.SignInMod = new SignIn();
        //初始化音效
        this.InitMusic();
        //初始化个人中心数据
        this.InitCenter();
        //获取签到缓存
        this.GetSignIn();
        //获取金币缓存
        this.GetCoin();
    }
    start() {

    }
    //获取金币缓存
    GetCoin() {
        let coin_num = cc.sys.localStorage.getItem("Coin");
        if (coin_num) {
            this.Coin_Label.string = coin_num;
        }
    }
    //获取签到缓存
    GetSignIn() {
        let day = cc.sys.localStorage.getItem("SignIn");
        if (day) {
            let day_arr = this.SignIn_Page.getChildByName("DayNum").children;
            let day_num = parseInt(day);
            for (let i = 0; i < day_arr.length; i++) {
                let arr_num = parseInt(day_arr[i].name);
                if (arr_num <= day_num) {
                    //按钮激活关闭
                    day_arr[i].getComponent(cc.Button).interactable = false;
                    //开启已签到显示
                    day_arr[i].getChildByName("duihao").active = true;
                }
            }
        }
    }
    //初始化个人中心数据
    InitCenter() {
        //判断是否第一次进入
        let one = cc.sys.localStorage.getItem("Game");
        if (one) {
            this.Hint_Page.active = false;
        } else {
            cc.sys.localStorage.setItem("Game", false);
        }
        //获取个性签名缓存
        let sig_data = cc.sys.localStorage.getItem("Signature");
        if (sig_data) {
            //更新个性签名
            this.Signature_EditBox.string = sig_data;
        }
        //获取游戏昵称缓存
        let nic_data = cc.sys.localStorage.getItem("NickName");
        if (nic_data) {
            //更新游戏昵称
            this.NickName_EditBox.string = nic_data;
            //更新顶部名字
            this.Top_Name.string = nic_data;
        }
    }
    //初始化音效
    InitMusic() {
        //获取背景缓存
        let bgm = cc.sys.localStorage.getItem("BGM");
        if (!bgm || bgm === "开") {
            //音乐开
            this.Music.getChildByName("Button").getChildByName("On").active = true;
            this.Music.getChildByName("Button").getChildByName("Off").active = false;
            this.BGM.play();
        }
        if (bgm === "关") {
            //音乐关
            this.Music.getChildByName("Button").getChildByName("On").active = false;
            this.Music.getChildByName("Button").getChildByName("Off").active = true;
            this.BGM.pause();
            this.SetMod.Music_Show_Num = 2;
        }
        //获取音效缓存
        let sound = cc.sys.localStorage.getItem("Sound");
        //音乐关
        if (sound === "关") {
            this.Sound.getChildByName("Button").getChildByName("On").active = false;
            this.Sound.getChildByName("Button").getChildByName("Off").active = true;
            this.SetMod.Sound_Show_Num = 2;
        }
        //音乐开
        if (!sound || sound === "开") {
            this.Sound.getChildByName("Button").getChildByName("On").active = true;
            this.Sound.getChildByName("Button").getChildByName("Off").active = false;
        }
    }
    //按钮管理
    ButtonManage(lv: any, button: string) {
        //音效开关
        this.SoundShow();
        switch (button) {
            //打开公告页
            case "notice":
                this.Notice_Page.active = true;
                break;
            //打开邮件页
            case "mail_1":
                this.Mail_Page_1.active = true;
                break;
            //打开设置页
            case "set":
                this.Set_Page.active = true;
                break;
            //打开个人中心页
            case "center":
                this.Center_Page.active = true;
                break;
            //训练模式
            case "drill":
                cc.sys.localStorage.setItem("Mod", "drill");
                cc.director.loadScene("GameScene");
                break;
            //生存模式或开始游戏
            case "survival":
                cc.director.loadScene("GameScene");
                break;
            //打开邮件二级页面
            case "select":
                this.Mail_Page_2.active = true;
                break;
            //退出游戏
            case "quit":
                cc.director.loadScene("StartScene");
                break;
            //音乐开关
            case "music":
                this.SetMod.MusicShow(this.Music, this.BGM);
                break;
            //音效开关
            case "sound":
                this.SetMod.SoundShow(this.Sound);
                break;
            //商城开关
            case "shop":
                this.Shop_Page.active = true;
                break;
            //活动开关
            case "activity":
                this.Acativity_Page.active = true;
                break;
            //签到开关
            case "signin":
                this.SignIn_Page.active = true;
                break;
            default:
                break;
        }
    }
    //事件管理
    EventManage(lv: any, eve: string) {
        //个性签名
        if (eve === "signature") {
            this.CenterMod.SetInput(this.Signature_EditBox);
        }
        //游戏昵称
        if (eve === "nickname") {
            this.CenterMod.SetInput(this.NickName_EditBox, this.Top_Name);
        }
    }
    //关闭页面
    ClosePage(lv: any, page: string) {
        //音效开关
        this.SoundShow();
        switch (page) {
            //关闭提示页
            case "hint":
                this.Hint_Page.active = false;
                break;
            //关闭公告页
            case "notice":
                this.Notice_Page.active = false;
                break;
            //关闭邮件一级页
            case "mail_1":
                this.Mail_Page_1.active = false;
                break;
            //关闭邮件二级页
            case "mail_2":
                this.Mail_Page_2.active = false;
                break;
            //关闭设置页
            case "set":
                this.Set_Page.active = false;
                break;
            //关闭个人中心页
            case "center":
                this.Center_Page.active = false;
                break;
            //关闭活动页
            case "activity":
                this.Acativity_Page.active = false;
                break;
            //关闭签到页
            case "signin":
                this.SignIn_Page.active = false;
                break;
            //关闭商城页
            case "shop":
                this.Shop_Page.active = false;
                break;
            default:
                break;
        }
    }
    //音效开关
    SoundShow() {
        let sound = cc.sys.localStorage.getItem("Sound");
        if (!sound || sound === "开") {
            //播放按钮音效
            cc.audioEngine.play(this.Button_Audio, false, 1);
        }
    }
    //签到
    SignIn(lv: any, day: string) {
        //签到
        this.SignInMod.SignInFunc(this.SignIn_Page, day);
    }
    //商品购买
    MerchandiseBuy(lv: any, mer: string) {
        //开启购买成功提示
        this.Buy_Hint.active = true;
        this.scheduleOnce(() => {
            //商品
            let mer_num = parseInt(mer);
            //金币数
            let coin_num = parseInt(this.Coin_Label.string);
            coin_num += mer_num;
            this.Coin_Label.string = coin_num + "";
            cc.sys.localStorage.setItem("Coin", coin_num);
            this.Buy_Hint.active = false;
        }, 0.5);
    }
    // update (dt) {}
}
