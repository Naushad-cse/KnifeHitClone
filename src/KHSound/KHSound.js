

var KHSound = KHButton.extend({
    isPlaying : true,

    ctor : function (image, position, tag){
        this._super(image, cc.p(position.x, position.y), tag);
        this.setOpacity(100);
        this.createUI();
     // this.setDelegate(this);
        return true;
    },


    buttonPressed : function (sender, type){
        cc.log("sound Button clicked");
    },

    changeSoundButtonTexture : function(){
        var soundButton = this.getChildByTag(kSoundSpriteTag);
        if(this.isPlaying){
          soundButton.setTexture(cc.Sprite.create(res.SoundDisable_png).getTexture());
         }
         else {
           soundButton.setTexture(cc.Sprite.create(res.SoundEnable_png).getTexture());
         }
        this.isPlaying =  !this.isPlaying;
    },

    createUI : function(){
        this.addSoundsprite();
    },

    addSoundsprite : function(){
      var soundButton = new KHSprite(res.SoundEnable_png, cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5), kSoundSpriteTag);
      this.addChild(soundButton, 2);
    },

    onEnter : function(){
        this._super();
    },

    onExit : function () {
        this._super();
    },

});
