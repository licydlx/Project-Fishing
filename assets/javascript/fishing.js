/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-03-27 16:29:30
 * @LastEditTime: 2019-09-11 19:22:53
 * @LastEditors: Please set LastEditors
 */
const DeviceDetect = require("DeviceDetect");
const { curNodeCoordinate } = require("toolBox");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.fishArea = this.node.getChildByName("fishArea");
        this.ship = this.node.getChildByName("ship");
        this.omo = this.node.getChildByName("omo");
        this.line = this.node.getChildByName("line").getComponent(cc.Graphics);

        if (DeviceDetect.isIpad || DeviceDetect.isAndroid || DeviceDetect.isIphone) {
            // 调整飞船位子
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.flyShipMove, this);
            // 监听鼠标位置,移动飞船位置并发射OMO
            this.node.on(cc.Node.EventType.TOUCH_START, this.fishing, this);
        } else {
            // 调整飞船位子
            this.node.on(cc.Node.EventType.MOUSE_MOVE, this.flyShipMove, this);
            // 监听鼠标位置,移动飞船位置并发射OMO
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this.fishing, this);
        }

    },

    // 开始游戏
    startGame() {
        // 获取子节点 entrance
        let entrance = this.node.getChildByName("entrance");
        entrance.active = false;
    },

    // 飞船移动
    flyShipMove(e) {
        let movePos = curNodeCoordinate(e, this.node);
        let curPos = this.ship.getPosition();
        this.ship.setPosition(movePos.x, curPos.y);
        this.omo.setPosition(movePos.x, curPos.y);
    },

    // 飞船捕鱼
    fishing(e) {
        let clickPos = curNodeCoordinate(e, this.node);
        let curPos = this.ship.getPosition();
        this.ship.setPosition(clickPos.x, curPos.y);

        let actionBy = cc.moveTo(1, cc.v2(clickPos.x, clickPos.y));
        this.omo.runAction(actionBy);
    },

    drawLine(shipPos, omoPos) { 
        this.line.clear();
        this.line.moveTo(shipPos.x, shipPos.y);
        this.line.lineTo(omoPos.x, omoPos.y);
        this.line.stroke();
    },

    update() {
        this.drawLine(this.ship.getPosition(), this.omo.getPosition());
    }

});
