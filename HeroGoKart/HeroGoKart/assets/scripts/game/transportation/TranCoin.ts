import { Transportation } from "../Transportation";
import { Cache } from "../../commont/Cache";
import { CacheType } from "../../commont/Enum";
import Game from "../../Game";

/**
 * @class 空投奖励--->金币卡
 */
export class TranCoin extends Transportation {

    /**
     * 
     * @param game 游戏类
     */
    constructor(game: Game) {
        super(game);
    }


    /**
      * 设置空投
      */
    public SetTransportation() {
        this.SetCoin();
    }

    /**
     * 设置金币卡
     */
    private SetCoin() {
        this.Game.Trans_Card.scale = 0;
        let act_move = cc.moveBy(0.3, 0, 100);
        let act_scale = cc.scaleTo(0.3, 1.5);
        let act_callback = () => {
            this.Game.Trans_Card.getChildByName("Card").active = false;
            this.Game.Trans_Card.getChildByName("label").active = true;
            let callback = () => {
                this.Game.Trans_Card.destroy();
                this.Game.Trans_Card = null;
            }
            setTimeout(callback, 500);
        }
        let act_seq = cc.sequence(act_move, act_scale, cc.callFunc(act_callback));
        this.Game.Trans_Card.runAction(act_seq);

        let coin = Cache.GetCache(CacheType.Coin_Amount);
        let num = parseInt(coin);
        let sum = num + 1000;
        Cache.SetCache(CacheType.Coin_Amount, sum + "");
        console.log("道具------------------>空投金币");
    }
}
