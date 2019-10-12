const express = require('express');

const app = express();

const path = require('path');

const http = require('http').Server(app);

const io = require('socket.io')(http);

const zmq = require('zeromq');

const pako = require('pako');

const process = require('process');

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

var RED = new Gpio(12, 'out'); //use GPIO pin 4, and specify that it is output

var GREEN = new Gpio(16, 'out'); //use GPIO pin 4, and specify that it is output

const SHT31 = require(`sht31`);

const sht31 = new SHT31(0x44, 1); 

const pigpio = require('pigpio');

const Gpigpio = pigpio.Gpio;

pigpio.configureSocketPort(8889);

const trigger = new Gpigpio(23, {mode: Gpigpio.OUTPUT});

const echo = new Gpigpio(24, {mode: Gpigpio.INPUT, alert: true});

const MICROSECDONDS_PER_CM = 1e6/34321;

trigger.digitalWrite(0); // Make sure trigger is low





var temp = 34;

var distance = 0;

var error = 0;

var offset = 0.0;

var run = 1;

var tempCen = 37;

var comfig = 36;


// Define a requester

let requester = zmq.socket('req');

requester.connect(process.argv[2] ? process.argv[2] : 'tcp://192.168.1.24:5555')





// Upon Lepton data arriving, build up a frame

requester.on('message', (data) => {

	

  sht31

  .init()

  .then(() => sht31.readSensorData())

  .then((data) => {

    temp = data.temperature;

    //console.log(temp);

  })

  .catch((err) => {

    

  });	

	

	

  data.swap16();

  let compressedData = Buffer.from(pako.deflate(data));

  io.volatile.emit('frame', compressedData, {for: 'everyone'});

  var inflatedData = pako.inflate(compressedData).buffer;

  var intData = new Uint16Array(inflatedData);

  var max = Math.max.apply(Math, intData);

  var min = Math.min.apply(Math, intData);

  var range = max - min;

  var tempMax = ((0.0217*max)-177.77+34+offset-error).toFixed(1);

  var tempMin = ((0.0217*min)-177.77+34+offset-error).toFixed(1);

  

	var i = 0;

	var buf = [];

	for(i = 0; i < 120; i++)

	{

	buf[i] = ((0.0217*intData[160*i + 78])-177.77+offset-error).toFixed(1);

	}

	for(i = 0; i < 120; i++)

	{

	buf[i+120] = ((0.0217*intData[160*i + 79])-177.77+offset-error).toFixed(1);

	}

	for(i = 0; i < 120; i++)

	{

	buf[i+120*2] = ((0.0217*intData[160*i + 80])-177.77+offset-error).toFixed(1);

	}

	for(i = 0; i < 120; i++)

	{

	buf[i+120*3] = ((0.0217*intData[160*i + 81])-177.77+offset-error).toFixed(1);

	}

	for(i = 0; i < 120; i++)

	{

	buf[i+120*3] = ((0.0217*intData[160*i + 82])-177.77+34+offset-error).toFixed(1);

	}

	

	tempCen = Math.max.apply(null, buf);

	

	io.emit('tempMax', tempMax);

	io.emit('tempMin', tempMin);

	io.emit('tempCen', tempCen);

	io.emit('ambTemp', temp);	

	io.emit('distance', parseInt(distance));
	
	
	if(run == 1)

	{

		run = 0;

		offset = comfig-tempMax;

	}



});





const watchHCSR04 = () => {

  let startTick;



  echo.on('alert', (level, tick) => {

    if (level == 1) {

      startTick = tick;

    } else {

      const endTick = tick;

      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic

	  distance = diff / 2 / MICROSECDONDS_PER_CM;

      //console.log(diff / 2 / MICROSECDONDS_PER_CM);

	
	if (tempCen >= 38.0 && tempCen < 41.5 &&distance >= 0 && distance <= 80) 

	{ 

		//console.log(" >= 38.0 ");

		RED.writeSync(0);

		GREEN.writeSync(1);

	} 

	else if (tempCen >= 41.5 && distance >= 0 && distance <= 80) 

	{

		//console.log(" >= 41.5 ");

		GREEN.writeSync(0);

		RED.writeSync(1);

	}

	else

	{

		GREEN.writeSync(1);

		RED.writeSync(0);

	} 
	

    }

  });

};



watchHCSR04();



// Request a single frame now

setInterval(() => {

  requester.send('hello');
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds

}, 1000/9);


setTimeout(function() {

    function explode(){


	run = 0;

	offset = comfig-tempMax;


}

}, 5*1000*60)


app.get('/', (req, res) => {

  res.sendFile(__dirname + '/index.html');

});



app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use('/pako', express.static(__dirname + '/node_modules/pako/dist/'));



http.listen(3000);

