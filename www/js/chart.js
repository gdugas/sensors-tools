var chart;
var dates;


var nummax = 0;
var k=0;

myseries = new Array();

//temp arrays
myseries['core_temp']		= new Array();
myseries['motherboard_temp']= new Array();
myseries['unknown_devices']	= new Array();

//fans arrays
myseries['cpu_fans']		= new Array();
myseries['motherboard_fans']= new Array();
myseries['chassis_fans']	= new Array();
myseries['unknown_fans']	= new Array();

//volts arrays
myseries['vcore']			= new Array();
myseries['volts3']			= new Array();
myseries['volts5']			= new Array();
myseries['volts12']			= new Array();
myseries['volts1_5']		= new Array();
myseries['unknown_voltages']= new Array();
	
function loadChart( getData ) {
	$('#chart').text('Loading ...');
	var string = "";
	if( typeof(getData.date) != "undefined" )
		string += "&date="+ getData.date;
	if( typeof( getData.view ) != "undefined" )
		string += "&view="+ getData.view;
	
	var monitor = $("#sensors2seeOnChart").val();
	$("#sensors2seeOnChart").change(function() {
		monitor = $(this).val();
	});
	
	$.ajax({
		url: "request.php",
		data: string,
		dataType: "xml",
		success: function(data){
			var i=0;
			$("sensor",data).each(function() {
				i++;
				refreshChart(getData,data,monitor);
			});
		}
	});
}

function parseAttr(monitor,index,num,attr,value)
	{
	if(monitor == "temp")
		{
		if( attr == 'core')
			{
			myseries['core_temp'][num][index] = parseInt(value);
			}
		else if(attr == 'motherboard')
			{
			myseries['motherboard_temp'][num][index] = parseInt(value);
			}
		else if(attr == 'unknown_device')
			{
			myseries['unknown_devices'][num][index] = parseInt(value);
			}
		}
	else if(monitor == "fan")
		{
		if( attr == 'cpu_fan')
			{
			myseries['cpu_fans'][num][index] = parseInt(value);
			}
		else if(attr == 'chassis_fan')
			{
			myseries['chassis_fans'][num][index] = parseInt(value);
			}
		else if(attr == 'motherboard_fan')
			{
			myseries['motherboard_fans'][num][index] = parseInt(value);
			}
		else if(attr == 'unknown_fan')
			{
			myseries['unknown_fans'][num][index] = parseInt(value);
			}
		}
	else if(monitor == "volt")
		{
		if( attr == 'Vcore')
			{
			myseries['vcore'][num][index] = parseInt(value);
			}
		else if(attr == '3.3V')
			{
			myseries['volts3'][num][index] = parseInt(value);
			}
		else if(attr == '5V')
			{
			myseries['volts5'][num][index] = parseInt(value);
			}
		else if(attr == '12V')
			{
			myseries['volts12'][num][index] = parseInt(value);
			}
		else if(attr == '1.5V')
			{
			myseries['volts1_5'][num][index] = parseInt(value);
			}
		else if(attr == 'unknown_voltage')
			{
			myseries['unknown_voltages'][num][index] = parseInt(value);
			}
		}
	}

function refreshChart(getData, data, monitor) {
	
	var index		= 0;
	var lastdate	= 0;
	var step 		= 0;
	
	var $MINUTE	= 60;
	var $HOUR	= 60 * $MINUTE;
	var $DAY	= 24 * $HOUR;
	var $WEEK	= 7  * $DAY;
	var $MONTH	= 4  * $WEEK;
	
	switch(getData['view']) {
		case 'day':		step = $HOUR; break;
		case 'week':	step = $DAY;  break;
		case 'month':	step = $WEEK; break;
		case 'hour':	
		default : 		step = 5 * $MINUTE; break; 
	}
	
	var dates	= [];
	
	var fsens = $("sensor",data).first();
	var date	= parseInt( fsens.attr('date') );
	lastdate	= date;
	dates.push	= date;
	
	
	$("sensor",data).each( function(){
		var num = $(this).attr('num');
		if(num > nummax)
			{
			nummax = num;
			if(monitor == "temp")
				{
				myseries['core_temp'][num] 			= [];
				myseries['motherboard_temp'][num] 	= [];
				myseries['unknown_devices'][num] 	= [];
				}
			else if (monitor == "fan")
				{
				myseries['cpu_fans'][num] 			= [];
				myseries['chassis_fans'][num] 		= [];
				myseries['motherboard_fans'][num] 	= [];
				myseries['unknown_fans'][num] 		= [];
				}
			else if (monitor == "volt")
				{
				myseries['vcore'][num] 				= [];
				myseries['volts3'][num] 			= [];
				myseries['volts5'][num] 			= [];
				myseries['volts12'][num] 			= [];
				myseries['volts1_5'][num] 			= [];
				myseries['unknown_voltages'][num] 	= [];
				}
			}
		
		
		if( $(this).attr('type') == monitor ) {
			
			var date = parseInt( $(this).attr('date') );
			
			if(  date - lastdate >= step ) {
				lastdate = date;
				dates.push = date;
				index++;
			}
			
			if( date - lastdate == 0 ) 
				{
				parseAttr(monitor,index,num,$(this).attr('periph'),$(this).attr('value'));
				}
		}
	});
	printChart(myseries,index,monitor,nummax);	
}

	
function printChart(myseries,index,monitor,nummax)
	{
	var j = 1;
	var k = 1;
	
	myarray = 	[];
	myname 	= 	[];
	
	for(k=1;k<=13;k++)
		{
		myarray[k] = new Array();
		myname[k]  = new Array();
		for(j=1;j<=5;j++)
			{
			myarray[k][j] = new Array();
			myname[k][j]  = new Array(); 
			}
		}
	for(j=1;j<=nummax;j++)
		{
		if(monitor == "temp")
			{
			if(myseries['core_temp'] !== undefined && myseries['core_temp'][j] !== undefined)
				{
				myarray[1][j]	= myseries['core_temp'][j];
				myname[1][j] 	= "Core temperature sensor number "+j.toString();
				}
			if(myseries['motherboard_temp'] !== undefined && myseries['motherboard_temp'][j] !== undefined)
				{
				myarray[2][j]	= myseries['motherboard_temp'][j];
				myname[2][j] 	= "Motherboard temperature number "+j.toString();
				}
			if(myseries['unknown_devices'] !== undefined && myseries['unknown_devices'][j] != undefined)
				{
				myarray[3][j]	= myseries['unknown_devices'][j];
				myname[3][j] 	= "Unknown temperature for device number "+j.toString();
				}
			}
		else if (monitor == "fan")
			{
			if(myseries['cpu_fans'] !== undefined && myseries['cpu_fans'][j] !== undefined)
				{
				myarray[4][j] 	= myseries['cpu_fans'][j];
				myname[4][j] 	= "CPU fan sensor number "+j.toString();				
				}
			if(myseries['chassis_fans'] !== undefined && myseries['chassis_fans'][j] !== undefined)
				{
				myarray[5][j]	= myseries['chassis_fans'][j];
				myname[5][j] 	= "Chassis fan sensor number "+j.toString();
				}
			if(myseries['motherboard_fans'] !== undefined && myseries['motherboard_fans'][j] !== undefined)
				{
				myarray[6][j]	= myseries['motherboard_fans'][j];
				myname[6][j] 	= "Motherboard fan sensor number "+j.toString();
				}
			if(myseries['unknown_fans'] !== undefined && myseries['unknown_fans'][j] !== undefined)
				{
				myarray[7][j]	= myseries['unknown_fans'][j];
				myname[7][j] 	= "Unknown fan for sensor number "+j.toString();
				}
			}
		else if (monitor == "volt")
			{
			if(myseries['vcore'] !== undefined && myseries['vcore'][j] !== undefined)
				{
				myarray[8][j]	= myseries['vcore'][j];
				myname[8][j]	= "VCore sensor number "+j.toString();				
				}
			if(myseries['volts3'] !== undefined && myseries['volts3'][j] !== undefined)
				{
				myarray[9][j]	= myseries['volts3'][j];
				myname[9][j]	= "3,3V sensors number "+j.toString();
				}
			if(myseries['volts5'] !== undefined && myseries['volts5'][j] !== undefined)
				{
				myarray[10][j]	= myseries['volts5'][j];
				myname[10][j]	= "5 volts sensor number "+j.toString();
				}
			if(myseries['volts12'] !== undefined && myseries['volts12'][j] !== undefined)
				{
				myarray[11][j]	= myseries['volts12'][j];
				myname[11][j]	= "12 volts sensor number "+j.toString();
				}
			if(myseries['volts1_5'] !== undefined && myseries['volts1_5'][j] !== undefined)
				{
				myarray[12][j]	= myseries['volts1_5'][j];
				myname[12][j]	= "1,5 volts sensor number "+j.toString();
				}
			if(myseries['unknown_voltages'] !== undefined && myseries['unknown_voltages'][j] !== undefined)
				{
				myarray[13][j]	= myseries['unknown_voltages'][j];
				myname[13][j]	= "Unknown voltage sensor number "+j.toString();
				}
			}
		}
		
	chart = new Highcharts.Chart({
		chart: {
			renderTo: 'chart',
			defaultSeriesType: 'line'
		},
		title: {
			text: window.location.hostname +' Sensors History'
		},
		xAxis: {
			categories: dates
		},
		yAxis: {
			title: {
				text: 'Temperature(Celcius degree)/voltage(V)/fans(RPM)'
			}
		},
		series: [
			{
			data: myarray[1][1],
			name: myname[1][1],
			},
			{
			data: myarray[1][2],
			name: myname[1][2],
			},
			{
			data: myarray[1][3],
			name: myname[1][3],
			},
			{
			data: myarray[1][4],
			name: myname[1][4],
			},
			{
			//data: myarray[2][1],
			//name: myname[2][1],
			//},
			//{
			//data: myarray[2][2],
			//name: myname[2][2],
			//},
			//{
			//data: myarray[2][3],
			//name: myname[2][3],
			//},
			//{
			//data: myarray[2][4],
			//name: myname[2][4],
			//},
			//{
			//data: myarray[3][1],
			//name: myname[3][1],
			},
		]
	});
}


function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}
