
var KHAttachedKnife  =  KHSprite.extend({
    mKnifeBody : null,
    ctor : function (world, knifeImage, position, tag) {
        this._super(knifeImage, position, tag);
        this.createBody(world);
        return true;
    },

    createBody : function (world) {
      this.mKnifeBody = new KHBoxBody(world, KnifeWidth, KnifeLength, Box2D.Dynamics.b2Body.b2_dynamicBody, KnifeDensity, KnifeRestitution, KnifeFriction, cc.p(this.getPositionX(), this.getPositionY()), 0,  KeyForAttachedKnifeText, this, kKnifeCategory,  kKnifeMask);
      //this.mKnifeBody.body.GetFixtureList().GetFixtureA().filter.groupIndex = FFFFFFFF;
    },

    onEnter : function () {
        this._super();
    },

    onExit : function () {
        this._super();
    }

});
