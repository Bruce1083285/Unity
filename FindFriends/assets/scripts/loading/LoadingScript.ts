import Manager from "../common/ManageScript";
import { AudioD, SceneD } from "../common/EnumScript";

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
export default class Loading extends cc.Component {

    /**
     * @property 规则页
     */
    @property(cc.Node)
    private Page_Rule: cc.Node = null;
    /**
     * @property BGM
     */
    @property(cc.Node)
    private BGM: cc.Node = null;
    /**
     * @property [Audio]BGM
     */
    @property({ url: cc.AudioClip })
    private Aud_BGM: string = null;
    /**
     * @property [Audio]按钮点击
     */
    @property({ url: cc.AudioClip })
    private Aud_Click_But: string = null;
    /**
     * @property [Audio]刷新点击
     */
    @property({ url: cc.AudioClip })
    private Aud_Click_Refresh: string = null;
    /**
     * @property [Audio]移动
     */
    @property({ url: cc.AudioClip })
    private Aud_Move: string = null;
    /**
     * @property [Audio]失败
     */
    @property({ url: cc.AudioClip })
    private Aud_Failure: string = null;
    /**
     * @property [Audio]胜利
     */
    @property({ url: cc.AudioClip })
    private Aud_Victory: string = null;
    /**
     * @property 管理器
     */
    private Manage_SC: Manager = null;
    /**
     * @property BGM开关
     */
    private BGM_Switch: boolean = false;
    onLoad() {
        this.Manage_SC = Manager.GetManage(SceneD.loading);
        this.Manage_SC.Manage_Audio.setAudio(this.Aud_BGM, this.Aud_Click_But, this.Aud_Click_Refresh, this.Aud_Move, this.Aud_Failure, this.Aud_Victory);
        this.getCache();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 获取缓存
     */
    private getCache() {
        let bgm = cc.sys.localStorage.getItem("BGM");
        if (!bgm || bgm === "true") {
            this.BGM.getChildByName("yinyue").active = true;
            this.BGM.getChildByName("yinyue1").active = false;
            this.Manage_SC.Manage_Audio.PauseBgm();
            this.Manage_SC.Manage_Audio.PlayAudio(AudioD.bgm);
        }
        if (bgm === "false") {
            this.BGM.getChildByName("yinyue").active = false;
            this.BGM.getChildByName("yinyue1").active = true;
            this.BGM_Switch = true;
            this.Manage_SC.Manage_Audio.PauseBgm();
        }
    }

    /**
     * 点击事件
     * @param lv 任意值
     * @param click_param 点击值
     */
    eventClick(lv: any, click_param: string) {
        this.Manage_SC.Manage_Audio.PlayAudio(AudioD.click_but);
        switch (click_param) {
            case "begin":
                cc.director.loadScene("GameScene");
                break;
            case "rule":
                this.Page_Rule.active = true;
                break;
            case "ruleclose":
                this.Page_Rule.active = false;
                break;
            case "bgm":
                this.BGM_Switch = this.Manage_SC.Manage_Moudel.setMusic(this.BGM, this.Manage_SC, this.BGM_Switch);
                break;
            default:
                break;
        }
    }
}
