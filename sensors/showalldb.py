#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os,sys
import sqlite3 

dirpyfile = os.path.dirname(sys.argv[0])
#print dirpyfile

wdir = os.path.abspath( os.path.dirname(sys.argv[0]) + '/../' )
sys.path.append(wdir)

#print wdir
import sensorsConf

#mydatabase="history.db"
connection=sqlite3.connect(sensorsConf.DB_name)
cursor=connection.cursor()
#print "\nTEMPERATURES\n\n"
#cursor.execute('SELECT * FROM temp;')
cursor.execute('SHOW TABLE;')
#print cursor.fetchall()
#print "\nVOLTAGES\n\n"
#cursor.execute('SELECT * FROM voltage;')
#print cursor.fetchall()
#print "\nFANS\n\n"
#cursor.execute('SELECT * FROM fan;')
print cursor.fetchall()
connection.commit()
cursor.close()
quit()
