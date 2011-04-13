<?php

define('DB_path', 'history.db');

// Time definitions
define('MINUTE',	60 );
define('HOUR',		60 * MINUTE);
define('DAY',		24 * HOUR);
define('WEEK',		7  * DAY);
define('MONTH',		4  * WEEK);

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
$pdo = new PDO('sqlite:' . DB_path);


// Display
header('Content-type: text/xml');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<monitor>';

foreach( $pdo->query($sql) as $row ) {

	$output = "\t" . '<sensor';
	$output .= ' type="'	.$row['type'].		'"';
	$output .= ' periph="'	.$row['periph'].	'"';
	$output .= ' num="'		.$row['num'].	'"';
	$output .= ' value="'	.$row['value'].		'"';
	$output .= ' date="'	.$row['date'].		'" />';
	echo $output . "\n";
}
echo '</monitor>';
?>
