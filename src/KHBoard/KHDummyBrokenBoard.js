var KHDummyBrokenBoard = KHSprite.extend({
      ctor : function (world, image, position, tag) {
        this._super(image, position, tag);
        this.AddPhysicsBodies(world);
        return true;
      },

      AddPhysicsBodies : function(World){
          this.DummyBrokenBoardBody = new KHBoxBody(World, this.getContentSize().width, this.getContentSize().height, Box2D.Dynamics.b2Body.b2_dynamicBody, KnifeDensity, KnifeRestitution, KnifeFriction, cc.p(this.getPositionX(), this.getPositionY()), 0,  "DummyBrokenBoard", this);
      },

      onEnter : function(){
        this._super();
      },

      onExit : function(){
        this._super();
      },

});
