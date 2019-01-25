cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var startButton = this.node.getChildByName("startButton");
        if (startButton) {
            startButton.on(cc.Node.EventType.TOUCH_START, function (event) {
                console.log('TOUCH_START');
            }, this);
        }
    },

    start() {

    },

    // update (dt) {},
});
