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

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log('spaceShip')
        // 飞船长大
        var seq = cc.sequence(
            cc.scaleTo(.2, .2),
            cc.scaleTo(.4, .4),
            cc.scaleTo(.6, .6),
            cc.scaleTo(.8, .8),
            cc.scaleTo(1, 1),
        );
        this.node.runAction(seq);

        // 监听鼠标位置,移动飞船位置
        this.node.parent.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            var location = event.getLocation();
            var pos = this.node.parent.convertToNodeSpaceAR(location);
            this.node.setPosition(pos.x, -150);
        }, this);

    },


    getNodePos: function (curNode, targetNode) {
        var worldPos = curNode.parent.convertToNodeSpaceAR(curNode.position);
        var pos = targetNode.convertToNodeSpaceAR(worldPos);
        return pos;
    },

});
