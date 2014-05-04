define(function(require, exports, module) {
	// LOAD CLASS
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
	var Transitionable  = require('famous/transitions/Transitionable');
	var Easing		    = require('famous/transitions/Easing');
    var GenericSync     = require('famous/inputs/GenericSync');
	var MouseSync       = require('famous/inputs/MouseSync');

    var PageListView    = require('./PageListView');

    // CONSTRUCTOR
    /**
     * @param (object) options
     * @return this
     */
    function ListView() {
        View.apply(this, arguments);

        // Add PageListView
        _createPageListView.call(this);

        _handleTouch.call(this);
    }

    // EXTENDS FAMOUS VIEW CLASS
    ListView.prototype = Object.create(View.prototype);
    ListView.prototype.constructor = ListView;

    // DEFAULT OPTIONS (refer to this.options into ListView)
    ListView.DEFAULT_OPTIONS = {
		posThreshold: window.innerHeight / 4,
        velocity: 0.25,
		listData: null,
        transition: {
            duration: 500,
            curve: Easing.outCubic
        }
    };

    // CUSTOM PRIVATE METHODS
    function _createPageListView() {
		this.scrollEnabled = true;

        this.pageListView = new PageListView({
			stripHeight: this.options.posThreshold * 2,
			listData: this.options.listData
		});
        this.pageModifier = new Modifier();

        this.maxScroll = this.pageListView.getStripsViewHeight() - window.innerHeight;

        this._add(this.pageModifier).add(this.pageListView);
    }

    function _handleTouch() {
        this.pageListViewPos = new Transitionable(0);

        GenericSync.register(MouseSync);
        this.sync = new GenericSync(function() {
            return this.pageListViewPos.get(0);
        }.bind(this), {direction: GenericSync.DIRECTION_Y});

        this.pageListView.pipe(this.sync);

        this.sync.on('update', function(data) {
			var pos = this.pageListViewPos.get();
			pos += data.delta / 2;
            this.pageListViewPos.set(pos);
        }.bind(this));

        this.sync.on('end', (function(data) {
			this.scrollEnabled = false;
			var offsetY = Math.floor(this.pageListViewPos.get() / this.options.posThreshold);
            var velocity = data.velocity;
            var position = this.pageListViewPos.get();
			var duration = this.options.transition.duration;
			var curve = this.options.transition.curve;

			if(data.delta > 0) {
				offsetY += 1;
			}

			offsetY *= this.options.posThreshold;

			if(this.pageListViewPos.get() < -(this.maxScroll + window.innerHeight - this.options.posThreshold)) {
				this.slideTo(-(this.maxScroll + window.innerHeight - this.options.posThreshold));
				offsetY = -(this.maxScroll + window.innerHeight - this.options.posThreshold);
				curve = Easing.outBack;
			}else if(this.pageListViewPos.get() > 0) {
				offsetY = 0;
				curve = Easing.outBack;
			}

			duration = Math.abs(position - offsetY) * 10;

			this.slideTo(offsetY, duration, curve);
        }).bind(this));
    }

    ListView.prototype.render = function() {
        this.spec = [];

        var offsetY = this.pageListViewPos.get();

        this.spec.push({
			transform: Transform.translate(0, this.pageListViewPos.get(), 0),
            target: this.pageListView.render()
        });

        _updateListView.call(this, this.pageListViewPos.get());

        return this.spec;
    };

    function _updateListView(y) {
		this.pageListView.updateView(y);
    }

    // CUSTOM PUBLIC METHODS
    ListView.prototype.slideTo = function(y, duration, curve) {
        this.pageListViewPos.set(y, {duration: duration, curve: curve}, function() {
            this.scrollEnabled = true;
        }.bind(this));
    };

    // EXPORT
    module.exports = ListView;
});
