
var KHCircleBody  = cc.Class.extend({
        body    : null,
        bodyDef : null,
        shape   : null,
        world   : null,

    ctor: function(world,radius, bodyType, density, restitution, friction, pos, type, sprite, categoryBits, maskBits){
        this.world = world;
        this.makeCircleBody(radius, bodyType, density, restitution, friction, pos, type, sprite, categoryBits, maskBits);
        return true;

    },

    makeCircleBody: function(radius, bodyType, density, restitution, friction, pos, type, sprite, categoryBits, maskBits){
        this.bodyDef = new b2BodyDef();
        this.bodyDef.type = bodyType;
        this.bodyDef.position.Set(pos.x/kPTMRatio, pos.y/kPTMRatio);
        this.bodyDef.angularVelocity = 3.0;
        this.bodyDef.userData = {
            type  : type,
            asset : sprite,
        },

        this.body = this.world.CreateBody( this.bodyDef);
        this.shape = new b2CircleShape();
        this.shape.SetRadius(radius/kPTMRatio);
        var fixDef = new b2FixtureDef();
        fixDef.shape = this.shape;
        fixDef.density =density;
        fixDef.friction=friction;
        fixDef.restitution = restitution;
         fixDef.sensor= true;
        fixDef.filter.categoryBits = categoryBits;
        fixDef.filter.maskBits = maskBits;
        this.body.CreateFixture(fixDef);
    },
});
