#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os,re,subprocess,sys
import sensorsConf

def parseSensors(stdout):

    temps       = []
    fans        = []
    volts       = []

    return_content = stdout.readlines()

    # some counters
    itemp = 0
    ifan = 0
    ivolt = 0

    for line in return_content:
        #print '\t', line

        TempRegExp = re.search('(\+|\-)([0-9]+\.[0-9])°C',line)
        FansRegExp = re.search('([0-9]+)\sRPM',line)
        VoltRegExp = re.search('(\+|\-)([0-9]+\.[0-9]{2})\sV',line)

        #temperatures
        if TempRegExp:
            itemp = itemp + 1
            match = re.split(":",line)


            #found CPU ?
            if re.search("(CPU)|(core)|(processor)",match[0],\
            re.IGNORECASE):
                temps.append(['core',itemp,TempRegExp.group(2)])
            #found motherboard ?
            elif re.search("(board)|(motherboard)|(MB)",\
            match[0],re.IGNORECASE):
                temps.append(['motherboard',itemp,TempRegExp.group(2)])
            else:
                match2 = re.search("^temp([0-9])",match[0],re.IGNORECASE)
                if match2:
                    #temps.append(['unknown_sensor',match2.group(1),\
                    #TempRegExp.group(2)])
                    temps.append(['core',itemp,\
                    TempRegExp.group(2)])
                elif re.search("remote",match[0],re.IGNORECASE):
                    temps.append(['motherboard',itemp,\
                    TempRegExp.group(2)])
                else:
                    temps.append(['unknown_device',itemp,\
                    TempRegExp.group(2)])

        #fans
        if FansRegExp:
            ifan = ifan + 1
            match = re.split(":",line)
            #found CPU fan speed ?
            if re.search("CPU",match[0],re.IGNORECASE):
                fans.append(['cpu_fan',ifan,FansRegExp.group(1)])
            #found chassis fan speed ?
            elif re.search("chassis",match[0],re.IGNORECASE):
                fans.append(['chassis_fan',ifan,FansRegExp.group(1)])
            #found MB fan speed ?
            elif re.search("(MB)|(board)|(motherboard)",\
            match[0],re.IGNORECASE):
                fans.append(['motherboard_fan',ifan,FansRegExp.group(1)])
            else:
                match2 = re.search("^fan([0-9])",match[0],re.IGNORECASE)
                if match2:
                    fans.append(['fan',match2.group(1),\
                    FansRegExp.group(1)])
                else:
                    fans.append(['unknown_fan',ifan,\
                    FansRegExp.group(1)])

        #voltages
        if VoltRegExp:
            ivolt = ivolt + 1
            match = re.split(":",line)
            #found Vcore ?
            if re.search("Vcore",match[0],re.IGNORECASE):
                volts.append(['Vcore',ivolt,VoltRegExp.group(2)])
            #found 3.3V ?
            elif re.search("3\.3",match[0]):
                volts.append(['3.3V',ivolt,VoltRegExp.group(2)])
            #found 5V ?
            elif re.search("5",match[0]):
                volts.append(['5V',ivolt,VoltRegExp.group(2)])
            #found 12V ?
            elif re.search("12",match[0]):
                volts.append(['12V',ivolt,VoltRegExp.group(2)])
            #found 1.5V ?
            elif re.search("1\.5",match[0]):
                volts.append(['1.5V',ivolt,VoltRegExp.group(2)])
            else:
                volts.append(['unknown_voltage',ivolt,VoltRegExp.\
                group(2)])

    return temps,fans,volts

def writeXml(temps,fans,volts):
    # writing xml output
    outXml  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"

    outXml  = outXml + "<monitor>\n"
    outXml  = outXml + "\t<temperatures>\n"
    for i in temps:
        #if i[0] == "core":
            #i[0] = "processor"
        outXml = outXml + "\t\t<temperature name=\""+i[0]+"\" num=\""+\
        str(i[1])+"\" value=\""+str(i[2])+"\" />\n"
    outXml = outXml + "\t</temperatures>\n"
    outXml = outXml + "\t<fans>\n"
    for i in fans:
        outXml = outXml + "\t\t<fan name=\""+i[0]+"\" num=\""+str(i[1])+\
        "\" value=\""+str(i[2])+"\" />\n"
    outXml = outXml + "\t</fans>\n"
    outXml = outXml + "\t<voltages>\n"
    for i in volts:
        outXml = outXml + "\t\t<voltage name=\""+i[0]+"\" num=\""+\
        str(i[1])+"\" value=\""+str(i[2])+"\" />\n"
    outXml = outXml + "\t</voltages>\n"
    outXml = outXml + "</monitor>\n"

    return outXml

def Xml():
    #sensors_cmd = "/usr/bin/sensors"
    sensors_cmd = sensorsConf.SENSORS_path
    wdir        = os.path.abspath( os.path.dirname(sys.argv[0]) )

    # Output of sensors acquisition
    process = subprocess.Popen([sensors_cmd], stdout=subprocess.PIPE)

    sensorsOut = ''

    temps       = []
    fans        = []
    volts       = []

    temps,fans,volts = parseSensors(process.stdout)

    outXml = writeXml(temps,fans,volts)
    #print outXml
    return outXml

### for standalone test uncomment the following and sensors_cmd binary path
### and comment "import sensorsConf" at the beginning
### ...then comment "return outXml" and uncomment "print outXml" above
#def main():
    #Xml()

#if __name__ == "__main__":
    #main()

