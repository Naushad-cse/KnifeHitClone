
cc.PGPostalButtonDelegate = cc.Class.extend({

    buttonPressed: function (sender) {

    }
});


var KHButton = ccui.Button.extend({

    mDelegate : null,

    /**
     * ctor : This is a constructor method which will firstly call the super constructor and customise the properties  of
     * button by calling the method initWithData
     * @param position
     * @param tag
     * @returns {boolean}
     */
    ctor: function (buttonImage, position, tag) {
        this._super();
        this.initWithData(buttonImage ,position, tag);
        return true;
    },

    onEnter: function () {
        this._super();

    },


    /**
     * initWithData: This will customise the Button properties.
     * @param position: position of the Button
     * @param tag: Tag of the Button
     */
    initWithData : function(buttonImage, position, tag){
        this.loadTextures(buttonImage, buttonImage);
        this.setPosition(cc.p(position.x, position.y));
        this.setTag(tag);
        this.addTouchEventListener(this.buttonCallback, this);
    },

    /**
     * setDelegate : this will set the delegate for button
     * @param ref
     */
    setDelegate : function(ref){
        this.mDelegate = ref;
    },

    /**
     * buttonCallback : This is a callback method of button touch event which will call when a button will be touch.
     * This will call a delegate method button pressed when a button will be touched.
     * @param sender: button which will be touch.
     * @param type: type of the touch event
     */
    buttonCallback : function(sender, type) {

        switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
            this.mDelegate.buttonPressed(sender);
            break;
        }
    },

    onExit : function () {
        this._super();
    }
});