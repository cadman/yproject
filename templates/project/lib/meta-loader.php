<?php

	define("LIB_PATH", ( isset($_SERVER["SCRIPT_FILENAME"]) ) ? preg_replace( "/[^\/]*.php/", "", $_SERVER["SCRIPT_FILENAME"] ) . "src/" : "src/" );
	define("LIB_ROOT", ( isset($_SERVER["REQUEST_URI"]) ) ? preg_replace( "/[^\/]*.php/", "", current( explode( "?", $_SERVER["REQUEST_URI"] ) ) ) : "" );

	$name = "local";

	$local = false;

	$defaults = array(
		"filter" => "min",
		"base" => LIB_ROOT . "build/",
		"comboBase" => LIB_ROOT . "combo.php?",
		"root" => "build/",
		"combine" => true
	);

	$booleans = array("combine");

	function get_module_meta_value($key, $string) {
		$found = preg_match("/^".$key."=(.*)\n/m", $string, $matches);
		if ($found == 1) {
			return trim($matches[1]);
		} else {
			return null;
		}
	}
	
	function get_module_meta($file) {
		$config = array(
			"component" => array(
				"key" => "name",
				"type" => "value"
			),
			"component.module" => array(
				"key" => "module",
				"type" => "value"
			),
			"component.jsfiles" => array(
				"key" => "jsfiles",
				"type" => "array"
			),
			"component.cssfiles" => array(
				"key" => "cssfiles",
				"type" => "array"
			),
			"component.requires" => array(
				"key" => "requires",
				"type" => "array"
			),
			"component.lang" => array(
				"key" => "lang",
				"type" => "array"
			),
			"component.use" => array(
				"key" => "use",
				"type" => "array"
			),
			"component.supersedes" => array(
				"key" => "supersedes",
				"type" => "array"
			),
			"component.optional" => array(
				"key" => "optional",
				"type" => "array"
			),
			"component.prependfiles" => array(
				"key" => "prependfiles",
				"type" => "array"
			),
			"component.appendfiles" => array(
				"key" => "appendfiles",
				"type" => "array"
			),
			"component.skinnable" => array(
				"key" => "skinnable",
				"type" => "boolean"
			)
		);
		
		if (is_file($file)) {
			$file_contents = file_get_contents($file);
		} else {
			return null;
		}
		
		$module = array();

		foreach ($config as $key => $meta) {
			$value = get_module_meta_value($key, $file_contents);
			if ($value) {
				if ($meta["type"] == "value") {
					$module[$meta["key"]] = $value;
				} elseif ($meta["type"] == "array") {
					$module[$meta["key"]] = array_map("trim", explode(",", $value));
				} elseif ($meta["type"] == "boolean") {
					$module[$meta["key"]] = ($value == "true") ? true : false;
				}
			}			
		}
		
		return $module;
	}
	
	function get_modules($dir, $local = false) {

		$property_files = glob($dir . "*/*.properties");
		
		$meta = array("name", "type", "path", "requires", "lang", "optional", "supersedes", "skinnable");

		$modules = array();

		foreach ($property_files as $property_file) {
			$module_dir = str_replace($dir, "", dirname($property_file));
			$module = get_module_meta($property_file);
			
			if (!$module || !$module["name"] || (!$module["jsfiles"] && !$module["cssfiles"])) {
				next;
			}
			
			$name = $module["name"];
			$module["name"] = (isset($module["module"])) ? $module["module"] : $module["name"];
			
			if ($module["jsfiles"]) {
				$module["type"] = "js";
			} else {
				$module["type"] = "css";
			}
			
			if ($local) {
				$module["path"] = $module_dir . "/build_tmp/" . $name . "-min.js";
			} else {
				$module["path"] = $name . "/" . $name . "-min.js";
			}
			
			$modules[$module["name"]] = array();
			foreach ($meta as $key) {
				if (isset($module[$key])) {
					$modules[$module["name"]][$key] = $module[$key];
				}
			}
		}

		return $modules;

	}

	header("Content-type: application/x-javascript");
	
	$config = array();
	
	if (isset($_GET)) {
		if (isset($_GET["name"])) {
			$name = $_GET["name"];
		}
		if (isset($_GET["local"])) {
			$local = $_GET["local"];
		}
		foreach ($defaults as $key => $value) {
			if (isset($_GET[$key])) {
				if (in_array($key, $booleans)) {
					$config[$key] = ($_GET[$key] == "true") ? true : false ;
				} else {
					$config[$key] = $_GET[$key];
				}
			}
		}
	}
	
	$group = array_merge($defaults, $config);
	$group["modules"] = get_modules(LIB_PATH, $local);

?>
if (typeof YUI_config === "undefined") {
	YUI_config = {groups: {}};
}
YUI_config.groups[<?php echo json_encode($name); ?>] = <?php echo json_encode($group); ?>;