import { Prop } from "../Prop";
import { Cache } from "../../commont/Cache";
import { CacheType } from "../../commont/Enum";

/**
 * @class 金币
 */
export class Coin extends Prop {

    /**
     * 道具效果
     * @param target 被影响目标
     * @param target_class 被影响目标所属类型
     */
    public Effect(target: cc.Node, target_Class: any) {
        this.EffectRealize();
    }

    /**
     * 效果实现
     */
    private EffectRealize() {
        //设置金币数
        let coin = Cache.GetCache(CacheType.Coin_Amount);
        let num = parseInt(coin);
        let sum = coin + 1;
        Cache.SetCache(CacheType.Coin_Amount, sum + "");

        //更新金币
    }
}
