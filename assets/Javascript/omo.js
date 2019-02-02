cc.Class({
    extends: cc.Component,

    properties: {

    },
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},

    // 碰撞 生命周期
    onCollisionEnter: function (other, self) {
        let a ={position: other.world.position, radius: other.world.radius};
        let b ={position: self.world.position, radius: self.world.radius};
        if (cc.Intersection.circleCircle(a, b)) {
            if (a.position.y > b.position.y) {
                console.log('向上纵向碰撞')
                let cee = new cc.Event.EventCustom('retakeOMO', true);
                cee.setUserData(other.node);
                this.node.dispatchEvent(cee);
            }
        }
    },
    onCollisionStay: function (other, self) {

    },
    onCollisionExit: function (other) {

    },

});
