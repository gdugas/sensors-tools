


# REQUIREMENTS #
linux file system with cron service, apache server (or other web server),
lm-sensors, php, sqlite3, python >= 2.6

After the install of lm-sensors, launch "sensors-detect" command and
answer to all question (to load modules at boot do not gorget to answer yes to the last question).

If "sensors" command works well and give some interesting results, you
can install the sensors-tools program.

To use www highchart, please check that you enable sqlite PDO driver in php.ini
You will find sqlite.so in php5-sqlite package on ubuntu.

/etc/php5/apache2/conf.d/pdo.ini (or [/etc/php5/apache2/]php.ini)
  * extension=pdo.so
  * extension=pdo\_sqlite.so
  * extension=sqlite.so


# INSTALL #
First launch install.py python script in root with

```shell

# python install.py

or

$ sudo python install.py
```

You have to create a symlinks in your www directory to map to the www
subdirectory of sensor-tools here.

# CONFIGURATION #

First edit **sensorsConf.py** to map to your system and your preferences.
To know what device(s) you want to monitor, you can execute :
```shell

# python bin/sensors-xml
<code>
from sensors-tools install directory

You can add a treshold to email you for temperature alerts.

You could change the /etc/cron.d/sensors-tools file to save information every
N minutes (5 by default).