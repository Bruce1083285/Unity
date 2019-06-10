
cc.Class({
    extends: cc.Component,

    properties: {
        Type: 1,                 //1-10共有10类鱼
        Speed: 0,                //鱼移动速度
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    initData(type) {
        this.Type = type;
        this.Speed = (type/4+3)*10;
        var clips = this.node.getComponent(cc.Animation).getClips();
        for (let i = 0; i < clips.length; i++) {
            this.node.getComponent(cc.Animation).removeClip(clip, true);
        }
        let urls = [];
        for (let i = 1; i < 7; i++) {
            let url = 'Texture/allfish/fish_'+type+'_'+i;
            urls.add(url);
        }
        // 
        cc.loader.loadResArray(urls,cc.SpriteFrame, (err, frames) => {
            if (err) {
                return;
            }
            this.node.width = frames[0]._rect.size.width;
            this.node.height = frames[0]._rect.size.height;
            if (this.node.width>100) {
                this.node.scale = 100/this.node.width;
            }
            var fish_clip = cc.AnimationClip.createWithSpriteFrames(frames, 10);
            fish_clip.name = "anim_run";
            fish_clip.wrapMode = cc.WrapMode.Loop;
            this.node.getComponent(cc.Animation).addClip(fish_clip);
            this.node.getComponent(cc.Animation).play("anim_run");
        });

        // cc.loader.loadResDir('Texture/fish/'+this.Type, cc.SpriteFrame, (err, frames) => {
        //     if (err) {
        //         return;
        //     }
        //     this.node.width = frames[0]._rect.size.width;
        //     this.node.height = frames[0]._rect.size.height;
        //     if (this.node.width>100) {
        //         this.node.scale = 100/this.node.width;
        //     }
        //     var fish_clip = cc.AnimationClip.createWithSpriteFrames(frames, 10);
        //     fish_clip.name = "anim_run";
        //     fish_clip.wrapMode = cc.WrapMode.Loop;
        //     this.node.getComponent(cc.Animation).addClip(fish_clip);
        //     this.node.getComponent(cc.Animation).play("anim_run");
        // });
        
    },

    start() {

    },

    // update (dt) {},
});
