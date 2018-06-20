var KHApple = KHSprite.extend({
     mAppleBody   : null,
     mAppleImage  : null,
     mAppleAngle  : 0,
     bodyDef      : null,
     shape        : null,
     body         : null,
     fixDef       : null,

  ctor : function(world, appleImage, position, type, categoryBits, maskBits, tag){
    this._super(appleImage, position, tag);
    this.setOpacity(255);
    this.getApple(world,type, categoryBits, maskBits);
    this.setScale(0.3);
    this.setAnchorPoint(cc.p(0.2, 0.2));
    return true;
  },

  onEnter : function () {
      this._super();

  },

/**
 * getApple : This will create an physics body for apple.
 */
  getApple : function (world, type, categoryBits, maskBits) {
   //this.mAppleBody = Utility.getCircleBody(world, AppleRadius, cc.p(this.getPositionX(),  this.getPositionY()), Box2D.Dynamics.b2Body.b2_dynamicBody, AppleDensity, AppleRestitution, AppleFriction, KeyForAppleText, this);
   //this.mAppleBody.body.SetAngle(90);
   //this.setRotation(90);

   this.bodyDef = new b2BodyDef();
   this.bodyDef.type =  Box2D.Dynamics.b2Body.b2_dynamicBody;
   this.bodyDef.position.Set(this.getPositionX()/kPTMRatio, this.getPositionY()/kPTMRatio);
   this.bodyDef.angularVelocity = 2.0;
  // this.bodyDef.angle = 90;
   this.bodyDef.userData = {
       type  : type,
       asset : this,
   },

   this.body = world.CreateBody(this.bodyDef);
   this.shape = new b2CircleShape();
   this.shape.SetRadius(AppleRadius/kPTMRatio);
   this.fixDef = new b2FixtureDef();
   this.fixDef.shape = this.shape;
   this.fixDef.density = AppleDensity;
   this.fixDef.friction = AppleFriction;
   this.fixDef.isSensor = true;
   this.fixDef.restitution = AppleRestitution;
   this.fixDef.filter.categoryBits = categoryBits;
   this.fixDef.filter.maskBits = maskBits;
   this.body.CreateFixture( this.fixDef);
  },

/**
 * setAppleAngle : This will rotate the apple by an angle.
 */
  setAppleAngle : function(angle){
     //this.setRotation(90);
   },

  onExit : function () {
    this._super();
  },
});
