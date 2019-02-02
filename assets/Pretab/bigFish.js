cc.Class({
    extends: cc.Component,

    properties: {
        enemySpriteFrames: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.node.setPosition(this.getRandomNum(120),this.getRandomNum(120));
        this.node.scale = parseInt(this.node.scale) * 40/100;
        let circleCollider = this.node.addComponent(cc.CircleCollider);
        circleCollider.radius = 30;
        
        let index = Math.floor(Math.random() * this.enemySpriteFrames.length);
        let fish = this.node.getComponent(cc.Sprite);
        fish.spriteFrame = this.enemySpriteFrames[index];
    },

    start() {
        this.time = 0;
        this.moveCoordinate();
    },

    update(dt) {
        this.time += dt;
        if (this.time > 2) {
            this.time = 0;
            this.moveCoordinate();
        }
    },

    moveCoordinate() {
        // 停止并且移除所有正在运行的动作列表
        this.node.stopAllActions();
        // 旧坐标
        let oldCoordinate = this.node.getPosition();
        // 新坐标
        let newCoordinate = cc.v2(oldCoordinate.x + this.getRandomNum(60), oldCoordinate.y + this.getRandomNum(60));
        // 游戏背景尺寸
        let width = this.node.parent.width;
        let height = this.node.parent.height;
        // 新坐标限制条件
        newCoordinate.x < -width / 2 || newCoordinate.x > width / 2 ? newCoordinate.x = oldCoordinate.x : '';
        newCoordinate.y < -height / 2 + 100 || newCoordinate.y > height / 2 - 40 ? newCoordinate.y = oldCoordinate.y : '';

        let moveCoordinate = cc.catmullRomTo(2.8, [oldCoordinate, newCoordinate]);
        this.node.runAction(moveCoordinate);
    },

    // 返回 -1 至 1
    getRandomNum(mul) {
        if (!mul) mul = 1;
        return Math.random() > .5 ? -Math.round(Math.random() * mul) : Math.round(Math.random() * mul);
    }

});
