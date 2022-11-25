var should = require("should");
var fds = require("../index");

describe("Embed Server", function () {
    var server;

    before(function () {
        server = fds({ enableJava: false });
    });

    it("should return a server object", function () {
        server.should.be.a.Function();
    });
});
