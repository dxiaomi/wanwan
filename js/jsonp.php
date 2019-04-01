<?php
$arr = array ('username'=>'jack','age'=>21,'gender'=>'male');
echo $_GET['callback']."(".json_encode($arr).")";
?>