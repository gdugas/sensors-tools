# -*- coding:Utf-8 -*-

import os,re,subprocess,sys
import sensorsConf

def Xml():
	sensors_cmd	= sensorsConf.SENSORS_path
	wdir		= os.path.abspath( os.path.dirname(sys.argv[0]) )
	
	# Acquisition sortie de sensors
	process = subprocess.Popen( [sensors_cmd], stdout=subprocess.PIPE )
	
	sensorsOut = ''
	
	temps		= []
	fans		= []
	voltages	= []
	
	for i in process.stdout:
		########## MBB
		## Acquisition des températures des cores (coretemp-isa)
		if re.search('^coretemp-isa-',i) != None:
			buf1 = []
			buf1.append( int(re.sub('coretemp-isa-', '', i)) )
		elif re.search('^Core [0-9]:',i) != None:
			match = re.search( '(\+|\-)([0-9]+)', (re.split('\s+', i))[2] )
			buf1.append( int( match.group(1) + match.group(2) ) )
			temps.append( ['core', buf1[0], buf1[1]] )
		
		## Acquisition température carte mere
		elif re.search('^temp[0-9]', i):
			match = re.search('^temp([0-9]+):\s+(\+|\-)([0-9]+)', i)
			temps.append( ['motherboard',match.group(1),int(match.group(2)+match.group(3)) ] )
		
		########## Cluster3 et Mbb
		## Acquisition vitesse des ventilos
		elif re.search('^fan[0-9]', i) or re.search('^CPU_Fan',i):
			match = re.search('^([a-zA-Z_]+)([0-9]*):\s+([0-9]+)', i)
			fans.append( [match.group(1),match.group(2),match.group(3)] )
		
		########## Cluster3 (noeud 0 à 14)
		## Acquisition température carte mèret "remote" (noeud de calcul 0-14 cluster3)
		elif re.search('^Board Temp', i) or re.search('^Remote Temp', i):
			buf1 = []
			match = re.search('^(\w+) (\w+):', i)
			buf1.append( match.group(1)+match.group(2) )
		elif re.search('^\s+(\+|-)[0-9]+', i):
			match = re.search('^\s+(\+|\-)([0-9]+)', i)
			buf1.append( int(match.group(1)+match.group(2)) )
			temps.append( [buf1[0],'',buf1[1]] )
		
		## Acquisition voltages
		elif re.search('^V.*:\s+(\+|\-)[0-9]+\.[0-9]+ V', i):
			match = re.search('^(V.+):\s+(\+|\-)([0-9]+\.[0-9]+) V', i)
			voltages.append( [match.group(1), float(match.group(2)+match.group(3) )] )
	
	# Ecriture sortie
	outXml	= "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
	
	outXml	= outXml + "<monitor>\n"
	outXml	= outXml + "<temperatures>\n"
	for i in temps:
#		if i[0] == "core":
#			i[0] = "processor"
		outXml = outXml + "\t<temperature name=\""+i[0]+"\" num=\""+str(i[1])+"\" value=\""+str(i[2])+"\" />\n"
	outXml = outXml + "</temperatures>\n"
	outXml = outXml + "<fans>\n"
	for i in fans:
		outXml = outXml + "\t<fan name=\""+i[0]+"\" num=\""+str(i[1])+"\" value=\""+str(i[2])+"\" />\n"
	outXml = outXml + "</fans>\n"
	outXml = outXml + "<voltages>\n"
	for i in voltages:
		outXml = outXml + "\t<voltage name=\""+i[0]+"\" value=\""+str(i[1])+"\" />\n"
	outXml = outXml + "</voltages>\n"
	outXml = outXml + "</monitor>\n"
	return outXml

