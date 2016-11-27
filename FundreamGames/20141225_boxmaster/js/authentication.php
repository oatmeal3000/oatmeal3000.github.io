<?php
require('../wp-load.php' );

$arr = array('user_email'=>$_GET['email'], 'ice_apppin'=>$_GET['pin']);
//$arr = array('user_email'=>'1069218989@qq.com', 'ice_apppin'=>'7bcd5250d0655fac3af128902af5759f');

$sql = 'select ice_appurl from wp_ice_download where ice_user_id=(select ID from wp_users where user_email=\'' .(string)$arr['user_email'] .'\') and ice_apppin=\'' . $arr['ice_apppin'] .'\'';
//$sql = 'select ice_appurl from wp_ice_download where ice_user_id=(select ID from wp_users where user_email="1069218989@qq.com") and ice_apppin="7bcd5250d0655fac3af128902af5759f"';

$result = mysql_query ( $sql );
$row = mysql_fetch_array ( $result );
unset($row[0]); 

echo json_encode($row);

?>


