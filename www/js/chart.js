var chart;
var dates;


function loadChart( getData ) {
	$('#chart').text('Loading ...');
	var string = "";
	if( typeof(getData.date) != "undefined" )
		string += "&date="+ getData.date;
	if( typeof( getData.view ) != "undefined" )
		string += "&view="+ getData.view;
	
	$.ajax({
		url: "request.php",
		data: string,
		success: function(data){
			var i=0;
			$("sensor",data).each(function() { i++; });
			refreshChart(getData,data);
		}
	});
}
	
function refreshChart(getData, data) {
	
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
	
	var core		= [];
	var mobo		= [];
	var chassis		= [];
	var unknown		= [];
	var volts3		= [];
	var volts5		= [];
	var volts12		= [];
	var volts1_5	= [];
	
	var dates	= [];
	var i = 0;
	
	var monitor = $("#sensors2seeOnChart").val();
	
	$("#sensors2seeOnChart").change(function() {
		monitor = $(this).val();
	});
	
	alert(monitor);	
	
	var $fsens = $("sensor",data).first();
	var date	= parseInt( $fsens.attr('date') );
	lastdate	= date;
	dates.push	= date;
	
	$("sensor",data).each( function(){
		
		if( $(this).attr('type') == monitor ) {
			
			var date = parseInt( $(this).attr('date') );
			
			if(  date - lastdate >= step ) {
				lastdate = date;
				dates.push = date;
				index++;
			}
			
			if( date - lastdate == 0 ) 
				{
				if( $(this).attr('periph') == 'core' || $(this).attr('periph') == 'Vcore' || $(this).attr('periph') == 'cpu_fan' )
					{
					core[index][$(this).attr('num')] = parseInt( $(this).attr('value') );
					}
				else if($(this).attr('periph') == 'motherboard' || $(this).attr('periph') == 'motherboard_fan') 
					{
					mobo[index][$(this).attr('num')] = parseInt( $(this).attr('value') );
					}
				}
		}
	});
	
	chart = new Highcharts.Chart({
		chart: {
			renderTo: 'chart',
			defaultSeriesType: 'line'
		},
		title: {
			text: window.location.hostname +' Sensors history'
		},
		xAxis: {
			categories: dates
		},
		yAxis: {
			title: {
				text: 'Temperature'
			}
		},
		series: [{
			 name: 'Core',
			 data: core
			}, {
			 name: 'Motherboard',
			 data: mobo
			}]
	});
}
