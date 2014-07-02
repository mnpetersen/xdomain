// crappy cross-domain functions.
var XDomain = (function (targetWindow) {

    var eventDelegate = {};
    var log = function(msg) {
        console.log(msg);
    }
    // Bind to postEvents from parent page;
    // TODO - needs better security
    $(window).on("message", function (evt) {
        var msgAsJSON = evt.originalEvent.data;
        log("Received : " + msgAsJSON + " from " + evt.originalEvent.origin);
        var msg = JSON.parse(msgAsJSON);
        $(eventDelegate).trigger(msg.type, msg.data);
    });

    return {
        sendMessage: function sendMessage(eventType, eventData) {
            var msg = {
                type: eventType,
                data: eventData
            };
            targetWindow.postMessage(JSON.stringify(msg), "*");
        },
        listen: function (eventType, callback) {
            $(eventDelegate).on(eventType, function(e,data) {
                callback(data);
            });
        }

    };
});