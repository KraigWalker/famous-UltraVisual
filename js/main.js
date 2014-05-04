define(function(require, exports, module) {
        var Engine = require('famous/core/Engine');
        var ListView  = require('app/ListView');

        var mainContext = Engine.createContext();

        var listView = new ListView({listData: ultraVisualData.Featured});

        mainContext.add(listView);
});
