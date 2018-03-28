"use strict"

class GoogleCalendar {

    getEvents (callback) {
	const that = this,
	    map = {};
	async.waterfall([
	    function (cb) {
		that.initialize(function (err) {
		    console.dir("loaded");
		    cb(err);
		});
	    },
	    function (cb) {
		const req = that.makeEventListRequest();
		req.execute(function (res) {
		    if (!res || !res.items) {
			const err = "No events exist";
			cb(err);
			return;
		    }
		    cb(null, res);
		});
	    },
	    function (res, cb) {
		async.each(res.items, function (event, ecb) {
		    that.getEvent(event, function (json) {
			map[json.start] = json;
			ecb();
		    });
		}, function (err) {
		    cb(err);
		});
	    }
	], function (err) {
	    const events = [];
	    if (err) {
		callback(err, null);
	    }
	    const keys = Object.keys(map);
	    keys.sort();
	    keys.forEach(function (key) {
		const ev = map[key];
		events.push(ev);
	    });
	    callback(null, events);
	});
    };

    initialize (callback) {
	if (!gapi || !gapi.client) {
	    callback("initialize failed");
	    return;
	}
	gapi.client.setApiKey("AIzaSyBcfNIHy3lcSSBD385jDJaYfOalt-lLmRg");
	gapi.client.load('calendar', 'v3').then(function () {
            callback();
	});
    }

    makeEventListRequest () {
	const start = new Date();
        const end = new Date();
	start.setHours(start.getHours() - 12);
	end.setDate(end.getDate() + 14);
	const req = gapi.client.calendar.events.list({
            "calendarId": "tkdksc@gmail.com",
            "singleEvents": "true", // expand recurring events                                                                                                                                                                        
            "timeMin": start.toJSON(),
            "timeMax": end.toJSON()
	});
	return req;
    }

    getEvent (event, callback) {
	const req = gapi.client.calendar.events.get({
            "calendarId": "tkdksc@gmail.com",
            "eventId": event.id
	});
	req.execute(function (res) {
            const ev = res.result,
		  json = {};
            json.summary = ev.summary;
            json.loc = ev.location;
            json.start = new Date(ev.start.dateTime);
            json.end = new Date(ev.end.dateTime);
            callback(json);
	});
    };
}
