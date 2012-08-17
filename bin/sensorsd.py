#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import subprocess

wdir = os.path.abspath( os.path.dirname(sys.argv[0]) + '/../' )
sys.path.append(wdir)

class Sensorsd:

    def __init__(self):
        self.execute()
        pass


    def execute(self):
        """
        Check temperature every 5 minutes:
            If temp >= 1st treshold < 2nd treshhold:
                - sending email and check every 5 minutes except if the
                 action is not "mail"
            If temp >= 2nd treshhold:
                - we execute the command defined in sensorsConf.py
                - disable sensors-monitor from /etc/cron(.)d/sensors-tools
                 script and reload cron to avoid any further mail
        """
        import time
        import sensorsConf

        checkcycle  = int(sensorsConf.LOG_time) * 60 #convert in seconds
        timeout     = checkcycle
        count       = 0
        count2      = 0

        while 1:
            temp = self.getTemp()
            if temp >= int(sensorsConf.SENSORS_trigger):
                now = time.strftime("%Y%m%d %H:%M:%S", time.gmtime())

                if temp >= sensorsConf.SENSORS_trigger2 and \
                sensorsConf.ACTION_trigger2:

                    #very high temperature
                    print "Alert: Second treshold is reached"
                    subprocess.call(str(sensorsConf.ACTION_trigger2),\
                    shell=True)
                    count2 = count2 + 1
                    print now
                    print "---------"
                    print "Second treshold !"
                    print "Action is "+str(sensorsConf.ACTION_trigger2)
                    print "Temperature alert: "+str(temp)+\
                    " degrees, count = " + str(count2) + " time(s)"
                    print "----------------------------------------"
                    timeout = int(sensorsConf.SECOND_alert_time) * 60

                else:

                    # high temperature
                    count = count + 1
                    if sensorsConf.N_trigger and \
                    sensorsConf.ACTION_N_trigger and count >= \
                    int(sensorsConf.N_trigger):
                        subprocess.call(\
                        str(sensorsConf.ACTION_N_trigger),shell=True)
                    else:
                        if sensorsConf.ACTION_trigger == "mail":
                            print "Alert: First treshold is reached"
                            print now
                            print "---------"
                            print "First treshold !"
                            message = "Temperature report: \nT = "+\
                            str(temp)+" degrees\n"
                            message = message + "Count : "+str(count)+\
                            " time(s)"
                            message = message + "\n\n" + \
                            sensorsConf.EMAIL_text
                            self.sendMailReport(message,"Temperature \
alert (first trigger) ["+ str(count)+" time(s)]")
                            print "Temperature alert: "+str(temp)+\
                            " degrees, count = "+str(count) + " time(s)"
                            print "------------------------------------\
----"
                        else:
                            subprocess.call(\
                            str(sensorsConf.ACTION_trigger),shell=True)
                    timeout = int(sensorsConf.FIRST_alert_time) * 60

            else:
                timeout = checkcycle
                count = 0
            time.sleep(timeout)


    def getTemp(self):
        """
            Get sensor temperature from sensorsConf.periph and
            sensorsConf.num [configuration file]
        """
        import sensors.output,sensorsConf
        from xml.dom.minidom import parseString

        dom     = parseString( sensors.output.Xml() )
        temps   = dom.getElementsByTagName("temperatures")[0]

        for temp in temps.getElementsByTagName("temperature"):
            values = {}
            values['periph']    = temp.getAttribute('name')
            values['num']       = temp.getAttribute('num')
            values['type']      = 'temp'
            values['value']     = float(temp.getAttribute('value'))
            if values['periph'] == sensorsConf.SENSORS_periph and \
            int(values['num']) == sensorsConf.SENSORS_num:
                return int(round(values['value']))

    def sendMailReport(self,message,subject):
        """
            Send email temperature report to address defined in
            configuration file
        """
        import sensors.output,sensors.reportmime
        xml_detail = sensors.output.Xml()
        sensors.reportmime.createhtmlmail(message,xml_detail,subject)


main = Sensorsd()
