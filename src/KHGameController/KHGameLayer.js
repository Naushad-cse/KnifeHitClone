
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

// var orld;
var count = 0;
var timerForGameOver = 0;
var KHGameLayer = KHBaseLayer.extend({
    mPhysicsWorld : null,
    mIsKnifeAvailable : false,
    mAvailableKnife : kTotalNumberOfKnife,
    mShouldJoin     : true,
    isGameOver       : false,
    mScore           : 0,
    mTimerForGameOver: 100,


    ctor: function () {
        this._super(cc.size(cc.winSize.width  , cc.winSize.height), cc.p(0,0), kGameControllerLayerTag);
        return true;
    },

    onEnter : function () {
        this._super();

        var gameOverLayer =  this.getChildByTag(kGameOverLayerTag);
        if(gameOverLayer){
            this.removeChildByTag(kGameOverLayerTag);
        }
        this.initPhysicsWorld();
        this.createUI();


    },

    /**
     * initthis.mPhysicsWorld : This will add physics world in the game and it will also call scheduleUpdate.
     */
    initPhysicsWorld : function(){
        this.mPhysicsWorld = new b2World(new b2Vec2(KGravityInX , KGravityInY), true);
        this.mPhysicsWorld.SetContinuousPhysics(true);
        this.scheduleUpdate();
    },

    /**
     * createUI : This will add UI component in the game.
     */
    createUI : function(){
        this.addBackGroundImage(res.BackGround_png);
        this.addTargetInGame();
        //this.addKnifeInGame();
        this.contactListener();
        // this.addAvailableDummyKnife();
        // this.addScoreLabel();
        this.gameName();

    },

    addBackGroundImage : function(image){
        var backGround = new KHSprite(image, cc.p(this.getContentSize().width / 2, this.getContentSize().height / 2), kBackGroundTag);
        this.addChild(backGround,1);
    },

    /**
     * update : This is a scheduler callback method which will call on every dt seconds.
     * @param dt : time interval between two consecutive call.
     */
    update : function(dt){
        this.mPhysicsWorld.Step(dt,10,10);
        this.moveSpritesWithBodies();
        this.updateScore();
        this.onDebugDrawMask();

        if(!this.mIsKnifeAvailable && count > 25 && this.mAvailableKnife > 0) {
            this.addKnifeInGame();
            this.mIsKnifeAvailable = true;
            count = 0;
        }else{
            count++;
        }

        if (this.mAvailableKnife == 0  ||  this.isGameOver){
            timerForGameOver++;
        }

        if( this.mTimerForGameOver < timerForGameOver){
            var gameOverLayer  =  new KHGameOverLayer();
            this.addChild(gameOverLayer, 100);
            timerForGameOver = 0;
        }
        console.log("available knife " + this.mAvailableKnife);
    },


    moveSpritesWithBodies : function() {
        for (var body  =  this.mPhysicsWorld.GetBodyList(); body; body = body.GetNext()) {
            if (body.GetUserData() != null) {
                var mySprite = body.GetUserData().asset;
                mySprite.setPosition(body.GetPosition().x * kPTMRatio, body.GetPosition().y * kPTMRatio);
                mySprite.setRotation(-1 * cc.radiansToDegrees(body.GetAngle()));
                if( body.GetUserData().type == KeyForKnifeText && body.GetPosition().y * kPTMRatio > this.getContentSize().height * 0.8 || body.GetPosition().y * kPTMRatio < this.getContentSize().height * 0.1 || body.GetPosition().x * kPTMRatio > this.getContentSize().width * 0.6 || body.GetPosition().x * kPTMRatio < this.getContentSize().width * 0.4){
                    this.isGameOver =  true;
                    this.mAvailableKnife = 0;
                }
            }

            if(body.GetUserData() != null && body.GetUserData().type  == KeyForTargetText ){
                body.SetPosition(new b2Vec2((this.getContentSize().width * 0.5) / kPTMRatio, (this.getContentSize().height * 0.6)/kPTMRatio));

            }
        }
    },

    contactListener : function() {
        cc.log("contact listener called");
        var listener = new Box2D.Dynamics.b2ContactListener;
        physicsWorld = this.mPhysicsWorld;


        listener.BeginContact = function (contact) {

            var bodyA = contact.GetFixtureA().GetBody();
            var bodyB = contact.GetFixtureB().GetBody();


            //  console.log("count for contact " + contact.GetManifold().m_pointCount);
            //
            //  var  worldManifold =  new Box2D.Collision.b2WorldManifold;
            // contact.GetWorldManifold(worldManifold);
            //
            //
            // for(var pointCount = 0;  pointCount < contact.GetManifold().m_pointCount; pointCount++){
            //     cc.log (" point in x " + worldManifold.m_points[pointCount].x * kPTMRatio, " point on y" +  worldManifold.m_points[pointCount].y * kPTMRatio);
            // }
            //
            //  var rotation = 0;

            // var radius = contactBody.other.GetUserData().asset.getContentSize().width / 2;
            // var deltaAngle = 90;
            //
            // var xPos = contactBody.other.GetUserData().asset.getContentSize().width / 2 + radius * Math.cos(cc.degreesToRadians(rotation - deltaAngle));
            // var yPos = contactBody.other.GetUserData().asset.getContentSize().height /2 + radius * Math.sin(cc.degreesToRadians(rotation - deltaAngle));


            if ((bodyA.GetUserData().type == KeyForKnifeText && bodyB.GetUserData().type == KeyForTargetText) || (bodyB.GetUserData().type == KeyForKnifeText && bodyA.GetUserData().type == KeyForTargetText)) {
                var worldCoordsAnchorPointForTarget = bodyA.GetWorldPoint(new b2Vec2(0.0, 0.5));
                var worldCoordsAnchorPointForKnife = bodyA.GetWorldPoint(new b2Vec2(0.0, 1.0));


                var rotation = bodyA.GetUserData.type == KeyForTargetText ? (bodyA.GetUserData().asset.getRotation() % 360) : (bodyB.GetUserData().asset.getRotation() % 360);


                //Stop the knife

                if (bodyA.GetUserData.type == KeyForKnifeText) {
                    bodyA.SetAngle(rotation);
                    bodyA.ApplyImpulse(new b2Vec2(0, 0), bodyA.GetWorldCenter());
                }
                else {
                    bodyB.SetAngle(rotation);
                    bodyB.ApplyImpulse(new b2Vec2(0, 0), bodyB.GetWorldCenter());
                }

                weldJointDef = new Box2D.Dynamics.Joints.b2WeldJointDef;
                weldJointDef.bodyA = bodyA;
                weldJointDef.bodyB = bodyB;
                weldJointDef.localAnchorA = bodyA.GetLocalPoint(worldCoordsAnchorPointForTarget);
                weldJointDef.localAnchorB = bodyB.GetLocalPoint(worldCoordsAnchorPointForKnife);
                weldJointDef.referenceAngle = weldJointDef.bodyB.GetAngle() - weldJointDef.bodyA.GetAngle();

                weldJointDef.collideConnected = false;

                this.mScore++;

              //  cc.log("should join", +  this.mShouldJoin);

              //  if(this.mShouldJoin) {
                joint = this.mPhysicsWorld.CreateJoint(weldJointDef);
                this.addHittingEffect();
                    //this.isGameOver = false;
                    //this.mShouldJoin  = true;
                //}else{
                this.mShouldJoin =  true;
              //  }



            }


            //-- If a knife collide with another one
            else {
                bodyA.ApplyImpulse(new b2Vec2(1, -10), bodyA.GetWorldCenter());
                bodyB.ApplyImpulse(new b2Vec2(-1, -10), bodyB.GetWorldCenter());
               // this.mAvailableKnife = 0;
              //  this.mShouldJoin = false;

                cc.log("body A = " + bodyA.GetUserData().type);
                cc.log("body B = " + bodyB.GetUserData().type);
            }

        }.bind(this);

        listener.EndContact = function (contact) {
            console.log(contact.GetFixtureA().GetBody().GetUserData());
            console.log(" collide");
              //this.isGameOver =  true;
        };
        listener.PostSolve = function (contact, impulse) {

        };
        listener.PreSolve = function (contact, oldManifold) {

        };




        this.mPhysicsWorld.SetContactListener(listener);
    },


    /**
     * onDebugDrawMask : This will on the debug draw mask of physics bodies.
     */
    onDebugDrawMask : function(){
        var debugDraw = new Box2D.Dynamics.b2DebugDraw();
        debugDraw.SetSprite(document.getElementById(kDebugCanvas).getContext(kDebugContext));
        debugDraw.SetDrawScale(12.5);
        debugDraw.SetFillAlpha(1.3);
        debugDraw.SetLineThickness(0.5);
        debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
        this.mPhysicsWorld.SetDebugDraw(debugDraw);
        this.mPhysicsWorld.DrawDebugData();


    },


    /**
     * addTargetInGame : This will add a target board in middle of screen to hit by knife.
     */
    addTargetInGame : function(){
        var targetSprite = new KHBoard(res.Target_png, cc.p(this.getContentSize().width / 2, this.getContentSize().height * 0.6), kTargetTag);
        var circleBody  = new KHCircleBody(this.mPhysicsWorld, kTargetRadius, Box2D.Dynamics.b2Body.b2_dynamicBody, KTargetDensity, KTargetRestitution, KTargetFriction, cc.p(targetSprite.getPositionX(), targetSprite.getPositionY()), KeyForTargetText, targetSprite);
        this.addChild(targetSprite, 100);

    },

    /**
     * addKnifeInGame : This will add knife in the game.
     */
    addKnifeInGame : function(){

        var knife = new KHKnife(res.Knife_png, cc.p(this.getContentSize().width / 2, this.getContentSize().height * 0.2 ), 0, kKnifeInitialTag);
        knife.setDelegate(this);
        knife.setOpacity(0);
        var knifeBody = new KHBoxBody(this.mPhysicsWorld, KnifeWidth, KnifeLength, Box2D.Dynamics.b2Body.b2_dynamicBody, KnifeDensity, KnifeRestitution, KnifeFriction, cc.p(knife.getPositionX(), knife.getPositionY()), 0,  KeyForKnifeText, knife);
        this.addChild(knife, 3);

        var  dummyKnifeForAnimation   = new KHSprite(res.Knife_png, cc.p(this.getContentSize().width / 2, this.getContentSize().height * 0.2), kDummyKnifeTag);
        dummyKnifeForAnimation.runAction( Utility.getToAndFromMoveAnimation(cc.p(0, 10)));

        this.addChild(dummyKnifeForAnimation, 2);

    },

    buttonPressed : function(sender, type){
        cc.log("button pressed");
        // var dummyKnife  = this.getChildByTag(kDummyKnifeTag);
        this.removeChildByTag(kDummyKnifeTag);
        sender.setOpacity(255);
        this.mIsKnifeAvailable = false;
        count = 0;
        this.tapKnife();
    },


    tapKnife : function () {
        for (var body = this.mPhysicsWorld.GetBodyList(); body; body = body.GetNext()) {

            if (body.GetUserData() != null && body.GetUserData().type == KeyForKnifeText) {

                body.ApplyImpulse(new b2Vec2(0, 5.5), body.GetWorldCenter());
            }
        }
    },
    onExit : function () {
        this._super();
    },

    addHittingEffect : function () {
        var hitEffect =  new KHParticleEffect(res.TargetEffect_Plist, cc.p(this.getContentSize().width * 0.5 , this.getContentSize().height * 0.52), true, 0);
        this.addChild(hitEffect, 100);
    },

});
