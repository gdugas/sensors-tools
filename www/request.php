<?php

define('DB_path', '../db/history.db');
define('CONF_path', '../sensorsConf.py');

// Time definitions
define('MINUTE',    60 );
define('HOUR',      60 * MINUTE);
define('DAY',       24 * HOUR);
define('WEEK',      7  * DAY);
define('MONTH',     4  * WEEK);

// Default values
if( ! isset( $_GET['view'] ) ) $view = 'day';
else $view = $_GET['view'];
if( ! isset($_GET['date']) ) $startdate = time() - ( time() % DAY ) - 2*HOUR;
else $startdate = intval( $_GET['date'] );

//echo $startdate;
//exit;

// Time request
switch( $view ) {
    case 'day':
        $step = HOUR;
        $stopdate = $startdate + DAY;
        break;
    case 'week':
        $step = DAY;
        $stopdate = $startdate + WEEK;
        break;
    case 'month':
        $step = WEEK;
        $stopdate = $startdate + MONTH;
        break;
    case 'hour':
    default:
        $view = 'hour';
        $step = 5*MINUTE;
        $stopdate = $startdate + HOUR;
        break;
}

// Request
$sql = "SELECT * FROM temp WHERE date >= '".$startdate."' AND date < '".$stopdate."' ";
try
    {
    $pdo = new PDO('sqlite:' . DB_path);
    }
catch(PDOException $e)
    {
    echo "Could not connect to sqlite db... Check (pdo_)sqlite.so and that these mods are enable...<br />";
    echo $e->getMessage();
    exit(1);
    }

if($pdo)
    {
    // Display
    header('Content-type: text/xml');
    header('Access-Control-Allow-Origin: *');
    echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
    echo '<monitor>' . "\n";
    foreach( $pdo->query($sql) as $row ) {
        $output = "\t" . '<sensor';
        $output .= ' type="'    .$row['type'].      '"';
        $output .= ' periph="'  .$row['dev'].       '"';
        $output .= ' num="'     .$row['num'].       '"';
        $output .= ' value="'   .$row['value'].     '"';
        $output .= ' date="'    .$row['date'].      '" />';
        echo $output . "\n";
        }
    echo '        <default>' . "\n";
    $handle = @fopen(CONF_path, 'r');
    if ($handle)
        {
        while (($buffer = fgets($handle, 4096)) !== false) {
            $attr = explode('=',$buffer);
            if(rtrim($attr[0]) == "SENSORS_periph")
                {
                $type = explode("\"",rtrim($attr[1]));
                echo '              <device>'.rtrim($type[1]).'</device>' . "\n";
                }
            elseif(rtrim($attr[0]) == "SENSORS_num")
                {
                echo '              <attr_num>'.rtrim($attr[1]).'</attr_num>'."\n";
                }
            }
        if (!feof($handle)) {
            echo "fgets() failed\n";
            }
        }
    fclose($handle);
    echo '        </default>' . "\n";
    echo '</monitor>';
    }
?>
