/**
 * @file Orange Payload Praser
 * @copyright Michal Miskov 2020
 * @author Michal Miškov <michal.miskov@gmail.com>
 * @version 0.0.1 <2020/10/03>
 */

const BATTERY_STATUS = 0xFF;
const BATTERY_LEVEL = 0x3FFF;
const EXT_TEMPERATURE_SENSOR = 0x01;

function GetValueUnitObj(value, unit) {
  var obj = {};
  obj.unit = unit;
  obj.value = value;
  return obj;
}

function GetBatteryStatusTitle(batteryStatus) {
	var statuses = ["Ultra Low", "Low", "Ok", "Good"];
	if (batteryStatus < 0 || batteryStatus >= statuses.length) {
		batteryStatus = 0;
	} 
	return statuses[batteryStatus];
}
 
function ParseBattery(batteryData) {
	var obj = {};
	obj.status = GetBatteryStatusTitle((batteryData >> 14) & BATTERY_STATUS);
	obj.voltage = GetValueUnitObj(batteryData & BATTERY_LEVEL, "mV");
	return obj;
}

function ParseIntTemperature(tempData) {
	
	if(tempData > 61439){
      tempData = tempData - 65536;
    }
	
	tempData = tempData/100;
	
	return GetValueUnitObj(tempData, "°C");
}

function ParseIntHumidity(tempHumi) {
	
	tempHumi = tempHumi/10;
	
	return GetValueUnitObj(tempHumi, "%");
}

function ParseExtTemperature(tempData) {
	
	if(tempData > 61439){
      tempData = tempData - 65536;
    }
	
	tempData = tempData/100;
	
	return GetValueUnitObj(tempData, "°C");
}

function ParsePayload(data) {
	
	var i = 0;
	var message = {};

	var batteryData = (data[i++] << 8) | (data[i++]);
	message.battery = ParseBattery(batteryData);
	
	var intTemperature = (data[i++] << 8) | (data[i++]);
	message.temperature = ParseIntTemperature(intTemperature);
	
	var intHumidity = (data[i++] << 8) | (data[i++]);
	message.humidity = ParseIntHumidity(intHumidity);
	
	var extSensor = data[i++];
	if (extSensor & EXT_TEMPERATURE_SENSOR) {
		extTemperature = (data[i++] << 8) | (data[i++]);
		message.ext_temperature = ParseExtTemperature(extTemperature);
	}
	return message;
} 

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

function decoder(receivedString) {
	receivedString = receivedString.toUpperCase();
	
	var arrLength = receivedString.length;
	var hexArr = [];
	
	resObj = {}; resObj.payload = {}; resObj.payload.decode = {};
	
	if(arrLength % 2 !== 0) {
		// return {payload:{decode_status: "Received frame length error"}};
		resObj.payload.decode.status = "fail";
		resObj.payload.decode.exception = "Received frame length error!";
		return resObj;
	}

	for(var i = 0; i < arrLength; i++){
			hexArr.push(parseInt(receivedString.substr(i*2, 2), 16));
	}

	result = ParsePayload(hexArr);
	
	if (!(isEmpty(result))) {
		resObj.payload.data = result;
		resObj.payload.decode.status = "ok";
	} else {
		resObj.payload.decode.status = "fail";
		resObj.payload.decode.exception = "Result is empty!";
	}
	console.log(JSON.stringify(resObj));
	return resObj;
}
 
// return decoder(msg.payload.data);

module.exports = {decoder};
