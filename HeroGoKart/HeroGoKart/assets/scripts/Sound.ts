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
    // /**
    //  * @property 水滩
    //  */
    // @property({ type: cc.AudioClip })
    // private Sound_Water: cc.AudioClip = null;
}
