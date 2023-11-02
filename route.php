<?php

Flight::route('POST /sort', function(){ 
    echo 'I received a POST request.'; 
    $numArray = Flight::request()->data->numbers;
    sort($numArray);
    Flight::json(array('numbers' => $numArray));

});


Flight::start();
?>