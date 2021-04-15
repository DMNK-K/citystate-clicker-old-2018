"use strict";
//===========================  FUNCTIONS FOR FAST CLOCK  =============================|

function ActiveBuild(what_slot)
{
    if(constr[what_slot] != "empty" && constr[what_slot] != "locked")
    {
        //division by 10 because 10 ticks of fast clock per second
        constr_progress[what_slot] += build_force / constr_now / 10;
        if(constr_progress[what_slot] >= bld[constr[what_slot]].work[bld[constr[what_slot]].lvl])
        {
            //building process completed
            DisplayMessage("Construction of " + bld[constr[what_slot]].name.toLowerCase() + " completed.", 3);    
            if(bld[constr[what_slot]].hasOwnProperty("on_complete"))
            {
                //apply the on_build effect of the building (important that it happens before raising the lvl)
                bld[constr[what_slot]].on_complete();  
            }
            if(bld[constr[what_slot]].lvl === 0)
            {
                //remove this bld from building menu and add to city menu
                $("#bld_" + constr[what_slot]).remove();
                UnlockThing(bld[constr[what_slot]], true, 1);
            }
            else
            {
                //update the display of this bld in city menu
                UpdateCityMenu(constr[what_slot]);
            }
            constr_progress[what_slot] = 0;         //reset progress for future constructions
            constr_now -= 1;                        //decrease amount of ongoing constructions (since this one is finished)
            bld[constr[what_slot]].lvl += 1;        //increase bld level  
            UpdateCityView(constr[what_slot]);
            PropellUnlocks(bld[constr[what_slot]]); //find things that have this newly built building in their requirements
            constr[what_slot] = "empty";            //empty the slot for future constructions
        }
        else
        {
            let percent = (constr_progress[what_slot] / bld[constr[what_slot]].work[bld[constr[what_slot]].lvl]);
            percent = Math.round(percent * 100);
            $("#bld_"+constr[what_slot] + " .progress_bar .progress_percent").html(percent + "%");
            $("#bld_"+constr[what_slot] + " .progress_bar .progress_indicator").css("width", percent + "%");
        }
    }
}

function ActiveResearch()
{
    if(research != "none")
    {
        research_progress += research_force / 10;
        if(research_progress >= tech[research].work)
        {
            //research completed
            DisplayMessage("Our great thinkers have uncovered the secrets of " + tech[research].name.toLowerCase() + ".", 3);
            if(tech[research].hasOwnProperty("on_complete"))
            {
                tech[research].on_complete();
            }
            $("#tech_" + research).remove();
            research_progress = 0;
            tech[research].completed = true;
            PropellUnlocks(tech[research]);
            research = "none";
        }
        else
        {
            let percent = (research_progress / tech[research].work);
            percent = Math.round(percent * 100);
            $("#tech_" + research + " .progress_bar .progress_percent").html(percent + "%");
            $("#tech_" + research + " .progress_bar .progress_indicator").css("width", percent + "%");
        }
    }
}

function PassiveEffectsFast()
{
    for(let b in bld)
    {
        const obj = bld[b];
        if(obj.hasOwnProperty("passive_fast"))
        {
            obj.passive_fast();
        }
    }
    for(let t in tech)
    {
        const obj = tech[t];
        if(obj.hasOwnProperty("passive_fast"))
        {
            obj.passive_fast();
        }
    }
}

function ResourceProfit()
{
    const c_names = ['food','wood','stone','metal','money','knowl'];
    for(let i = 0; i < profit.length; i++)
    {
        if(profit[i] >= 1)
        {
            if(i === 3 || i === 4)    //metal and money profits are modified by crime levels
            {
                window[c_names[i]] += Math.round(Math.floor(profit[i]) * profit_global_multi[i] * crime_resource_mult);
            }
            else
            {
                window[c_names[i]] += Math.round(Math.floor(profit[i]) * profit_global_multi[i]);
            } 
            profit[i] -= Math.floor(profit[i]);
            if(window[c_names[i]] > storage[i])
            {
                window[c_names[i]] = storage[i];
            }
        }
    }
}

function HappinessProcess()
{
    //gravity effect
    if (hap > 50) { hap -= 0.01; }
    else if (hap < 50) { hap += 0.01; }
    //capping
    hap = Clamp(hap, 0, 100);
    //emoticon icon change
    if (hap >= 75) { $('#res_icon_hap').attr('src', 'resource_icons/icon_happ4.png'); }
    else if (hap >= 50) { $('#res_icon_hap').attr('src', 'resource_icons/icon_happ3.png'); }
    else if (hap >= 25) { $('#res_icon_hap').attr('src', 'resource_icons/icon_happ2.png'); }
    else { $('#res_icon_hap').attr('src', 'resource_icons/icon_happ1.png'); }
}

function GameOverCheck()
{
    if (pop <= 0)
    {
        pop = 0;
        clearInterval(fast_clock_interval);
        clearInterval(slow_clock_interval);
        $('#gameover_scrn').fadeIn(150);
        save_blocked = true;
        DeleteSave();
    }
}

function DisplayResources()
{
    $('#res_pop').html(pop);
    $('#res_hap').html(Math.round(hap) + "%");

    $('#res_food').html(food);
    $('#res_wood').html(wood);
    $('#res_stone').html(stone);
    $('#res_metal').html(metal);
    $('#res_money').html(money);
    $('#res_knowl').html(knowl);
}