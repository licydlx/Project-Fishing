cc.Class({
    extends: cc.Component,

    properties: {
        gemList:{
            default:[],
            type:[cc.SpriteFrame]
        }
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        // 宝石化妆
        let seq = Math.floor(Math.random() * 2);
        let gem = this.node.getComponent(cc.Sprite);
        gem.spriteFrame = this.gemList[seq];
        gem.node.scale = .3;

        // 宝石配置参数
        switch (seq) {
            case 0:
                gem.node.addTime = 5;
            break;
            case 1:
                gem.node.addTime = 3;
            break;
        }

        // 宝石添加碰撞体
        let gemBC = this.node.addComponent(cc.BoxCollider);
        gemBC.size.width = 40;
        gemBC.size.height = 40;
        
    },


});
