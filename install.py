#! /usr/bin/python
# -*- coding: utf-8 -*-

import os,re,sys

wdir = os.path.abspath( os.path.dirname(sys.argv[0]) )
sys.path.append(wdir)

pwd = os.path.abspath( os.path.dirname(sys.argv[0]) )

sensors_path = ''
for path in os.environ['PATH'].split(':'):
	if os.path.exists( path + '/sensors' ):
		sensors_path = path + '/sensors'
		break

if sensors_path == '':
	print "error: unable to find `sensors` program"
	quit()

files = []
for f in os.listdir(pwd):
	if os.path.isfile(pwd + '/' + f) and len(f) > 3 and f[len(f)-3:] == '.in':
		files.append(f)

for tpl in files:
	f	= open( pwd + '/' + tpl )
	outp	= open( pwd + '/' + tpl[0:len(tpl)-3], 'w' )
	for line in f:
		line = line.replace('{{DB_PATH}}', pwd + '/db/history.db')
		line = line.replace('{{SENSORS_PATH}}', sensors_path)
		outp.write(line)
	f.close()
	outp.close()

if not os.path.exists( pwd + '/db' ): os.mkdir( pwd + '/db' );
