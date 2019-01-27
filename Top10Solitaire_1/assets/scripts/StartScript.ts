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
export default class NewClass extends cc.Component {

    @property(cc.Node)
    public OtherPage: cc.Node = null;
    @property(cc.AudioSource)
    public BGM: cc.AudioSource = null;
    //音乐开关按钮
    @property(cc.Node)
    public Music: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    private MusicNum: number = 0;
    onLoad() {
        //音乐开关
        let show = cc.sys.localStorage.getItem("Music");
        if (show === "开") {
            // this.Music.getChildByName("yinyue111").active = true;
            // this.Music.getChildByName("yunyeuguan22").active = false;
            this.BGM.play();
        }
        if (show === "关") {
            // this.Music.getChildByName("yinyue111").active = false;
            // this.Music.getChildByName("yunyeuguan22").active = true;
            this.BGM.pause();
            // this.MusicNum = 2;
        }
    }

    start() {

    }
    //普通模式
    NormalGame() {
        cc.director.loadScene("NormalScene");
    }
    //开始游戏
    BeginGame() {
        cc.director.loadScene("GameScene");
    }
    //街机模式
    ArcadeGame() {
        cc.director.loadScene("ArcadeScene");
    }
    //返回主页
    BackMain() {
        this.OtherPage.active = false
    }
    //其他
    OtherButton() {
        this.OtherPage.active = true;
    }
    //音乐开关
    MusicShow(lv: any, show: string) {
        if (show === "关") {
            // this.Music.getChildByName("yinyue111").active = false;
            // this.Music.getChildByName("yunyeuguan22").active = true;
            this.BGM.pause();
            cc.sys.localStorage.setItem("Music", "关");
        }
        //this.MusicNum++;
        if (show === "开") {
            // this.Music.getChildByName("yinyue111").active = true;
            // this.Music.getChildByName("yunyeuguan22").active = false;
            this.BGM.play();
            cc.sys.localStorage.setItem("Music", "开");
        }
    }
    // update (dt) {}
}
