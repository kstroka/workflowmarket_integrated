<?php

function myErrorHandler($errno, $errstr, $errfile, $errline) {
        if (!(error_reporting() & $errno)) {
            return;
        }

        switch ($errno) {
            case E_ERROR:
                echo "<b>My err</b> [$errno] $errstr<br />\n";
                //header("Location: " . HTML_PATH . 'index.php/error');
                //exit(1);
                break;

            case E_WARNING:
                echo "<b>My war</b> [$errno] $errstr<br />\n";
                //header("Location: " . HTML_PATH . 'index.php/error');
                //exit(1);
                break;

            case E_NOTICE:
                //echo "<b>My NOTICE</b> [$errno] $errstr<br />\n";
                break;

            default:
                echo "Unknown error type: [$errno] $errstr<br />\n";
                break;
        }

    return true;
    }

    // Set user-defined error handler function
    set_error_handler("myErrorHandler");