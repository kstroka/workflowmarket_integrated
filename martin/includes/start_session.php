<?php
	function start_session(){
		if (ini_set('session.use_only_cookies', 1) === false) { // pouzivam sessions ktore sa ukladaju v cookies, nie v url
			echo "zle";
		}
			
		$c_parameters = session_get_cookie_params();
		session_set_cookie_params($c_parameters["lifetime"],$c_parameters["path"], $c_parameters["domain"], false, true); // false na https, true na httponly
			
		session_name("secsess");
		session_start();
		session_regenerate_id(true);
	}
?>