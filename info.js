"use strict";

SetUpInfoButtonControls();
FillInfoContent();

function SetUpInfoButtonControls()
{
    $("#button_info, #info_close_button").click(function()
    {
        DisplayInfo();
    });
    
    $("#info_game_button").click(function()
    {
        $("#info_content_changelog").fadeOut(0, function(){$("#info_content_game").fadeIn(0);});
    });
    
    $("#info_changelog_button").click(function()
    {
        $("#info_content_game").fadeOut(0, function(){$("#info_content_changelog").fadeIn(0);});
    });
}

function FillInfoContent()
{  
    $('#info_content_game').html(InfoGame());
    $('#info_content_changelog').html(InfoChangelog());
}

function DisplayInfo()
{
    $("#info_wrapper").fadeToggle(100);
}
