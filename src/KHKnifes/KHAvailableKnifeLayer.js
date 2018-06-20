

var KHAvailbaleKnifeLayer = KHBaseLayer.extend({
    mAvailabelKnife : kTotalNumberOfKnife,

    ctor : function (size, postion, tag) {
        this._super(size, postion, tag);
        this.addAvailableDummyKnife();
        this.setOpacity(0);
        this.setColor(cc.color(100, 100, 100));
        cc.log("available knife called");
        return true;
    },

    onEnter : function (){
        this._super();
    },

    /**
     * addAvailableDummyKnife : This will add dummy Knife the game to show the available knife.
     */
    addAvailableDummyKnife : function(){
        var xInitialPosition = this.getContentSize().width * 0.0;
        var YInitialPosition = this.getContentSize().height * 0.2;

         cc.log(" knife count = " + GameLevel.getAvailableKnife());
        for (var knifeIndex = 0; knifeIndex < GameLevel.getAvailableKnife(); knifeIndex++) {
            var dummyKnife = new KHSprite(res.GrayKnife_png, cc.p(xInitialPosition, YInitialPosition), kAvailableKnifeInitialTag + knifeIndex);
            //dummyKnife.setRotation(-30);
           // dummyKnife.setScale();
            this.addChild(dummyKnife, 50);
            YInitialPosition = YInitialPosition + 30;
        }
    },

    /**
     * changeKnifeTexture : This will change the knife texture if it has been used.
     */
    changeKnifeTexture : function(availebleKnife){
      cc.log("change knife texture called with value"+ availebleKnife);
        var knife  = this.getChildByTag((kAvailableKnifeInitialTag) + parseInt(availebleKnife));
        if(knife) {
            knife.setTexture(cc.Sprite.create(res.YellowKnife_png).getTexture());
            //this.removeChild(knife);
        }
    },

    onExit : function () {
        this._super();
    }
});
