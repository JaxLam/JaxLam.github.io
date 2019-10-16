// Sets console.log() to print to Evothings console
if (window.hyper && window.hyper.log) { console.log = hyper.log }

document.addEventListener(
    'deviceready',
    function() { /*TODO: Add your callback here*/ });

var app = {}
//check address first then connect
app.SERVICE_UUID='0000ffe0-0000-1000-8000-00805f9b34fb';
app.CHARACTERISTIC_UUID='0000ffe1-0000-1000-8000-00805f9b34fb';

app.showControls = function()
{
    $('#disconnect').prop('disabled', false);
    $('#controlsView').show();
    $('#startView').hide();
    $('#theHeader').hide();
    document.getElementById('theHeader').disabled = true;
    document.body.style.backgroundSize = "150%";
}

app.showStart = function()
{
    $('#disconnect').prop('disabled', true);
    $('#controlsView').hide();
    $('#startView').show();
    $('#theHeader').show();
    document.getElementById('theHeader').disabled = false;
    document.body.style.backgroundSize = "0";
}

app.initialize = function() {
    app.disconnect("Initialized");
    document.body.style.backgroundSize = "0";
    document.body.style.backgroundImage = "url(./ui/images/background.jpg)";
}

app.connect = function()
{
    //Comment out for demo purpose
    // console.log('Attempting to connect to bluetooth module');

    // evothings.easyble.startScan(scanSuccess,scanFailure, {serviceUUIDS : [app.SERVICE_UUID]}, { allowDuplicates: false});



    //add showControls for demo purpose
    app.showControls();
}

function scanSuccess(device)
{
    if(device.address == "82A14011-D7E3-E586-F6F5-AC7E240034BE")
    {
        console.log('Found' + device.name);
        device.connect(connectSuccess,connectFailure);
        evothings.easyble.stopScan();
        app.showControls();
    }
    else {
        
    }
}

function scanFailure(errorCode)
{
    console.log('Error ' + errorCode);
}

function connectSuccess(device)
{
    console.log('Successfully connected!!');
    app.connected = true;
    app.device = device; 
    app.device.readServices(serviceSuccess, serviceFailure, [ app.SERVICE_UUID]);
}

function connectFailure()
{
    app.connected = false;
    console.log('Failed to connect! :( ');
}

app.disconnect = function(errorMessage)
{
    //Comment out for demo purpose
    // if(errorMessage)
    // {
    //     console.log(errorMessage);
    // }
    // app.connected = false;
    // app.device = null;

    // evothings.easyble.stopScan();
    // evothings.easyble.closeConnectedDevices();
    app.showStart();
}

function serviceSuccess(device)
{
    console.log('The bluetooth module can now read and write');
    app.device.enableNotification(
        app.SERVICE_UUID,
        app.CHARACTERISTIC_UUID,
        app.receivedData,
        function(errorCode)
        {
            console.log('Failed to receive notification from device' + errorCode);
        },
        { writeConfigDescriptor: false }
    );
}

function serviceFailure(errorCode)
{
    console.log('Failed to read services' + errorCode);
    app.disconnect();
}

app.sendData = function(data)
{//comment out for demo purpose
    // if (app.connected && app.device != null)
    // {
    //     data = new Uint8Array(data);
    //     app.device.writeCharacteristic(
    //         app.CHARACTERISTIC_UUID,
    //         data,
    //         function ()
    //         {
    //             console.log('Succeed to send message!' + data);
    //         },
    //         function (errorCode)
    //         {
    //             console.log('Failed to send message!' + errorCode);
    //         }
    //     );
    // }
    // else
    // {
    //     app.disconnect('Device was disconnected when trying to send message');
    // }
}

app.receivedData = function(data)
{
    console.log("recive " + data);
}


function changeAngle() {
    let textboxValue = [document.getElementById("angleBox").value];
    if(textboxValue[0] > 255) {
        textboxValue[1] = textboxValue[0] - 255;
        textboxValue[0] = 255;
    }
    app.sendData(textboxValue);
}

function changeRangeText() {
    let v = document.getElementById("angleBox").value;
    document.getElementById("rangeOutput").innerHTML = v;
}

app.timerStart = false;
function setTimer() {
    if(!app.timerStart) {
        app.theTime = new Date().getTime();
        app.timerStart = true;
        app.timer = setInterval(startTimer, 1000);
    }
    else {
        app.timerStart = false;
        stopTimer();
    }
}

function startTimer() {
    newTime = new Date().getTime() - app.theTime;
    minutes = Math.floor((newTime % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((newTime % (1000 * 60)) / 1000);
    document.getElementById("timerBox").innerHTML = minutes + ":" + seconds;
}

function stopTimer() {
    clearInterval(app.timer);
    document.getElementById("timerBox").innerHTML = "00:00";
}