import { EventType } from "./Enum";



// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 事件监听
 */
export default class EventCenter {
    /**
     * 监听对象
     */
    private static Listenter = {};

    private constructor() { }

    /**
     * 添加监听
     * @param eventType 事件类型
     * @param callback 回调
     */
    public static AddListenter(eventType: EventType, callback: Function) {
        if (!EventCenter.Listenter[eventType]) {
            EventCenter.Listenter[eventType] = [];
        }
        let ind = EventCenter.Listenter[eventType].indexOf(callback);
        if (ind === -1) {
            EventCenter.Listenter[eventType].push(callback);
        } else {
            console.log("重复添加回调：{0}", callback);
        }
    }

    /**
     * 移除监听
     * @param eventType 事件类型
     */
    public static RemoveListenter(eventType: EventType, callback: Function) {
        if (!EventCenter.Listenter[eventType]) {
            console.log("移除对象为空");
        }
        EventCenter.Listenter[eventType].splice(callback, 1);
    }

    /**
     * 广播
     * @param eventType 事件类型
     */
    public static Broadcast(eventType: EventType) {
        let callbacks = EventCenter.Listenter[eventType];
        if (callbacks) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i]();
            }
        } else {
            console.log("监听对象为空");
        }
    }
}
