<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, minimum-scale=0.5, maximum-scale=1, initial-scale=1, user-scalable=no, target-densitydpi=device-dpi">

        <title>RaceFinder.bike</title>

        <link href="public/Includes/css/styles.css" media="all" rel="stylesheet" type="text/css" />

    </head>
    <body class="on-load-ask-server" data-action="getRaceRSS({
            url: '' })">
        <h1>Racefinder!</h1>
        <div class="container">
            <div class="content">
                <div class="map-canvas"></div>
            </div>
        </div>
        <script src="public/Includes/scripts/require.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
        <script type="text/javascript"
              src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAXPwfiflEHVhuTLPWrb7j1d5PMyXS-UeE&sensor=true"></script>
        <script src="public/Includes/scripts/AppGlobal.js"></script>
        <script src="public/Includes/scripts/Scrape.js"></script>
        <script src="public/Includes/scripts/Map.js"></script>
        <script src="public/Includes/scripts/bootstrap.js"></script>
    </body>
</html>
