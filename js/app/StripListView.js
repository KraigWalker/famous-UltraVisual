define(function(require, exports, module) {
	// LOAD CLASS
    var Surface         	= require('famous/core/Surface');
    var Modifier        	= require('famous/core/Modifier');
    var Transform       	= require('famous/core/Transform');
    var View            	= require('famous/core/View');
    var ImageSurface	= require('famous/surfaces/ImageSurface');
    var ContainerSurface	= require('famous/surfaces/ContainerSurface');
	var Easing				= require('famous/transitions/Easing');

    // CONSTRUCTOR
    /**
     * @param (object) options
     * 		- (int) width
     * 		- (int) height
     * 		- (int) yOffset
	 * 		- (String) title
	 * 		- (String) paragraph
	 * 		- (String) img
     * @return this
     */
    function StripListView(options)
    {
        View.apply(this, arguments);

        _createImageView.call(this);

        this._eventInput.pipe(this._eventOutput);
    }

    // EXTENDS FAMOUS VIEW CLASS
    StripListView.prototype = Object.create(View.prototype);
    StripListView.prototype.constructor = StripListView;

    // DEFAULT OPTIONS (refer to this.options into AppView)
    StripListView.DEFAULT_OPTIONS = {
        width: 0,
        height: 0,
		yOffset: 0,
		title: "",
		paragraph: "",
        img: ""
    };

    // CUSTOM PRIVATE METHODS
    function _createImageView() {
		// GROUP VIEW
		this.itemContainer = new ContainerSurface({
            size: [undefined, this.options.height],
            properties:{overflow: 'hidden'}
        });

        this._add(this.itemContainer);

		// IMAGE SURFACE + MODIFIER
        this.imageMod = new Modifier({
            transform: Transform.translate(0, 0, 0)
        });

		// this.imageSurf = new Surface({
		// 	size: [undefined, undefined],
		// 	content: '<img src="' + this.options.img + '" />'
		// });

		this.imageSurf = new ImageSurface({
			size: [undefined, undefined]
		});
		this.imageSurf.setContent(this.options.img)

		// SMALL BANNER SURFACE + MODIFIER
		this.banMod = new Modifier({
			opacity: 0,
			transform: Transform.translate(0, 0, 1)
		});

		this.banSurf = new Surface({
			size: [undefined, undefined],
			content: '<img class="img-top" src="assets/img-top.png" />'
		});

		// TEXT SURFACE + MODIFIER
		var textOffsetHeight = this.options.height * 70 * .01;
		this.textMod = new Modifier();

		this.textSurf = new Surface({
			size: [this.options.width, this.options.height],
			properties: {
				webkitTransformOrigin: "50% 0"
			},
			content: '<div class="title">' + this.options.title + '</div>'
		});

		// PARAGRAPH SURFACE + MODIFIER
		this.paragraphMod = new Modifier();

		this.paragraphSurf = new Surface({
			size: [this.options.width, this.options.height],
			properties: {
				webkitTransformOrigin: "50% 0"
			},
			content: '<p>' + this.options.paragraph + '</p>'
		});

		// PIPE
		this.itemContainer.pipe(this._eventInput);

		// ADD to view to match modifier and surface, because doesn't work on containerSurf ???
		this.add(this.imageMod).add(this.imageSurf);
		this.add(this.banMod).add(this.banSurf);
		this.add(this.textMod).add(this.textSurf);
		this.add(this.paragraphMod).add(this.paragraphSurf);

		// ADD to container surf
		this.itemContainer.add(this.imageSurf);
		this.itemContainer.add(this.banSurf);
		this.itemContainer.add(this.textSurf);
		this.itemContainer.add(this.paragraphSurf);

		// TRANSLATE TO FIRST STATE
		this.textMod.setTransform(
			Transform.translate(0, textOffsetHeight, 0)
		);

		this.paragraphMod.setTransform(
			Transform.translate(0, this.options.height, 0)
		);
    }

	// CUSTOM PUBLIC METHODS
	/**
	* @param (int) y - set img modifier translateY
	* @return null
	*/
	StripListView.prototype.parallax = function(y)
	{
		this.imageMod.setTransform(Transform.translate(0, y * 15, this.options.translateZ));
		this.banMod.setTransform(Transform.translate(0, y, 0));
	};

	// CUSTOM PUBLIC METHODS
	/**
	* @param (int) y - set zoom translateY
	* @return null
	*/
	StripListView.prototype.zoom = function(y)
	{
		if(y < 100) {
			var scaleOffset = y / 100;
			var textOffsetY = (this.options.height * (70 - y) * .01);
			var fontSize = ((y / 2) + 16);

			if(y > 0 && y < 60) {
				scaleOffset = 1 + (y / 100);
			}

			this.banMod.setOpacity(((100 - (-y + 100)) * 2) / 100);

			this.textMod.setTransform(
				Transform.translate(0, textOffsetY, 0)
			);

			if(y > 1) {
				this.paragraphMod.setTransform(
					Transform.translate(0, textOffsetY + 50, 0)
				);
			}else {
				this.paragraphMod.setTransform(
					Transform.translate(0, this.options.height, 0)
				);
			}

			this.textSurf.setProperties({
				fontSize: ((y / 2) + 16) + 'px'
			});
		}
	};

    // EXPORT
    module.exports = StripListView;
});
