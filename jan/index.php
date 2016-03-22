<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Workflow management-forms</title>
    <meta name="description" content="Workflow management forms">
    <meta name="author" content="Jan Polacek">

    <link rel="stylesheet" href="build/vendor/normalize.css">
    <link rel="stylesheet" href="build/vendor/jquery-ui.min.css">
    <link rel="stylesheet" href="build/mainformsstyles.css">

</head>

<body>

<nav style="width: 100%;height: 80px;background-color: #f0f0f0"></nav>
<section class="wm-form-creator-app">

</section>

<script src="build/vendor/jquery.min.js"></script>
<script src="build/vendor/jquery-ui.min.js"></script>
<script src="build/vendor/mustache.min.js"></script>

<script>
    window._WMGlobal = window._WMGlobal || {forms :[],$el : $(".app")};
</script>

<script src="build/templates.js"></script>
<script src="build/forms.js"></script>
</body>

</html>