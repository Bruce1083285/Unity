import { SoundType, EventType } from "./commont/Enum";
import { EventCenter } from "./commont/EventCenter";

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
export default class Sound extends cc.Component {

    /**
     * @property 背景音效--->首页
     */
    @property({ type: cc.AudioClip })
    private BGM_Start: cc.AudioClip = null;
    /**
     * @property 背景音效--->游戏页
     */
    @property({ type: cc.AudioClip })
    private BGM_Game: cc.AudioClip = null;
    /**
     * @property 出发音效
     */
    @property({ type: cc.AudioClip })
    private Sound_Go: cc.AudioClip = null;
    /**
     * @property 购买道具成功音效
     */
    @property({ type: cc.AudioClip })
    private Sound_Buy_Yes: cc.AudioClip = null;
    /**
     * @property 点击音效
     */
    @property({ type: cc.AudioClip })
    private Sound_Click: cc.AudioClip = null;
    /**
     * @property 金币不足音效
     */
    @property({ type: cc.AudioClip })
    private Sound_Coin_insufficient: cc.AudioClip = null;
    /**
    * @property 刹车音效
    */
    @property({ type: cc.AudioClip })
    private Sound_Brake: cc.AudioClip = null;
    /**
     * @property 完成音效
     */
    @property({ type: cc.AudioClip })
    private Sound_Complete: cc.AudioClip = null;
    /**
     * @property 开始游戏倒计时
     */
    @property({ type: cc.AudioClip })
    private Sound_StartTime: cc.AudioClip = null;
    /**
     * @property 游戏结束倒计时
     */
    @property({ type: cc.AudioClip })
    private Sound_EndTime: cc.AudioClip = null;
    /**
       * @property 道具--->问号
       */
    @property({ type: cc.AudioClip })
    private Sound_Question: cc.AudioClip = null;
    /**
     * @property 香蕉皮
     */
    @property({ type: cc.AudioClip })
    private Sound_BananaSkin: cc.AudioClip = null;
    /**
   * @property 导弹
   */
    @property({ type: cc.AudioClip })
    private Sound_Bomb: cc.AudioClip = null;
    /**
   * @property 小丑礼包
   */
    @property({ type: cc.AudioClip })
    private Sound_ClownGift: cc.AudioClip = null;
    /**
   * @property 水球
   */
    @property({ type: cc.AudioClip })
    private Sound_WaterPolo: cc.AudioClip = null;
    /**
   * @property 冰冻
   */
    @property({ type: cc.AudioClip })
    private Sound_Frozen: cc.AudioClip = null;
    /**
   * @property 保护罩
   */
    @property({ type: cc.AudioClip })
    private Sound_Protection: cc.AudioClip = null;
    /**
   * @property 加速
   */
    @property({ type: cc.AudioClip })
    private Sound_SpeedUp: cc.AudioClip = null;
    /**
     * @property 吸铁石
     */
    @property({ type: cc.AudioClip })
    private Sound_Mangnet: cc.AudioClip = null;
    /**
   * @property 雷击
   */
    @property({ type: cc.AudioClip })
    private Sound_Lightning: cc.AudioClip = null;
    /**
   * @property 金币
   */
    @property({ type: cc.AudioClip })
    private Sound_Coin: cc.AudioClip = null;
    /**
   * @property 龙卷风
   */
    @property({ type: cc.AudioClip })
    private Sound_Tornado: cc.AudioClip = null;
    /**
   * @property 传送门
   */
    @property({ type: cc.AudioClip })
    private Sound_Portal: cc.AudioClip = null;
    /**
     * @property 油漆
     */
    @property({ type: cc.AudioClip })
    private Sound_Paint: cc.AudioClip = null;
    /**
   * @property 路障
   */
    @property({ type: cc.AudioClip })
    private Sound_Roadblock: cc.AudioClip = null;
    /**
   * @property 石墩
   */
    @property({ type: cc.AudioClip })
    private Sound_Piers: cc.AudioClip = null;
    /**
   * @property 水滩
   */
    @property({ type: cc.AudioClip })
    private Sound_Water: cc.AudioClip = null;
    /**
    * @property 定时炸弹
    */
    @property({ type: cc.AudioClip })
    private Sound_TimeBomb: cc.AudioClip = null;
    /**
     * @property 特殊汽车
     */
    @property({ type: cc.AudioClip })
    private Sound_SpecialCar: cc.AudioClip = null;
    // /**
    //  * @property 水滩
    //  */
    // @property({ type: cc.AudioClip })
    // private Sound_Water: cc.AudioClip = null;
    // /**
    //  * @property 水滩
    //  */
    // @property({ type: cc.AudioClip })
    // private Sound_Water: cc.AudioClip = null;

    /**
     * 初始化
     */
    Init() {
        this.AddListenter();
    }

    /**
     * 播放音效
     * @param soundType 音效类型
     */
    PlaySound(soundType: SoundType) {
        switch (soundType) {
            case SoundType.PlayBGM_Start:
                this.Play(this.BGM_Start, true);
                break;
            case SoundType.StopBGM_Start:
                this.Stop();
                break;
            case SoundType.PlayBGM_Game:
                this.Play(this.BGM_Game, true);
                break;
            case SoundType.StopBGM_Game:
                this.Stop();
                break;
            case SoundType.Go:
                this.Play(this.Sound_Go, false);
                break;
            case SoundType.Buy_Yes:
                this.Play(this.Sound_Buy_Yes, false);
                break;
            case SoundType.Click:
                this.Play(this.Sound_Click, false);
                break;
            case SoundType.Coin_insufficient:
                this.Play(this.Sound_Coin_insufficient, false);
                break;
            case SoundType.Brake:
                this.Play(this.Sound_Brake, false);
                break;
            case SoundType.Complete:
                this.Play(this.Sound_Complete, false);
                break;
            case SoundType.StartTime:
                this.Play(this.Sound_StartTime, false);
                break;
            case SoundType.EndTime:
                this.Play(this.Sound_EndTime, false);
                break;
            case SoundType.Question:
                this.Play(this.Sound_Question, false);
                break;
            case SoundType.BananaSkin:
                this.Play(this.Sound_BananaSkin, false);
                break;
            case SoundType.Bomb:
                this.Play(this.Sound_Bomb, false);
                break;
            case SoundType.ClownGift:
                this.Play(this.Sound_ClownGift, false);
                break;
            case SoundType.WaterPolo:
                this.Play(this.Sound_WaterPolo, false);
                break;
            case SoundType.Frozen:
                this.Play(this.Sound_Frozen, false);
                break;
            case SoundType.Protection:
                this.Play(this.Sound_Protection, false);
                break;
            case SoundType.SpeedUp:
                this.Play(this.Sound_SpeedUp, false);
                break;
            case SoundType.Mangnet:
                this.Play(this.Sound_Mangnet, false);
                break;
            case SoundType.Lightning:
                this.Play(this.Sound_Lightning, false);
                break;
            case SoundType.Coin:
                this.Play(this.Sound_Coin, false);
                break;
            case SoundType.Tornado:
                this.Play(this.Sound_Tornado, false);
                break;
            case SoundType.Portal:
                this.Play(this.Sound_Portal, false);
                break;
            case SoundType.Paint:
                this.Play(this.Sound_Paint, false);
                break;
            case SoundType.Roadblock:
                this.Play(this.Sound_Roadblock, false);
                break;
            case SoundType.Piers:
                this.Play(this.Sound_Piers, false);
                break;
            case SoundType.Water:
                this.Play(this.Sound_Water, false);
                break;
            case SoundType.TimeBomb:
                this.Play(this.Sound_TimeBomb, false);
                break;
            case SoundType.SpecialCar:
                this.Play(this.Sound_SpecialCar, false);
                break;
            default:
                break;
        }
    }

    /**
     * 播放
     * @param sound 音频
     * @param loop 是否循环播放
     */
    private Play(sound: cc.AudioClip, loop: boolean) {
        cc.audioEngine.play(sound, loop, 1);
    }

    /**
     * 停止
     */
    private Stop() {
        cc.audioEngine.stopAll();
    }

    /**
     * 添加监听
     */
    private AddListenter() {
        EventCenter.AddListenter(EventType.Sound, (soundType: SoundType) => {
            this.PlaySound(soundType);
        }, "Sound");
    }

    /**
     * 移除监听
     */
    private RemoveListenter() {
        EventCenter.RemoveListenter(EventType.Sound, "Sound");
    }
}
