var geomock = (typeof(geomock) == 'undefined')?{}:geomock;

geomock.map = null;
geomock.map_id = 'gm_map'; 
geomock.mock_pos = {};
geomock.orig_pos = {};
geomock._getCurrentPosition = function() {};

geomock.init = function() {

	// Initialise map
	geomock.map = new google.maps.Map(document.getElementById(geomock.map_id), {
		zoom: 14,
		center: new google.maps.LatLng(geomock.mock_pos.coords.latitude, geomock.mock_pos.coords.longitude),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	})

	// Mark own position
	geomock.orig_pos = new google.maps.LatLng(geomock.mock_pos.coords.latitude, geomock.mock_pos.coords.longitude)
	new google.maps.Marker({
		animation: google.maps.Animation.BOUNCE,
		position: new google.maps.LatLng(geomock.mock_pos.coords.latitude, geomock.mock_pos.coords.longitude),
		icon: "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png",
		map: geomock.map
	})

	// Set up listener on map to detect selected mock position
	google.maps.event.addListener(geomock.map, 'click', function(e) {
		geomock.mock_pos.coords.latitude = e.latLng.lat();
		geomock.mock_pos.coords.longitude = e.latLng.lng();
		
		geomock._markPosition(new google.maps.LatLng(geomock.mock_pos.coords.latitude, geomock.mock_pos.coords.longitude));
	})

	// Substitue native geolocation methods with our own
	geomock._getCurrentPosition = navigator.geolocation.getCurrentPosition;
	navigator.geolocation.getCurrentPosition = geomock.getCurrentPosition;

	geomock._watchPosition = navigator.geolocation.watchPosition;
	navigator.geolocation.watchPosition = geomock.watchPosition;

}

geomock._markPosition = function(ll) {
	// Mark the position
	if(geomock.mock_pos.marker) {
		geomock.mock_pos.marker.setMap(null);	
	}
	geomock.mock_pos.marker = new google.maps.Marker({
		position: ll,
		map: geomock.map,
		title: "Mock position"
	})
}

geomock._returnPosition = function(f) {
	var pos = {
		'coords': geomock.mock_pos.coords,
		'timestamp': Date.parse(new Date())
	}

	if(typeof(f) == 'function') {
		f.call(window, pos); // Call the success callback
	}
}

geomock.getCurrentPosition = function(success, error, opts) {
	console.log("Fake");

	// Return our mocked location after some delay
	return setTimeout(function(){
		geomock._returnPosition(success);
	}, parseInt(Math.random() * 1000 % 1000));
}

geomock.watchPosition = function(success, error, opts) {
	console.log("Fake");

	// Return our mocked location after some delay
	return setInterval(function(){
		geomock._returnPosition(success);
	}, parseInt(Math.random() * 1000 % 1000));
}

geomock.go = function() {
	// Nerf the real geolocation poll
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(pos) {
			
			if(!geomock.mock_pos.coords) { 
				geomock.mock_pos.coords = {} 
			}
			geomock.mock_pos.coords = {
				'accuracy': pos.coords.accuracy,
				'latitude': pos.coords.latitude,
				'longitude': pos.coords.longitude
			};

			// Import GMaps Javascript
			var s = document.createElement('script');
			s.type = 'text/javascript';
			s.src = "http://maps.googleapis.com/maps/api/js?sensor=true&region=GB&callback=geomock.init";


			var gm_panel = document.createElement('div');
			gm_panel.id = "gm_panel"

			gm_panel.style.backgroundColor = "white";
			gm_panel.style.border = "1px solid #ccc";
			gm_panel.style.position = "absolute";
			gm_panel.style.top = "20px";
			gm_panel.style.left = "20px";
			gm_panel.style.right = "20px";
			//gm_panel.style.bottom = "520px";
			gm_panel.style.padding = "15px";
			gm_panel.style.margin = "auto";
			gm_panel.style.webkitBoxShadow = "1px 1px 5px #222";
			gm_panel.style.webkitTransition = "height ease-in 0.3s"
			//gm_panel.style.webkitTransform = "translateZ(0)";
			gm_panel.style.height = "0px";
			//gm_panel.style.width = "90%";
			gm_panel.style.zIndex = 999;
			

			var gm = document.createElement('div')
			gm.id = geomock.map_id;
			gm.style.height = "100%";
			gm.style.backgroundColor = 'pink';

			gm_panel.appendChild(gm);

			document.body.appendChild(gm_panel);
			
		
			setTimeout(function() { 
				gm_panel.style.height = "500px"; 
				setTimeout(function() { document.body.appendChild(s) }, 250);
			 }, 1);
		}, function() {});

		
	}


}