
var b2Vec2 = Box2D.Common.Math.b2Vec2
    , b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2World = Box2D.Dynamics.b2World
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    , b2Mat22 = Box2D.Common.Math.b2Mat22
    , b2Transform =  Box2D.Common.Math.b2Transform;


var KHGameControllerLayer  = KHBaseLayer.extend({
    mGamePause                      : false,
    mAvailableKnife                 : 0,
    mDelayBetweenKnife              : 0,
    mTouchCount                     : 0,
    mknifeAvailable                  : true,
    mJoint                          : null,
    mLevelComplete                  : false,
    mCollisionHappend               : false,
    mIsGameStopped                  : false,
    mSelectedKnife                  : null,
    mIsGameStarted                  : false,
    mPhysicsWorld                   : null,
    mCollidedBodyA                  : null,
    mCollidedBodyB                  : null,
    mKnifeOrAppleCollided           : null,
    mCollisionEnable                : true,
    touchListener                   : true,
    mKnifeCollided                  : false,
    mTappingEnable                  : true,
    delay                           : 0,
    delayForRotation                : 0,
    delayInNextLevel                : 0,
    mJointHappend                   : false,

    ctor: function () {
        this._super(cc.size(cc.winSize.width, cc.winSize.height), cc.p(0, 0), kGameControllerLayerTag);
        return true;
    },


    onEnter: function () {
        this._super();
        this.createUI();
        this.mAvailableKnife = GameLevel.getAvailableKnife();
        // this.setScale(0.6 , 0.6);
    },

    onExit : function () {
        this._super();
    },

    /**
     * createUI : This will add UI in the game
     */
    createUI: function () {
        this.addBackGround();
        this.setUpPhysicsWorld();
        this.addHomeLayer();
        this.addScoreLayer();
        this.addSoundController();
        this.addKnifeSelector();
        this.addGameName();
        this.addCompanyName();
        this.addTouchEvent();
        // this.addTargetInGame();
        //this.addAppleOnTheBoard();

    },

    /**
     * addBackGround : This will add a background image in the game.
     */
    addBackGround: function () {
        var backGround = new KHSprite(res.BackGround_png, cc.p(this.getContentSize().width / 2, this.getContentSize().height / 2), kBackGroundTag);
        this.addChild(backGround, 1);
    },

    /**
     * setUpPhysicsWorld : This will set the physics world and initialise a scheduler.
     */
    setUpPhysicsWorld: function () {
        this.mPhysicsWorld = new b2World(new b2Vec2(KGravityInX, KGravityInY), true);
        this.mPhysicsWorld = new b2World(new b2Vec2(KGravityInX, KGravityInY), true);
        this.mPhysicsWorld.SetContinuousPhysics(true);
        this.scheduleUpdate();
        this.contactListener();
    },

    /**
     * addKnifeInGame : This will add knife in the game from KHKnife.
     */
    addKnifeInGame: function () {

        var knife = new KHKnife(this.mPhysicsWorld, cc.size(cc.winSize.width * 0.2, cc.winSize.height * 0.2), cc.p(cc.winSize.width * 0.35, cc.winSize.height * 0.13), kKnifeLayerTag);
        knife.setDelegate(this);
        knife.getKnife(this.mLevel);
        this.addChild(knife, 2);
    },

    /**
     * addTargetInGame : This will add target board in the game
     */
    addTargetInGame: function () {
        var targetPosition = cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.610);
        if (this.mIsGameStarted) {
            //  targetPosition = cc.p(cc.winSize.width * 0.42, cc.winSize.height);
        }
        var target = new KHBoard(this.mPhysicsWorld, cc.p(targetPosition.x, targetPosition.y), kTargetLayerTag);
        target.getBoard(this.mLevel);

        //target.runAction(Utility.getMoveAnimation(cc.p(cc.winSize.width * 0.42,  cc.winSize.height * 610)));
        this.addChild(target, 3);
        this.mIsGameStarted = true;
       this.addAppleOnTheBoard();
       this.attachKnifeWithBoard();
    },

    /**
     * addAppleOnTheBoard : This will add apple on The board.
     */

    addAppleOnTheBoard: function () {
        var lastAngle  = 0;
        var currentAngle = 0;
        var board = this.getChildByTag(kTargetLayerTag);
        var radius = board.getContentSize().width / 2;
        var numberOfApple = Math.random() * 1;
       if(numberOfApple < 0.5){
           return;
       }


         for (var appleIndex = 0; appleIndex < numberOfApple; appleIndex++) {

             var angle = Math.random() * 180 + 180;
             currentAngle = angle  + lastAngle;
             lastAngle = currentAngle;
            var xPos = (board.getPositionX() + radius * Math.cos(cc.degreesToRadians(currentAngle)));
            var yPos = (board.getPositionY() + radius * Math.sin(cc.degreesToRadians(currentAngle)));

            var apple = new KHApple(this.mPhysicsWorld, res.Apple_png, cc.p(xPos, yPos), KeyForAppleText, kAppleCategory, kAppleMask, kAttachedAppleTag);
            apple.body.SetAngle( cc.degreesToRadians(currentAngle - 90));
            this.addChild(apple, 1000);
            Utility.joinTwoBodies(this.mPhysicsWorld, apple.body, board.mBoard.body, cc.p(0.0, 0.0), cc.p(0.0, 0.0));
            if (apple.body.GetWorld().IsLocked() == true) {
                cc.log("world is lock at apple addition");
            }
        }
    },


    /**
     * attchKnifeWithBoard : This will attach some knife in the begining of the game.
     */
    attachKnifeWithBoard : function () {

        var board = this.getChildByTag(kTargetLayerTag);
        var radius = board.getContentSize().width;
        var lastAngle  = 0;
        var currentAngle = 0;

        var numberOfKnife = Math.random() * 1;
        if(numberOfKnife < 0.5){
            return;
        }

        for (var knifeIndex = 0; knifeIndex < numberOfKnife ; knifeIndex++) {

            var angle = Math.random() * 140;
            currentAngle = angle  + lastAngle;
            lastAngle = currentAngle;
            radius = radius + 100;


            var xPos = (board.getPositionX() + radius * Math.cos(cc.degreesToRadians(currentAngle)));
            var yPos = (board.getPositionY() + radius * Math.sin(cc.degreesToRadians(currentAngle)));



            var attachedKnife = new KHAttachedKnife(this.mPhysicsWorld, res.AttachedKnife_png, cc.p(xPos, yPos), kAttachedKnifeTag);
            attachedKnife.mKnifeBody.body.SetAngle(cc.degreesToRadians(currentAngle + 90));

            var impulseX = board.getPositionX() - attachedKnife.mKnifeBody.body.GetPosition().x * kPTMRatio;
            var impulseY = board.getPositionY() - attachedKnife.mKnifeBody.body.GetPosition().y * kPTMRatio;

           attachedKnife.mKnifeBody.body.ApplyImpulse(new b2Vec2(impulseX,impulseY), attachedKnife.mKnifeBody.body.GetWorldCenter());
            this.addChild(attachedKnife, 2);
        }
    },

    /**
     *  addHomeLayer : This will add a playButton in the game, which will play the game on click.
     */
    addHomeLayer: function () {
        var homeLayer = new KHHomeLayer(cc.size(cc.winSize.width * 0.4, cc.winSize.height * 0.9), cc.p(cc.winSize.width * 0.3, cc.winSize.height * 0.0), kHomeLayerTag);
        homeLayer.setDelegate(this);
        this.addChild(homeLayer, 4);
    },

    /**
     * addAvailableKnifeLayer : This will add available Knife in the game.
     */
    addAvailableKnifeLayer: function () {
        var knifeLayer = new KHAvailbaleKnifeLayer(cc.size(cc.winSize.width * 0.2, cc.winSize.height * 0.5), cc.p(cc.winSize.width * 0.0, cc.winSize.height * 0.25), kAvailableKnifeLayerTag);
        knifeLayer.runAction(Utility.getMoveAnimation(cc.p(cc.winSize.width * 0.1, cc.winSize.height * 0.25)));
        this.addChild(knifeLayer, 5);
    },

    /**
     * addScoreLayer : This will add score Layer to show the score.
     */
    addScoreLayer: function () {
        var scoreLayer = new KHScoreLayer(cc.size(cc.winSize.width, cc.winSize.height * 0.2), cc.p(cc.winSize.width * 0.25, cc.winSize.height * 0.8), kGameScoreLayerTag);
        this.addChild(scoreLayer, 6);
    },

    /**
     * addSoundController : This will a  sound button wich can use to control background
     * Music
     */
    addSoundController: function () {
        var soundController = new KHSound(res.SoundEnable_png, cc.p(this.getContentSize().width * 0.0, this.getContentSize().height * 0.2), kSoundButtonTag);
        soundController.runAction(new cc.Sequence(Utility.getMoveAnimation(cc.p(this.getContentSize().width * 0.1, this.getContentSize().height * 0.2))));
        soundController.setDelegate(this);
        this.addChild(soundController, 7);
    },

    /**
     * addKnifeSelector : This will add a button which can be used to select a desired knife to play further.
     */
    addKnifeSelector: function () {
        var knifeSelector = new KHButton(res.KnifeSelector_png, cc.p(this.getContentSize().width * 1.0, this.getContentSize().height * 0.2), kKnifeSelectorTag);
        knifeSelector.runAction(new cc.Sequence(Utility.getMoveAnimation(cc.p(this.getContentSize().width * 0.9, this.getContentSize().height * 0.2))));
        knifeSelector.setDelegate(this);
        this.addChild(knifeSelector, 8);
    },

    /**
     * addGameName : This will add Game name which will be disapper when play button will be clicked.
     *his will also add a knife between the name.
     */
    addGameName: function (selected_knife) {
        if ((!this.getChildByTag(kGameNameKnifeTag)) && (!this.getChildByTag(kGameNameHitTag))) {
            var gameNameKnife = Utility.getLabel("KN     FE", cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.2), kGameNameKnifeTag);
            gameNameKnife.setOpacity(0);
            gameNameKnife.runAction(Utility.fadeInAnimation(2));
            gameNameKnife.setFontSize(50);
            this.addChild(gameNameKnife, 10);
            var gameNameHit = Utility.getLabel("HIT", cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.1), kGameNameHitTag);
            gameNameHit.setOpacity(0);
            gameNameHit.runAction(Utility.fadeInAnimation(2));
            gameNameHit.setFontSize(50);
            this.addChild(gameNameHit, 10);
        }

        if (!this.getChildByTag(kKnifeLayerTag)) {
            var selectedKnife = new KHSprite(res.Knife_png, cc.p(this.getContentSize().width * 0.50, this.getContentSize().height * 0.23), KSelectedKnifeTag);
            selectedKnife.runAction(Utility.getToAndFromMoveAnimation(cc.p(0, 10)));
            this.addChild(selectedKnife, 10);
        }

    },

    /**
     * removeGameName : This will remove the game name when the play button will be clicked.
     */
    removeGameName: function () {
        var knifeText = this.getChildByTag(kGameNameKnifeTag);
        var HitText = this.getChildByTag(kGameNameHitTag);
        var remove = new cc.RemoveSelf();
        if (knifeText && HitText) {
            knifeText.runAction(new cc.Sequence(Utility.fadeOutAnimation(0.5), remove));
            knifeText.setOpacity(0);
            HitText.runAction(new cc.Sequence(Utility.fadeOutAnimation(0.5), remove));
            knifeText.setOpacity(0);
        }
        if (this.getChildByTag(KSelectedKnifeTag))
            this.removeChildByTag(KSelectedKnifeTag);

    },

    /**
     * knifeSelectionLayer : This will add a layer from which desired knife can be selected.
     */
    knifeSelectionLayer: function () {
        var knifeSelectionLayer = new KHKnifeSelectionLayer();
        knifeSelectionLayer.setDelegate(this);
        knifeSelectionLayer.createUI();
        this.addChild(knifeSelectionLayer, 11);
    },

    /**
     * addPauseLayer : This will addd a pause layer from where you can go to home or reply the game.
     */
    addPauseLayer: function () {
        var pauseLayer = new KHPauseLayer(cc.size(cc.winSize.width, cc.winSize.height), cc.p(0, 0), kPauseLayerTag);
        pauseLayer.setDelegate(this);
        this.addChild(pauseLayer, 100);
    },

    /**
     * addPauseButton : This is pause button to pause the game.
     */
    addPauseButton: function () {
        var pauseButton = new KHButton(res.Pause_png, cc.p(this.getContentSize().width * 0.9, this.getContentSize().height * 0.2), kPauseButtonTag);
        pauseButton.setDelegate(this);
        this.addChild(pauseButton, 11);
    },

    addCompanyName: function () {
        var companyName = Utility.getLabel(kCompanyName, cc.p(this.getContentSize().width * 0.15, this.getContentSize().height * 1.0), kCompanyNameTag);
        companyName.runAction(Utility.getMoveAnimation(cc.p(this.getContentSize().width * 0.15, this.getContentSize().height * 0.85)))
        this.addChild(companyName, 100);
    },

    /**
     * buttonPressed : This is a delegate method of KHButton which will call when a button will be buttonPressed
     * This will use to get the callback of knife selector and sound control,
     */
    buttonPressed: function (sender) {
        switch (sender.getTag()) {
            case kSoundButtonTag :
                sender.changeSoundButtonTexture();
                break;
            case kKnifeSelectorTag :
                this.knifeSelectionLayer();
                break;
            case kPauseButtonTag :
                this.addPauseLayer();
                this.mGamePause = true;
                this.getChildByTag(kKnifeLayerTag).stopKnifeAnimation();
                break;
        }
    },

    /**
     * playButtonClicked : This is a delegate method of home layer which will call when play button will be clicked.
     * This will start the game.
     */
    playButtonClicked: function (sender) {
        this.mTouchCount = 0 ;
        this.startTheGame();

    },


    /**
     * addTouchEvent : This is
     */
    addTouchEvent   : function() {
        this.touchListener  =   cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan : function (touch, event) {
                cc.log("touch began called in game layer");
               if (this.mTouchCount > 0){
                    this.knifeTapped();
                }else{
                   this.mTouchCount++;
                }
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




    /**
     * knifeTapped : This  is  a delegate method of knife which will call when a knife will be taped.
     */
    knifeTapped: function () {
        //sender.setOpacity(255);
        if((!this.mCollisionEnable) || (!this.mTappingEnable)){
            cc.log("return from tapped");

            if(this.getChildByTag(kTargetLayerTag)){
                var target = this.getChildByTag(kTargetLayerTag);
                this.mPhysicsWorld.DestroyBody(target.mBoard.body);
            }




            return;
        }

        if (!this.mGamePause) {
            this.mknifeAvailable = false;
            this.delay = 0;
            this.mCollisionHappend = false;

            for (var body = this.mPhysicsWorld.GetBodyList(); body; body = body.GetNext()) {
                if (body.GetUserData() != null && body.GetUserData().type == KeyForKnifeText) {
                    body.ApplyImpulse(new b2Vec2(0, 350.0), body.GetWorldCenter());
                    body.GetUserData().asset.setOpacity(255);
                    body.GetUserData().asset.getParent().removeDummyKnife();
                    this.mJointHappend=false;

                }
            }


        }
    },

    /**
     * pauseLayerCallback : This is a delegate method of pause layer whhich will call
     * if home button or replay button will be clicked.
     */
    pauseLayerCallback: function (sender) {
        this.removeChildByTag(kPauseLayerTag);
        //cc.director.GetPhysicsManager().enabled = false;
        if (sender.getTag() == kReplayButtonTag) {
            this.replyTheGame();
        } else {
            this.goToHome();
        }
    },


    /**
     * onDebugDrawMask : This will enable the debug draw mask to see the physics bodies.
     */
    onDebugDrawMask: function () {
        var debugDraw = new Box2D.Dynamics.b2DebugDraw();
        debugDraw.SetSprite(document.getElementById(kDebugCanvas).getContext(kDebugContext));
        debugDraw.SetDrawScale(13.5);
        debugDraw.SetFillAlpha(1.3);
        debugDraw.SetLineThickness(0.5);
        debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
        this.mPhysicsWorld.SetDebugDraw(debugDraw);
        this.mPhysicsWorld.DrawDebugData();
    },

    /**
     * update : This is a scheduler callback to attach the bodies with sprite and control the game
     * pause and play staus.
     *
     */
    update: function (dt) {
        if (this.mGamePause) {
            this.mPhysicsWorld.Step(null, null, null);
        } else {
            this.mPhysicsWorld.Step(1/60, 10,10);
        }
        this.moveSpritesWithBodies();
        this.onDebugDrawMask();
       // this.updateKnifeInGame();
        this.changeBoardRotation();
        if ((this.mAvailableKnife < 0) && this.mKnifeCollided && (!this.mLevelComplete)){
            this.updateGameLevel();
            this.delayInNextLevel = 0;
        }

        if(this.mCollisionHappend){
            this.joinKnifeAndTarget();
           this.mCollisionHappend = false;
        }

        if(this.mKnifeOrAppleCollided) {
            this.knifeOrAppleCollidedTogether();

            this.mKnifeOrAppleCollided = false;

        }

        if (this.delayInNextLevel > 40 && this.mLevelComplete) {
            this.addNewLevel();
        } else {
            this.delayInNextLevel++;
        }


    },

    /**
     * This will add another knife when a  knife will be tapped
     *
     */
    updateKnifeInGame: function () {
        cc.log("update knife in the game called with avialabe knife " + this.mAvailableKnife);
        if ((this.mAvailableKnife > 0)  && (!this.mknifeAvailable) && (!this.mIsGameStopped)) {
            this.addKnifeInGame();
            this.mknifeAvailable = true;
            // delay = 0;
        }else{
            this.mknifeAvailable = false;
        }
    },

    /**
     * changeBoardRotation : This will change the board rotation after every 50 count.
     *
     */
    changeBoardRotation: function () {
        var board = this.getChildByTag(kTargetLayerTag);


        var delay  = (Math.random() % 10) + (10  + (100/(GameLevel.getLevel() == 0 ? 1 : GameLevel.getLevel())));
        delay = 25;
        if (board && this.delayForRotation > delay) {
            cc.log("level =   "  +(GameLevel.getLevel() == 0 ? 1 : GameLevel.getLevel()));
            board.rotateBoard();
            this.delayForRotation = 0;
        } else {
            this.delayForRotation++;
        }
    },

    /**
     * updateScoreLayer : This will update score layer values.
     */
    updateScoreLayer: function () {
        var score = this.getChildByTag(kGameScoreLayerTag);
        score.updateApple();
        score.updateScore();
        score.updateLevel();

    },
    /**
     * updateGameLevel : This will update game level.
     *
     */

    updateGameLevel: function () {
        cc.log("call inside update game level");
        this.mCollisionHappend = false;
        this.mCollisionEnable = false;
        this.mKnifeCollided = false;
        this.destroyAllJoints();
        this.enableGravity();
        this.mLevelComplete = true;
        if (this.getChildByTag(kTargetLayerTag)) {
            this.addBrokenBoard();
            var target = this.getChildByTag(kTargetLayerTag);
            this.mPhysicsWorld.DestroyBody(target.mBoard.body);
            this.removeChildByTag(kTargetLayerTag);
            this.removeChildByTag(kAvailableKnifeLayerTag);

        }
    },

    /**
     * addNewLevel : This will add new level in the game.
     */
    addNewLevel: function () {
        cc.log("call inside add new level");
        GameLevel.updateLevel();
        this.updateScoreLayer();
        this.startTheGame();

        this.mknifeAvailable = true;
        this.mGamePause = false;
         this.mIsGameStopped = false;
        this.mLevelComplete = false;
        count = 0;
        this.mAvailableKnife = GameLevel.getAvailableKnife();
    },
    /**
     * moveSpritesWithBodies : This will maintain the physics bodies and sprite position
     * by continuosly assigning the body position to sprite.
     */
    moveSpritesWithBodies: function () {
        for (var body = this.mPhysicsWorld.GetBodyList(); body; body = body.GetNext()) {

         //   cc.log("this.mLevelComplete" +  this.mLevelComplete);
         //    cc.log("this.mIsGameStopped" + this.mIsGameStopped);
            if ((body.GetUserData() != null) && (!this.mLevelComplete) && (!this.mIsGameStopped) && (body.GetUserData().type == KeyForKnifeText) && ((body.GetPosition().y * kPTMRatio > this.getContentSize().height * 0.8) || ((body.GetPosition().y * kPTMRatio) < (this.getContentSize().height * 0.1)) || ((body.GetPosition().x * kPTMRatio) > (this.getContentSize().width * 0.6)) || ((body.GetPosition().x * kPTMRatio) < (this.getContentSize().width * 0.4)))) {
                // cc.log("stop the game called with body position " + body.GetPosition().y * kPTMRatio);
                this.stopTheGame();
            }else{
                this.mIsGameStopped = false;
            }
            if (body.GetUserData() != null) {
                var mySprite = body.GetUserData().asset;
                if (body.GetUserData().asset.getParent()) {

                    // cc.log("body type = "+ body.GetUserData().type + " position in y = " +  body.GetPosition().y * kPTMRatio);
                    mySprite.setPosition((body.GetPosition().x * kPTMRatio) - body.GetUserData().asset.getParent().getPositionX(), (body.GetPosition().y * kPTMRatio) - body.GetUserData().asset.getParent().getPositionY());
                }
                else {
                    mySprite.setPosition((body.GetPosition().x * kPTMRatio), (body.GetPosition().y * kPTMRatio));
                }

                mySprite.setRotation(-1 * cc.radiansToDegrees(body.GetAngle()));
            }
            if (body.GetUserData() != null && body.GetUserData().type == KeyForTargetText && (!this.mLevelComplete)) {
                body.SetPosition(new b2Vec2(((cc.winSize.width * 0.5) / kPTMRatio), ((cc.winSize.height * 0.615) / kPTMRatio)));
            }


        }
    },

    /**
     *
     *destroyAllJoints : This will destroy all joints.
     */
    destroyAllJoints: function () {
        for (var joint = this.mPhysicsWorld.GetJointList(); joint; joint = joint.GetNext()) {
            this.mPhysicsWorld.DestroyJoint(joint);
        }

    },



    enableGravity : function(){
        this.mPhysicsWorld.SetGravity(new b2Vec2(0, -10));
    },


    /**
     * addBrokenBoard : This will add broken board when a level will complete
     *
     */

    addBrokenBoard: function () {
        var brokenBoardImage = [res.TargetTopLeft_png, res.TargetBottomRight_png, res.TargetBottomLeft_png, res.TargetTopRight_png];
        var position = [cc.p(0.47, 0.60), cc.p(0.56, 0.60), cc.p(0.4, 0.50), cc.p(0.56, 0.50)];
        var impulse = [new b2Vec2(1000, 1000), new b2Vec2(-1000, 1000), new b2Vec2(1000, 1000), new b2Vec2(-1000, 1000)];
        this.shuffleArray(position);
        this.shuffleArray(impulse);

        for (var index = 0; index < brokenBoardImage.length; index++) {
            var positionIndex = (Math.random() * 5) + 1;
            var brokenBoard = new KHDummyBrokenBoard(this.mPhysicsWorld, brokenBoardImage[index], cc.p(this.getContentSize().width * position[index].x, this.getContentSize().height * position[index].y), kDummyBrokenBoardInitialTag);
            brokenBoard.DummyBrokenBoardBody.body.ApplyImpulse(impulse[index], brokenBoard.DummyBrokenBoardBody.body.GetWorldCenter());
            brokenBoard.DummyBrokenBoardBody.body.SetLinearDamping(6);
            this.addChild(brokenBoard, 15);
        }

        for(var body = this.mPhysicsWorld.GetBodyList(); body; body = body.GetNext()){
            if(body && body.GetUserData().type == KeyForKnifeText || body.GetUserData().type == KeyForAttachedKnifeText){
               var  AppleImpulseX = cc.randomMinus1To1() * 50;
               var  AppleImpulseY =  cc.randomMinus1To1() * 50;
                body.ApplyImpulse(new b2Vec2(AppleImpulseX, AppleImpulseY), body.GetWorldCenter());
            }
        }




    },
    /**
     * contactListener : This is a contact listener to get callback whenever physics bodies collide with each other.
     * This will join the knife and board if the collide toghether.
     */
    contactListener: function () {
        var listener = new  Box2D.Dynamics.b2ContactListener;
        physicsWorld = this.mPhysicsWorld;
        listener.BeginContact = function (contact) {



            var bodyA = contact.GetFixtureA().GetBody();
            var bodyB = contact.GetFixtureB().GetBody();
            var filterA = contact.GetFixtureA().GetFilterData();
            var filterB = contact.GetFixtureB().GetFilterData();

            var collide = ((filterA.maskBits & filterB.categoryBits) != 0 && (filterA.categoryBits & filterB.maskBits) != 0);




           if(collide && this.mCollisionEnable && (!this.mJointHappend)) {
               this.mCollidedBodyA = bodyA;
               this.mCollidedBodyB = bodyB;
               cc.log("body a type " + bodyA.GetUserData().type);
               cc.log("body b type " + bodyB.GetUserData().type);

               // if ((bodyA.GetUserData().type == KeyForLeftAppleText || bodyB.GetUserData().type == KeyForLeftAppleText) || (bodyB.GetUserData().type == KeyForRightAppleText || bodyA.GetUserData().type == KeyForRightAppleText)) {
               //     cc.log("return from cutting apple");
               //     return;
               // }

               if (!this.mLevelComplete && ((this.mCollidedBodyA.GetUserData().type == KeyForKnifeText && this.mCollidedBodyB.GetUserData().type == KeyForKnifeText) || (this.mCollidedBodyB.GetUserData().type == KeyForAttachedKnifeText && this.mCollidedBodyA.GetUserData().type == KeyForAttachedKnifeText) || (this.mCollidedBodyB.GetUserData().type == KeyForKnifeText && this.mCollidedBodyA.GetUserData().type == KeyForAttachedKnifeText) || (this.mCollidedBodyB.GetUserData().type == KeyForAttachedKnifeText && this.mCollidedBodyA.GetUserData().type == KeyForKnifeText))) {
                   this.mCollidedBodyA.ApplyImpulse(new b2Vec2(10, -1000), this.mCollidedBodyA.GetWorldCenter());
                   this.mCollidedBodyB.ApplyImpulse(new b2Vec2(-10, -1000), this.mCollidedBodyB.GetWorldCenter());
                   this.mCollidedBodyA.SetAngularVelocity(200);
                   var filter = new Box2D.Dynamics.b2FilterData();
                   filter.categoryBits = 0x0000;
                   filter.maskBits = 0x0000;
                   filter.groupIndex = 0x0000;
                   contact.GetFixtureA().SetFilterData(filter);
                   contact.GetFixtureB().SetFilterData(filter);
                   this.mTappingEnable = false;
                   if(!this.mJointHappend) {
                       this.mIsGameStopped = false;
                       // cc.log("return from knife collision");
                       this.mKnifeOrAppleCollided = false;
                       return true;
                   }

                   return;
               }


               if ((bodyA.GetUserData().type == KeyForKnifeText && bodyB.GetUserData().type == KeyForTargetText) || (bodyB.GetUserData().type == KeyForKnifeText && bodyA.GetUserData().type == KeyForTargetText) || (bodyA.GetUserData().type == KeyForAttachedKnifeText && bodyB.GetUserData().type == KeyForTargetText) || (bodyB.GetUserData().type == KeyForAttachedKnifeText && bodyA.GetUserData().type == KeyForTargetText)) {
                   this.mCollidedBodyA = bodyA;
                   this.mCollidedBodyB = bodyB;
                   this.mCollisionHappend = true;

                   // cc.log("collision happend set to true");
               }
               else {

                   // cc.log("else block executed");
                   this.mKnifeOrAppleCollided = true;
                   this.mCollidedBodyA = bodyA;
                   this.mCollidedBodyB = bodyB;
               }

           }


        }.bind(this);

        listener.EndContact = function (contact) {
        };
        listener.PostSolve = function (contact, impulse) {

        };
        listener.PreSolve = function (contact, oldManifold) {

        };

        this.mPhysicsWorld.SetContactListener(listener);
    },

    /**
     * joinKnifeAndTarget : This will join knife and board when they collide together.
     * @returns {boolean}
     */
    joinKnifeAndTarget : function() {
        this.mCollisionHappend = false;
        if(!this.mCollisionEnable){
            return;
        }
        // cc.log(" join knife and target called");
        var rotation = this.mCollidedBodyA.GetUserData().type == KeyForTargetText ? (this.mCollidedBodyA.GetUserData().asset.getRotation() % 360) : (this.mCollidedBodyB.GetUserData().asset.getRotation() % 360);
        var board = this.getChildByTag(kTargetLayerTag);
        var radius = board.getContentSize().width / 2;
        var worldCoordsAnchorPointForTarget = this.mCollidedBodyA.GetWorldPoint(new b2Vec2(0.0, 0.0));
        var worldCoordsAnchorPointForKnife =  this.mCollidedBodyA.GetWorldPoint(new b2Vec2(0.0, 0.0));


        if (!this.mLevelComplete && ((this.mCollidedBodyA.GetUserData().type == KeyForKnifeText && this.mCollidedBodyB.GetUserData().type == KeyForKnifeText) || (this.mCollidedBodyB.GetUserData().type == KeyForAttachedKnifeText && this.mCollidedBodyA.GetUserData().type == KeyForAttachedKnifeText) || (this.mCollidedBodyB.GetUserData().type == KeyForKnifeText && this.mCollidedBodyA.GetUserData().type == KeyForAttachedKnifeText) || (this.mCollidedBodyB.GetUserData().type == KeyForAttachedKnifeText && this.mCollidedBodyA.GetUserData().type == KeyForKnifeText))) {

            this.mCollidedBodyA.ApplyImpulse(new b2Vec2(10, -1000), this.mCollidedBodyA.GetWorldCenter());
            this.mCollidedBodyB.ApplyImpulse(new b2Vec2(-10, -1000), this.mCollidedBodyB.GetWorldCenter());
            this.mCollidedBodyB.SetAngularVelocity(100);
            // var filter = new  Box2D.Dynamics.b2FilterData();
            // filter.categoryBits = 0x0000;
            // filter.maskBits = 0x0000;
            // filter.groupIndex = 0x0000;
            // contact.GetFixtureA().SetFilterData(filter);
            // contact.GetFixtureB().SetFilterData(filter);
            this.mTappingEnable = false;
            // this.contac();
            cc.log("return from knife collision");
            this.mKnifeOrAppleCollided = false;
            return true;
        }





        if (this.mCollidedBodyA.GetUserData().type == KeyForKnifeText || this.mCollidedBodyA.GetUserData.type == KeyForAttachedKnifeText) {
            // this.mCollidedBodyA.SetAngle(rotation);
            this.mCollidedBodyA.SetLinearVelocity(new b2Vec2(0, 0));
            this.mCollidedBodyA.ApplyImpulse(new b2Vec2(0, 0), this.mCollidedBodyA.GetWorldCenter());
            this.mCollidedBodyA.SetLinearDamping(0);
            this.mCollidedBodyA.SetAngularDamping(0);


            var xPos =   (board.getPositionX() + radius * Math.cos(cc.degreesToRadians(this.mCollidedBodyA.GetAngle() - 90)));
            var yPos =   (board.getPositionY() + radius * Math.sin(cc.degreesToRadians(this.mCollidedBodyA.GetAngle() - 90)));

            // var bodyPosition = cc.p(this.mCollidedBodyA.GetPosition().x * kPTMRatio, this.mCollidedBodyA.GetPosition().y * kPTMRatio);
            // var bodyAsset = this.mCollidedBodyA.GetUserData().asset;
            // var bodyAngle = this.mCollidedBodyA.GetAngle();
            // cc.log(" body  A type =" + this.mCollidedBodyB.GetUserData().type + "removed");
            // this.mCollidedBodyA.GetUserData().asset.removeFromParent(false);
            // this.mPhysicsWorld.DestroyBody(this.mCollidedBodyA);
            //  var knifeBody = new KHBoxBody(this.mPhysicsWorld, KnifeWidth, KnifeLength, Box2D.Dynamics.b2Body.b2_dynamicBody, KnifeDensity, KnifeFriction, KnifeRestitution, bodyPosition, 0, KeyForKnifeText, bodyAsset, kKnifeCategory, kKnifeMask);
            // knifeBody.body.SetAngle(bodyAngle);
            //  this.mCollidedBodyA = knifeBody.body;
            //  this.hittingEffect(cc.p(xPos,yPos));

            }
            else {
            // this.mCollidedBodyB.SetAngle(rotation);
            this.mCollidedBodyB.SetLinearVelocity(new b2Vec2(0, 0));
            this.mCollidedBodyB.ApplyImpulse(new b2Vec2(0, 0),  this.mCollidedBodyB.GetWorldCenter());
            this.mCollidedBodyB.SetLinearDamping(0);
            this.mCollidedBodyB.SetAngularDamping(0);


            // var bodyPosition = cc.p(this.mCollidedBodyB.GetPosition().x * kPTMRatio, this.mCollidedBodyB.GetPosition().y * kPTMRatio);
            // var bodyAsset = this.mCollidedBodyB.GetUserData().asset;
            // var bodyAngle = this.mCollidedBodyB.GetAngle();
            // this.mCollidedBodyB.GetUserData().asset.removeFromParent(false);
            // cc.log(" body  B type =" + this.mCollidedBodyB.GetUserData().type + "removed");

            // this.mPhysicsWorld.DestroyBody(this.mCollidedBodyB);
            // var knifeBody = new KHBoxBody(this.mPhysicsWorld, KnifeWidth, KnifeLength, Box2D.Dynamics.b2Body.b2_dynamicBody, KnifeDensity, KnifeFriction, KnifeRestitution, bodyPosition, 0, KeyForKnifeText, bodyAsset, kKnifeCategory, kKnifeMask);
            // knifeBody.body.SetAngle(bodyAngle);
            // this.mCollidedBodyB = knifeBody.body;




            var xPos =   (board.getPositionX() + radius * Math.cos(cc.degreesToRadians(this.mCollidedBodyB.GetAngle() - 90)));
            var yPos =   (board.getPositionY() + radius * Math.sin(cc.degreesToRadians(this.mCollidedBodyB.GetAngle() - 90)));
            //
            // cc.log("Effect position in x =" + this.mCollidedBodyB.GetUserData().asset.getPosition().x);
            // cc.log("Effect position in Y =" + this.mCollidedBodyB.GetUserData().asset.getPosition().y + this.getContentSize().height / 2);
            this.hittingEffect(cc.p(xPos,yPos));
            }

            weldJointDef = new Box2D.Dynamics.Joints.b2WeldJointDef;
            weldJointDef.bodyA = this.mCollidedBodyA;
            weldJointDef.bodyB = this.mCollidedBodyB;
            weldJointDef.localAnchorA =  this.mCollidedBodyA.GetLocalPoint(worldCoordsAnchorPointForTarget);
            weldJointDef.localAnchorB = this.mCollidedBodyB.GetLocalPoint(worldCoordsAnchorPointForKnife);
            weldJointDef.referenceAngle = weldJointDef.bodyB.GetAngle() - weldJointDef.bodyA.GetAngle();
            weldJointDef.collideConnected = false;





        cc.log(" body joined called");

        if((this.mCollidedBodyA.GetUserData().type == KeyForAttachedKnifeText && this.mCollidedBodyB.GetUserData().type == KeyForTargetText) || (this.mCollidedBodyB.GetUserData().type ==  KeyForAttachedKnifeText  && this.mCollidedBodyA.GetUserData().type == KeyForTargetText )){
            this.mJoint =  this.mCollidedBodyB.GetWorld().CreateJoint(weldJointDef);
            this.mJointHappend = true;
            cc.log(" body joined");
        }



        if ((this.mCollidedBodyA.GetUserData().type == KeyForKnifeText && this.mCollidedBodyB.GetUserData().type == KeyForTargetText) || (this.mCollidedBodyB.GetUserData().type ==  KeyForKnifeText  && this.mCollidedBodyA.GetUserData().type == KeyForTargetText )){

            // if(this.mCollidedBodyA.GetUserData().type == KeyForKnifeText){
            //     this.mCollidedBodyA.SetAngle(cc.degreesToRadians(this.mCollidedBodyB.GetAngle() - 90));
            // }else{
            //     this.mCollidedBodyB.SetAngle(cc.degreesToRadians(this.mCollidedBodyB.GetAngle() - 90));
            // }

            this.mJoint =  this.mCollidedBodyB.GetWorld().CreateJoint(weldJointDef);
            this.mJointHappend = true;
            cc.log(" body joined");
            this.mKnifeCollided = true;
            var score = this.getChildByTag(kGameScoreLayerTag);
            score.mScore++;
            this.updateScoreLayer();
            var knife = this.getChildByTag(kAvailableKnifeLayerTag);
            knife.changeKnifeTexture(this.mAvailableKnife--);
            this.mknifeAvailable = false;
            this.updateKnifeInGame();

        }

     },
    /**
     * knifeOrAppleCollidedTogether : This will call when knife and knife or knife and apple will collide.
     * this can make game stop or it'll call for knife cutting animation.
     */
    knifeOrAppleCollidedTogether : function(){
        this.mKnifeOrAppleCollided = false;
        if(!this.mCollisionEnable){
            return;
        }

        if(!this.mLevelComplete && ((this.mCollidedBodyA.GetUserData().type == KeyForKnifeText &&  this.mCollidedBodyB.GetUserData().type == KeyForKnifeText) || (this.mCollidedBodyB.GetUserData().type ==  KeyForAttachedKnifeText  && this.mCollidedBodyA.GetUserData().type == KeyForAttachedKnifeText ) || (this.mCollidedBodyB.GetUserData().type ==  KeyForKnifeText  && this.mCollidedBodyA.GetUserData().type == KeyForAttachedKnifeText ) || (this.mCollidedBodyB.GetUserData().type ==  KeyForAttachedKnifeText  && this.mCollidedBodyA.GetUserData().type == KeyForKnifeText ) ) ) {

            this.mCollidedBodyA.ApplyImpulse(new b2Vec2(10, -1000),  this.mCollidedBodyA.GetWorldCenter());
            this.mCollidedBodyB.ApplyImpulse(new b2Vec2(10, -1000),  this.mCollidedBodyB.GetWorldCenter());
            return;

        }
            if (this.mCollidedBodyA.GetUserData().type == KeyForAppleText) {
                this.removeChild(this.mCollidedBodyA.GetUserData().asset);
                this.mCollidedBodyA.GetWorld().DestroyBody( this.mCollidedBodyA);
                this.CuttingAppleAnimation(cc.p(this.mCollidedBodyA.GetPosition().x * kPTMRatio, this.mCollidedBodyA.GetPosition().y * kPTMRatio));
                var score = this.getChildByTag(kGameScoreLayerTag);
                score.mAppleCount++;
                this.updateScoreLayer();

                 if(this.mCollidedBodyB.GetUserData().type == KeyForKnifeText){
                     this.mCollidedBodyA = this.mCollidedBodyB;
                 }else{
                     return;
                }


                 for(var body = this.mPhysicsWorld.GetBodyList(); body; body = body.GetNext()){
                     if(body.GetUserData().type == KeyForTargetText){
                         this.mCollidedBodyB = body;

                     }
                 }

                if ((this.mCollidedBodyA.GetUserData().type == KeyForKnifeText &&  this.mCollidedBodyB.GetUserData().type == KeyForTargetText) || (this.mCollidedBodyB.GetUserData().type ==  KeyForKnifeText  && this.mCollidedBodyA.GetUserData().type == KeyForTargetText ) || (this.mCollidedBodyA.GetUserData().type == KeyForAttachedKnifeText && this.mCollidedBodyB.GetUserData().type == KeyForTargetText) || (this.mCollidedBodyB.GetUserData().type ==  KeyForAttachedKnifeText  && this.mCollidedBodyA.GetUserData().type == KeyForTargetText )){
                    this.mCollisionHappend = true;

                }

            } else {
                this.removeChild(this.mCollidedBodyB.GetUserData().asset);
                this.mCollidedBodyA.GetWorld().DestroyBody(this.mCollidedBodyB);
                this.CuttingAppleAnimation(cc.p(this.mCollidedBodyB.GetPosition().x * kPTMRatio, this.mCollidedBodyB.GetPosition().y * kPTMRatio));

                var score = this.getChildByTag(kGameScoreLayerTag);
                score.mAppleCount++;
                this.updateScoreLayer();


                if(this.mCollidedBodyA.GetUserData().type == KeyForKnifeText){
                    this.mCollidedBodyB = this.mCollidedBodyA;
                }else{
                    return;
                }


                for(var body = this.mPhysicsWorld.GetBodyList(); body; body = body.GetNext()){
                    if(body.GetUserData().type == KeyForTargetText){
                        this.mCollidedBodyA = body;
                    }

                }

                if ((this.mCollidedBodyA.GetUserData().type == KeyForKnifeText &&  this.mCollidedBodyB.GetUserData().type == KeyForTargetText) || (this.mCollidedBodyB.GetUserData().type ==  KeyForKnifeText  && this.mCollidedBodyA.GetUserData().type == KeyForTargetText ) || (this.mCollidedBodyA.GetUserData().type == KeyForAttachedKnifeText && this.mCollidedBodyB.GetUserData().type == KeyForTargetText) || (this.mCollidedBodyB.GetUserData().type ==  KeyForAttachedKnifeText  && this.mCollidedBodyA.GetUserData().type == KeyForTargetText )){
                    this.mCollisionHappend = true;
                    cc.log("collision happend and called for joint");
                }


            }

    },





    /**
     * CuttingAppleAnimation : This will add cutted apple in the game whenever knife collide with apple.
     */
    CuttingAppleAnimation : function(position){
        var leftCuttedApple = new KHApple(this.mPhysicsWorld, res.LeftCuttedApple_png, cc.p(position.x - CuttedApplePositionMargin, position.y - CuttedApplePositionMargin), KeyForLeftAppleText, 0x00, 0x00, kLeftCuttedAppleTag);
        var rightCuttedApple = new KHApple(this.mPhysicsWorld, res.RightCuttedApple_png, cc.p(position.x + CuttedApplePositionMargin, position.y - CuttedApplePositionMargin), KeyForRightAppleText, 0x00, 0x00, kRightCuttedAppleTag);
        this.addChild(leftCuttedApple, 50);
        this.addChild(rightCuttedApple, 51);

        leftCuttedApple.body.ApplyImpulse(new b2Vec2(-AppleImpulseInX, -AppleImpulseInY),  leftCuttedApple.body.GetWorldCenter());
        rightCuttedApple.body.ApplyImpulse(new b2Vec2(AppleImpulseInX, -AppleImpulseInY),  rightCuttedApple.body.GetWorldCenter());

    },

     // throwAppleUp : function(leftCuttedApple, rightCuttedApple){
     //     leftCuttedApple.body.ApplyImpulse(new b2Vec2(-AppleImpulseInX, AppleImpulseInY),  leftCuttedApple.body.GetWorldCenter());
     //     rightCuttedApple.body.ApplyImpulse(new b2Vec2(AppleImpulseInX, AppleImpulseInY),  rightCuttedApple.body.GetWorldCenter());
     // },
     //
     // throwAppleDown : function(leftCuttedApple, rightCuttedApple){
     //
     // },


    /**
     * shuffleArray : This will shuffle the array
     * @param array : array which has to shuffled.
     */
    shuffleArray : function(array) {
      for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
     },


    /**
     * startTheGame : This will start the game when play button will be clicked.
     */
    startTheGame : function(){
          this.mPhysicsWorld.SetGravity(new b2Vec2(0, 0));
        this.mLevelComplete = false;
        this.mGamePause = false;
        this.mCollisionEnable = true;
        this.mTappingEnable = true;
        this.mJointHappend = false;
        this.removeAllBodies();
        this.removeBodiesSprite();
        //this.destroyAllJoints();
        this.mAvailableKnife = GameLevel.getAvailableKnife();
        this.removeChildByTag(kKnifeSelectorTag);
        if(this.getChildByTag(kAvailableKnifeLayerTag))
            this.removeChildByTag(kAvailableKnifeLayerTag);
        this.addTargetInGame();
        if(!this.getChildByTag(kKnifeLayerTag))
        this.addKnifeInGame();
        this.addAvailableKnifeLayer();
        this.addPauseButton();
    },

    /**
     * contac : This will stop the game when a knife collide with another knife.
     */
    stopTheGame : function(){

        this.removeAllBodies();
        this.mGamePause = true;
        this.mLevelComplete = false;

        if(!this.getChildByTag(kHomeLayerTag))
            this.addHomeLayer();
            this.addGameName();
          this.mIsGameStopped = true;
    },

    /**
     * goToHome : This will navigate to home layer when home button will be select.
     */
    goToHome : function(){
        this.mLevelComplete = false;
        this.mGamePause = true;
        this.removeAllBodies();
        this.removeBodiesSprite();
       if((!this.getChildByTag(kKnifeSelectorTag))){
        this.addKnifeSelector();
        this.addHomeLayer();
        this.addGameName();
      }
    },
    /**
     * replyTheGame : This will replay the game.
     */
    replyTheGame : function(){
        this.removeChildByTag(kPauseLayerTag);
        this.mGamePause = false;
        this.getChildByTag(kKnifeLayerTag).resumeKnifeAnimation();
    },

    /**
     * knifeSelectedCallback : This is a callback method of knifeSelection Layer.
     */
    knifeSelectedCallback : function (sender) {
      this.removeChildByTag(kknifeSelectionLayerTag);
    },

    /**
     * hittingEffect : This will show particle effect when a knife will collide with board.
     *
     */

    hittingEffect : function(position){
           // var hitEffect =  new KHParticleEffect(res.TargetEffect_Plist, cc.p(position.x , position.y), true, 0.05);
            //this.addChild(hitEffect, 100);

    },

    /**
     * removeAllBodies : This will remove all bodies from world.
     */
    removeAllBodies : function () {
      for (var body  =  this.mPhysicsWorld.GetBodyList(); body; body = body.GetNext()) {
          if (body) {
              this.mPhysicsWorld.DestroyBody(body);
          }
      }

    },

     removeBodiesSprite : function () {
         if(this.getChildByTag(kTargetLayerTag)){
             this.removeChildByTag(kTargetLayerTag);
         }
         while(this.getChildByTag(kKnifeLayerTag)){
             this.removeChildByTag(kKnifeLayerTag);
         }
         while(this.getChildByTag(kAttachedKnifeTag)){
             this.removeChildByTag(kAttachedKnifeTag);
         }

         while(this.getChildByTag(kAttachedAppleTag)){
             this.removeChildByTag(kAttachedAppleTag);
         }
         if(this.getChildByTag(kHomeLayerTag))
             this.removeChildByTag(kHomeLayerTag);
             this.removeGameName();
         if(this.getChildByTag(kAvailableKnifeLayerTag))
             this.removeChildByTag(kAvailableKnifeLayerTag);
         if(this.getChildByTag(kAvailableKnifeLayerTag))
             this.removeChildByTag(kAvailableKnifeLayerTag);
         while(this.getChildByTag(kPauseButtonTag)){
             this.removeChildByTag(kPauseButtonTag);
         }

         while(this.getChildByTag(kDummyBrokenBoardInitialTag)){
             this.removeChildByTag(kDummyBrokenBoardInitialTag);
         }

         while(this.getChildByTag(kLeftCuttedAppleTag)){
             this.removeChildByTag(kLeftCuttedAppleTag);
             this.removeChildByTag(kRightCuttedAppleTag);
         }
     },
});
/**
 * KHGameControllerScene : This is the only Scene of the game.
 */
var KHGameControllerScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        return true;
    },

    onEnter : function () {
        this._super();

        var gameControllerLayer =  new KHGameControllerLayer();
        this.addChild(gameControllerLayer, 1);
    },
});
