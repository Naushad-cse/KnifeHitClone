
var kTotalKnifeOption = 10;
var knifeInARow = 3;
var kTotalKnifeBeforeLastRow = 7;

cc.SelectedButtonDelegate =  cc.Class.extend({
     knifeSelectedCallback : function (sender) {
     }
});


var KHKnifeSelectionLayer  =  KHBaseLayer.extend({
         mDelegate      : null,
         mSelectedKnife : null,
          touchListener : null,

    ctor : function () {
        this._super(cc.size(cc.winSize.width   , cc.winSize.height ), cc.p(cc.winSize.width * 0.0, cc.winSize.height * 0.0), kknifeSelectionLayerTag);
        this.setColor(cc.color(100, 50, 50));
        this.setOpacity(255);
        return true;
    },


    onEnter : function () {
        this._super();

    },

    createUI : function () {
      this.addBackground();
      this.addKnifes();
      this.addTouchEvent();
      this.addSelectedButton();
    },

    addBackground : function(){
      cc.log(" knife background added")
      var background = new KHSprite(res.KnifeBackground_png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5), kKnifeSelectionBackgroundTag);
      this.addChild(background, 1);
    },

    /**
     * addKnifes : This will add a bunch of knife, which user can select for further use.
     */
    addKnifes : function () {
      var xInitialPosition = this.getContentSize().width * 0.40;
      var yInitialPosition = this.getContentSize().height * 0.75;
        var imageName = [res.SelectedKnife_png, res.KnifeLock_1_png, res.KnifeLock_2_png, res.KnifeLock_3_png, res.KnifeLock_4_png, res.KnifeLock_5_png, res.KnifeLock_6_png, res.KnifeLock_7_png, res.KnifeLock_8_png, res.KnifeLock_9_png, res.KnifeLock_10_png];

      for(var index = 1; index <= kTotalKnifeOption; index++){
      var  Knife = new KHButton(imageName[index], cc.p(xInitialPosition, yInitialPosition), kKnifeSelectionInitialTag + index);
      Knife.setDelegate(this);
      var spriteToLockKnife  = new KHSprite(imageName[index], cc.p(Knife.getContentSize().width * 0.5, Knife.getContentSize().width * 0.5), Knife.getTag());
      Knife.addChild(spriteToLockKnife);
      this.addChild(Knife, 2);
      xInitialPosition = xInitialPosition + this.getContentSize().width * 0.10;
      if(index == knifeInARow){
         xInitialPosition = this.getContentSize().width * 0.36;
         yInitialPosition = this.getContentSize().height * 0.55;
      }
      else if(index == kTotalKnifeBeforeLastRow){
       xInitialPosition = this.getContentSize().width * 0.41;
       yInitialPosition = this.getContentSize().height * 0.35;
       }
     }
    },


    /**
     * addTouchEvent : This will create a touch listener and it will also implement touch began method
     */
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

    /**
     * addSelectedButton : This will add a button to pass on the selected knife in the game.
     */

    addSelectedButton : function () {
      var selectedButton  =  new KHButton(res.SelectedButton_png, cc.p(this.getContentSize().width * 0.5,this.getContentSize().height * 0.2 ), kSelectedButtonTag);
      selectedButton.setDelegate(this);
      this.addChild(selectedButton, 10);
    },

    setDelegate : function (ref) {
      this.mDelegate = ref;
    },

   buttonPressed : function (sender) {
     cc.log("button clicked");
     this.mDelegate.knifeSelectedCallback(sender);
   },

    onExit : function () {
        this._super();
    }

});
