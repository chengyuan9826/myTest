<?php
header('Content-Type:text/html; charset=utf-8;');
$con=@mysql_connect('127.0.0.1','root','') or die('connect:'.mysql_error().'<br/>');
mysql_select_db('famousschool',$con)or die('select_db:'.mysql_error().'<br/>');
mysql_query("set names 'utf8'");
//$p_id=$_POST["provinceId"];
$result=mysql_query("SELECT * FROM `school` WHERE `provinceId` =1",$con)or die('query:'.mysql_error().'<br/>');
$arr=array();
$id=0;
class School{
   public $id;
   public $name;
   public $schoolLevel;
   public $levelId;
   public $img;
   public $provinceId;
}
while($row=mysql_fetch_row($result)){
   $schools= new School();
   $schools->id=$row[0];
   $schools->name=$row[1];
   $schools->schoolLevel=$row[2];
   $schools->levelId=$row[3];
   $schools->img=$row[4];
   $schools->provinceId=$row[5];
   $arr[]=$schools;
}
echo json_encode($arr);

mysql_close($con);