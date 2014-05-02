var SerialPort = require("serialport").SerialPort;
var io = require('socket.io').listen(3000);

var serialPort;
var portName = '/dev/ttyACM0';
var sendData = "";

var debug = true;

io.sockets.on('connection', function (socket) {
  serialListener(debug);
  io.sockets.emit('updateSensor', 'koira');
  
	socket.on('remote', function (data) {
		console.log(data);
		io.sockets.emit('update', data);
	});
	/*socket.on('sensorData', function (data) {
		console.log(data);
		io.sockets.emit('updateSensor', data);
	});*/
});

function serialListener(debug)
{
    var receivedData = "";
    serialPort = new SerialPort(portName, {
        baudrate: 9600,
        // defaults for Arduino serial communication
         dataBits: 8,
         parity: 'none',
         stopBits: 1,
         flowControl: false
    });

    serialPort.on("open", function () {
      console.log('open serial communication');
            // Listens to incoming data
        serialPort.on('data', function(data) {
             receivedData += data.toString();
          if (receivedData .indexOf('E') >= 0 && receivedData .indexOf('B') >= 0) {
           sendData = receivedData .substring(receivedData .indexOf('B') + 1, receivedData .indexOf('E'));
           receivedData = '';
         }
         // send the incoming data to browser with websockets.
       io.sockets.emit('updateSensor', sendData);
      });
    });
}