
//global var initialization

var chart;
var dates;


var nummax = 0;
var k=0;

myseries = new Array();

//temp arrays
myseries['core_temp']       = new Array();
myseries['motherboard_temp']= new Array();
myseries['unknown_devices'] = new Array();

//fans arrays
myseries['cpu_fans']        = new Array();
myseries['motherboard_fans']= new Array();
myseries['chassis_fans']    = new Array();
myseries['unknown_fans']    = new Array();

//volts arrays
myseries['vcore']           = new Array();
myseries['volts3']          = new Array();
myseries['volts5']          = new Array();
myseries['volts12']         = new Array();
myseries['volts1_5']        = new Array();
myseries['unknown_voltages']= new Array();

var j = 1;
var k = 1;

//buffer tabs
myarray =   [];
myname  =   [];

for(k=1;k<=13;k++)
    /* we do not know how many array we needs...
     * Perhaps, a patch could be apply for this...
     */
    {
    myarray[k] = new Array();
    myname[k]  = new Array();
    for(j=1;j<=5;j++)
        {
        myarray[k][j] = new Array();
        myname[k][j]  = new Array();
        }
    }


function loadChart( getData ) {
    $('#chart').text('Please wait while loading ...');
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
            if(monitor == "default")
                { refreshChart(getData,data,monitor); }
            else
                {
                refreshChart(getData,data,monitor);
                }
            }
        });
}


//main function
function refreshChart(getData, data, monitor) {

    var time_index  = 0;
    var lastdate    = 0;
    var step        = 0;

    var $MINUTE = 60;
    var $HOUR   = 60 * $MINUTE;
    var $DAY    = 24 * $HOUR;
    var $WEEK   = 7  * $DAY;
    var $MONTH  = 4  * $WEEK;

    switch(getData['view']) {
        case 'day':     step = $HOUR; break;
        case 'week':    step = $DAY;  break;
        case 'month':   step = $WEEK; break;
        case 'hour':
        default :       step = 5 * $MINUTE; break;
    }

    var dates   = [];

    var fsens   = $("sensor",data).first();
    var date    = parseInt( fsens.attr('date') );
    lastdate    = date;
    dates.push  = date;
    var init    = false;

    if(monitor == "default")
        {
        //default values are retrieve from sensorsConf.py by request.php
        var default_device = $(data).find("device").text();
        var default_num = $(data).find("attr_num").text();
        monitortype = "temp";
        myseries[0] = [];
        init = true;
        }

    $("sensor",data).each( function(){
        if (init == false)
            {
            var num = $(this).attr('num');
            if(num > nummax)
                {
                nummax = num;
                if(monitor == "temp_core")
                    {
                        monitortype = "temp";
                        myseries['core_temp'][num]        = [];
                    }
                else if(monitor == "temp_mb")
                    {
                        monitortype = "temp";
                        myseries['motherboard_temp'][num] = [];
                    }
                else if(monitor == "temp_others")
                    {
                        monitortype = "temp";
                        myseries['unknown_devices'][num]  = [];
                    }
                else if (monitor == "fan")
                    {
                    monitortype = "fan";
                    myseries['cpu_fans'][num]             = [];
                    myseries['chassis_fans'][num]         = [];
                    myseries['motherboard_fans'][num]     = [];
                    myseries['unknown_fans'][num]         = [];
                    }
                else if (monitor == "volt")
                    {
                    monitortype = "voltage";
                    myseries['vcore'][num]                = [];
                    myseries['volts3'][num]               = [];
                    myseries['volts5'][num]               = [];
                    myseries['volts12'][num]              = [];
                    myseries['volts1_5'][num]             = [];
                    myseries['unknown_voltages'][num]     = [];
                    }
                }
            }


        if( $(this).attr('type') == monitortype ) {
            var date = parseInt( $(this).attr('date') );
            if( date - lastdate >= step ) {
                lastdate = date;
                dates.push = date;
                time_index++;
            }

            if( date - lastdate == 0 )
            // Date choosen
                {
                    if(monitor != "default")
                        { parseAttr(monitor,time_index,num,$(this).attr('periph'),$(this).attr('value')); }
                    else
                        {
                        if(parseInt($(this).attr('num')) == default_num && $(this).attr('periph') == default_device)
                            { parseAttr(monitor,time_index,default_num,false,$(this).attr('value')); }
                        }
                }
            }
    });
    if(monitor != "default")
        {
        assignChart(myseries,time_index,monitor,nummax);
        }
    else {
        myname[0] = [];
        myname[0] = default_device+" "+default_num;
        myarray[1] = myseries[0];
        }
    printChart(myarray,myname,time_index,monitor);
}


function parseAttr(monitor,time_index,num,attr,value)
    {
    if(monitor == "default")
        {
        myseries[0][time_index] = parseInt(value);
        }
    else if(monitor == "temp_core")
        {
        if(attr == 'core')
            {
            myseries['core_temp'][num][time_index] = parseInt(value);
            }
        }
    else if(monitor == "temp_mb")
        {
        if(attr == 'motherboard')
            {
            myseries['motherboard_temp'][num][time_index] = parseInt(value);
            }
        }
    else if(monitor == "temp_others")
        {
        if(attr == 'unknown_sensor')
            {
            myseries['unknown_devices'][num][time_index] = parseInt(value);
            }
        }
    else if(monitor == "fan")
        {
        if(attr == 'cpu_fan')
            {
            myseries['cpu_fans'][num][time_index] = parseInt(value);
            }
        else if(attr == 'chassis_fan')
            {
            myseries['chassis_fans'][num][time_index] = parseInt(value);
            }
        else if(attr == 'motherboard_fan')
            {
            myseries['motherboard_fans'][num][time_index] = parseInt(value);
            }
        else if(attr == 'unknown_fan' || attr == 'fan')
            {
            myseries['unknown_fans'][num][time_index] = parseInt(value);
            }
        }
    else if(monitor == "volt")
        {
        if(attr == 'Vcore')
            {
            myseries['vcore'][num][time_index] = parseInt(value);
            }
        else if(attr == '3.3V')
            {
            myseries['volts3'][num][time_index] = parseInt(value);
            }
        else if(attr == '5V')
            {
            myseries['volts5'][num][time_index] = parseInt(value);
            }
        else if(attr == '12V')
            {
            myseries['volts12'][num][time_index] = parseInt(value);
            }
        else if(attr == '1.5V')
            {
            myseries['volts1_5'][num][time_index] = parseInt(value);
            }
        else if(attr == 'unknown_voltage')
            {
            myseries['unknown_voltages'][num][time_index] = parseInt(value);
            }
        }
    }

function assignChart(myseries,time_index,monitor,nummax)
    {
    for(j=1;j<=nummax;j++)
        {
        if(monitor == "temp_core")
            {
            if(myseries['core_temp'] !== undefined && myseries['core_temp'][j] !== undefined)
                {
                myarray[1][j]   = myseries['core_temp'][j];
                myname[1][j]    = "Core temperature sensor number "+j.toString();
                }
            }
        if(monitor == "temp_mb")
            {
            if(myseries['motherboard_temp'] !== undefined && myseries['motherboard_temp'][j] !== undefined)
                {
                myarray[2][j]   = myseries['motherboard_temp'][j];
                myname[2][j]    = "Motherboard temperature number "+j.toString();
                }
            }
        if(monitor == "temp_others")
            {
            if(myseries['unknown_devices'] !== undefined && myseries['unknown_devices'][j] != undefined)
                {
                myarray[3][j]   = myseries['unknown_devices'][j];
                myname[3][j]    = "Unknown temperature for device number "+j.toString();
                }
            }
        else if (monitor == "fan")
            {
            if(myseries['cpu_fans'] !== undefined && myseries['cpu_fans'][j] !== undefined)
                {
                myarray[4][j]   = myseries['cpu_fans'][j];
                myname[4][j]    = "CPU fan sensor number "+j.toString();
                }
            if(myseries['chassis_fans'] !== undefined && myseries['chassis_fans'][j] !== undefined)
                {
                myarray[5][j]   = myseries['chassis_fans'][j];
                myname[5][j]    = "Chassis fan sensor number "+j.toString();
                }
            if(myseries['motherboard_fans'] !== undefined && myseries['motherboard_fans'][j] !== undefined)
                {
                myarray[6][j]   = myseries['motherboard_fans'][j];
                myname[6][j]    = "Motherboard fan sensor number "+j.toString();
                }
            if(myseries['unknown_fans'] !== undefined && myseries['unknown_fans'][j] !== undefined)
                {
                myarray[7][j]   = myseries['unknown_fans'][j];
                myname[7][j]    = "Unknown fan for sensor number "+j.toString();
                }
            }
        else if (monitor == "volt")
            {
            if(myseries['vcore'] !== undefined && myseries['vcore'][j] !== undefined)
                {
                myarray[8][j]   = myseries['vcore'][j];
                myname[8][j]    = "VCore sensor number "+j.toString();
                }
            if(myseries['volts3'] !== undefined && myseries['volts3'][j] !== undefined)
                {
                myarray[9][j]   = myseries['volts3'][j];
                myname[9][j]    = "3,3V sensors number "+j.toString();
                }
            if(myseries['volts5'] !== undefined && myseries['volts5'][j] !== undefined)
                {
                myarray[10][j]  = myseries['volts5'][j];
                myname[10][j]   = "5 volts sensor number "+j.toString();
                }
            if(myseries['volts12'] !== undefined && myseries['volts12'][j] !== undefined)
                {
                myarray[11][j]  = myseries['volts12'][j];
                myname[11][j]   = "12 volts sensor number "+j.toString();
                }
            if(myseries['volts1_5'] !== undefined && myseries['volts1_5'][j] !== undefined)
                {
                myarray[12][j]  = myseries['volts1_5'][j];
                myname[12][j]   = "1,5 volts sensor number "+j.toString();
                }
            if(myseries['unknown_voltages'] !== undefined && myseries['unknown_voltages'][j] !== undefined)
                {
                myarray[13][j]  = myseries['unknown_voltages'][j];
                myname[13][j]   = "Unknown voltage sensor number "+j.toString();
                }
            }
        }
}

function printChart(myarray,myname,time_index,monitor)
    {
    if (monitor == "default")
        {
        if(myarray[1].length != 0)
            {
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
                        text: 'Temperature(Celcius degree)'
                    }
                },
                series: [
                        {
                        data: myarray[1],
                        name: myname[0],
                        },
                    ]
                });
            }
        else
            {
            document.write("No data for this sensor");
            setTimeout("location.reload(true)", 5000);
            }
        }
    else if (monitor == "temp_core")
        {
        if(myarray[1][1].length == 0)
            {
            document.write("No data for core temperature. You will be redirected in 5sec.");
            setTimeout("location.reload(true)", 5000);
            }
        else
            {
            //create core temp chart for 4 core.
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
                        text: 'Temperature(Celcius degree)'
                    }
                },
                series: [
                /* Once again, we do not know how many array we need to print
                 * On Highchart
                 * Once again a fix would be great...
                 */
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
                    ]
                });
            }
        }
    //motherboard temp sensors - 3 T(C) sensors
    else if (monitor == "temp_mb")
        {
        if(myarray[2][1].length == 0)
            {
            document.write("No data for motherboard temperature. You will be redirected in 5sec.");
            setTimeout("location.reload(true)", 5000);
            }
        else
            {
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
                        text: 'Temperature(Celcius degree)'
                    }
                },
                series: [
                        {
                        data: myarray[2][1],
                        name: myname[2][1],
                        },
                        {
                        data: myarray[2][2],
                        name: myname[2][2],
                        },
                        {
                        data: myarray[2][3],
                        name: myname[2][3],
                        },
                    ]
                });
            }
        }
        //other temp sensors ?
    else if (monitor == "temp_others")
        {
        if(myarray[3][1].length == 0)
            {
            document.write("No data for other device temperature. You will be redirected in 5sec.");
            setTimeout("location.reload(true)", 5000);
            }
        else
            {
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
                        text: 'Temperature(Celcius degree)'
                    }
                },
                series: [
                        {
                        data: myarray[3][1],
                        name: myname[3][1],
                        },
                        {
                        data: myarray[3][2],
                        name: myname[3][2],
                        },
                    ]
                });
            }
        }
    else if (monitor == "fan")
        {
        if(myarray[4][1].length == 0 && myarray[5][1].length == 0 && myarray[5][2].length == 0 && myarray[6][1].length == 0 && myarray[7][1].length == 0)
            {
            document.write("No data for fan rpm sensors. You will be redirected in 5sec.");
            setTimeout("location.reload(true)", 5000);
            }
        else
            {
            //create fan chart.
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
                        text: 'Fans (RPM)'
                    }
                },
                series: [
                        {
                        data: myarray[4][1],
                        name: myname[4][1],
                        },
                        {
                        data: myarray[4][2],
                        name: myname[4][2],
                        },
                        {
                        data: myarray[4][3],
                        name: myname[4][3],
                        },
                        {
                        data: myarray[4][4],
                        name: myname[4][4],
                        },
                        {
                        data: myarray[5][1],
                        name: myname[5][1],
                        },
                        {
                        data: myarray[5][2],
                        name: myname[5][2],
                        },
                        {
                        data: myarray[5][3],
                        name: myname[5][3],
                        },
                        {
                        data: myarray[6][1],
                        name: myname[6][1],
                        },
                        {
                        data: myarray[6][2],
                        name: myname[6][2],
                        },
                        {
                        data: myarray[6][3],
                        name: myname[6][3],
                        },
                        {
                        data: myarray[7][1],
                        name: myname[7][1],
                        },
                        {
                        data: myarray[7][2],
                        name: myname[7][2],
                        },
                        {
                        data: myarray[7][3],
                        name: myname[7][3],
                        },
                        {
                        data: myarray[7][4],
                        name: myname[7][4],
                        },
                    ]
                });
            }
        }
    else if (monitor == "volt")
        {
        if(myarray[8][1].length == 0 && myarray[9][1].length == 0 && myarray[10][1].length == 0 && myarray[11][1].length == 0 && myarray[12][1].length == 0 && myarray[13][1].length == 0)
            {
            document.write("No data for voltage sensors. You will be redirected in 5sec.");
            setTimeout("location.reload(true)", 5000);
            }
        else
            {
            //create fan chart.
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
                        text: 'Fans (RPM)'
                    }
                },
                series: [
                        {
                        data: myarray[8][1],
                        name: myname[8][1],
                        },
                        {
                        data: myarray[8][2],
                        name: myname[8][2],
                        },
                        {
                        data: myarray[8][3],
                        name: myname[8][3],
                        },
                        {
                        data: myarray[8][4],
                        name: myname[8][4],
                        },
                        {
                        data: myarray[9][1],
                        name: myname[9][1],
                        },
                        {
                        data: myarray[9][2],
                        name: myname[9][2],
                        },
                        {
                        data: myarray[10][1],
                        name: myname[10][1],
                        },
                        {
                        data: myarray[10][2],
                        name: myname[10][2],
                        },
                        {
                        data: myarray[11][1],
                        name: myname[11][1],
                        },
                        {
                        data: myarray[11][2],
                        name: myname[11][2],
                        },
                        {
                        data: myarray[12][1],
                        name: myname[12][1],
                        },
                        {
                        data: myarray[12][2],
                        name: myname[12][2],
                        },
                        {
                        data: myarray[13][1],
                        name: myname[13][1],
                        },
                        {
                        data: myarray[13][2],
                        name: myname[13][2],
                        },
                    ]
                });
            }
        }
    else
        {
        document.write("Not yet implemented... You will be redirected in 5sec.");
        setTimeout("location.reload(true)", 5000);
        }
}


function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}
