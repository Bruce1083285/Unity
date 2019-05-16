import { Transportation } from "../Transportation";
import { Cache } from "../../commont/Cache";
import { CacheType } from "../../commont/Enum";

/**
 * @class 空投奖励--->金币卡
 */
export class TranCoin extends Transportation {

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
        let coin = Cache.GetCache(CacheType.Coin_Amount);
        let num = parseInt(coin);
        let sum = num + 1000;
        Cache.SetCache(CacheType.Coin_Amount, sum + "");
    }
}
