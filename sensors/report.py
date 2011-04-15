# -*- coding:Utf-8 -*-

import sensorsConf,smtplib
from email.MIMEText import MIMEText

def Mail( text ):
    mail = MIMEText(text)
    mail['From'] = sensorsConf.EMAIL_from
    mail['Subject'] = sensorsConf.EMAIL_subject
    mail['To'] = sensorsConf.EMAIL_to
    mail['Cc'] = sensorsConf.EMAIL_cc
    smtp = smtplib.SMTP()
    smtp.connect()
    smtp.sendmail(sensorsConf.EMAIL_from, sensorsConf.EMAIL_to.split(',') + sensorsConf.EMAIL_cc.split(','), mail.as_string())
    smtp.close()
