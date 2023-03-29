<?php
    header('Content-Type: application/json');
    $files = scandir('../img');
    unset($files[0]);
    unset($files[1]);
    $files = array_values($files);

    echo json_encode($files);
?>