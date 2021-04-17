"use strict";
//  ================================== SAVE AND LOAD SCRIPT ==================================
//  this script handles saving and loading the game, using cookies that store relative data
//  only the things needed are stored eg.: bld[].lvl, bld[].mult, tech[].completed, resources, pop, hap
//  progress of currently researched tech and built buildings, items in menus - based on loaded bld[].lvl
//  unlocked functionalities, stats changed by on_complete() of buildings and techs

let length_all = 0;
let save_blocked = false;
const sep0 = ":";     //small separator
const sep1 = "|";     //big separator
const sep2 = "~";     //superior separartor

function SaveGame()
{
    length_all = 0;
    SaveBuildings();
    SaveTech();
    SaveResourcesAndStorage();
    SaveGatheringButtons();
    SaveMenuItems();
    SavePantheon();
    SaveMilitary();
    SaveWorld();
    SaveManagement();
    //SaveSettings();
    SaveOther();
    DebugLog("save length: " + length_all);
}

function LoadGame()
{
    LoadBuildings();
    LoadTech();
    LoadResourcesAndStorage();
    LoadGatheringButtons();
    LoadMenuItems();
    LoadPantheon();
    LoadMilitary();
    LoadWorld();
    LoadManagement();
    //LoadSettings();
    LoadOther();
}

function HasSave()
{
    if(GetCookie("bld") == "empty"){return false;}
    if(GetCookie("tech") == "empty"){return false;}
    if(GetCookie("res") == "empty"){return false;}
    if(GetCookie("gath") == "empty"){return false;}
    if(GetCookie("menu") == "empty"){return false;}
    if(GetCookie("panth") == "empty"){return false;}
    if(GetCookie("mili") == "empty"){return false;}
    if(GetCookie("world") == "empty"){return false;}
    if(GetCookie("manag") == "empty"){return false;}
    //if(GetCookie("sett") == "empty"){return false;}
    if(GetCookie("other") == "empty"){return false;}
    //alert("has save");
    return true;
}

function DeleteSave()
{
    MarkCookie("bld");
    MarkCookie("tech");
    MarkCookie("res");
    MarkCookie("gath");
    MarkCookie("menu");
    MarkCookie("panth");
    MarkCookie("mili");
    MarkCookie("world");
    MarkCookie("manag");
    //MarkCookie("sett");
    MarkCookie("other");
}

function SaveBuildings()
{
    let str = "";
    for(let b in bld)
    {
        str += StrToLowerAndSpacesToUnderscores(bld[b].name) + sep0 + bld[b].lvl;
        str += (bld[b].hasOwnProperty("mult")) ? sep0 + bld[b].mult : "";
        str += (bld[b].hasOwnProperty("mult2")) ? sep0 + bld[b].mult2 : "";
        str += (bld[b].hasOwnProperty("mult3")) ? sep0 + bld[b].mult3 : "";
        str += sep1;
    }
    str = str.slice(0, -1);
    //alert(str);
    length_all += str.length;
    SetCookie("bld", str, 365);
}

function LoadBuildings()
{
    let bld_array = GetCookie("bld").split(sep1);
    for(let i = 0; i < bld_array.length; i++)
    {
        let b = bld_array[i].split(sep0);
        bld[b[0]].lvl = b[1]*1;
        if(bld[b[0]].hasOwnProperty("mult") && b.length > 2)
        {
            bld[b[0]].mult = b[2] * 1;
        }
        if(bld[b[0]].hasOwnProperty("mult2") && b.length > 3)
        {
            bld[b[0]].mult2 = b[3] * 1;
        }
        if(bld[b[0]].hasOwnProperty("mult3") && b.length > 4)
        {
            bld[b[0]].mult3 = b[4] * 1;
        }
    }
    for(let b in bld)
    {
        if(bld[b].lvl > 0)
        {
            const cost_content = AssembleCostBarContent(bld[b], bld[b].lvl, true);
            const lvl_label = 'LVL: ' + bld[b].lvl;
            const box = ''+
            '<div class="bld_box" id="bld_'+ StrToLowerAndSpacesToUnderscores(bld[b].name) +'">'+
                '<div class="bld_img_wrapper">'+
                    '<img class="bld_img uns" src="bld_icons/icon_'+ StrToLowerAndSpacesToUnderscores(bld[b].name) +'.png"/>'+
                    '<div class="bld_level_label uns">'+lvl_label+'</div>'+
                '</div>'+
                '<div class="bld_content uns">'+
                    '<p class="bld_name">'+ bld[b].name +'</p>'+
                    '<div class="bld_cost_bar">'+ cost_content +'</div>'+ 
                    '<div class="progress_bar"><div class="progress_percent">0%</div><div class="progress_indicator"></div></div>'+
                    '<div class="bld_desc">'+ bld[b].desc +'</div>'+
                '</div>'+
            '</div>';
            $('#city_menu').append(box);
            if(cost_content.length < 165)
            {
                $("#bld_" + StrToLowerAndSpacesToUnderscores(bld[b].name) + " .bld_content .bld_name").css("width", "65%");
                $("#bld_" + StrToLowerAndSpacesToUnderscores(bld[b].name) + " .bld_content .bld_cost_bar").css("width", "35%");
            }
            $('#bld_' + StrToLowerAndSpacesToUnderscores(bld[b].name)).click(function()
            {
                Build($(this).attr("id").slice(4));
            });
            AddHoverBoxFunctionality('#bld_' + StrToLowerAndSpacesToUnderscores(bld[b].name), 1);
            AddHoverAudioFunctionality('#bld_' + StrToLowerAndSpacesToUnderscores(bld[b].name), "audio_tick", 0.2);
            UpdateCityView(StrToLowerAndSpacesToUnderscores(bld[b].name));
        }
    }
}

function SaveTech()
{
    let str = "";
    for(let t in tech)
    {
        str += StrToLowerAndSpacesToUnderscores(tech[t].name) + sep0;
        str += (tech[t].completed == true) ? 1 : 0;
        str += sep1;
    }
    str = str.slice(0, -1);
    //alert(str);
    length_all += str.length;
    SetCookie("tech", str, 365);
}

function LoadTech()
{
    let tech_array = GetCookie("tech").split(sep1);
    console.log("n of found tech in saved cookie: " + tech_array.length);
    for(var i = 0; i < tech_array.length; i++)
    {
        const t = tech_array[i].split(sep0);
        const t_prop_name = t[0];
        const t_completed = t[1];
        if (tech.hasOwnProperty(t_prop_name))
        {
            tech[t_prop_name].completed = (t_completed == 1) ? true : false;
        }
        else
        {
            console.log("tech has no property: " + t_prop_name);
        }
    }
}

function SaveResourcesAndStorage()
{
    let str = "";
    const r_names = ["food", "wood", "stone", "metal", "money", "knowl", "hap", "pop"];
    for(let i = 0; i < r_names.length; i++)
    {
        str += window[r_names[i]] + sep0;
    }
    str = str.slice(0, -1);
    str += sep1;
    for(let i = 0;  i < r_names.length - 2; i++)
    {
        str += storage[i] + sep0;
    }
    str = str.slice(0, -1);
    //alert(str);
    length_all += str.length;
    SetCookie("res", str, 365);
}

function LoadResourcesAndStorage()
{
    const r_names = ["food", "wood", "stone", "metal", "money", "knowl", "hap", "pop"];
    let res_array = GetCookie("res").split(sep1);
    let ar = res_array[0].split(sep0);
    for(let i = 0; i < r_names.length; i++)
    {
        window[r_names[i]] = ar[i] * 1;
    }
    ar = res_array[1].split(sep0);
    for(let i = 0; i < r_names.length - 2; i++)
    {
        storage[i] = ar[i] * 1;
    }
    DisplayResources();
}

function SaveGatheringButtons()
{
    let str = "";
    for(let i = 0; i < 4; i++)
    {
        str += gather_base[i] + sep0;
        str += gather_replenish[i] + sep0;
        str += gather_replenish_chance[i] + sep0;
        str += gather_available_now[i] + sep0;
        str += gather_available_max[i] + sep0;
        str += gather_lucky_mult[i] + sep0;
        str += gather_lucky_chance[i];
        str += sep1;
    }
    str += special_lucky_stone + sep1;
    str += special_lucky_metal;
    //alert(str);
    length_all += str.length;
    SetCookie("gath", str, 365);
}

function LoadGatheringButtons()
{
    const gath_array = GetCookie("gath").split(sep1);
    for(let i = 0; i < 4; i++)
    {
        const gath = gath_array[i].split(sep0);
        gather_base[i] = gath[0]*1;
        gather_replenish[i] = gath[1]*1;
        gather_replenish_chance[i] = gath[2]*1;
        gather_available_now[i] = gath[3]*1;
        gather_available_max[i] = gath[4]*1;
        gather_lucky_mult[i] = gath[5]*1;
        gather_lucky_chance[i] = gath[6]*1;
    }
    special_lucky_stone = gath_array[4];
    special_lucky_metal = gath_array[5];
    console.log("specialized tools completed = "+tech["specialized_tools"].completed);
    if(tech["specialized_tools"].completed){UnlockGatherButton('stone');}
    if(bld["mine"].lvl > 0){UnlockGatherButton('metal');}
}

function SaveMenuItems()
{
    //only saves items in tech menu and bld menu, but not in city menu, because you can infer those based on bld levels
    //does not save current progress of constr projects and research projects, instead SaveOther() does that
    let str = "";
    $('#bld_menu .bld_box').each(function(index)
    {
        let id = $(this).attr("id");
        id = id.slice(4);   //removing 4 chars from id since those ids start with 'bld_'
        str += id; 
        str += sep0;
    });
    str = str.slice(0, -1);
    str += sep1;
    $('#tech_menu .tech_box').each(function(index)
    {
        let id = $(this).attr("id");
        id = id.slice(5);   //removing 5 chars from id since those ids start with 'tech_'
        str += id; 
        str += sep0;
    });
    length_all += str.length;
    SetCookie("menu", str, 365);
}

function LoadMenuItems()
{
    const mi_array = GetCookie("menu").split(sep1);
    const bld_array = mi_array[0].split(sep0);
    const tech_array = mi_array[1].split(sep0);
    for(var i = 0; i < bld_array.length; i++)
    {
        if(bld_array[i] == ""){break;}
        UnlockThing(bld[bld_array[i]], true, 0);
    }
    for(var i = 0; i < tech_array.length; i++)
    {
        if(tech_array[i] == ""){break;}
        UnlockThing(tech[tech_array[i]], false, 0);
    }
}

function SavePantheon()
{
    let str = "";
    for(let i = 0; i < panth_current.length; i++)
    {
        str += panth_current[i] + sep0;
    }
    str = str.slice(0, -1);
    length_all += str.length;
    SetCookie("panth",str,365);
}

function LoadPantheon()
{
    const panth_array = GetCookie("panth").split(sep0);
    for(let i = 0; i < panth_array.length; i++)
    {
        panth_current[i] = panth_array[i];
        if(panth_current[i] != "locked" && panth_current[i] != "empty")
        {
            $('#god_accept' + i).attr("disabled", true);
            $('#god_accept' + i).hide();
            $('#god_tab' + i + ' .god_circle').css('background-image', 'url(god_icons/god_'+ panth_current[i] +'.png)');
            $('#god_tab' + i + ' .god_name').html(gods[panth_current[i]].name);
            $('#god_tab' + i + ' .god_desc').html(gods[panth_current[i]].desc);
            $('#god_tab' + i + ' .god_left').hide();
            $('#god_tab' + i + ' .god_right').hide();
        }
        else if(panth_current[i] == "empty")
        {
            let fitting_god;
            for(let q = 0; q < fitting_gods[i].length; q++)
            {
                if(!HasValue(panth_current, fitting_gods[i][q]))
                {
                    fitting_god = fitting_gods[i][q];
                }
            }
            $('#god_tab' + i + ' .god_circle').css('background-image', 'url(god_icons/god_'+ fitting_god +'.png)');
            $('#god_tab' + i + ' .god_name').html(gods[fitting_god].name);
            $('#god_tab' + i + ' .god_desc').html(gods[fitting_god].desc);
            $('#god_accept' + i).attr("disabled", false);
        }
    }
    if(tech["pantheon"].completed){$('#pantheon_tab').show();}
}

function SaveMilitary()
{
    let str = "";
    for(let i = 0; i < 6; i++)
    {
        str += units[unit_prop_names[i]].garrison + sep0;
        str += units[unit_prop_names[i]].army1 + sep0;
        str += units[unit_prop_names[i]].army2 + sep0;
        str += units[unit_prop_names[i]].strength + sep0;
        str += units[unit_prop_names[i]].cost_money + sep0;
        str += units[unit_prop_names[i]].limit;
        str += sep1;
    }
    str += units_strength_mult;
    length_all += str.length;
    SetCookie("mili",str,365);
}

function LoadMilitary()
{
    const mili_array = GetCookie("mili").split(sep1);
    for(let i = 0; i < mili_array.length - 1; i++)
    {
        const ar = mili_array[i].split(sep0);
        units[unit_prop_names[i]].garrison = ar[0];
        units[unit_prop_names[i]].army1 = ar[1];
        units[unit_prop_names[i]].army2 = ar[2];
        units[unit_prop_names[i]].strength = ar[3];
        units[unit_prop_names[i]].cost_money = ar[4];
        units[unit_prop_names[i]].limit = ar[5];
        ChangeArmyUnits(0, unit_prop_names[i], i, 1);
        ChangeArmyUnits(0, unit_prop_names[i], i, 2);
    }
    units_strength_mult = mili_array[mili_array.length - 1];
    if(tech["military_training"].completed){$('#military_tab').show(); $('#military_tab').attr("disabled",false);}
    if(bld["barracks"].lvl > 0){$('#unit_row_wariors .unit_button').attr("disabled",false);}
    if(bld["archery_range"].lvl > 0){$('#unit_row_archers .unit_button').attr("disabled",false);}
    if(bld["stables"].lvl > 0){$('#unit_row_cavalry .unit_button').attr("disabled",false);}
    if(bld["harbor"].lvl > 0){$('#unit_row_galley .unit_button').attr("disabled",false);}
    if(bld["harbor"].lvl > 1){$('#unit_row_galleass .unit_button').attr("disabled",false);}
}

function SaveWorld()
{
    let str = "";
    for(let i = 0; i < city_states.length; i++)
    {
        str += city_states[i].name + sep0;
        str += city_states[i].index + sep0;
        str += city_states[i].relations + sep0;
        str += city_states[i].walls + sep0;
        str += city_states[i].other_defenses + sep0;
        str += city_states[i].aggression + sep0;
        str += city_states[i].economic_mindset + sep0;
        str += city_states[i].military_mindset + sep0;
        str += city_states[i].diplomatic_resistance + sep0;
        str += city_states[i].agent_propensity + sep0;
        str += city_states[i].export_res + sep0;
        str += city_states[i].import_res + sep0;
        str += city_states[i].spy_resistance + sep0;
        str += city_states[i].influence + sep0;
        str += city_states[i].units[0] + sep0;
        str += city_states[i].units[1] + sep0;
        str += city_states[i].units[2] + sep0;
        str += city_states[i].units[3] + sep0;
        str += city_states[i].units[4] + sep0;
        str += city_states[i].units[5] + sep0;
        str += city_states[i].info_lvl + sep0;
        str += city_states[i].besieged_by + sep0;
        str += (city_states[i].sea_acces) ? 1 + sep0 : 0 + sep0;
        str += (city_states[i].trade_route) ? 1 + sep0 : 0 + sep0;
        str += (city_states[i].governor) ? 1 + sep0 : 0 + sep0;
        str += (city_states[i].conquered) ? 1 + sep0 : 0 + sep0;
        str += city_states[i].distance + sep0;
        str += city_states[i].size_lvl;
        str += sep1;
    }
    str = str.slice(0, -1);
    str += sep2;

    for(let i = 0; i < map_tiles.length; i++)
    {
        str += map_tiles[i].coord[0] + sep0;
        str += map_tiles[i].coord[1] + sep0;
        str += (map_tiles[i].is_land) ? 1 + sep0 : 0 + sep0;
        str += (map_tiles[i].our_city) ? 1 + sep0 : 0 + sep0;
        str += (map_tiles[i].other_city) ? 1 + sep0 : 0 + sep0;
        str += (map_tiles[i].visible) ? 1 : 0;
        str += sep1;
    }
    str = str.slice(0, -1);
    str += sep2;

    str += trade_route_mult + sep0;
    str += trade_route_money_mult + sep0;
    str += (spying[0]) ? 1 + sep0 : 0 + sep0;
    str += (spying[1]) ? 1 + sep0 : 0 + sep0;
    str += (spying[2]) ? 1 + sep0 : 0 + sep0;
    str += (spying[3]) ? 1 + sep0 : 0 + sep0;
    str += (spying_unlocked) ? 1 + sep0 : 0 + sep0;
    str += spying_left[0] + sep0;
    str += spying_left[1] + sep0;
    str += spying_left[2] + sep0;
    str += spying_left[3] + sep0;
    str += spying_chance_mult + sep0;
    str += (diplomacy[0]) ? 1 + sep0 : 0 + sep0;
    str += (diplomacy[1]) ? 1 + sep0 : 0 + sep0;
    str += (diplomacy[2]) ? 1 + sep0 : 0 + sep0;
    str += (diplomacy[3]) ? 1 + sep0 : 0 + sep0;
    str += (diplomacy_unlocked) ? 1 + sep0 : 0 + sep0;
    str += diplomacy_left[0] + sep0;
    str += diplomacy_left[1] + sep0;
    str += diplomacy_left[2] + sep0;
    str += diplomacy_left[3] + sep0;
    str += diplomacy_chance_mult + sep0;
    str += invasion[0] + sep0;
    str += invasion[1] + sep0;
    str += invasion[2] + sep0;
    str += invasion[3] + sep0;
    str += invasion_left[0] + sep0;
    str += invasion_left[1] + sep0;
    str += invasion_left[2] + sep0;
    str += invasion_left[3] + sep0;
    str += max_trade_routes;

    length_all += str.length;
    SetCookie("world",str,365);
}

function LoadWorld()
{
    const world_array = GetCookie("world").split(sep2); //yields 3 strings
    const cs_array = world_array[0].split(sep1); //yields 4 strings
    const map_array = world_array[1].split(sep1); //yields 64 strings
    const utility_array = world_array[2];
    //city states part
    for(let i = 0; i < cs_array.length; i++)
    {
        const ar = cs_array[i].split(sep0);
        const cs = new CityState();
        cs.name= ar[0];
        cs.index= ar[1];
        cs.relations= ar[2];
        cs.walls = ar[3];
        cs.other_defenses = ar[4];
        cs.aggression = ar[5];
        cs.economic_mindset = ar[6];
        cs.military_mindset = ar[7]; 
        cs.diplomatic_resistance = ar[8];
        cs.agent_propensity = ar[9];
        cs.export_res = ar[10];
        cs.import_res = ar[11];          
        cs.spy_resistance = ar[12];
        cs.influence = ar[13];
        cs.units=[ ar[14], ar[15], ar[16], ar[17], ar[18], ar[19]];
        cs.info_lvl= ar[20];
        cs.besieged_by= ar[21]; 
        cs.sea_acces= (ar[22] == 1) ? true : false; 
        cs.trade_route=(ar[23] == 1) ? true : false; 
        cs.governor=(ar[24] == 1) ? true : false;
        cs.conquered=(ar[25] == 1) ? true : false; 
        cs.distance= ar[26];
        cs.size_lvl= ar[27];
        city_states.push(cs);
    }
    //map part
    let l = map_array.length;
    for(let i = 0; i < l; i++)
    {
        const ar = map_array[i].split(sep0);
        const tile = new MapTile([ar[0],ar[1]], (ar[2]==1)?true:false);
        tile.our_city = (ar[3]==1) ? true : false;
        tile.other_city = (ar[4]==1) ? true : false;
        tile.visible = (ar[5]==1) ? true : false;
        map_tiles.push(tile);
    }
    const ar = utility_array.split(sep0);
    trade_route_mult = ar[0];
    trade_route_money_mult = ar[1];
    spying[0] = (ar[2] == 1) ? true : false;
    spying[1] = (ar[3] == 1) ? true : false;
    spying[2] = (ar[4] == 1) ? true : false;
    spying[3] = (ar[5] == 1) ? true : false;
    spying_unlocked = (ar[6] == 1) ? true : false;
    spying_left = [ar[7], ar[8], ar[9], ar[10]];
    spying_chance_mult = ar[11];
    diplomacy[0] = (ar[12] == 1) ? true : false;
    diplomacy[1] = (ar[13] == 1) ? true : false;
    diplomacy[2] = (ar[14] == 1) ? true : false;
    diplomacy[3] = (ar[15] == 1) ? true : false;
    diplomacy_unlocked = (ar[16] == 1) ? true : false;
    diplomacy_left = [ar[17], ar[18], ar[19], ar[20]];
    diplomacy_chance_mult = ar[21];
    invasion = [ar[22], ar[23], ar[24], ar[25]];
    invasion_left = [ar[26], ar[27], ar[28], ar[29]];
    max_trade_routes = ar[30];
    if(tech["cartography"].completed){$('#world_view_tab').show();}
}

function SaveManagement()
{
    let str = "";
    //food rations
    str += rations_counter + sep0;
    str += rations + sep0;
    str += starvation_factor + sep0;
    str += pop_growth_amount.toFixed(6);
    str += sep1;
    //experiment
    str += (exp_conducting) ? 1 + sep0 : 0 + sep0;
    str += exp_amount + sep0;
    str += exp_mult + sep0;
    str += exp_cost + sep0;
    str += exp_work + sep0;
    str += exp_work_force + sep0;
    str += exp_progress;
    str += sep1;
    //taxes
    str += (tax_collecting) ? 1 + sep0 : 0 + sep0;
    str += tax_amount + sep0;
    str += tax_mult + sep0;
    str += tax_work + sep0;
    str += tax_work_force + sep0;
    str += tax_progress + sep0;
    str += tax_hap_cost;
    str += sep1;
    //holiday
    str += (holiday_announced) ? 1 + sep0 : 0 + sep0;
    str += holiday_delay_remaining + sep0;
    str += holiday_mult + sep0;
    str += holiday_establish_chance;
    str += sep1;
    //trader
    str += trader_stay_mult + sep0;
    str += trader_arrive_mult + sep0;
    str += trader_rate_mult + sep0;
    str += (trader_present) ? 1 + sep0 : 0 + sep0;
    str += trader_arrive_date + sep0;
    str += trader_leave_date + sep0;
    str += (trader_offer.sell) ? 1 + sep0 : 0 + sep0;
    str += trader_offer.resource + sep0;
    str += trader_offer.resource_amount + sep0;
    str += trader_offer.money_amount;

    length_all += str.length;
    SetCookie("manag",str,365);
}

function LoadManagement()
{
    let str = GetCookie("manag").split(sep1);
    const ar_rations = str[0].split(sep0);
    const ar_experiment = str[1].split(sep0);
    const ar_taxes = str[2].split(sep0);
    const ar_holiday = str[3].split(sep0);
    const ar_trader = str[4].split(sep0);

    rations_counter = ar_rations[0]*1;
    rations = ar_rations[1]*1;
    starvation_factor = ar_rations[2]*1;
    pop_growth_amount = ar_rations[3]*1;

    exp_conducting = (ar_experiment[0] == 1) ? true : false;
    exp_amount = ar_experiment[1];
    exp_mult = ar_experiment[2];
    exp_cost = ar_experiment[3];
    exp_work = ar_experiment[4];
    exp_work_force = ar_experiment[5];
    exp_progress = ar_experiment[6];
    
    tax_collecting = (ar_taxes[0] == 1) ? true : false;
    tax_amount = ar_taxes[1];
    tax_mult = ar_taxes[2];
    tax_work = ar_taxes[3];
    tax_work_force = ar_taxes[4];
    tax_progress = ar_taxes[5];
    tax_hap_cost = ar_taxes[6];

    holiday_announced = (ar_holiday[0] == 1) ? true : false;
    holiday_delay_remaining = ar_holiday[1];
    holiday_mult = ar_holiday[2];
    holiday_establish_chance = ar_holiday[3];

    trader_stay_mult = ar_trader[0];
    trader_arrive_mult = ar_trader[1];
    trader_rate_mult = ar_trader[2];
    trader_present = (ar_trader[3] == 1) ? true : false;
    trader_arrive_date = ar_trader[4];
    trader_leave_date = ar_trader[5];
    trader_offer.sell = (ar_trader[6] == 1) ? true : false;
    trader_offer.resource = ar_trader[7];
    trader_offer.resource_amount = ar_trader[8];
    trader_offer.money_amount = ar_trader[9];

    UpdateRationsText();
}

function SaveSettings()
{
    let str = "";
}

function LoadSettings()
{

}

function SaveOther()
{   
    //order:
    //build_force | all constr[:] | constr_slots | constr_now | all constr_progress[:] |
    //research_force | research | research_progress |
    //all profit[:] | all profit_global_multi[:] | day | year
    let str = "";
    str += build_force + sep1;
    for(let i = 0; i < constr.length; i++)
    {
        str += constr[i] + sep0;
    }
    str = str.slice(0, -1);
    str += sep1;

    str += constr_slots + sep1;
    str += constr_now + sep1;
    for(let i = 0; i < constr_progress.length; i++)
    {
        str += constr_progress[i] + sep0;
    }
    str = str.slice(0, -1);
    str += sep1;

    str += research_force + sep1;
    str += research + sep1;
    str += research_progress + sep1;
    for(let i = 0; i < profit.length; i++)
    {
        str += profit[i] + sep0;
    }
    str = str.slice(0, -1);
    str += sep1;

    for(let i = 0; i < profit_global_multi.length; i++)
    {
        str += profit_global_multi[i] + sep0;
    }
    str = str.slice(0, -1);
    str += sep1;

    str += day + sep1;
    str += year;
    //alert(str);
    length_all += str.length;
    SetCookie("other", str, 365);
}

function LoadOther()
{
    const other_array = GetCookie("other").split(sep1);
    console.log("other_array.length = " + other_array.length);
    build_force = other_array[0] * 1;
    const constr_array = other_array[1].split(sep0);
    for(let i = 0; i < constr_array.length; i++)
    {
        constr[i] = constr_array[i];
    }
    constr_slots = other_array[2];
    constr_now = other_array[3];
    const constr_progress_array = other_array[4].split(sep0);
    for(let i = 0; i < constr_progress_array.length; i++)
    {
        constr_progress[i] = constr_progress_array[i]*1;
    }
    research_force = other_array[5]*1;
    research = other_array[6];
    research_progress = other_array[7]*1;
    const profit_array = other_array[8].split(sep0);
    for(let i = 0; i < profit_array.length; i++)
    {
        profit[i] = profit_array[i]*1;
    }
    const profit_global_multi_array = other_array[9].split(sep0);
    for(let i = 0; i < profit_global_multi_array.length; i++)
    {
        profit_global_multi[i] = profit_global_multi_array[i]*1;
    }
    day = Math.round(other_array[10]*1);
    year = Math.round(other_array[11]*1);

    //unlocking functionalities and loading management
    if(bld["granary"].lvl > 0 && bld["palace"].lvl > 0){$('#rations_button').attr("disabled", false);}
    if(bld["academy"].lvl > 0){$('#experiment_button').attr("disabled",false);}
    if(tech["taxation"].completed){$('#taxes_button').attr("disabled",false);}
}

//=========== end of save and load script ====================