cc.Class({
    extends: cc.Component,
    properties: {
        loadingImg: cc.Node,            //加载图片
    },

    // use this for initialization
    onLoad: function () {
    },

    // 控制图片旋转
    update: function (dt) {
        this.loadingImg.rotation = this.loadingImg.rotation + dt * 300;
    },

    // 显示加载圈
    show: function () {
        try {
            this.node.active = true;
            this.loadingImg.parent.active = true;
        } catch (error) {
            return;
        }

        this.timeHideFn = () => {
            Loading.hide();
        }
        this.scheduleOnce(this.timeHideFn, 10);
    },

    // 隐藏加载圈
    hide: function () {
        if (this.timeFn) {
            this.unschedule(this.timeFn);
        }
        if (this.timeHideFn) {
            this.unschedule(this.timeHideFn);
        }
        if (this.node) {
            this.node.active = false;
            this.loadingImg.parent.active = false;
        }
    },

    // 显示加载圈
    showM: function () {
        this.node.active = true;
        if (this.timeFn) {
            this.unschedule(this.timeFn);
        } else {
            this.timeFn = () => {
                if (this.node) {
                    this.loadingImg.parent.active = true;
                }
            }
        }
        this.scheduleOnce(this.timeFn, 1);

        if (this.timeHideFn) {
            this.unschedule(this.timeHideFn);
        } else {
            this.timeHideFn = () => {
                if (this.node) {
                    this.node.active = false;
                    this.loadingImg.parent.active = false;
                }
            }
        }
        this.scheduleOnce(this.timeHideFn, 10);
    },
});