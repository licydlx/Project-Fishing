// 要干什么
// 飞碟 omo 线
// 飞碟移动 屏幕点击 omo移动 飞碟与omo连线 捕获检测

cc.Class({
    extends: cc.Component,

    properties: {
        fish: {
            default: [],
            type: [cc.Prefab]
        },

        gem: {
            default: null,
            type: cc.Prefab
        },

        timeProgress: {
            type: cc.ProgressBar,
            default: null
        },

        rankProgress: {
            type: cc.ProgressBar,
            default: null
        },

        shipSpr: {
            default: [],
            type: [cc.SpriteFrame]
        },

        scoreList: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.COVER = this.node.parent.getChildByName("cover");
        this.coverDown = true;
        let startButton = this.COVER.getChildByName("start");
        if (startButton) {
            startButton.on(cc.Node.EventType.TOUCH_START, function (event) {
                this.coverDown = false;
                this.COVER.setPosition(-500, 0);
                setTimeout(function () {
                    this.init();
                }.bind(this), 10);

            }, this);
        }

        let flyShip = this.node.getChildByName("flyShip");
        this.SHIP = flyShip.getChildByName("ship");
        this.LINE = flyShip.getChildByName("line").getComponent(cc.Graphics);
        this.OMO = flyShip.getChildByName("omo");
        this.HARPOON = flyShip.getChildByName("harpoon");
        this.GAMEVICTORY = this.node.getChildByName("gameVictory");
        this.GAMEFAIL = this.node.getChildByName("gameFail");

        // 1.飞碟移动
        // 监听鼠标位置,移动飞船位置
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.globalClick, this);

        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            if (!this.coverDown) return;
            let location = event.getLocation();
            let pos = this.node.convertToNodeSpaceAR(location);
            this.SHIP.setPosition(pos.x, -150);
            if (this.FLAG) this.OMO.setPosition(pos.x, -150);
            pos.y = -150;
            this.moveToPos = pos;
        }, this);


        // 捕鱼成功，OMO回家睡觉觉
        this.node.on('retakeOMO', function (event) {
            event.stopPropagation();
            if (!(this.OMO.rank < event.detail.rank)) this.fishTarget = event.detail;
            this.isLaunchOMO = false;
            this.retakeOMO();
            
        }.bind(this));

        // 捕获宝石，增加游戏时间
        // 红：5秒；黄：3秒；
        this.node.on('addTime', function (event) {
            event.stopPropagation();
            console.log(event);
            // 添加时间
            let addTime = parseInt(event.detail.addTime)/60;
            this.timeProgress.progress = this.timeProgress.progress + addTime;

            // 销毁宝石
            let fishPool = this.node.getChildByName('fishPool');
            let gem = fishPool.getChildByName('gem');
            gem.destroy();
            this.gemSub = null;
        }.bind(this));   
    },

    globalClick(event) {
        if (!this.coverDown) return;
        let location = event.getLocation();
        let pos = this.node.convertToNodeSpaceAR(location);
        this.SHIP.setPosition(pos.x, -150);
        if (this.FLAG) {
            this.FLAG = false;
            // 显示鱼叉
            this.HARPOON.setPosition(pos.x, pos.y);
            let action = cc.sequence(
                cc.fadeIn(.1),
                cc.fadeOut(1)
            );
            this.HARPOON.runAction(action);
            this.launchOMO(pos);
        }
    },

    init() {
        this.GAMEVICTORY.runAction(cc.hide());
        this.GAMEFAIL.runAction(cc.hide());
        this.OMO.runAction(cc.hide());
        this.HARPOON.runAction(cc.fadeOut(.1));

        this.countDown = true;
        this.FLAG = true;
        this.coverDown = true;

        this.timeProgress.progress = 1;
        this.rankProgress.progress = 0;

        this.OMO.rank = 1;
        this.SHIP.scale = .8;
        this.OMO.scale = .8;
        this.HARPOON.scale = .4;
        this.LINE.lineWidth = .8;

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.globalClick, this);
        // 飞船长大
        let seq = cc.sequence(
            cc.scaleTo(.2, .2),
            cc.scaleTo(.4, .4),
            cc.scaleTo(.6, .6),
            cc.scaleTo(.8, .8),
        );

        setTimeout(function () {
            this.createDeaultFish();
        }.bind(this), 1000);

        this.SHIP.runAction(seq);
    },

    gameVictory() {
        this.GAMEVICTORY.runAction(cc.show());
        this.reloadGame();
    },

    gameFail() {
        let fishPool = this.node.getChildByName('fishPool');
        fishPool.removeAllChildren(true);
        this.GAMEFAIL.runAction(cc.show());
        this.reloadGame();
    },

    reloadGame() {
        //this.isRetake = false;
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.globalClick, this);

        setTimeout(function () {
            this.GAMEVICTORY.runAction(cc.hide());
            this.GAMEFAIL.runAction(cc.hide());
            this.COVER.setPosition(0, 0);
        }.bind(this), 2000);
    },

    shipRise() {
        this.createGem();
        console.log('飞船升级');
        let sprite = this.SHIP.getComponent(cc.Sprite);
        sprite.spriteFrame = this.shipSpr[this.OMO.rank - 1];

        this.SHIP.scale = this.SHIP.scale + .1;
        this.OMO.scale = this.OMO.scale + .1;
        this.HARPOON.scale = this.HARPOON.scale + .05;
        this.LINE.lineWidth = this.LINE.lineWidth + .1;
    },

    // 生产宝石
    createGem(){
        let gem = cc.instantiate(this.gem);
        gem.parent = this.node.getChildByName('fishPool');
        gem.setPosition(getRandomNum(120),150);
        this.gemSub = gem;
    },

    // 返回 -1 至 1
    getRandomNum(mul) {
        if (!mul) mul = 1;
        return Math.random() > .5 ? -Math.round(Math.random() * mul) : Math.round(Math.random() * mul);
    },

        
    createDeaultFish() {
        let num;
        let bigNum;
        let seq;
        let bigSeq;
        let rank;
        let bigRank;
        switch (this.OMO.rank) {
            case 1:
                num = 4;
                bigNum = 1;
                seq = 0;
                bigSeq = 1;
                rank = 1;
                bigRank = 2;
                break;

            case 2:
                num = 3;
                bigNum = 2;
                seq = 1;
                bigSeq = 2;
                rank = 2;
                bigRank = 3;
                break;

            case 3:
                num = 3;
                bigNum = 2;
                seq = 2;
                bigSeq = 3;
                rank = 3;
                bigRank = 4;
                break;
            case 4:
                num = 5;
                seq = 3;
                rank = 4;
                break;
        }

        // 小鱼
        for (let index = 0; index < num; index++) {
            let fish = cc.instantiate(this.fish[seq]);
            fish.rank = rank;
            fish.parent = this.node.getChildByName('fishPool');
        }

        if (rank == 4) return;
        for (let index = 0; index < bigNum; index++) {
            let fish = cc.instantiate(this.fish[bigSeq]);
            fish.rank = bigRank;
            fish.parent = this.node.getChildByName('fishPool');
        }
    },

    // 生成小鱼 
    createFish() {
        let fish = cc.instantiate(this.fish[this.OMO.rank - 1]);
        fish.rank = this.OMO.rank;
        fish.parent = this.node.getChildByName('fishPool');
    },
    // 发射OMO
    launchOMO(worldPos) {
        this.OMO.runAction(cc.show());
        this.OMO.setPosition(worldPos.x, -140);
        this.isLaunchOMO = true;
        this.OMOtoY = worldPos.y;
    },

    // 回收OMO
    retakeOMO() {
        this.isRetake = true;
        this.OMO.angle = 180;
    },

    // 绘制线
    drawLine(shipPos, omoPos) {
        this.LINE.clear();
        this.LINE.moveTo(shipPos.x, shipPos.y);
        this.LINE.lineTo(omoPos.x, omoPos.y);
        this.LINE.stroke();
    },

    addRankProgress() {
        let progressBar = this.rankProgress;
        let progress = progressBar.progress;
        if (progress < 1) {
            progress = progress + .2;
            this.createFish();
        } else {
            console.log('升级');
            // 鱼升级
            this.OMO.rank = this.OMO.rank + 1;
            let rankLabel = this.node.getChildByName('rank').getComponent(cc.Label);
            rankLabel.string = this.OMO.rank;
            let fishPool = this.node.getChildByName('fishPool');
            fishPool.removeAllChildren(true);

            if (this.OMO.rank < 4) {
                this.createDeaultFish();
                this.shipRise();
                progress = 0;
            } else {
                this.countDown = false;
                this.gameVictory();
            }
        }
        progressBar.progress = progress;
    },

    _updateProgressBar: function (progressBar, dt) {
        let progress = progressBar.progress;
        if (progress > 0) {
            progress -= dt * 1/60;
            progressBar.progress = progress;
        } else {
            this.countDown = false;
            this.gameFail();
        }
    },

    update(dt) {
        // 倒计时
        if (this.countDown) {
            this._updateProgressBar(this.timeProgress, dt);
        }

        if(this.gemSub){
            this.gemSub.y -= 90 * dt;
        }

        if (!this.FLAG) this.drawLine(this.SHIP, this.OMO);

        if (this.isLaunchOMO) {
            let OMOcurPos = this.OMO.y + 120 * dt;
            this.OMO.setPosition(this.OMO.x, OMOcurPos);
            if (this.OMOtoY < OMOcurPos) {
                this.isLaunchOMO = false;
                this.retakeOMO();
            }
        }

        if (this.isRetake) {
            var oldPos = this.OMO.position;

            var direction = this.moveToPos.sub(oldPos).normalize();
            var newPos = oldPos.add(direction.mul(120 * dt));
            this.OMO.setPosition(newPos);
            if (this.fishTarget) {
                newPos.x = newPos.x;
                newPos.y = newPos.y;
                let newFishPosX = newPos.x + 10;
                let newFishPosY = newPos.y - 10;
                this.fishTarget.setPosition(newFishPosX, newFishPosY);
            }

            this.drawLine(this.SHIP, this.OMO);
            var gap = Math.pow(Math.abs(oldPos.x - newPos.x), 2) + Math.pow(Math.abs(-150 - newPos.y), 2);
            if (gap < 20) {
                if (this.fishTarget) {
                    this.fishTarget.removeFromParent();
                    this.fishTarget = null;
                    this.addScore(this.OMO.rank);
                    this.addRankProgress();
                }
                this.OMO.runAction(cc.hide());
                this.isRetake = false;
                this.FLAG = true;
            }
        }
    },

    // 加分动效
    addScore(seq) {
        let scoreNode = this.SHIP.getChildByName("score");
        let score = scoreNode.getComponent(cc.Sprite);
        score.spriteFrame = this.scoreList[seq - 1];
        let action = cc.sequence(cc.fadeIn(.2), cc.fadeOut(1));
        scoreNode.runAction(action);
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        //cc.director.getCollisionManager().enabledDebugDraw = false;
    },

});
