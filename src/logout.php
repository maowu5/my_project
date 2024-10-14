<?php
session_start();
session_unset();  // 清除所有会话变量
session_destroy();  // 销毁会话
header("Location: login.html");  // 重定向到登录页面
exit;
?>
