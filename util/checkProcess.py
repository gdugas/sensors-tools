#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os
from subprocess import Popen, call, PIPE
import sensorsConf

PROC_SCRIPT_NAME = sensorsConf.PROC_SCRIPT_NAME
CPU_MIN_VAL_FOR_PROC = sensorsConf.CPU_MIN_VAL_FOR_PROC

def check_cpu_for_proc(std_output):
    """
    Check CPU usage by the process to ignore
    @ Take the standard input from ps aux |grep PROC_SCRIPT_NAME
    @ Take the CPU usage value
    @ Return True/False
    """
    res = False
    std_output = std_output.split('\n')
    for curline in std_output:
        if curline :
            data = curline.split()
            if float(data[2]) >= CPU_MIN_VAL_FOR_PROC:
                return True
            else:
                return False

def check_ps_cmd():
    """
    Execute a system call to get the list of process that meet our
    process
    @ Take the name of process
    """
    try:
        p1 = Popen(["ps", "aux"], stdout=PIPE)
        p2 = Popen(["grep", PROC_SCRIPT_NAME], stdin=p1.stdout, \
        stdout=PIPE)
        p3 = Popen(["grep", "-v", "grep"], stdin=p2.stdout, stdout=PIPE)
        output = p3.communicate()[0]
        return output
    except Exception, e:
        print >>sys.stderr, "Execution failed:", e
        return None

def is_script_running(std_output):
    """
    Check if the process wanted is running
    @ Take the name of standard output of previous command
    """
    res = False
    std_output = std_output.split('\n')
    for curline in std_output:
        if PROC_SCRIPT_NAME in curline:
            res = True
    return res

if __name__ == "__main__":
    main()

def main():
    """
    The program check if a process is running and then, the amount of
    CPU usage. If this amount is higher than treshold from configuration
    file it returns True. Otherwise it is False
    """
    over_treshold = False
    std_output = check_ps_cmd()
    if std_output:
        res = is_script_running(std_output)
        if res is True:
            over_treshold = check_cpu_for_proc(std_output)
    return over_treshold
    sys.exit()
