"use strict";

// Starts the process of building - picks the construction slot if any are available,
// checks if enough resources. what_building is a string describing an obj inside bld obj.
function Build(what_building)
{
    if(HasValue(constr, what_building)){return;} //stop if the building is already being built
    if(bld[what_building].lvl == bld[what_building].work.length){return;} //no levels left to build
    const c_names = ['food','wood','stone','metal','money','knowl'];
    let costs = [0,0,0,0,0,0];
    const lvl = bld[what_building].lvl;
    for(let i = 0; i < costs.length; i++)
    {
        const cost_property_name = "cost_" + c_names[i];
        costs[i] = 0;
        if(bld[what_building].hasOwnProperty(cost_property_name))
        {
            costs[i] = bld[what_building][cost_property_name][lvl];
        }
    }
    const enough_resources = Boolean(food >= costs[0] && wood >= costs[1] && stone >= costs[2] && metal >= costs[3] && money >= costs[4] && knowl >= costs[5]);
    
    if(enough_resources)
    {
        let will_build = false;
        for (let i = 0; i < constr.length; i++)
        {
            //adding the building to first constr slot that is empty
            if(constr[i] === "empty")
            {
                constr[i] = what_building;
                will_build = true;
                break;
            }
        }
        
        //if any slot was empty spend the resources
        if(will_build === true)
        {
            for(let i = 0; i < c_names.length; i++)
            {
                window[c_names[i]] -= costs[i];
            }
            constr_now += 1;
            $("#bld_" + what_building + " .bld_desc").hide();
            $("#bld_" + what_building + " .progress_bar").show();
            DisplayResources();
        }
        else
        {
            //can only build n = construction_slots buildings at once
            let msg = 'As of now you can only be constructing ' + constr_slots;
            msg += (constr_slots === 1) ? ' building at once' : ' buildings at once.';
            DisplayMessage(msg, 2);
        }
    }
    else
    {
        //insuficient resources
        DisplayMessage("Insufficient resources to build " + HumanifyString(what_building) + ".", 2);
    }
}

function Research(what_tech)
{
    if(research == what_tech){return;}
    const c_money = (tech[what_tech].hasOwnProperty("cost_money")) ? tech[what_tech].cost_money : 0;
    const c_knowl = (tech[what_tech].hasOwnProperty("cost_knowl")) ? tech[what_tech].cost_knowl : 0;
    if(money >= c_money && knowl >= c_knowl)
    {
        if(research == "none")
        {
            research = what_tech;
            money -= c_money;
            knowl -= c_knowl;
            $("#tech_" + what_tech + " .bld_desc").hide();
            $("#tech_" + what_tech + " .progress_bar").show();
            DisplayResources();
        }
        else
        {
            DisplayMessage("Something else is already being researched.", 2);
        }
    }
    else {DisplayMessage("Insufficient resources to research " + HumanifyString(what_tech) + ".", 2);}
}

function PropellUnlocks(done_thing)
{
    for(let b in bld)                   
    {
        if(CanUnlock(done_thing, bld[b])){UnlockThing(bld[b], true, 0);}
    }
    //now the same thing but for techs
    for(let t in tech)
    {
        if(CanUnlock(done_thing, tech[t])){UnlockThing(tech[t], false, 0);}
    }
}

function CanUnlock(done_thing, thing_to_attempt)
{
    if(thing_to_attempt.hasOwnProperty("req"))
    {
        const suffix = (done_thing.hasOwnProperty("lvl")) ? "_" + done_thing.lvl : "";
        if(HasValue(thing_to_attempt.req, StrToLowerAndSpacesToUnderscores(done_thing.name) + suffix))
        {
            let all_req_fullfilled = true;
            for(let i = 0; i < thing_to_attempt.req.length; i++)
            {
                let req_string = thing_to_attempt.req[i];
                let last_char = req_string.slice(-1);
                let req_is_tech = (isNaN(last_char)) ? true : false;
                if(req_is_tech)
                {
                    if(tech[req_string].completed === false)
                    {
                        //the tech that is required is not completed, so we can stop checking
                        all_req_fullfilled = false;
                        break;
                    }
                }
                else
                {
                    const level = last_char;
                    const prop_name = req_string.slice(0, -2); //cutting _n
                    if((bld.hasOwnProperty(prop_name) && bld[prop_name].lvl < level) || !bld.hasOwnProperty(prop_name))
                    {
                        //the building that is required has a lower level than required, so we can stop checking
                        all_req_fullfilled = false;
                        break;
                    }
                }
            }
            return all_req_fullfilled;
        }
    }
}

function UnlockThing(what_thing, is_bld, lvl)
{
    const cost_content = AssembleCostBarContent(what_thing, lvl, is_bld);
    const main_class = (is_bld) ? 'bld_' : 'tech_';
    const lvl_label = (lvl > 0) ? 'LVL: ' + lvl : '';
    const img_folder = (is_bld) ? 'bld_icons' : 'tech_icons';
    DebugLog('main_class: '+ main_class + ' lvl_label: '+ lvl_label + ' img_folder: '+ img_folder);
    const box = ''+
    '<div class="' + main_class + 'box" id="' + main_class + StrToLowerAndSpacesToUnderscores(what_thing.name) +'">'+
        '<div class="bld_img_wrapper">'+
            '<img class="bld_img uns" src="' + img_folder + '/icon_'+ StrToLowerAndSpacesToUnderscores(what_thing.name) +'.png"/>'+
            '<div class="bld_level_label uns">'+ lvl_label + '</div>'+
        '</div>'+
        '<div class="bld_content uns">'+
            '<p class="bld_name">'+ what_thing.name +'</p>'+
            '<div class="bld_cost_bar">'+ cost_content +'</div>'+ 
            '<div class="progress_bar"><div class="progress_percent">0%</div><div class="progress_indicator"></div></div>'+
            '<div class="bld_desc">'+ what_thing.desc +'</div>'+
        '</div>'+
    '</div>';
    let append_location = '#';
    if(is_bld)
    {
        append_location += (lvl > 0) ? 'city_menu' : 'bld_menu';
    }
    else
    {
        append_location += 'tech_menu';
    }

    $(append_location).append(box);

    if(is_bld)
    {
        if(cost_content.length < 165)
        {
            $("#"+ main_class + StrToLowerAndSpacesToUnderscores(what_thing.name) + " .bld_content .bld_name").css("width", "65%");
            $("#"+ main_class + StrToLowerAndSpacesToUnderscores(what_thing.name) + " .bld_content .bld_cost_bar").css("width", "35%");
        }
        $('#' + main_class + StrToLowerAndSpacesToUnderscores(what_thing.name)).click(function()
        {
            Build($(this).attr("id").slice(4));
        });
        if(lvl > 0)
        {
            AddHoverBoxFunctionality('#' + main_class + StrToLowerAndSpacesToUnderscores(what_thing.name), 1);
        }
        else
        {
            AddHoverBoxFunctionality('#' + main_class + StrToLowerAndSpacesToUnderscores(what_thing.name), 0);
        }       
    }
    else
    {
        $('#' + main_class + StrToLowerAndSpacesToUnderscores(what_thing.name)).click(function()
        {
            Research($(this).attr("id").slice(5));
        });
    }
    AddHoverAudioFunctionality('#' + main_class + StrToLowerAndSpacesToUnderscores(what_thing.name), "audio_tick", 0.2);
}