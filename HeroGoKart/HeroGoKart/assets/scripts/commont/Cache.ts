import { CacheType } from "./Enum";

/**
 * @class 缓存类
 */
export class Cache {

    /**
     * @property 单例
     */
    private static Intitance: Cache = new Cache();

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
        let value = cc.sys.localStorage.getItem(cacheType);
        value = Cache.Intitance.IsEmpty(value);
        return value;
    }

    /**
     * 移除缓存
     * @param cacheType 缓存类型
     */
    public static RemoveCache(cacheType: CacheType) {
        cc.sys.localStorage.removeItem(cacheType)
    }

    /**
     * 是否为空
     * @param value 
     */
    private IsEmpty(value: string): string {
        if (!value || value === "" || value === "NaN" || value === "null" || value === "undefined") {
            return null;
        }
        return value;
    }
}
