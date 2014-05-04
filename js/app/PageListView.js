define(function(require, exports, module) {
	// LOAD CLASS
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');

    var StripListView      = require('./StripListView');

    // CONSTRUCTOR
    /**
    * @param (object) options
	*	- (int) stripWidth
	*	- (int) stripHeight
    *	- (int) topOffset
    * @return this
    */
    function PageListView() {

        View.apply(this, arguments);

        _createStripListViews.call(this);

        this._eventInput.pipe(this._eventOutput);
    }

    // EXTENDS FAMOUS VIEW CLASS
    PageListView.prototype = Object.create(View.prototype);
    PageListView.prototype.constructor = PageListView;

    // DEFAULT OPTIONS (refer to this.options into AppView)
    PageListView.DEFAULT_OPTIONS = {
            stripWidth: 320,
            stripHeight: 200,
            topOffset: 150,
			listData: null
        };

    // CUSTOM PRIVATE METHODS
    function _createStripListViews(options) {
		var yOffset;
		this.stripModifiers = [];
		this.stripListViews = [];

        for(var i = 0; i < this.options.listData.length; i++) {
            yOffset = (this.options.stripHeight / 2) * i;

            var stripListView = new StripListView({
                width: this.options.stripWidth,
                height: this.options.stripHeight,
				yOffset: yOffset,
                img: this.options.listData[i].img,
				title: this.options.listData[i].title,
				paragraph: this.options.listData[i].paragraph
            });

            stripListView.pipe(this._eventInput);

            var stripModifier = new Modifier({
                transform: Transform.translate(0, yOffset, -i)
            });

            this.stripListViews.push(stripListView);
            this.stripModifiers.push(stripModifier);
            this._add(stripModifier).add(stripListView);
        }
		this.totalHeight = yOffset + this.options.stripHeight / 2;
    }

    // CUSTOM PUBLIC METHODS
    /**
     * @param (int) y - set translateY
     * @return null
     */
    PageListView.prototype.updateView = function(y)
    {
		this.stripListViews[0].zoom(50);
		var yOffset, percent;

        for(var i = 0; i < this.stripModifiers.length; i++) {
			var stripOffset = this.stripListViews[i].options.yOffset;

			if(-stripOffset >= y) {
				yOffset = stripOffset - (-stripOffset- y);
				percent = yOffset * 100 / this.stripListViews[i].options.height;
				this.stripModifiers[i].setTransform(Transform.translate(0, yOffset, -i));

				if(i + 1 < this.stripListViews.length) {
					this.stripListViews[i + 1].zoom((-stripOffset - y) * 100 / this.stripListViews[i].options.height);
				}
			}else {
				yOffset = stripOffset - (-stripOffset);
				this.stripModifiers[i].setTransform(Transform.translate(0, stripOffset, -i));
			}

			if(-stripOffset > y - (window.innerHeight)) {
				this.stripListViews[i].parallax((-stripOffset - y) / 10);
			}
		}
	};

	/**
	* return the totalHeight caculated into _createStripListViews
	* @param null
	* @return (int) this.totalHeight
	*/
	PageListView.prototype.getStripsViewHeight = function()
	{
		return this.totalHeight;
	};

    // EXPORT
    module.exports = PageListView;
});
