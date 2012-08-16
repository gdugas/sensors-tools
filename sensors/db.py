#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sensorsConf
import sqlite3

def create():
    conn    = sqlite3.connect(sensorsConf.DB_name)
    cursor  = conn.cursor()
    request = "CREATE TABLE temp (num NUMERIC, id INTEGER PRIMARY KEY,"\
" date NUMERIC, dev TEXT, type TEXT, value NUMERIC);"
    cursor.execute(request)
    conn.commit()
    request = "CREATE TABLE fan (num NUMERIC, id INTEGER PRIMARY KEY,"\
" date NUMERIC, dev TEXT, type TEXT, value NUMERIC);"
    cursor.execute(request)
    conn.commit()
    request = "CREATE TABLE volt (num NUMERIC, id INTEGER PRIMARY KEY,"\
" date NUMERIC, dev TEXT, type TEXT, value NUMERIC);"
    cursor.execute(request)
    conn.commit()
    cursor.close()

def insert(values):
    conn    = sqlite3.connect(sensorsConf.DB_name)
    cursor  = conn.cursor()
    i = 0
    for i in range(len(values['date'])):
        request = ""
        request = request + "INSERT INTO temp(date,dev,num,type,value)"
        request = request + "VALUES("
        request = request + "'"+str(values['date'][i])+"',"
        request = request + "'"+values['dev'][i]+"',"
        request = request + "'"+values['num'][i]+"',"
        request = request + "'"+values['type'][i]+"',"
        request = request + "'"+values['value'][i]+"')"
        cursor.execute(request)
        conn.commit()
    cursor.close()
