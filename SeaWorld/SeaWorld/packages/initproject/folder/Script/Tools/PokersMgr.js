
cc.Class({
    extends: cc.Component,

    properties: {
        pokersFrame: cc.SpriteAtlas,
        emptyFrame: cc.SpriteFrame,
        vipsFrame:cc.SpriteAtlas,
        Pre_VIP_TYPE_1: cc.Prefab,
        Pre_VIP_TYPE_2: cc.Prefab,
        Pre_VIP_TYPE_3: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.PokersMgr = this;
        window.pokersFrame = this.pokersFrame;
        window.emptyFrame = this.emptyFrame;
        // cc.moveTo
    },

    getPokerSpriteFrameByName(name) {
        return window.pokersFrame.getSpriteFrame(name);
    },

    getEmptyPokerSpriteFrame() {
        return window.emptyFrame;
    },

    getPokerTitle(color) {
        switch (color) {
            case 3:
                return 'ht_';
            case 2:
                return 'hot_';
            case 1:
                return 'mh_';
            case 0:
                return 'fp_';
            default:
                break;
        }
    },

    getPokerFrameWithID(card) {
        var url = '';
        var title = this.getPokerTitle(parseInt((card - 1) / 13));
        var value = card % 13;
        if (value == 0) {
            value = 13;
        }
        url = title + value;
        return window.PokersMgr.getPokerSpriteFrameByName(url);
    },

    // 1土豪（12万） 2大款（8万） 3老板（5万） 4赌王（3万） 
    // 5赌侠（2万） 6财主（1万） 7商人（6千） 8掌柜（4千） 
    // 9富农（2千） 10渔夫（1千） 11平民
    getVipNodeByVip(vip){
        vip = 11-vip;
        if (vip==0) {
            return new cc.Node();
        }
        if (vip>0&&vip<4) {
            return this.getVipTypeOne(vip);
        }
        if (vip>=4&&vip<10) {
            return this.getVipTypeTwo(vip);
        }
        if (vip>=10) {
            return this.getVipTypeThree(vip);
        }
    },

    getVipTypeOne(vip){
        let vipNode = cc.instantiate(this.Pre_VIP_TYPE_1);
        let vip_frame = this.vipsFrame.getSpriteFrame('vip_'+vip);
        cc.find('vip',vipNode).getComponent(cc.Sprite).spriteFrame = vip_frame;
        return vipNode;
    },

    getVipTypeTwo(vip){
        let vipNode = cc.instantiate(this.Pre_VIP_TYPE_2);
        let vip_frame = this.vipsFrame.getSpriteFrame('vip_'+vip);
        let vip_frame_ = this.vipsFrame.getSpriteFrame('vip_'+vip+'_');
        cc.find('vip',vipNode).getComponent(cc.Sprite).spriteFrame = vip_frame;
        cc.find('vip_',vipNode).getComponent(cc.Sprite).spriteFrame = vip_frame_;
        return vipNode;
    },

    getVipTypeThree(vip){
        let vipNode = cc.instantiate(this.Pre_VIP_TYPE_3);
        let vip_frame = this.vipsFrame.getSpriteFrame('vip_'+vip);
        cc.find('vip',vipNode).getComponent(cc.Sprite).spriteFrame = vip_frame;
        return vipNode;
    },

    start() {

    },

    // update (dt) {},
});
