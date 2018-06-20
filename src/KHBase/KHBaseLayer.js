
var KHBaseLayer = cc.LayerColor.extend({

    ctor: function (size, position, tag) {
        this._super();
        this.initWithData(size, position, tag);
        return true;
    },

    onEnter: function () {
        this._super();

    },


    /**
     * initWithData: This will customise the base layer properties.
     * @param size: Size of the Layer
     * @param position: position of the layer
     * @param tag: Tag of the Layer
     */
    initWithData : function(size, position, tag){
        this.setContentSize(cc.size(size));
        this.setPosition(cc.p(position.x, position.y));
        this.setTag(tag);
    },



    onExit : function () {
        this._super();
    }



});