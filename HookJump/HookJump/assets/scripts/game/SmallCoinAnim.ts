import Cache from "../common/Cache";
import { CacheType, Prop } from "../common/Enum";
import Game from "../Game";
import Http from "../common/Http";
import WX from "../common/WX";

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
export default class SmallCoinAnim extends cc.Component {

    /**
     * @property 金币
     */
    private Coin: cc.Node = null;
    /**
     * @property 金币数节点
     */
    private Coin_Num: cc.Node = null;
    /**
     * @property 目标金币节点
     */
    private Target_Coin: cc.Node = null;
    /**
     * @property 小金币数
     */
    private Small_Coin: number = 0;
    /**
     * @property 游戏类
     */
    private Game: Game = null;

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    Play(target: cc.Node) {
        this.Coin = this.node.getChildByName("coin");
        this.Coin_Num = this.node.getChildByName("coin_label");
        this.Target_Coin = cc.find("Canvas/Coin/coin_icon");
        this.Game = this.node.parent.getComponent(Game);
        this.StopAction(this.Coin, this.Coin_Num, this.node);
        this.node.active = true;

        this.Small_Coin = 5;
        if (this.Game.Current_Prop === Prop.DoubleCoin) {
            this.Small_Coin = this.Small_Coin * 2;
        }
        this.Coin_Num.getComponent(cc.Label).string = "+" + this.Small_Coin;

        this.SetCoinPos(target, this.Coin);
        this.SetCoinAnim(this.Coin, 1, this.Target_Coin);
        this.scheduleOnce(() => {
            this.Coin_Num.active = true;
            this.SetCoinNumAnim(this.Coin_Num, 1, this.node);
        }, 1);

        this.GetHttp();
    }

    private GetHttp() {
        let coin = 5;
        Http.sendRequest("https://xy.zcwx.com/userapi/hall/getcoin", (data) => {
            // console.log("金币数据");
            // console.log(data);
        }, { uid: WX.Uid, coin: coin });
    }

    /**
     * 设置金币位置
     * @param target 目标节点
     * @param coin 金币节点
     */
    private SetCoinPos(target: cc.Node, coin: cc.Node) {
        let target_world_pos = target.parent.convertToWorldSpaceAR(target.position);
        let target_node_pos = coin.parent.convertToNodeSpaceAR(target_world_pos);
        coin.setPosition(target_node_pos);
        coin.active = true;
    }

    /**
     * 设置金币动画
     * @param coin 金币节点
     * @param dt 持续时间
     * @param target_pos 目标位置
     * @param scale_value 缩放大小值
     */
    private SetCoinAnim(coin: cc.Node, dt: number, target: cc.Node) {
        let target_world_pos = target.parent.convertToWorldSpaceAR(target.position);
        let target_node_pos = coin.parent.convertToNodeSpaceAR(target_world_pos);
        coin.scale = 0.7;
        let coin_move = cc.moveTo(0.3, target_node_pos);
        let coin_scale = cc.scaleTo(dt, 0.4);
        // console.log(target_node_pos);
        let callfunc = cc.callFunc(() => {
            coin.active = false;
        });
        coin.runAction(cc.sequence(cc.spawn(coin_move, coin_scale), callfunc));
    }

    /**
     * 设置金币数动画
     * @param coin_num 金币数节点
     * @param dt 持续时间
     * @param 自身
     */
    private SetCoinNumAnim(coin_num: cc.Node, dt: number, self: cc.Node) {
        let coin_num_big = cc.scaleTo(0.25, 3);
        let coin_num_small = cc.scaleTo(0.25, 1);
        let callfunc = cc.callFunc(() => {
            coin_num.active = false;
            self.active = false;
            let coin_sum = Cache.GetCache(CacheType.Coin);
            if (coin_sum === "NaN" || coin_sum === null || coin_sum === "" || coin_sum === undefined || coin_sum === "undefine" || coin_sum === "null") {
                coin_sum = "0";
            }
            let sum = parseInt(coin_sum) + this.Small_Coin;
            this.Game.SetCurrentCoin(this.Small_Coin + "");
            Cache.SetCache(CacheType.Coin, sum + "");
            this.Game.UpdateCoin();
        });
        coin_num.runAction(cc.sequence(coin_num_big, coin_num_small, callfunc));
    }

    /**
     * 停止动作
     * @param coin 金币节点
     * @param coin_num 金币数
     * @param self 自身节点
     */
    private StopAction(coin: cc.Node, coin_num: cc.Node, self: cc.Node) {
        coin.stopAllActions();
        coin.active = false;

        coin_num.stopAllActions();
        coin_num.active = false;
        self.active = false;
    }
}
