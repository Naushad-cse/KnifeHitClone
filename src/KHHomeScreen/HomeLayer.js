
cc.KHPlayButtonDelegate = cc.Class.extend({

    playButtonClicked : function (sender) {

    }
});


var  KHHomeLayer = KHBaseLayer.extend({
    mDelegate : null,
    touchListener : null,

    ctor: function (size, position, tag) {
        this._super(size, position, tag);
        this.setOpacity(0);
        this.setColor(100, 10, 10);
        return true;
    },

    onEnter : function () {
        this._super();

        this.createUI();
    },

    /**
     * createUI : This will add UI component in the game.
     */
    createUI : function(){
        this.addPlayButton();
        this.addTouchEvent();
       // this.addGameName();
        //this.addDummyMovingKnife();
    },

    addTouchEvent   : function() {
        this.touchListener  =   cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function (touch, event) {
                cc.log("touch began called in home layer");
                return true;
            }.bind(this),

            onTouchesMoved : function(touch, event){
                return true;
            },

            onTouchCancelled : function(touch, event){
                return true;
            },

            onTouchesEnded : function (touch, event) {
                return true;
            },

        }, this);
    },



    addPlayButton : function(){

        var dummyBoard = new KHSprite(res.Target_png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.68), kDummyBoardTag);
        this.addChild(dummyBoard, 1);

        var playButton = new KHButton(res.PlayButton_png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.68), kPlayButtonTag);
        playButton.runAction(Utility.getZoomInZoomOutAnimation());
        playButton.setDelegate(this);
        this.addChild(playButton, 2);
    },

    // addDummyMovingKnife : function(){
    //     var  dummyKnifeForAnimation   = new KHSprite(res.Knife_png, cc.p(this.getContentSize().width / 2, this.getContentSize().height * 0.25), kDummyKnifeTag);
    //     dummyKnifeForAnimation.setScale(4.0);
    //     dummyKnifeForAnimation.runAction(Utility.getZoomAnimation(1.0));
    //     dummyKnifeForAnimation.runAction(Utility.getToAndFromMoveAnimation(cc.p(0, 10)));
    //     //
    //     this.addChild(dummyKnifeForAnimation, 2);
    // },

    buttonPressed : function(sender, type){
        this.mDelegate.playButtonClicked(sender);
    },

    setDelegate : function(ref){
        this.mDelegate = ref;
    },


    onExit: function () {
        this._super();
    },

});
