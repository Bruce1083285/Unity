import { CacheType } from "./Enum";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * @class 缓存类
 */
export default class Cache {

    /**
     * 设置缓存
     * @param cacheType 缓存类型
     * @param value 缓存值
     */
    public static SetCache(cacheType: CacheType, value: string) {
        cc.sys.localStorage.setItem(cacheType, value);
    }

    /**
     * 获取缓存
     * @param cacheType 缓存类型
     */
    public static GetCache(cacheType: CacheType): string {
        return cc.sys.localStorage.getItem(cacheType);
    }
    
}
