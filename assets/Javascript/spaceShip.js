// 要干什么
// 飞碟 omo 线
// 飞碟移动 屏幕点击 omo移动 飞碟与omo连线 捕获检测

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        console.log('main')
        var slef = this;
        var SHIP = slef.SHIP = this.node.getChildByName("ship");
        var LINE = slef.LINE = this.node.getChildByName("line").getComponent(cc.Graphics);
        var OMO = slef.OMO = this.node.getChildByName("omo");

        this.FLAG = true;

        this.OMO.runAction(cc.hide());
        // 飞船长大
        var seq = cc.sequence(
            cc.scaleTo(.2, .2),
            cc.scaleTo(.4, .4),
            cc.scaleTo(.6, .6),
            cc.scaleTo(.8, .8),
            cc.scaleTo(1, 1),
        );

        SHIP.runAction(seq);

        // 1.飞碟移动
        // 监听鼠标位置,移动飞船位置
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            var location = event.getLocation();
            var pos = this.node.convertToNodeSpaceAR(location);
            this.SHIP.setPosition(pos.x, -150);

            if (this.FLAG) {
                this.FLAG = false;
                this.launchOMO(pos);
            }

        }, this);

        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            var location = event.getLocation();
            var pos = this.node.convertToNodeSpaceAR(location);

            this.SHIP.setPosition(pos.x, -150);

            if (this.FLAG) {
                this.OMO.setPosition(pos.x, -150);
            }

            pos.y = -150;
            this.moveToPos = pos;
        }, this);

    },

    // 2.屏幕点击
    // 
    launchOMO(worldPos) {
        var action = cc.sequence(cc.show(), cc.moveTo(2, cc.v2(worldPos.x, worldPos.y)), cc.callFunc(this.retakeOMO, this));
        this.OMO.runAction(action);
    },

    retakeOMO() {
        this.isRetake = true;
        this.OMO.angle = 180;
    },

    // getNodePos: function (curNode, targetNode) {
    //     var worldPos = curNode.parent.convertToNodeSpaceAR(curNode.position);
    //     var pos = targetNode.convertToNodeSpaceAR(worldPos);
    //     return pos;
    // },
    drawLine(shipPos, omoPos) {
        this.LINE.clear();
        this.LINE.moveTo(shipPos.x, shipPos.y);
        this.LINE.lineTo(omoPos.x, omoPos.y);
        this.LINE.stroke();
    },

    update(dt) {
        if (!this.FLAG) {
            this.drawLine(this.SHIP, this.OMO);
        }

        if (this.isRetake) {
            var oldPos = this.OMO.position;
            var direction = this.moveToPos.sub(oldPos).normalize();
            var newPos = oldPos.add(direction.mul(100 * dt));
            this.OMO.setPosition(newPos);

            this.drawLine(this.SHIP, this.OMO);
            var gap = Math.pow(Math.abs(oldPos.x - newPos.x), 2) + Math.pow(Math.abs(-150 - newPos.y), 2);
            if (gap < 10) {
                this.OMO.runAction(cc.hide());
                this.isRetake = false;
                this.FLAG = true;
            }
        }
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },
});
