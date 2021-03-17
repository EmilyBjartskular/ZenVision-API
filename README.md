# ZenVision-API

Api that takes data from an fibaro homecenter 3 through restAPI, using axios and a custom event handler.
Meant to be a server hosting sensordata for the following project [ZenVision-Unity](https://github.com/EmilyBjartskular/ZenVision-Unity).

## Future work
ability to host multiple selected id´s, smarter use of cached results and better concurrency.
Utilize Fibaros HC3 Lua scripting to make this api directly observe changes. This was not done because i do not know how as of this writing.

### ===== Websocket protocol =====
Sever is simple for now, but to get an device data to update every 500 ms and send it over the socket, send an integer id that will select a device and send the data as is

supported messages : int id

send format: id: number, name: string, type: string, baseType: string, created: Date, modifier: Date, batteryLevel: int, value: string
