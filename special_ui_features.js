"use strict";

// Displays something in the log  window, msg is the string, type is what color is the msg:
// 0 for unimportant, 1 for terrible, 2 for bad, 3 for normal, 4 for good
function DisplayMessage(msg, type=3)
{
    let timestamp = (settings.display_timestamp === true) ? '<span>' : '<span class="no_display">';
    timestamp += '[d' + PadWith0(day, 3) + ' y' + year + '] </span>';
    $('#game_log').prepend('<p class="msg_' + type + '">' + timestamp + msg + '</p>');
}

document.getElementById("toppanel_left").addEventListener("wheel", function(){ScrollMenu("#city_menu","#toppanel_left",event);});
document.getElementById("botpanel_left").addEventListener("wheel", function(){ScrollMenu("#bld_menu","#botpanel_left",event);});
document.getElementById("botpanel_right").addEventListener("wheel", function(){ScrollMenu("#tech_menu","#botpanel_right",event);});

function ScrollMenu(id,bounds,e)
{
    let move = Math.round(-e.deltaY * 0.5);
    let current_margin = $(id).css("margin-top").slice(0,-2);
    const dif = $(id).height() + current_margin*1;
    const h_bounds = $(bounds).innerHeight();
    const gap = h_bounds - dif;

    if(current_margin <= 0)
    {
        const operator = current_margin*1 + move*1;          
        if(operator < 0)
        {
            DebugLog('current_margin: '+current_margin+' | operator: '+operator+' | dif: '+dif+' | bounds.h: '+ h_bounds + ' | gap:'+gap);
            if(move > 0 || (move < 0 && gap < 70))
            {
                $(id).css("margin-top", "-" + Math.abs(operator) + "px");
            }
        }
        else
        {
            $(id).css("margin-top", operator + "px");
        }
    }

    current_margin = $(id).css("margin-top").slice(0,-2);
    if(current_margin > 0 || $(id).height() < h_bounds)
    {
        $(id).css("margin-top","0px");
    }
    else if(dif < h_bounds)
    {
        $(id).css("margin-top",'-'+ (current_margin - gap) +'px');
    }
}

let hover_box_timeout_on;
let hover_box_timeout_off;
let cursor_on_hover_box = false;
let cursor_on_thing = false;

function AddHoverBoxFunctionality(id, type)
{
    $(id).mouseenter(function()
    {
        hover_box_timeout_on = setTimeout(function() {DisplayHoverBox(type, id);}, 700);
        cursor_on_thing = true;
    });

    $(id).mouseleave(function()
    { 
        clearTimeout(hover_box_timeout_on);
        cursor_on_thing = false;
        if(!cursor_on_thing && !cursor_on_hover_box)
        {
            hover_box_timeout_off = setTimeout(function(){HideHoverBox(type);}, 10);
        }
    });
}

function AddHoverAudioFunctionality(id, sound_id, vol)
{
    $(id).mouseenter(function()
    {
        let audio = document.getElementById(sound_id);
        audio.volume = vol * volume_effects;
        PlaySound(sound_id);
    });
}
AddHoverAudioFunctionality('#button_info', 'audio_tick', 0.2);
AddHoverAudioFunctionality('#button_sfx', 'audio_tick', 0.2);
AddHoverAudioFunctionality('#button_music', 'audio_tick', 0.2);

$(".hover_box").mouseenter(function()
{
    clearTimeout(hover_box_timeout_off);
    cursor_on_hover_box = true;
});
$(".hover_box").mouseleave(function()
{
    cursor_on_hover_box = false;
    if(!cursor_on_thing && !cursor_on_hover_box)
    {
        hover_box_timeout_off = setTimeout(function(){HideHoverBox(0);HideHoverBox(1);}, 10);
    }
});

$("body").mousemove(function(event) {
    cursor_x = event.pageX;
    cursor_y = event.pageY;
});

function DisplayHoverBox(type, hovered_thing_id)
{
    let hover_box = $("#hb_type"+type);
    let content = '';
    switch(type)
    {
        case 0:
            hovered_thing_id = hovered_thing_id.slice(5);  //removing #bld_ from #bld_name
            if(bld[hovered_thing_id].hasOwnProperty('det'))
            {
                for(var i = 1; i < bld[hovered_thing_id].work.length+1; i++)
                {
                    content += '<p class="hb_det"><span class="hb_det_blue"> - Level '+ i +': </span>'+ bld[hovered_thing_id].det(i) +'</p>';
                }
            }
            break;
        case 1:
            hovered_thing_id = hovered_thing_id.slice(5);  //removing #bld_ from #bld_name
            if(bld[hovered_thing_id].hasOwnProperty('det'))
            {
                for(var i = 1; i < bld[hovered_thing_id].work.length+1; i++)
                {
                    if(i == bld[hovered_thing_id].lvl)
                    {
                        content += '<p class="hb_det"><span class="hb_det_white">- Level '+ i +': '+ bld[hovered_thing_id].det(i) +'</span></p>';
                    }
                    else if(i == bld[hovered_thing_id].lvl + 1)
                    {
                        content += '<p class="hb_det"><span class="hb_det_blue">- Level '+ i +': '+ bld[hovered_thing_id].det(i) +'</span></p>';
                    }
                    else
                    {
                        content += '<p class="hb_det">- Level '+ i +': '+ bld[hovered_thing_id].det(i) +'</p>';
                    }
                }
                content += '<p class="hb_det"><span class="hb_det_white">* current level</span>, <span class="hb_det_blue">* next level</span></p>';
            }
            break;
        default: break;
    }

    hover_box.html(content);
    const off_left = (cursor_x > $(window).width()/2) ? (cursor_x - hover_box.outerWidth() - 2) + "px" : (cursor_x + 2) + "px";
    const off_top = (cursor_y > $(window).height() - hover_box.outerHeight()) ? (cursor_y - hover_box.outerHeight()) + "px" : cursor_y + "px";
    hover_box.css("left", off_left);
    hover_box.css("top", off_top);
    
    hover_box.fadeIn(200);
}

function HideHoverBox(type)
{
    $("#hb_type"+type).hide(10);
}