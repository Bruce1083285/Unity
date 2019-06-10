cc.Class({
    extends: cc.Component,
    properties: {

    },
    
    onLoad: function () {
        this.setupSpriteFrame();
    },

    setupSpriteFrame: function () {
        if (this._spriteFrame) {
            var spr = this.getComponent(cc.Sprite);
            if (spr) {
                spr.spriteFrame = this._spriteFrame;
            }
        }
    },

    setImgUrl: function (url) {
        var self = this;
        if (cc.vv.images != null && cc.vv.images[url] != null) {
            self._spriteFrame = cc.vv.images[url];
            self.setupSpriteFrame();
            return;
        }
        if (!url) {
            return;
        }
        cc.loader.load({ url: url, type: "jpg" }, (err, tex) => {
            var n = self.node;
            if (!n) {
                return;
            }
            var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, n.width, n.height));
            self._spriteFrame = spriteFrame;
            self.setupSpriteFrame();
            if (cc.vv.images == null) {
                cc.vv.images = {};
            }
            cc.vv.images[url] = spriteFrame;
        });
    },
});