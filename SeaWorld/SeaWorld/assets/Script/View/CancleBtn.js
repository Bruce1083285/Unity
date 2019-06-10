cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            this.node.runAction(cc.scaleTo(0.1,0.9));
        });
        this.node.on(cc.Node.EventType.TOUCH_END,()=>{
            this.node.runAction(cc.sequence(cc.scaleTo(0.1,1),cc.callFunc(()=>{
                if (this.node.parent.parent) {
                    this.node.parent.parent.active = false;
                }else{
                    this.node.parent.active = false;
                }
            })));
        });
    },
    
});
