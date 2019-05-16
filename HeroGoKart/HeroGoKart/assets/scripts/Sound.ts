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
}
