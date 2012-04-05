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
cursor.execute('SELECT * FROM temp;')
print cursor.fetchall()
connection.commit()
cursor.close()
quit()
