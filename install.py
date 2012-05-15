#! /usr/bin/python
# -*- coding: utf-8 -*-

import os,re,sys,subprocess,time

wdir = os.path.abspath( os.path.dirname(sys.argv[0]) )
sys.path.append(wdir)

pwd = os.path.abspath( os.path.dirname(sys.argv[0]) )

sensors_path = ''
for path in os.environ['PATH'].split(':'):
    if os.path.exists( path + '/sensors' ):
        sensors_path = path + '/sensors'
        break

if sensors_path == '':
    print "Error: unable to find `sensors` program\n\
    Please install it first (lm-sensors or lm_sensors)."
    quit()

files = []
for f in os.listdir(pwd):
    if os.path.isfile(pwd + '/' + f) and len(f) > 3 and f[len(f)-3:] == '.in':
        files.append(f)

for tpl in files:
    f   = open( pwd + '/' + tpl )
    outp    = open( pwd + '/' + tpl[0:len(tpl)-3], 'w' )
    for line in f:
        line = line.replace('{{DB_PATH}}', pwd + '/db/history.db')
        line = line.replace('{{SENSORS_PATH}}', sensors_path)
        outp.write(line)
    f.close()
    outp.close()

if not os.path.exists( pwd + '/db' ): os.mkdir( pwd + '/db' );
if not os.path.exists( pwd + '/logs' ): os.mkdir( pwd + '/logs' );

time.sleep(1)

import sensorsConf
if sensorsConf.LOG_time:
    log_time = sensorsConf.LOG_time
else:
    log_time = "5"
if sensorsConf.FIRST_alert_time:
    report_time = sensorsConf.FIRST_alert_time
else:
    report_time = "5"

with open("/etc/cron.d/sensors-tools", "w") as myfile:
    #every 5 minutes monitor in a cron file...
    myfile.write("*/"+log_time+" * * * * root "+pwd + "/bin/sensors-logging\n")
    myfile.write("*/"+report_time+" * * * * root "+pwd + "/bin/sensors-monitor\n")

cron_path = ""
daemon_path = "/etc/init.d"
if os.path.exists(daemon_path + '/cron'):
    cron_path = daemon_path + '/cron'
elif os.path.exists(daemon_path + '/crond'):
    cron_path = daemon_path + '/crond'

print cron_path
subprocess.call("cp "+pwd + "/bin/sensorsd /etc/init.d/", shell=True)
subprocess.call(cron_path+" reload", shell=True)
subprocess.call("service sensorsd start", shell=True)
