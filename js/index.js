(function () {

    "use strict";

    /*
    $('.navbar-nav>li>a').on('click', function(){
	$('.navbar-collapse').collapse('hide');
    });
    */
    
    const app = {};
    const array = [];
    app.gc = new GoogleCalendar();
    app.gc.getEvents(function (err, events) {
	if (err || !events) {
	    console.log(err);
	    return;
	}
	events.forEach(function (event) {
	    console.log(event);
	    array.push(new app.Schedule(event));
	});
	//app.schedules.reset(array);
    });

})();
