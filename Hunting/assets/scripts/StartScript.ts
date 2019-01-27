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
export default class Start extends cc.Component {

    //规则页
    @property(cc.Node)
    public Rule_Page: cc.Node = null;
    //背景音效
    @property(cc.AudioSource)
    public BGM: cc.AudioSource = null;
    //音效开关按钮
    @property(cc.Node)
    public Music_Show: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:
    //背景音效开关
    private BGM_Num: number = 0;
    onLoad() {
        //获取缓存值
        let bgm = cc.sys.localStorage.getItem("Music");
        if (!bgm) {
            //播放音效
            this.BGM.play();
            cc.sys.localStorage.setItem("Music", "开");
            return;
        }
        if (bgm === "开") {
            this.Music_Show.getChildByName("music_off").active = false;
            this.Music_Show.getChildByName("music_on").active = true;
            //播放背景音效
            this.BGM.play();
        }
        if (bgm === "关") {
            this.Music_Show.getChildByName("music_off").active = true;
            this.Music_Show.getChildByName("music_on").active = false;
            //暂停背景音效
            this.BGM.pause();
            //重置背景音效开关
            this.BGM_Num = 2;
        }
    }

    start() {

    }
    //开始游戏
    BeginGame() {
        cc.director.loadScene("GameScene");
    }
    //规则页显示
    RuleShow() {
        this.Rule_Page.active = true;
    }
    //关闭
    Close(lv: any, name: string) {
        if (name === "rule") {
            this.Rule_Page.active = false;
        }
    }
    //背景音效按钮
    MusicButton() {
        if (this.BGM_Num === 0) {
            this.Music_Show.getChildByName("music_off").active = true;
            this.Music_Show.getChildByName("music_on").active = false;
            //暂停背景音效
            this.BGM.pause();
            //修改缓存值
            cc.sys.localStorage.setItem("Music", "关");
        }
        this.BGM_Num++;
        if (this.BGM_Num >= 2) {
            this.Music_Show.getChildByName("music_off").active = false;
            this.Music_Show.getChildByName("music_on").active = true;
            //播放背景音效
            this.BGM.play();
            //修改缓存值
            cc.sys.localStorage.setItem("Music", "开");
            //重置背景音效开关
            this.BGM_Num = 0;
        }
    }
    // update (dt) {}
}
