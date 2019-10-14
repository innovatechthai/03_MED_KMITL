(function($) {

  $(function () {

	var socket = io();

	var canvas = document.getElementById('canvas');

	var TMAX = document.getElementById('TMAX');
	var TMIN = document.getElementById('TMIN');
	var TCEN = document.getElementById('TCEN');

	var Amb = document.getElementById('Amb');
	var Range = document.getElementById('Range');
	var Target = document.getElementById('Target');

	var STATUS = document.getElementById('STATUS');

	var ctx = canvas.getContext('2d');

	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	var ambTemp;
	var distance;
	var tempCen;
	var tempMax;
	var tempMin;
	var num;
	var data = 0;
	
	socket.on('connect', function () { 
		socket.emit('calibration', data);
		$(document).ready(function(){
			$('#MyButton').click(function(){
				num = document.getElementById('cal').value;
				data = num - tempMax;
				socket.emit('calibration', data);
			});
		  });
	  });

	socket.on('distance', function(msg) {
		distance = msg;
		Range.innerHTML = "ระยะ:  " + parseInt(distance).toString() + "CM";
	});
	
	socket.on('tempCen', function(msg) {
		tempCen = msg;
		TCEN.innerHTML = "ใบหน้า:  " + tempCen.toString() + "°C";
	});
	  
	socket.on('tempMax', function(msg) {
		tempMax = msg;
		TMAX.innerHTML = "สูงสุด:  " + tempMax.toString() + "°C";
	});	  
	  
	socket.on('tempMin', function(msg) {
		tempMin = msg;
		TMIN.innerHTML = "ต่ำสุด:  " + tempMin.toString() + "°C";
	});
	
	socket.on('ambTemp', function(msg) {
		ambTemp = msg;
		Amb.innerHTML = "อุณหภูมิห้อง:  " + parseInt(ambTemp).toString() + "°C";
	});

  });

})(jQuery);

