import { SoundType } from "../common/Enum";

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
export default class GameAudio extends cc.Component {

    /**
     * @property BGM
     */
    @property({ type: cc.AudioClip })
    public BGM: cc.AudioClip = null;
    /**
     * @property [Array]背景BGM
     */
    @property([cc.AudioClip])
    public BG_BGMs: cc.AudioClip[] = [];
    /**
     * @property [Array]底部BGM
     */
    @property([cc.AudioClip])
    public Down_BGMs: cc.AudioClip[] = [];
    /**
     * @property 金币音效
     */
    @property({ type: cc.AudioClip })
    public Coin_Audio: cc.AudioClip = null;
    /**
     * @property 礼包音效
     */
    @property(cc.AudioClip)
    public Gift_Audio: cc.AudioClip = null;
    /**
     * @property 奖品音效
     */
    @property(cc.AudioClip)
    public Prize_Audio: cc.AudioClip = null;
    /**
     * @property 钩中音效
     */
    @property(cc.AudioClip)
    public Hooking_Audio: cc.AudioClip = null;
    /**
     * @property 抽奖音效
     */
    @property(cc.AudioClip)
    public Luck_Audio: cc.AudioClip = null;
    /**
     * @property 绳子音效
     */
    @property(cc.AudioClip)
    public Rope_Audio: cc.AudioClip = null;
    /**
    * @property 弹框音效
    */
    @property(cc.AudioClip)
    public Popout_Audio: cc.AudioClip = null;
    /**
    * @property 死亡音效
    */
    @property(cc.AudioClip)
    public Death_Audio: cc.AudioClip = null;
    /**
     * @property ReadyGO
     */
    @property(cc.AudioClip)
    public ReadyGo: cc.AudioClip = null;
    /**
     * @property 点击音效
     */
    @property(cc.AudioClip)
    public Click_Audio: cc.AudioClip = null;
    /**
     * @property 跳跃音效
     */
    @property(cc.AudioClip)
    public Jump_Audio: cc.AudioClip = null;
    // /**
    //  * @property 碎片音效
    //  */
    // @property(cc.AudioClip)
    // public Fragment_Audio: cc.AudioClip = null;
    /**
     * @property 奖品音效
     */
    @property(cc.AudioClip)
    public Award_Audio: cc.AudioClip = null;
    /**
     * @property 音效开关
     */
    public Audio_Switch: boolean = true;

    onLoad() {
        // cc.loader.downloader.loadSubpackage('audio', function (err) {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     console.log('load subpackage successfully.');
        // });
        // this.Audio_Switch = true;
    }

    start() {

    }

    // update (dt) {}

    /**
     * 播放BGM
     * @param audio_id 音效ID
     */
    PlayBGM(audio_id: string) {
        if (this.Audio_Switch) {
            if (audio_id === "bg") {
                cc.audioEngine.play(this.BGM, true, 1);
                return;
            }

            //背景BGM
            let bg_bgm: cc.AudioClip = null;
            switch (audio_id) {
                case "b_1":
                    bg_bgm = this.BG_BGMs[0];
                    break;
                case "b_2":
                    bg_bgm = this.BG_BGMs[1];
                    break;
                case "b_3":
                    bg_bgm = this.BG_BGMs[2];
                    break;
                case "b_4":
                    bg_bgm = this.BG_BGMs[3];
                    break;
                default:
                    break;
            }
            cc.audioEngine.play(bg_bgm, true, 1);

            //底部BGM
            let down_bgm: cc.AudioClip = null;
            switch (audio_id) {
                case "b_1":
                    down_bgm = this.Down_BGMs[0];
                    break;
                case "b_2":
                    down_bgm = this.Down_BGMs[1];
                    break;
                case "b_3":
                    down_bgm = this.Down_BGMs[2];
                    break;
                case "b_4":
                    down_bgm = this.Down_BGMs[3];
                    break;
                default:
                    break;
            }
            cc.audioEngine.play(down_bgm, true, 1);
        }
    }

    //停止播放BGM
    StopBGM() {
        cc.audioEngine.stopAll();
    }

    PlaySound(soundType: SoundType) {
        if (this.Audio_Switch) {
            switch (soundType) {
                case SoundType.Coin_Audio:
                    cc.audioEngine.play(this.Coin_Audio, false, 1);
                    break;
                case SoundType.Death_Audio:
                    cc.audioEngine.play(this.Death_Audio, false, 1);
                    break;
                case SoundType.Gift_Audio:
                    cc.audioEngine.play(this.Gift_Audio, false, 1);
                    break;
                case SoundType.Hooking_Audio:
                    cc.audioEngine.play(this.Hooking_Audio, false, 1);
                    break;
                case SoundType.Luck_Audio:
                    cc.audioEngine.play(this.Luck_Audio, false, 1);
                    break;
                case SoundType.Popout_Audio:
                    cc.audioEngine.play(this.Popout_Audio, false, 1);
                    break;
                case SoundType.Prize_Audio:
                    cc.audioEngine.play(this.Prize_Audio, false, 1);
                case SoundType.Rope_Audio:
                    cc.audioEngine.play(this.Rope_Audio, false, 1);
                    break;
                case SoundType.Ready_Go:
                    cc.audioEngine.play(this.ReadyGo, false, 1);
                    break;
                case SoundType.Click:
                    cc.audioEngine.play(this.Click_Audio, false, 1);
                    break;
                case SoundType.Jump_Audio:
                    cc.audioEngine.play(this.Jump_Audio, false, 1);
                    break;
                case SoundType.Award_Audio:
                    cc.audioEngine.play(this.Award_Audio, false, 1);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 设置音效开关
     * @param isplay 是否播放
     */
    SetAudioSwitch(isplay: boolean) {
        this.Audio_Switch = isplay;
    }
}
