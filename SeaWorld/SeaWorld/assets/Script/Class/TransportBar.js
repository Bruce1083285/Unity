cc.Class({
    extends: cc.Component,

    properties: {
        star_x: 0,
        spacing: 80,
        barNum: 12,

        end_x_g: 720,
        star_x_g: 0,
        width_g: 100,

        _speed: 0,

        _Level: 0,
        _Next_Price: 0,

        Node_Bars: cc.Node,
        Node_Guest: cc.Node,

        SpriF_Bar: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.setBars();
        this.setGuest();
    },

    init(level) {
        var data = null;
        if (typeof (level) == 'number') {
            data = DataHelper.setTransportData(level, this.width_g);
        } else {
            data = level;
        }
        this._Speed = data.speed;
        this._Level = data.level;
        this._Next_Price = data.nextPrice;
        this._Next_Speed = data.nextSpeed;
    },

    toUpLevel(level) {
        DataHelper.setGoldNum(BigNumber(DataHelper.Gold_Num).minus(this._Next_Price).toString());
        this._Level = level;
        var data = DataHelper.setTransportData(this._Level, this.width_g);
        this.init(data);
        return data;
    },

    setGuest() {
        for (let i = 0; i < 7; i++) {
            var guestNode = this.getGuestNode();
            guestNode.getComponent('Guest').initData(this.getGuestType());
            guestNode.x = this.end_x_g - i * this.width_g;
            guestNode.y = -10;
            guestNode.zIndex = 7 - i;
            // guestNode.tag = i;
            guestNode.anchorY = 0;
            this.guestNode = guestNode;
            this.Node_Guest.addChild(guestNode);
        }
        // this.beginMove();
    },

    getGuestNode(guestType) {
        var guestNode = GuestPool.get();
        if (!guestNode) {
            var guestNode = new cc.Node('guest_' + guestType);
            // fishNode.anchorX = 1;
            guestNode.scaleX = -0.5;
            guestNode.scaleY = 0.5;
            guestNode.addComponent(cc.Sprite);
            guestNode.addComponent('Guest');
            guestNode.addComponent(cc.Animation);
        }
        return guestNode;
    },

    getGuestType() {
        var num = GameTools.GetRandom(1, 100);
        var result = 1;
        if (GameConfig.Game_Type == 1) {
            if (num > 0 && num <= 60) {
                result = GameTools.GetRandom(1, 4);
            } else if (num > 60 && num <= 85) {
                result = GameTools.GetRandom(5, 7);
            } else if (num > 85 && num <= 95) {
                result = GameTools.GetRandom(8, 9);
            } else {
                result = 10;
            }
        } else if (GameConfig.Game_Type == 2) {
            if (num > 0 && num <= 40) {
                result = GameTools.GetRandom(1, 4);
            } else if (num > 40 && num <= 70) {
                result = GameTools.GetRandom(5, 7);
            } else if (num > 70 && num <= 85) {
                result = GameTools.GetRandom(8, 9);
            } else {
                result = 10;
            }
        } else {
            if (num > 0 && num <= 10) {
                result = GameTools.GetRandom(1, 4);
            } else if (num > 10 && num <= 60) {
                result = GameTools.GetRandom(5, 7);
            } else if (num > 60 && num <= 80) {
                result = GameTools.GetRandom(8, 9);
            } else {
                result = 10;
            }
        }
        return result;
    },

    setBars() {
        for (let i = 0; i < this.barNum; i++) {
            var node = new cc.Node('Bar_' + (i + 1));
            node.addComponent(cc.Sprite).spriteFrame = this.SpriF_Bar;
            node.x = this.star_x + this.spacing * i;
            node.y = 6;
            this.Node_Bars.addChild(node);
        }
    },
    beginMove(endCallback, addCallback) {
        this.currenNum = 0;
        this.countNum = GameSceneData.submarine.count;
        this._speed = this._Speed * this.width_g;
        console.log('transport------->' + this._speed);
        if (endCallback) {
            this.endCallback = endCallback;
        }
        if (addCallback) {
            this.addCallback = addCallback;
        }
        this.types = [];
        this.toMove = true;

    },
    update(dt) {
        if (!this.toMove) {
            return;
        }

        let children = this.Node_Bars.children;
        for (let i = 0; i < children.length; i++) {
            var node = children[i];
            node.x -= dt * this._speed;
            if (node.x < this.star_x) {
                node.x += this.spacing * this.barNum;
            }
        }

        let children_g = this.Node_Guest.children;
        for (let j = 0; j < children_g.length; j++) {
            var element = children_g[j];
            element.x -= dt * this._speed;
            if (element.x < this.star_x_g) {
                element.x += this.width_g * 7;
                element.zIndex += 10;
                // this.types.push(element.type);
                if (this.addCallback) {
                    this.addCallback(element.type, this.countNum);
                }
                element.getComponent('Guest').initData(this.getGuestType());
                this.currenNum++;
            }
        }
        if (this.currenNum == this.countNum) {
            this.toMove = false;
            this.currenNum = 0;
            if (this.endCallback) {
                this.endCallback();
            }
        }
    },
});
