"use strict";

function UpdateCityMenu(bld_prop_name)
{
    const level = bld[bld_prop_name].lvl + 1; //adding 1, because this function is always run before raising the lvl
    const cost_content = AssembleCostBarContent(bld[bld_prop_name], level, true);

    const sel = '#toppanel_left #bld_' + bld_prop_name;
    $(sel + ' .bld_img_wrapper .bld_level_label').html('LVL: ' + level);
    $(sel + ' .bld_content .bld_cost_bar').html(cost_content);
    $(sel + ' .bld_content .progress_bar').hide();
    $(sel + ' .bld_content .bld_desc').show();
    $(sel + ' .bld_content .progress_bar .progress_indicator').css("width", "0%");
    $(sel + ' .bld_content .progress_bar .progress_percent').html("0%");
}

function UpdateCityView(bld_prop_name)
{
    if(bld[bld_prop_name].img_pos === "none" || !bld[bld_prop_name].hasOwnProperty("img_pos")){return;}
    if($('#cvimg_' + bld_prop_name).length < 1)
    {
        const class_name = (bld[bld_prop_name].img_pos === "special") ? "cvimg_special" : "cvimg" ;
        $('#city_bcg').append('<img class="'+class_name+' img_pf" id="cvimg_'+ bld_prop_name +'" src=""/>');
        if(bld[bld_prop_name].img_pos != "special")
        {
            $('#cvimg_'+bld_prop_name).css('left', bld[bld_prop_name].img_pos[0] + "%");
            $('#cvimg_'+bld_prop_name).css('top', bld[bld_prop_name].img_pos[1] + "%");
        }
    }
    $('#cvimg_' + bld_prop_name).attr("src", "city_view/" + bld_prop_name + "_" + bld[bld_prop_name].lvl + ".png");
}

function AssembleCostBarContent(obj, for_lvl, is_building)
{
    const c_names = ['food','wood','stone','metal','money','knowl'];
    let cost_content = '';
    if(is_building)
    {
        for(let i = 0; i < c_names.length; i++)
        {
            if(obj.hasOwnProperty('cost_' + c_names[i]))
            {
                if(obj['cost_' + c_names[i]][for_lvl] > 0)
                {
                    cost_content += '<img class="cost_icon" src="resource_icons/icon_'+ c_names[i] +'.png"/>';
                    cost_content += '<span class="cost_span">'+ obj['cost_' + c_names[i]][for_lvl] +'</span>';
                }
            }
        }
    }
    else
    {
        for(let i = 4; i < c_names.length; i++) //starts from 4 since research things only have costs in money and knowledge (4, 5)
        {
            if(obj.hasOwnProperty('cost_' + c_names[i]))
            {
                if(obj['cost_' + c_names[i]] > 0)
                {
                    cost_content += '<img class="cost_icon" src="resource_icons/icon_'+ c_names[i] +'.png"/>';
                    cost_content += '<span class="cost_span">'+ obj['cost_' + c_names[i]] +'</span>';
                }
            }
        }
    }
    return cost_content;
}

$('#city_view_tab').click(function()
{
    $('#pantheon_view').hide();
    $('#military_view').hide();
    $('#world_view').hide(); 
    $('#city_view').show();   
});