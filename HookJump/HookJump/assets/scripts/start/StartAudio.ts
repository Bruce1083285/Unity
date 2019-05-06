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
export default class StartAudio extends cc.Component {

    /**
     * @property 背景音乐
     */
    @property({ type: cc.AudioClip })
    public BGM: cc.AudioClip = null;
    /**
     * @property 点击音效
     */
    @property({ type: cc.AudioClip })
    public Click_Audio: cc.AudioClip = null;
    /**
     * @property 音效开关
     */
    public Audio_Switch: boolean = null;

    onLoad() {
        // cc.loader.downloader.loadSubpackage('audio', function (err) {
        //     if (err) {
        //         return console.error(err);
        //     }
        //     console.log('load subpackage successfully.');
        // });
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {

        this.Audio_Switch = true;
    }

    /**
     * 播放背景音乐
     */
    PlayBGM() {
        cc.audioEngine.play(this.BGM, true, 1);
    }

    /**
     * 停止播放背景音乐
     */
    StopBGM() {
        cc.audioEngine.stopAll();
    }

    /**
     * 播放音效
     * @param soundType 音效类型
     */
    PlaySound(soundType: SoundType) {
        if (this.Audio_Switch) {
            switch (soundType) {
                case SoundType.Click:
                    cc.audioEngine.play(this.Click_Audio, false, 1);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 设置音效开关
     * @param isopen 
     */
    SetAudioSwitch(isopen: boolean) {
        this.Audio_Switch = isopen;
    }
}
