import Cache from "../common/Cache";
import Game from "../Game";
import GameAudio from "./GameAudio";
import { SoundType } from "../common/Enum";
import WX from "../common/WX";
import Http from "../common/Http";

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
export default class CoinAnim extends cc.Component {

    /**
     * @property 持续时间
     */
    @property
    private DT: number = 0;
    /**
     * @property 最大X轴
     */
    @property
    private Max_X: number = 0;
    /**
     * @property 最小X轴
     */
    @property
    private Min_X: number = 0;
    /**
     * @property 最大Y轴
     */
    @property
    private Max_Y: number = 0;
    /**
     * @property 最小X轴
     */
    @property
    private Min_Y: number = 0;
    /**
     * @property 目标位置
     */
    @property(cc.Vec2)
    private Targte_Pos: cc.Vec2 = null;
    /**
     * @property 金币
     */
    @property(cc.Prefab)
    private Coin: cc.Prefab = null;
    /**
     * @property 增加的金币数
     */
    private Coin_Num: cc.Label = null;
    /**
     * @property 金币父节点
     */
    private Coin_Parent: cc.Node = null;
    /**
     * @property 游戏类
     */
    private Game: Game = null;
    /**
     * @property 金币对象池
     */
    public Pool_Coin: cc.NodePool = null;
    /**
     * @property [Array]金币
     */
    private Coins: cc.Node[] = [];


    onLoad() {
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Pool_Coin = new cc.NodePool();

        this.SetPool();
        // this.Play("100");
    }

    /**
     * 设置对象池
     * @param pool 对象池
     */
    private SetPool() {
        for (let i = 0; i < 5; i++) {
            let coin = cc.instantiate(this.Coin);
            this.Pool_Coin.put(coin);
        }
    }

    /**
     * 播放动画
     * @param coin_num 金币数
     */
    Play(coin_num: string) {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Gift_Audio);
        this.node.active = true;

        this.Coin_Parent = this.node.getChildByName("Coin");
        this.GetCoin(this.Pool_Coin, 50, this.Coin_Parent);
        this.Coins = this.node.getChildByName("Coin").children;
        this.Coin_Num = this.node.getChildByName("coin_label").getComponent(cc.Label);
        this.Game = cc.find("Canvas").getComponent(Game);

        // this.InitCoinsPos(this.Coins);
        this.SetCoinPos(this.DT, this.Coins, this.Min_X, this.Max_X, this.Min_Y, this.Max_Y, this.Targte_Pos, this.Coin_Num, coin_num);
        this.GetHttp(coin_num);
    }

    private GetHttp(coin: string) {
        Http.sendRequest("https://xy.zcwx.com/userapi/hall/getcoin", (data) => {
            console.log("金币数据");
            console.log(data);
        }, { uid: WX.Uid, coin: coin });
    }

    // /**
    //  * 设置金币位置
    //  * @param coins [Array]金币
    //  */
    // InitCoinsPos(coins: cc.Node[]) {
    //     for (let i = 0; i < coins.length; i++) {
    //         coins[i].active = true;
    //         coins[i].setPosition(0, 0);
    //     }
    // }

    /**
     * 设置金币位置
     * @param dt 持续时间
     * @param coins [Array]金币
     * @param min_x 最大X轴
     * @param max_x 最小X轴
     * @param min_y 最大Y轴
     * @param max_y 最小Y轴
     * @param target_pos 目标位置
     */
    private SetCoinPos(dt: number, coins: cc.Node[], min_x: number, max_x: number, min_y: number, max_y: number, target_pos: cc.Vec2, coin_label: cc.Label, coin_num: string) {
        for (let i = 0; i < coins.length; i++) {
            let ran_x = Math.random() * (max_x - min_x) + min_x;
            let ran_y = Math.random() * (max_y - min_y) + min_y;
            let move_1 = cc.moveTo(dt, ran_x, ran_y);
            let move_2 = cc.moveTo(0.3, target_pos);
            let istrue = true;
            let callfunc = cc.callFunc(() => {
                // cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Coin_Audio);
                coins[i].active = false;
            });
            coins[i].runAction(cc.sequence(move_1, move_2, callfunc));
            this.scheduleOnce(() => {
                coin_label.node.active = true;
                coin_label.string = "+" + coin_num;
                let coin_num_big = cc.scaleTo(0.25, 3);
                let coin_num_small = cc.scaleTo(0.25, 1);
                let callfunc = cc.callFunc(() => {
                    coin_label.node.active = false;
                    this.node.active = false;
                    this.RemovePool(this.Coins, this.Pool_Coin);
                    this.Game.UpdateCoin();
                });
                coin_label.node.runAction(cc.sequence(coin_num_big, coin_num_small, callfunc));
            }, 1);
        }
    }

    /**
     * 获取金币
     * @param pool 对象池
     * @param coin_num 金币数
     * @param coin_parent 金币父节点
     */
    private GetCoin(pool: cc.NodePool, coin_num: number, coin_parent: cc.Node) {
        for (let i = 0; i < coin_num; i++) {
            let coin = pool.get();
            if (!coin) {
                this.SetPool();
                coin = pool.get();
            }
            coin_parent.addChild(coin);
            coin.active = true;
            coin.setPosition(0, 0);
        }
    }

    /**
     * 回收对象池
     * @param coins 
     * @param pool 
     */
    private RemovePool(coins: cc.Node[], pool: cc.NodePool) {
        for (let i = 0; i < coins.length; i++) {
            pool.put(coins[i]);
        }
    }
}
