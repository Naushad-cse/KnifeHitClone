
var KHBoard = KHSprite.extend({
    mBoardAngularSpeed : 0,
    mWorld             : null,
    mBoard             : null,

    ctor: function (world, position, tag) {
        this._super(res.Target_png, cc.p(position.x, position.y), tag);
        this.setPhysicsWorld(world);
        this.setOpacity(255);
        this.setScale(1.0);
       // this.setColor(cc.color(100, 50, 50));
        return true;
    },

    /**
     * setPhysicsWorld : This will set the physics world.
     *
     */
    setPhysicsWorld : function (world){
        this.mWorld = world;
    },

     /**
      * getBoard : This will return a  target board, when a level will be passed.
      *
      */
     getBoard : function(level){
        //TargetSprite
        // var targetSprite = new KHSprite(res.Target_png, cc.p(this.getContentSize().width / 2, this.getContentSize().height/2), kTargetTag);
        //  targetSprite.setScale(1.0);
         //targetSprite.setAnchorPoint(cc.p(0.5, 0.5));
        //Target body
        this.mBoard  = new KHCircleBody(this.mWorld, kTargetRadius, Box2D.Dynamics.b2Body.b2_dynamicBody, KTargetDensity, KTargetRestitution, KTargetFriction, cc.p(this.getPositionX(), this.getPositionY()), KeyForTargetText, this, kTargetCategory, kTargetMask);
        //this.mBoard.body.SetAngularVelocity(2.0);
    },

    /**
     * rotateBoard : This wil rotate the board when a angular velocity will be passed to it.
     */
    rotateBoard : function(){
       var rand = cc.randomMinus1To1() * 2 + 1;
       if(rand > -0.5 && rand < 0.5){
           rand = 1.0;
       }
     this.mBoard.body.SetAngularVelocity(rand);
    },

    onEnter : function () {
        this._super();

    },

    onExit : function () {
        this._super();
    },
});
