#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sensorsConf,sqlite3

def create():
	conn    = sqlite3.connect(sensorsConf.DB_name)
	cursor	= conn.cursor()
	request	= "CREATE TABLE temp (num NUMERIC, id INTEGER PRIMARY KEY,"\
" date NUMERIC, dev TEXT, type TEXT, value NUMERIC);"
	cursor.execute(request)
	conn.commit()
	request	= "CREATE TABLE fan (num NUMERIC, id INTEGER PRIMARY KEY,"\
" date NUMERIC, dev TEXT, type TEXT, value NUMERIC);"
	cursor.execute(request)
	conn.commit()
	request	= "CREATE TABLE volt (num NUMERIC, id INTEGER PRIMARY KEY,"\
" date NUMERIC, dev TEXT, type TEXT, value NUMERIC);"
	cursor.execute(request)
	conn.commit()
	cursor.close()

def insert(values):
	conn    = sqlite3.connect(sensorsConf.DB_name)
	cursor	= conn.cursor()
	request = ""
	request = request + "INSERT INTO temp(date,dev,num,type,value)"
	request = request + "VALUES("
	request = request + "'"+str(values['date'])+"',"
	request = request + "'"+values['dev']+"',"
	request = request + "'"+values['num']+"',"
	request = request + "'"+values['type']+"',"
	request = request + "'"+values['value']+"')"
	cursor.execute(request)
	conn.commit()
	cursor.close()
