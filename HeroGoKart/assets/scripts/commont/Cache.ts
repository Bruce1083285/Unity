import { CacheType } from "./Enum";

/**
 * @class 缓存类
 */
export class Cache {

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
