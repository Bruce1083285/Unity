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
     * 添加监听--->无参数的回调函数
     * @param eventType 事件类型
     * @param callback 回调函数
     * @param call_class 回调函数所属类型
     */
    public static AddListenter(eventType: EventType, callback: Function, call_class: string) {
        if (!EventCenter.Listenter[eventType]) {
            EventCenter.Listenter[eventType] = [];
        }
        let call = new Callback(callback, call_class);
        let arr = EventCenter.Listenter[eventType];
        let ind: number = null;
        //遍历回调函数类型是否存在
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].Call_Class === call_class) {
                ind = i;
                break;
            }
        }

        if (ind === null) {
            arr.push(call);
        } else {
            console.error("重复添加回调" + call);
        }
    }

    /**
     * 移除监听--->无参数的回调函数
     * @param eventType 事件类型
     * @param call_class 回调函数所属类型
     */
    public static RemoveListenter(eventType: EventType, call_class: string) {
        if (!EventCenter.Listenter[eventType]) {
            console.error("移除对象未添加监听");
            return;
        }
        let arr = EventCenter.Listenter[eventType];
        let ind: number = null;
        //遍历回调函数类型是否存在
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].Call_Class === call_class) {
                ind = i;
                break;
            }
        }

        if (ind === null) {
            console.error("移除对象为空");
        } else {
            arr.splice(ind, 1);
        }
    }

    /**
     * 广播--->无参数的事件回调
     * @param eventType 事件类型
     */
    public static Broadcast(eventType: EventType) {
        let callbacks = EventCenter.Listenter[eventType];
        if (callbacks.length > 0) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i].Callback();
            }
        } else {
            console.error("广播对象为空");
        }
    }

    /**
     * 广播--->一个参数的事件回调
     * @param eventType 事件类型
     * @param param 参数
     */
    public static BroadcastOne<T>(eventType: EventType, param: T) {
        let callbacks = EventCenter.Listenter[eventType];
        if (callbacks.length > 0) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i].Callback(param);
            }
        } else {
            console.error("广播对象为空");
        }
    }

    /**
     * 广播--->两个参数的事件回调
     * @param eventType 事件类型
     * @param param_1 回调函数第一个参数
     * @param param_2 回调函数第二个参数
     */
    public static BroadcasTwo<T, Q>(eventType: EventType, param_1: T, param_2: Q) {
        let callbacks = EventCenter.Listenter[eventType];
        if (callbacks.length > 0) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i].Callback(param_1, param_2);
            }
        } else {
            console.error("广播对象为空");
        }
    }

    /**
     * 广播--->三个参数的事件回调
     * @param eventType 事件类型
     * @param param_1 回调函数第一个参数
     * @param param_2 回调函数第二个参数
     * @param param_3 回调函数第三个参数
     */
    public static BroadcasThree<T, Q, X>(eventType: EventType, param_1: T, param_2: Q, param_3: X) {
        let callbacks = EventCenter.Listenter[eventType];
        if (callbacks.length > 0) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i].Callback(param_1, param_2, param_3);
            }
        } else {
            console.error("广播对象为空");
        }
    }

    /**
     * 广播--->四个参数的事件回调
     * @param eventType 事件类型
     * @param param_1 回调函数第一个参数
     * @param param_2 回调函数第二个参数
     * @param param_3 回调函数第三个参数
     * @param param_4 回调函数第四个参数
     */
    public static BroadcasFour<T, Q, X, Y>(eventType: EventType, param_1: T, param_2: Q, param_3: X, param_4: Y) {
        let callbacks = EventCenter.Listenter[eventType];
        if (callbacks.length > 0) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i].Callback(param_1, param_2, param_3, param_4);
            }
        } else {
            console.error("广播对象为空");
        }
    }

    /**
     * 广播--->五个参数的事件回调
     * @param eventType 事件类型
     * @param param_1 回调函数第一个参数
     * @param param_2 回调函数第二个参数
     * @param param_3 回调函数第三个参数
     * @param param_4 回调函数第四个参数
     * @param param_5 回调函数第五个参数
     */
    public static BroadcasFive<T, Q, X, Y, S>(eventType: EventType, param_1: T, param_2: Q, param_3: X, param_4: Y, param_5: S) {
        let callbacks = EventCenter.Listenter[eventType];
        if (callbacks.length > 0) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i].Callback(param_1, param_2, param_3, param_4, param_5);
            }
        } else {
            console.error("广播对象为空");
        }
    }
}

/**
 * @class 回调函数类
 */
class Callback {
    /**
     * @property 回调函数
     */
    public Callback: Function = null;
    /**
     * @property 回调函数所属类型
     */
    public Call_Class: string = null;

    /**
     * 构造函数
     * @param callback 回调函数
     * @param call_class 回调函数所属类型
     */
    constructor(callback: Function, call_class: string) {
        this.Callback = callback;
        this.Call_Class = call_class;
    }
}
