# RaspberryPi-Web-Interface-for-Vehicle


This is a configurable web interface for a RaspberryPi controlled Vehicle.

The project has two servers, one for the backend API and a React development server to serve
the Web Interface.

The React Server can be started using npm start.

For the backend api use sudo node server.js

The sensors.js file in the backend uses code taken from the "HC-SR04-Pi" node package which can be found here
https://www.npmjs.com/package/hc-sr04-pi

This would normally just be imported as a normal node package. However I ran into some issues wih the node exporter accepting it.
As such I moved the code to its own file and refactored the export function to one that the importer accepts.
