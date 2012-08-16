#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sensorsConf
import smtplib
from email.MIMEBase import MIMEBase
from email import Encoders
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText

def createhtmlmail (text, xml_detail):
    """Create a mime-message that will render HTML in popular
    MUAs, text in better ones"""

    mesg = MIMEMultipart()

    mesg['From'] = sensorsConf.EMAIL_from
    mesg['Subject'] = sensorsConf.EMAIL_subject
    mesg['To'] = sensorsConf.EMAIL_to
    mesg['Cc'] = sensorsConf.EMAIL_cc
    mesg.attach( MIMEText(text) )

    # attach xml_detail
    part = MIMEBase('application', "octet-stream")
    part.set_payload( xml_detail )
    Encoders.encode_base64(part)
    part.add_header('Content-Disposition', \
    'attachment; filename="xml_detail"')

    mesg.attach(part)

    if (sensorsConf.EMAIL_relay_host) == "":
        server = smtplib.SMTP()
    else:
        if (sensorsConf.EMAIL_relay_port) == "":
            server = smtplib.SMTP(sensorsConf.EMAIL_relay_host)
        else:
            server = smtplib.SMTP(sensorsConf.EMAIL_relay_host, \
            sensorsConf.EMAIL_relay_port)
    username = sensorsConf.EMAIL_username
    password = sensorsConf.EMAIL_password
    if (username != "" and password != ""):
        server.login(username, password)
    server.sendmail(sensorsConf.EMAIL_from, \
    sensorsConf.EMAIL_to.split(',') + sensorsConf.EMAIL_cc.split(','), \
    mesg.as_string() )
    server.quit()
