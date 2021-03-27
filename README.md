# ZenVision-API

Api that takes data from an fibaro homecenter 3 through restAPI, using axios and a custom event handler.
Meant to be a server hosting sensordata for the following project [ZenVision-Unity](https://github.com/EmilyBjartskular/ZenVision-Unity).

## Future work
ability to host multiple selected id´s, smarter use of cached results and better concurrency.
~Utilize Fibaros HC3 Lua scripting to make this api directly observe changes. This was not done because i do not know how as of this writing.~
As of latest build, the system is observing changes on the api. If a post or put is on the collecion it will fire an update. The home fibaro system will generate a put request
towards an deployment of this app and will that way reactivly update.

### Websocket protocol
___
Sever is simple for now, but to get an device data to update every 500 ms and send it over the socket, send an integer id that will select a device and send the data as is

supported messages : int id

send format: 
```ts
{
  id: number, 
  name: string,
  type: string,
  baseType: string, 
  created: Date,
  modifier: Date,
  batteryLevel: int,
  value: string
}
```

___

### Install and run

This is not finished product and does not have a configured production mode

to run an server instance:

1. run ```npm install ```
2. generate the .env with valid variable. see [.env.example](https://github.com/Zenvision/ZenVision-API/blob/main/.env.example) for guide.
3. deploy dev: ```npm run dev```
