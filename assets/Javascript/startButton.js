cc.Class({
    extends: cc.Component,

    properties: {
        buttonArray:{
            default:[],
            type:cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.buttonArray

        // this.node.getComponent(cc.Sprite)

        component.schedule(function() {
            // 这里的 this 指向 component
            this.doSomething();
        }, 5);
        
    },

    start () {

    },

    // update (dt) {
    //     console.log(dt)
    // },

});
