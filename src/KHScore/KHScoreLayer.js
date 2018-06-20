var KHScoreLayer = KHBaseLayer.extend({
    mLevel      : 0,
    mScore      : 0,
    mAppleCount : 0,
    ctor : function (size, postion, tag) {
        this._super(size, cc.p(postion.x, postion.y), tag);
        return true;
    },

    onEnter : function () {
        this._super();
        this.setOpacity(0);
        this.createUI();
        this.mLevel = GameLevel.getLevel();
    },

    createUI : function(){
        this.addLevelCount();
        this.addScoreCount();
        this.addApple();
        this.addAppleCount();
    },

    addLevelCount : function(){
        var level = Utility.getLabel("0", cc.p(this.getContentSize().width * 0.25 , this.getContentSize().height * 0.3), kLevelTag);
        this.addChild(level, 1);
    },

    updateLevel : function(levelCount){
        var level  = this.getChildByTag(kLevelTag);
        this.mLevel = GameLevel.getLevel();
        level.setString(this.mLevel);
    },

    addScoreCount: function(){
        var score = Utility.getLabel("0", cc.p(this.getContentSize().width * 0.25, this.getContentSize().height * 0.7), kScoreTag);
        score.setColor(cc.color(255,255,0));
        this.addChild(score, 1);
    },

    updateScore : function(scoreCount){
        var score  = this.getChildByTag(kScoreTag);
        score.setPosition(cc.p(this.getContentSize().width * 0.25, this.getContentSize().height * 1.2));
        score.setString(this.mScore);

        if(score.getPositionY() >  this.getContentSize().height){
            score.stopAllActions();
            score.runAction(Utility.getMoveAnimation(cc.p(this.getContentSize().width * 0.25, this.getContentSize().height * 0.7)));
        }

       // score.setPosition(cc.p(this.getContentSize().width * 0.25, this.getContentSize().height * 0.7));
        localStorage.setItem(keyForScore,this.mScore);
    },


    addApple : function(){
        var apple  = new KHSprite(res.RightCuttedApple_png, cc.p(this.getContentSize().width * 0.65, this.getContentSize().height * 1.0), kAppleTag);
        apple.setScale(1.0);
        apple.runAction(Utility.getMoveAnimation(cc.p(this.getContentSize().width * 0.65, this.getContentSize().height * 0.40)))
        this.addChild(apple, 4);
    },

    addAppleCount: function(){
        var appleCount = Utility.getLabel("0", cc.p(this.getContentSize().width * 0.58, this.getContentSize().height * 0.29), kAppleCountTag);
        appleCount.setColor(cc.color(255,0,0));
        this.addChild(appleCount, 1);
    },

    updateApple : function(appleScore){
        var appleCount  = this.getChildByTag(kAppleCountTag);
        appleCount.setString(this.mAppleCount);

        // this.getChildByTag(kAppleTag).runAction(Utility.getZoomInZoomOutAnimation());
        localStorage.setItem(keyForAppleCount, this.mAppleCount);
    },

    onExit : function () {
        this._super();
    }


});
