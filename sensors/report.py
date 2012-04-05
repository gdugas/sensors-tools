# -*- coding:Utf-8 -*-

import sensorsConf,smtplib
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
    smtp = smtplib.SMTP()
    smtp.connect()
    if sensorsConf.EMAIL_cc == "":
        smtp.sendmail(sensorsConf.EMAIL_from, sensorsConf.EMAIL_to.split(','), mail.as_string())
    else:
        smtp.sendmail(sensorsConf.EMAIL_from, sensorsConf.EMAIL_to.split(',') + sensorsConf.EMAIL_cc.split(','), mail.as_string())
    smtp.close()
