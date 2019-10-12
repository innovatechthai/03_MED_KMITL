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

	  var ambTemp = 25.0;
	  var distance = 0.0;
	  var tempCen = 37.0;
	  var tempMax = 37.0;
	  var tempMin = 0;
	  
	socket.on('distance', function(msg) {
		distance = msg;
	});
	
	socket.on('ambTemp', function(msg) {
		ambTemp = msg;
	});
	
	socket.on('tempCen', function(msg) {
		tempCen = msg;
	});
	  
	socket.on('tempMax', function(msg) {
		tempMax = msg;
	});	  
	  
	socket.on('tempMin', function(msg) {
		tempMin = msg;
	});
	
	socket.on('frame', function (msg) {

	// Inflate the data

	var inflatedData = pako.inflate(msg).buffer;

	// Create an array of unsigned integers from the array

	var intData = new Uint16Array(inflatedData);

	// Take the range of the values

	var max = Math.max.apply(Math, intData);

	var min = Math.min.apply(Math, intData);

	var range = max - min;

	if(tempMax > 0 && tempMax < 100 && tempMin > 0 && tempMin < 100)

	{

        // Build some image data with the integers

        for (var c = 0; c < intData.length; c ++) {

          // Normalise each pixel value first

          var pixelValue = parseInt((intData[c] - min) / range * 254);

          // var pixelValue = parseInt(intData[c] / 16384 * 255);

          imageData.data[(c * 4) + 0] = gradients.fusion[pixelValue][0];

          imageData.data[(c * 4) + 1] = gradients.fusion[pixelValue][1];

          imageData.data[(c * 4) + 2] = gradients.fusion[pixelValue][2];

        }

    ctx.putImageData(imageData, 0, 0);

	TMAX.innerHTML = "สูงสุด:  " + tempMax.toString() + "°C";

	TCEN.innerHTML = "ใบหน้า:  " + tempCen.toString() + "°C";

    TMIN.innerHTML = "ต่ำสุด:  " + tempMin.toString() + "°C";

	Amb.innerHTML = "อุณหภูมิห้อง:  " + parseInt(ambTemp).toString() + "°C";

	Range.innerHTML = "ระยะ:  " + parseInt(distance).toString() + "CM";
	
        	
    if (distance >= 50 && distance <= 80) 

		{ 

			Target.innerHTML = "ตรวจ:  " + "พบ";

		} 
    else
		{ 

			Target.innerHTML = "ตรวจ:  " + "ไม่พบ";

		} 

    if (tempCen >= 38.0 && tempCen < 41.5) 

		{ 

			STATUS.innerHTML = "สถานะไข้สูง เกิน 38°C";

		} 

    else if (tempCen >= 41.5) 

		{

			STATUS.innerHTML = "สถานะไข้สูงอย่างรุนแรง เกิน 41.5°C";

		}

	else

		{

			STATUS.innerHTML = "สถานะไข้ต่ำ ไม่เกิน 38°C";

		}
	}
    });
  });

})(jQuery);

