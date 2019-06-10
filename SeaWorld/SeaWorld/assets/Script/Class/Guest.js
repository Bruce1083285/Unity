cc.Class({
    extends: cc.Component,

    properties: {

    },


    // LIFE-CYCLE CALLBACKS:
    initData(type) {
        this.Type = type;
        this.node.type = type;
        var clips = this.node.getComponent(cc.Animation).getClips();
        for (let i = 0; i < clips.length; i++) {
            let clip = clips[i];
            this.node.getComponent(cc.Animation).removeClip(clip, true);
        }

        let urls = [];
        for (let i = 1; i < 7; i++) {
            let url = 'Texture/allguest/guest_' + type + '_' + i;
            urls.add(url);
        }
        // 
        cc.loader.loadResArray(urls, cc.SpriteFrame, (err, frames) => {
            if (err) {
                return;
            }
            var fish_clip = cc.AnimationClip.createWithSpriteFrames(frames, 10);
            fish_clip.name = "anim_run";
            fish_clip.wrapMode = cc.WrapMode.Loop;
            this.node.getComponent(cc.Animation).addClip(fish_clip);
            this.node.getComponent(cc.Animation).play("anim_run");
        });

        // cc.loader.loadResDir('Texture/guest/dh' + type, cc.SpriteFrame, (err, frames) => {
        //     var fish_clip = cc.AnimationClip.createWithSpriteFrames(frames, 10);
        //     fish_clip.name = "anim_run";
        //     fish_clip.wrapMode = cc.WrapMode.Loop;
        //     this.node.getComponent(cc.Animation).addClip(fish_clip);
        //     this.node.getComponent(cc.Animation).play("anim_run");
        // });
    },
    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
