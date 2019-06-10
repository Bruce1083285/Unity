var onfire = require('onfire');
cc.Class({
    extends: cc.Component,

    properties: {
        _allEvents: null,
    },

    /**
     * 添加消息监听（执行一次之后自动销毁）
     * @param {*} event 
     * @param {*} callback 
     */
    addHandleOnce(event, callback) {
        onfire.un(event);
        onfire.one(event, callback);
    },

    /**
     * 移除单个事件
     * @param {事件名} event 
     */
    removeHandle(event) {
        onfire.un(event);
    },

    /**
     * 清除所有消息事件
     */
    clearAllHandle() {
        onfire.clear();
    },

    /**
     * 清除指定类型handle
     * @param {}} target 
     */
    clearHandle(target) {
        if (!this._allEvents) {
            return;
        }
        if (this._allEvents[target.name]) {
            let events = this._allEvents[target.name];
            for (let i = 0; i < events.length; i++) {
                onfire.un(events[i]);
            }
        }
    },

    /**
     * 添加事件
     * @param {事件名} event 
     * @param {回调} callback 
     */
    addHandle(event, callback, target) {
        // onfire.un(event);
        if (target) {
            if (!this._allEvents) {
                this._allEvents = {};
            }
            if (this._allEvents[target.name]) {
                this._allEvents[target.name].push(event);
            } else {
                this._allEvents[target.name] = [];
                this._allEvents[target.name].push(event);
            }
        }
        onfire.on(event, callback);
    },

    /**
     * 发送事件
     * @param {事件名} event 
     * @param {数据} data 
     */
    sendHandle(event, data) {
        onfire.fire(event, data);
    },

});
