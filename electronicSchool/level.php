<?php
header('Content-Type:text/html; charset=utf-8;');
$con=@mysql_connect('127.0.0.1','root','') or die('connect:'.mysql_error().'<br/>');
mysql_select_db('famousschool',$con)or die('select_db:'.mysql_error().'<br/>');
mysql_query("set names 'utf8'");
$result=mysql_query("SELECT * FROM `level`",$con)or die('query:'.mysql_error().'<br/>');
$arr=array();
$id=0;
class Level{
   public $id;
   public $name;
}
while($row=mysql_fetch_row($result)){
   $levels= new Level();
   $levels->id=$row[0];
   $levels->name=$row[1];
   $arr[]=$levels;
}
echo json_encode($arr) ;

mysql_close($con);