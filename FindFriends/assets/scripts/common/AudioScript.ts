import { AudioD } from "./EnumScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * @class 音效数据类
 */
export default class AudioData {

    /**
     * @property [Audio]BGM
     */
    public Aud_BGM: string = null;
    /**
     * @property [Audio]按钮点击
     */
    public Aud_Click_But: string = null;
    /**
     * @property [Audio]刷新点击
     */
    public Aud_Click_Refresh: string = null;
    /**
     * @property [Audio]移动
     */
    public Aud_Move: string = null;
    /**
     * @property [Audio]失败
     */
    public Aud_Failure: string = null;
    /**
     * @property [Audio]胜利
     */
    public Aud_Victory: string = null;
    /**
     * @property BGM音效ID
     */
    private BGM_ID: number = 0;

    /**
     * 设置音效数据
     * @param audio_array [Audio]音效数据
     */
    setAudio(...audio_array: string[]) {
        let i = 0;
        this.Aud_BGM = audio_array[i];
        i++;
        this.Aud_Click_But = audio_array[i];
        i++;
        this.Aud_Click_Refresh = audio_array[i];
        i++;
        this.Aud_Move = audio_array[i];
        i++;
        this.Aud_Failure = audio_array[i];
        i++;
        this.Aud_Victory = audio_array[i];
    }

    /**
     * 播放音效
     * @param audio_data 音效数据
     */
    PlayAudio(audio_data: AudioD) {
        switch (audio_data) {
            case AudioD.bgm:
                this.BGM_ID = cc.audioEngine.play(this.Aud_BGM, true, 1);
                break;
            case AudioD.click_but:
                cc.audioEngine.play(this.Aud_Click_But, false, 1);
                break;
            case AudioD.click_refresh:
                cc.audioEngine.play(this.Aud_Click_Refresh, false, 1);
                break;
            case AudioD.move:
                cc.audioEngine.play(this.Aud_Move, false, 1);
                break;
            case AudioD.failure:
                cc.audioEngine.play(this.Aud_Failure, false, 1);
                break;
            case AudioD.victory:
                cc.audioEngine.play(this.Aud_Victory, false, 1);
                break;
            default:
                break;
        }
    }

    /**
     * 暂停BGM
     */
    PauseBgm(){
        cc.audioEngine.pauseAll();
    }
}
