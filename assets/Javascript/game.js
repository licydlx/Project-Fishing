
const toolBox = require("toolBox");
const getRandomNum = toolBox.getRandomNum;
const getNumFromAssign = toolBox.getNumFromAssign;
const curNodeCoordinate = toolBox.curNodeCoordinate;
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
        this.FLYSHIP = this.node.getChildByName("flyShip");
        this.SHIP = this.FLYSHIP.getChildByName("ship");
        this.LINE = this.FLYSHIP.getChildByName("line").getComponent(cc.Graphics);
        this.OMO = this.FLYSHIP.getChildByName("omo");
        this.HARPOON = this.FLYSHIP.getChildByName("harpoon");
        this.GAMEVICTORY = this.node.getChildByName("gameVictory");
        this.GAMEFAIL = this.node.getChildByName("gameFail");

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

        // 调整飞船位子
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this._positionChange, this);

        // 监听鼠标位置,移动飞船位置并发射OMO
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this._fishing, this);

        // 捕鱼成功，OMO回家睡觉觉
        this.node.on('retakeOMO', this._retakeOMO, this);

        // 捕获宝石，增加游戏时间
        // 红：5秒；黄：3秒；
        this.node.on('addTime', this._addTime, this);
    },

    init() {
        this.GAMEVICTORY.runAction(cc.hide());
        this.GAMEFAIL.runAction(cc.hide());
        this.OMO.runAction(cc.hide());
        this.HARPOON.runAction(cc.fadeOut(.1));

        this.countDown = true;
        this.FLAG = true;
        this.coverDown = true;
        this.gemTime = getNumFromAssign([5,6,7,8]);

        this.timeProgress.progress = 1;
        this.rankProgress.progress = 0;

        this.OMO.rank = 1;
        this.SHIP.scale = .8;
        this.OMO.scale = .8;
        this.HARPOON.scale = .4;
        this.LINE.lineWidth = .8;


        // 飞船长大
        let seq = cc.sequence(
            cc.scaleTo(.2, .2),
            cc.scaleTo(.4, .4),
            cc.scaleTo(.6, .6),
            cc.scaleTo(.8, .8),
        );

        setTimeout(function () {
            this._createDeaultFish();
        }.bind(this), 1000);

        this.SHIP.runAction(seq);

    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        //cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    update(dt) {
        if(this.gemTime){
            this.gemTime -= dt*1/2;
            if(this.gemTime < 0){
                this.gemTime = null;
                this._createGem();
            }
        }

        if (this.gemSub) {
            this.gemSub.y -= 120 * dt;
        }

        // 倒计时
        if (this.countDown) {
            this._updateProgressBar(this.timeProgress, dt);
        }

        if (!this.FLAG) this._drawLine(this.SHIP, this.OMO);

        // 是否发射OMO
        if (this.isLaunchOMO) {
            let OMOcurPos = this.OMO.y + 120 * dt;
            this.OMO.setPosition(this.OMO.x, OMOcurPos);
            if (this.OMOtoY < OMOcurPos) {
                this.isLaunchOMO = false;
                this._retakeOMO();
            }
        }

        // 是否回收OMO
        if (this.isRetake) {
            // OMO老坐标
            let oldPos = this.OMO.position;
            let direction = this.moveToPos.sub(oldPos).normalize();
            // OMO新坐标
            let newPos = oldPos.add(direction.mul(120 * dt));
            this.OMO.setPosition(newPos);

            // 是否捕到鱼了
            if (this.fishTarget) {
                let newFishPosX = newPos.x + 10;
                let newFishPosY = newPos.y - 10;
                this.fishTarget.setPosition(newFishPosX, newFishPosY);
            }

            // 绘制OMO及飞船之间的线
            this._drawLine(this.SHIP, this.OMO);
            // OMO及飞船间的距离
            let gap = Math.pow(Math.abs(oldPos.x - newPos.x), 2) + Math.pow(Math.abs(-150 - newPos.y), 2);
            if (gap < 20) {
                if (this.fishTarget) {
                    this.fishTarget.removeFromParent();
                    this.fishTarget = null;
                    // 加分
                    this._addScore(this.OMO.rank);
                }

                this.OMO.runAction(cc.hide());
                this.isRetake = false;
                this.FLAG = true;
            }
        }
    },

    // 根据鼠标移动，调整飞船x轴位置
    _positionChange(event) {
        if (!this.coverDown) return;
        let nodeSpacePos = curNodeCoordinate(event,this.node);

        this.SHIP.setPosition(nodeSpacePos.x, -150);
        if (this.FLAG) this.OMO.setPosition(nodeSpacePos.x, -150);
        this.moveToPos = cc.v2(nodeSpacePos.x, -150);
    },

    // 根据点击事件，调整飞船位置及发射OMO捕鱼
    _fishing(event) {
        if (!this.coverDown) return;
        let nodeSpacePos = curNodeCoordinate(event,this.node);

        this.SHIP.setPosition(nodeSpacePos.x, -150);
        if (this.FLAG) {
            this.FLAG = false;
            this._harpoonAnimation(nodeSpacePos);
            this._launchOMO(nodeSpacePos);
        }
    },

    // 鱼叉显示及隐藏
    _harpoonAnimation(nodeSpacePos) {
        this.HARPOON.setPosition(nodeSpacePos.x, nodeSpacePos.y);
        let action = cc.sequence(
            cc.fadeIn(.1),
            cc.fadeOut(1)
        );
        this.HARPOON.runAction(action);
    },

    // 发射OMO
    _launchOMO(nodeSpacePos) {
        this.OMO.runAction(cc.show());
        this.OMO.setPosition(nodeSpacePos.x, -140);
        this.OMO.angle = 0;
        this.OMOtoY = nodeSpacePos.y;

        this.isLaunchOMO = true;
    },

    // 回收OMO
    _retakeOMO(event) {
        console.log(event);
        if (event) {
            event.stopPropagation();
            if (!(this.OMO.rank < event.detail.rank)) this.fishTarget = event.detail;
            this.isLaunchOMO = false;
        } 
        this.OMO.angle = 180;
        this.isRetake = true;
    },

    // 绘制线
    _drawLine(shipPos, omoPos) {
        this.LINE.clear();
        this.LINE.moveTo(shipPos.x, shipPos.y);
        this.LINE.lineTo(omoPos.x, omoPos.y);
        this.LINE.stroke();
    },

    // 生产宝石
    _createGem() {
        let gem = cc.instantiate(this.gem);
        gem.parent = this.node.getChildByName('fishPool');
        gem.setPosition(getRandomNum(120), 150);
        this.gemSub = gem;

        this.gemTime = getNumFromAssign([5,6,7,8]);

        console.log(this.gemTime);
    },

    // 根据宝石添加时间
    _addTime(event) {
        event.stopPropagation();
        // 添加时间
        let addTime = parseInt(event.detail.addTime) / 60;
        this.timeProgress.progress = this.timeProgress.progress + addTime;

        // 销毁宝石
        let fishPool = this.node.getChildByName('fishPool');
        let gem = fishPool.getChildByName('gem');
        gem.destroy();
        this.gemSub = null;
    },

    // 游戏胜利
    _gameVictory() {
        this.GAMEVICTORY.runAction(cc.show());
        this._reloadGame();
    },

    // 游戏失败
    _gameFail() {
        let fishPool = this.node.getChildByName('fishPool');
        fishPool.removeAllChildren(true);
        this.GAMEFAIL.runAction(cc.show());
        this._reloadGame();
    },

    // 重置游戏
    _reloadGame() {
        setTimeout(function () {
            this.GAMEVICTORY.runAction(cc.hide());
            this.GAMEFAIL.runAction(cc.hide());
            this.COVER.setPosition(0, 0);
        }.bind(this), 2000);
    },

    // 飞创升级
    _shipRise() {
        console.log('飞船升级');
        let sprite = this.SHIP.getComponent(cc.Sprite);
        sprite.spriteFrame = this.shipSpr[this.OMO.rank - 1];

        // 飞创逐渐变大
        let action = cc.scaleBy(this.SHIP.scale + .3, this.SHIP.scale + .3);
        action.easing(cc.easeIn(3.0));
        this.SHIP.runAction(action);
        this.SHIP.scale = this.SHIP.scale + .3;

        this.OMO.scale = this.OMO.scale + .2;
        this.HARPOON.scale = this.HARPOON.scale + .08;
        this.LINE.lineWidth = this.LINE.lineWidth + .15;
    },

    _createDeaultFish() {
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
    _createFish() {
        let fish = cc.instantiate(this.fish[this.OMO.rank - 1]);
        fish.rank = this.OMO.rank;
        fish.parent = this.node.getChildByName('fishPool');
    },

    _updateProgressBar: function (progressBar, dt) {
        let progress = progressBar.progress;
        if (progress > 0) {
            progress -= dt * 1 / 60;
            progressBar.progress = progress;
        } else {
            this.countDown = false;
            this._gameFail();
        }
    },

    // 加分动效
    _addScore(seq) {
        let scoreNode = this.SHIP.getChildByName("score");
        let score = scoreNode.getComponent(cc.Sprite);
        score.spriteFrame = this.scoreList[seq - 1];
        let action = cc.sequence(cc.fadeIn(.2), cc.fadeOut(1));
        scoreNode.runAction(action);

        // 更新分数进度条
        this._addRankProgress();
    },

    // 更新分数进度条
    _addRankProgress() {
        let progressBar = this.rankProgress;
        let progress = progressBar.progress;

        if (progress < 1) {
            progress = progress + .1;
            this._createFish();
        } else {
            // 鱼升级
            this.OMO.rank = this.OMO.rank + 1;
            let rankLabel = this.node.getChildByName('rank').getComponent(cc.Label);
            rankLabel.string = this.OMO.rank;
            let fishPool = this.node.getChildByName('fishPool');
            fishPool.removeAllChildren(true);

            if (this.OMO.rank < 4) {
                this._createDeaultFish();
                this._shipRise();
                progress = 0;
            } else {
                this.countDown = false;
                this._gameVictory();
            }
        }
        progressBar.progress = progress;
    },

});
