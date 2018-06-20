
    function Utility   () {}

    Utility.getToAndFromMoveAnimation  =   function (movement) {
        var moveBy  =  new  cc.MoveBy(0.4, cc.p(movement.x, movement.y));
        return  new cc.RepeatForever( new cc.Sequence(moveBy, moveBy.reverse()));

    };

    Utility.getMoveAnimation  =   function (movement) {
        var moveTo  =  new  cc.MoveTo(0.1, cc.p(movement.x, movement.y));
        var easeBounceOut = new  cc.EaseBounceOut.create( moveTo );
        return easeBounceOut;
    };

    Utility.getZoomInZoomOutAnimation =   function () {
        var scaleBy  =  new cc.ScaleBy(0.6, 0.5);
        return ( new cc.Sequence(scaleBy, scaleBy.reverse()));
    };

    Utility.getZoomAnimation = function(scale){
        return  new cc.ScaleTo(0.5, scale);
    };

    Utility.getLabel = function (text, position, tag) {
        var label = new cc.LabelTTF(text, res.DynoRegular_Font, kScoreFontSize, cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        label.setTag(tag);
        label.setPosition(cc.p(position.x, position.y));
        return label;
    };

    Utility.fadeOutAnimation = function(time){
        return new cc.FadeOut.create(time);
    };

    Utility.fadeInAnimation = function(time){
        return new cc.FadeIn.create(time);
    };

    Utility.joinTwoBodies = function(world, bodyA, bodyB, bodyAAnchor, bodyBAnchor){

      var worldCoordsAnchorPointForTarget = bodyA.GetWorldPoint(new b2Vec2(bodyAAnchor.x, bodyAAnchor.y));
      var worldCoordsAnchorPointForApple = bodyA.GetWorldPoint(new b2Vec2(bodyBAnchor.x, bodyBAnchor.y));

      var weldJointDef = new Box2D.Dynamics.Joints.b2WeldJointDef;
      weldJointDef.bodyA = bodyA;
      weldJointDef.bodyB = bodyB;
      weldJointDef.localAnchorA = bodyA.GetLocalPoint(worldCoordsAnchorPointForTarget);
      weldJointDef.localAnchorB = bodyB.GetLocalPoint(worldCoordsAnchorPointForApple);
     weldJointDef.referenceAngle = weldJointDef.bodyB.GetAngle() - weldJointDef.bodyA.GetAngle();
      weldJointDef.collideConnected = false;
       world.CreateJoint(weldJointDef);
    };

    // Utility.getCircleBody = function(world, radius, position, bodyType, density, restitution, friction, type, sprite){
    //   var bodyDef = new b2BodyDef();
    //   bodyDef.type = bodyType;
    //   bodyDef.position.Set(position.x/kPTMRatio, position.y/kPTMRatio);
    //   //this.bodyDef.angularVelocity = 2.0;
    //   bodyDef.userData = {
    //       type  : type,
    //       asset : sprite,
    //   },
    //
    //   body = world.CreateBody(bodyDef);
    //   var shape = new b2CircleShape();
    //   shape.SetRadius(radius/kPTMRatio);
    //   var fixDef = new b2FixtureDef();
    //   fixDef.shape = shape;
    //   fixDef.density =density;
    //   fixDef.friction=friction;
    //   fixDef.restitution = restitution;
    //   body.CreateFixture(fixDef);
    // };
