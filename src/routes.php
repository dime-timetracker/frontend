<?php

/*
|--------------------------------------------------------------------------
| DIME API Routes
|--------------------------------------------------------------------------
*/

// Route group for API versioning
Route::get('/', function()
{
    View::addExtension('html', 'php');
    return View::make('frontend::index');
});
