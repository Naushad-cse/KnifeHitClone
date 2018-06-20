
var KHParticleEffect = cc.ParticleSystem.extend({

    ctor: function (particleFile, position, duration, tag) {
        this._super(particleFile);
        this.initWithData(position, duration, tag);
        return true;
    },

    onEnter: function () {
        this._super();
    },
    /**
     * initWithData: This will customise the properties of the IAParticle system.
     * @param position: Position of the particle system.
     * @param duration: Duration of particles.
     * @param tag: tag of the particle system.
     */
    initWithData: function (position, duration, tag) {
        this.setPosition(cc.p(position.x, position.y));
        this.setDuration(duration);
        this.setTag(tag);
    },

    onExit: function () {
        this._super();
    }
});
