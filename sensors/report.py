#!/usr/bin/env python
# -*- coding: utf-8 -*-

import smtplib
import sensorsConf
from email.MIMEText import MIMEText

def Mail( text,subject=None ):
    mail = MIMEText(text)
    mail['From'] = sensorsConf.EMAIL_from
    if subject == None:
        mail['Subject'] = sensorsConf.EMAIL_subject
    else:
        mail['Subject'] = subject
    mail['To'] = sensorsConf.EMAIL_to
    mail['Cc'] = sensorsConf.EMAIL_cc
    if (sensorsConf.EMAIL_relay_host) == "":
        smtp = smtplib.SMTP()
    else:
        smtp = smtplib.SMTP(sensorsConf.EMAIL_relay_host)

    smtp.connect()
    if sensorsConf.EMAIL_cc == "":
        smtp.sendmail(sensorsConf.EMAIL_from, sensorsConf.EMAIL_to.split(','), mail.as_string())
    else:
        smtp.sendmail(sensorsConf.EMAIL_from, sensorsConf.EMAIL_to.split(',') + sensorsConf.EMAIL_cc.split(','), mail.as_string())
    smtp.close()
