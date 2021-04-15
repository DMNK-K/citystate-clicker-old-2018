"use strict";
const settings = {
    volume_effects: 1,
    volume_music: 1,
    mute_effects: false,
    mute_music: false,
    display_timestamp: true,
    display_mood_logs: true,
    hide_orange_logs_after_delay: false
}

$('#button_settings').click(function(){$('#settings_wrapper').show();});
$('#settings_close_button').click(function(){$('#settings_wrapper').hide();});

$('#button_setting_sfx').click(
    function(){MuteAudio(false);}
);
$('#button_setting_music').click(
    function(){MuteAudio(true);}
);
$('#button_setting_timestamps').click(
    function(){ToggleDisplayTimestamps();}
);
$('#button_setting_mood').click(
    function(){ToggleDisplayMoodLogs();}
);
$('#button_setting_orange').click(
    function(){ToggleHideOrangeLogs();}
);

$('#button_music').click(function(){MuteAudio(true);});
$('#button_sfx').click(function(){MuteAudio(false);});

const setting_str_on = "on";
const setting_str_off = "off";

function MuteAudio(is_music)
{
    if(is_music)
    {
        settings.mute_music = !settings.mute_music;
        $('#button_setting_music').html((settings.mute_music) ? setting_str_off : setting_str_on);
        $('#button_music .banner_button_icon').removeClass((settings.mute_music === false) ? 'bb_icon_off' : 'bb_icon_on');
        $('#button_music .banner_button_icon').addClass((settings.mute_music === false) ? 'bb_icon_on' : 'bb_icon_off');
        //SetCookie("music", settings.volume_music, 365);
    }
    else
    {
        settings.mute_effects = !settings.mute_effects;
        $('#button_setting_sfx').html((settings.mute_effects) ? setting_str_off : setting_str_on);
        $('#button_sfx .banner_button_icon').removeClass((settings.mute_effects === false) ? 'bb_icon_off' : 'bb_icon_on');
        $('#button_sfx .banner_button_icon').addClass((settings.mute_effects === false) ? 'bb_icon_on' : 'bb_icon_off');
        //SetCookie("sfx", settings.volume_effects, 365);
    }
}

function ToggleDisplayTimestamps()
{
    settings.display_timestamp = !settings.display_timestamp;
    if(settings.display_timestamp === true)
    {
        $('#game_log p span').show();
        $('#button_setting_timestamps').html(setting_str_on);
    }
    else
    {
        $('#game_log p span').hide();
        $('#button_setting_timestamps').html(setting_str_off);
    }
}

function ToggleDisplayMoodLogs()
{
    settings.display_mood_logs = !settings.display_mood_logs;
    if(settings.display_mood_logs === true)
    {
        $('#game_log .msg_0').show();
        $('#button_setting_mood').html(setting_str_on);
    }
    else
    {
        $('#game_log .msg_0').hide();
        $('#button_setting_mood').html(setting_str_off);
    }
}

function ToggleHideOrangeLogs()
{

}