<!doctype html>
<!--[if lt IE 7]> <html class="lt-ie9 lt-ie8 lt-ie7" lang="de"> <![endif]-->
<!--[if IE 7]>    <html class="lt-ie9 lt-ie8" lang="de"> <![endif]-->
<!--[if IE 8]>    <html class="lt-ie9" lang="de"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="de"> <!--<![endif]-->
<head>
	<meta charset="utf-8">

	<title><%= projectName %></title>

	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">

	<link rel="stylesheet" href="css/style.css">

</head>
<body>
	<div class="content">

		<h1><%= projectName %></h1>

		<ul>
			<li><a href="lib/docs/">Documentation</a></li>
			<li><a href="tests/coverage/lcov-report/index.html">Test coverage</a></li>
			<li><a href="tests/">Tests</a> (only available through the development server)</li>
		</ul>

	</div>

	<script src="http://yui.yahooapis.com/3.5.1/build/yui/yui-min.js"></script>
	<script><?php
		require_once('lib/meta-loader.php');
		meta_loader('<%= projectName %>', '', array(
			'filter' => 'debug',
			'combine' => false
		), 'lib/src/');
	?></script>

	<script>
		YUI().use('*', function (Y) {
		    


		});
	</script>
</body>
</html>