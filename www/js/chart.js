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
//			alert(i);
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
	
	var core	= [];
	var mobo	= [];
	var dates	= [];
	var i = 0;
	
	var $fsens = $("sensor",data).first();
	var date	= parseInt( $fsens.attr('date') );
	lastdate	= date;
	dates.push	= date;
	
	$("sensor",data).each( function(){
		
		if( $(this).attr('type') == 'temp' ) {
			
			var date = parseInt( $(this).attr('date') );
			
			if(  date - lastdate > step ) {
				lastdate = date;
				dates.push = date;
				index++;
			}
			
			if( date - lastdate == 0 ) {
				if( $(this).attr('periph') == 'core' && $(this).attr('num') == '0' ){
					core[index] = parseInt( $(this).attr('value') );
				}else if($(this).attr('periph') == 'motherboard' && $(this).attr('num') == '3' ) {
					mobo[index] = parseInt( $(this).attr('value') );
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
			text: 'Mbb Sensors history'
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
