
var KHBoxBody  = cc.Class.extend({
        body : null,
        shape : null,
        world : null,

    ctor: function(world, width, height, bodyType, density, restitution, friction, position, rotation, type, sprite, categoryBits, maskBits){
        this.world = world;
        this.makeBoxBody(width, height, bodyType, density, restitution, friction, position, rotation, type, sprite, categoryBits, maskBits);
        return true;

    },

    makeBoxBody: function(width, height, bodyType, density, restitution, friction, position, rotation, type, sprite, categoryBits, maskBits){
        var bodyDef = new b2BodyDef();
        bodyDef.type = bodyType;
        bodyDef.position.Set(position.x / kPTMRatio, position.y / kPTMRatio);


        bodyDef.userData = {
            type  : type,
            asset : sprite,
        },

        this.body = this.world.CreateBody(bodyDef);
        this.shape = new b2PolygonShape();
        width=width / 2;
        height=height / 2;
        this.shape.SetAsBox(width / kPTMRatio,height / kPTMRatio)
        var fixDef = new b2FixtureDef();
        fixDef.shape=this.shape;
        fixDef.density=density;
        fixDef.friction=friction;
        fixDef.restitution = restitution;
        fixDef.filter.categoryBits = categoryBits;
        fixDef.filter.maskBits = maskBits;
        this.body.CreateFixture(fixDef);
    },

});
