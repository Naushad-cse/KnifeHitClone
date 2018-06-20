
cc.PauseLayerDelegate = cc.Class.extend({
    pauseLayerCallback : function (sender) {

    }
});

var KHPauseLayer = KHBaseLayer.extend({
    isPlaying : true,
    mDelegate : null,
    touchListener : null,

    ctor : function (size, position, tag){
        this._super(size, cc.p(position.x, position.y), tag);
        this.setOpacity(0);
        this.setColor(cc.color(100, 50, 50));
        this.createUI();
        return true;
    },

    createUI : function(){
        cc.log("pause Layer added");
        this.addHomeButton();
        this.addReplayButton();
    },

    addHomeButton : function(){
        var homeButton = new KHButton(res.Home_png, cc.p(this.getContentSize().width * 0.0, this.getContentSize().height * 0.5), kHomeButtonTag);
        homeButton.setDelegate(this);

        homeButton.runAction(Utility.getMoveAnimation(cc.p(cc.winSize.width * 0.35, cc.winSize.height * 0.5)));

        this.addChild(homeButton, 1);
    },

    addReplayButton : function(){
        var replayButton = new KHButton(res.RePlay_png, cc.p(this.getContentSize().width, this.getContentSize().height * 0.5), kReplayButtonTag);
        replayButton.setDelegate(this);

         replayButton.runAction(Utility.getMoveAnimation(cc.p(cc.winSize.width * 0.65, cc.winSize.height * 0.5)));

        this.addChild(replayButton, 2);
    },

    buttonPressed : function (sender, type){
        cc.log("addHomeButton");
        cc.log("replayButtonClicked");
        this.mDelegate.pauseLayerCallback(sender);
    },

    addTouchEvent   : function() {
        this.touchListener  =   cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
             swallowTouches: true,
            onTouchBegan:function (touch, event) {
                cc.log("touch began called");
                return true;
            },
        }, this);
    },



    setDelegate : function(ref){
        this.mDelegate = ref;
    },

    onEnter : function(){
        this._super();
        this.addTouchEvent();
    },

    onExit : function () {
        this._super();
    },

});
