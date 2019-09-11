cc.Class({
    extends: cc.Component,

    properties: {},
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    // 碰撞 生命周期

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        let noworld = other.world;
        // dispatchEvent：做事件传递
        if (noworld.points) {
            // 碰撞宝石
            let cee = new cc.Event.EventCustom('addTime', true);
            cee.setUserData(other.node);
            this.node.dispatchEvent(cee);
        }
    },

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        
    },

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        
    }

});
