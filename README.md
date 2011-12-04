##README

Geomock.js

The Geomock project is a little plaything that allows you to mock your location in the browser.
Activating Geomock pops up a window with a Google Map. The blue bouncing icon represents your current position. Clicking anywhere else on the map produces a pink icon, which represents your mocked location.

Geomock overrides your browser's native getCurrentPosition() and watchPosition() calls with its own faked versions, so your code doesn't have to change.

The returned mock position object has the basic properties that you would expect from a successful return from the original functions, ie. stuff like latitude and longitude are present.


#How to use:

1. Include geomock.js 

    `<script src="js/geomock.js"></script>`


2. Call `geomock.go`

    `<input type="button" onclick="javascript:geomock.go()" value="Geomock Go">`


3. Click somewhere on the map to select the location you want to appear to be at


4. Your code should report you being at that location instead