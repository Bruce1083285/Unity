// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        init_Y: 0,

        _Level: 0,
        _Speed: 0,
        _Count: 0,
        _Next_Speed: 0,
        _Next_Count: 0,
        _Next_Price: 0,
        _Guest_Pool: cc.NodePool,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    toUpLevel(level) {
        DataHelper.setGoldNum(BigNumber(DataHelper.Gold_Num).minus(this._Next_Price).toString());
        this._Level = level;
        var data = DataHelper.setSubmarineData(this._Level);
        this.init(data);
        return data;
    },

    init(level) {
        var data = null;
        if (typeof (level) == 'number') {
            data = DataHelper.setSubmarineData(level);
        } else {
            data = level;
        }
        this._Level = data.level;
        this._Speed = data.speed;
        // this._Speed_Down = data.speed_down;
        // this._Speed_Up = data.speed_up;
        this._Count = data.count;
        this._Next_Speed = data.nextSpeed;
        this._Next_Count = data.nextCount;
        this._Next_Price = data.nextPrice;
        this.Num = 0;
        if (!this._Guest_Pool) {
            this._Guest_Pool = new cc.NodePool();
            this.GuestNode = new cc.Node('guest');
            this.GuestNode.y = -18;
            this.GuestNode.x = 0;
            this.GuestNode.addComponent(cc.Sprite);
            for (let i = 0; i < this._Count; i++) {
                this._Guest_Pool.put(this.GuestNode);
            }
        }

    },

    getGuestNode() {
        let node = this._Guest_Pool.get();
        if (!node) {
            node = cc.instantiate(this.GuestNode);
        }
        return node;
    },

    addGuest(guest, count) {
        let posi = cc.v2(0, 0);
        if (count != 1) {
            posi.x = GameTools.GetRandom(-40, 50);
        }
        let node = this.getGuestNode();
        node.parent = cc.find('guests', this.node);
        cc.loader.loadResDir('Texture/guest/dh' + guest, cc.SpriteFrame, (err, frames) => {
            node.getComponent(cc.Sprite).spriteFrame = frames[0];
            node.setPosition(posi);
            node.active = true;
        });

        // if (count == 1) {
        //     cc.loader.loadResDir('Texture/guest/dh' + guest, cc.SpriteFrame, (err, frames) => {
        //         cc.find('0', this.node).getComponent(cc.Sprite).spriteFrame = frames[0];
        //         cc.find('0', this.node).x = -10;
        //         cc.find('0', this.node).active = true;
        //         cc.find('1', this.node).active = false;
        //     });
        // } else {
        //     this.Num++;
        //     cc.loader.loadResDir('Texture/guest/dh' + guest, cc.SpriteFrame, (err, frames) => {
        //         let name = this.Num % 2 + '';
        //         cc.find(name, this.node).getComponent(cc.Sprite).spriteFrame = frames[0];
        //         cc.find(name, this.node).active = true;
        //     });
        // }
    },

    removeGuest() {
        let guestsNode = cc.find('guests', this.node).children;
        let len = guestsNode.length;
        let time = 1 / GameSceneData.transport.speed;
        if (len > 0) {
            let node = guestsNode[len - 1];
            this.scheduleOnce(() => {
                this._Guest_Pool.put(node);
                this.removeGuest();
            }, time);
        } else {
            this.endCallback();
        }
    },

    starMove(callback) {
        this.endCallback = callback;
        let time = (GameSceneData.fishbowls.length) / this._Speed;
        let lastFishBowl = GameSceneData.fishbowls[GameSceneData.fishbowls.length - 1];
        let len = 0;
        if (lastFishBowl.level < 1) {
            len = GameSceneData.fishbowls.length - 1;
        } else {
            len = GameSceneData.fishbowls.length;
        }
        let moveLen = (GameConfig.HEIGHT_FB * len - this.node.height - (len - 1) * 16);
        this.node.runAction(cc.sequence(cc.moveBy(time, 0, -moveLen), cc.moveBy(time, 0, moveLen), cc.callFunc(() => {
            // cc.find('0', this.node).active = false;
            // cc.find('1', this.node).active = false;
            this.removeGuest();
        })));
        // this.Num = 0;
        // console.time('down');
        // this.direction = 'down';


        // this.startMove = true;
        DataHelper.refreshGold();
    },

    start() {
        this.direction = 'end';
    },

    getHeight() {
        this.end_y = this.init_Y - (GameConfig.HEIGHT_FB * (GameSceneData.fishbowls.length) - this.node.height - (GameSceneData.fishbowls.length - 1) * 16);
    },

    update(dt) {
        // if (!this.startMove) {
        //     return;
        // }
        // this.getHeight();

        // if (this.direction == 'up') {
        //     this.node.y += dt * this._Speed_Up;
        // }

        // if (this.direction == 'down') {
        //     this.node.y -= dt * this._Speed_Down;
        // }

        // if (this.node.y < this.end_y) {
        //     // console.log('this.node.y------->'+this.node.y);
        //     // console.log('this.end_y------->'+this.end_y); 
        //     console.timeEnd('down');
        //     this.node.y = this.end_y + 2;
        //     this.startMove = false;
        //     setTimeout(() => {
        //         this.direction = 'up';
        //         this.startMove = true;
        //         console.time('up');
        //     }, 1000);

        // } else if (this.init_Y - this.node.y <= 0) {
        //     this.direction = 'end';
        //     this.node.y = this.init_Y - 1;
        //     // console.log('end------->');
        //     console.timeEnd('up');
        //     cc.find('0', this.node).active = false;
        //     cc.find('1', this.node).active = false;
        //     this.endCallback();
        // }
    },
});
