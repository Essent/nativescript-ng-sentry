var NgSentry = require("nativescript-ng-sentry").NgSentry;
var ngSentry = new NgSentry();

describe("greet function", function() {
    it("exists", function() {
        expect(ngSentry.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(ngSentry.greet()).toEqual("Hello, NS");
    });
});