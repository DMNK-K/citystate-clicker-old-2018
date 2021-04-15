"use strict";
//  ================================ PANTHEON SCRIPT ===============================
//  this script holds functions for pantheon handling

const gods = {
    eola:{
        name:"Eola",
        for_slots:[0,1,2],
        locked:false,
        effect:function()
        {
            if(day == 50){
                profit_global_multi[0] += 0.1;
                gather_lucky_chance[0] += 0.025;
            }
            else if(day == 150){
                profit_global_multi[0] -= 0.1;
                gather_lucky_chance[0] -= 0.025;
            }
        },
        desc:"Between days 50 and 150 +10% food from all sources, except manual gathering. During that time +2.5% chance for lucky food manual gathers."
    },
    tertencoth:{
        name:"Tertencoth",
        for_slots:[0,1,2],
        locked:false,
        on_adopt:function(){plague_ticks_max -= 40;},                
        desc:"Maximum duration of a plague is reduced by 40 days."
    },
    quoqlea:{
        name:"Quoqlea",
        for_slots:[0,1,2],
        locked:false,
        on_adopt:function(){gather_available_max[1] += 3;},        
        desc:"You are able to manually gather wood for longer (+3 possible gathers)."        
    },
    urlux:{
        name:"Urlux",
        for_slots:[1,2,3],
        locked:false,
        desc:"50% more happiness from temple sacrifice."
    },
    nousoo:{
        name:"Nousoo",
        for_slots:[1,2,3],
        locked:false,
        effect:function()
        {
            if(RChance(0.3))
            {
                knowl += 25;
                if(knowl > storage[5]){knowl = storage[5];}
            }
        },
        desc:"Every day there is a 0.3% chance for +25 knowledge."
    },
    timhea:{
        name:"Timhea",
        for_slots:[1,2,3],
        locked:false,
        below_last_time:false,
        effect:function()
        {
            if(!this.below_last_time && hap < 33)
            {
                build_force += 5;
                research_force += 2;
            }
            else if(this.below_last_time && hap >= 33)
            {
                build_force -= 5;
                research_force -= 2;
            }
            if(hap < 33){this.below_last_time = true;}
            else{this.below_last_time = false;}
        },
        desc:"+5 build force and +2 research force when happiness is below 33."
    },
    leluvec:{
        name:"Leluvec",
        for_slots:[2,3,4],
        locked:false,
        desc:"Triple the chance for a holiday to become an annual holiday. Holidays cost 30% less."
    },
    voovez:{
        name:"Voovez",
        for_slots:[2,3,4],
        locked:false,
        on_adopt:function(){profit_global_multi[2] += 0.15;},
        desc:"Stone from all sources, except manual gathering, +10%."
    },
    bleptecepl:{
        name:"Bleptecepl",
        for_slots:[2,3,4],
        locked:false,
        on_adopt:function(){build_force += 2;},
        desc:"+2 build force."
    },
    //gods that are locked by default
    chilltectec:{
        name:"Chilltectec",
        for_slots:[0,1,2],
        locked:true,
    },
    zaeewabah:{
        name:"Zaeewabah",
        for_slots:[1,2,3],
        locked:true,
    },
    boozabarax:{
        name:"Boozabarax",
        for_slots:[2,3,4],
        locked:true,
    },
    coltaxupeteq:{
        name:"Coltaxupetet",
        for_slots:[0,1,2],
        locked:true,
    },
    myrva:{
        name:"Myrva",
        for_slots:[1,2,3],
        locked:true,
    },
    aeshel:{
        name:"Aeshel",
        for_slots:[2,3,4],
        locked:true,
    },
    oxonebayool:{
        name:"Oxonebayool",
        for_slots:[0,1,2],
        locked:true,
    }
};

let panth_current = ["locked", "locked", "locked", "locked", "locked"];
let fitting_gods = [];

for(let i = 0; i < panth_current.length; i++)
{
    fitting_gods.push(GetPropNamesOfGodsForSlot(i));
}

function UnlockNewPantheonSlot()
{
    if(panth_current[panth_current.length-1] != "locked"){DebugLog("Trying to unlock a pantheon slot when all are unlocked, how did this happen?"); return;}  //this shouldnt happen
    let new_slot = panth_current.indexOf("locked");
    if(new_slot === -1) {DebugLog("Invalid new pantheon slot."); return;}
    else
    {
        panth_current[new_slot] = "empty";
    }

    //picking first god that fits to display as first option
    let fitting_god;
    for(let i = 0; i < fitting_gods[new_slot].length; i++)
    {
        if(!HasValue(panth_current, fitting_gods[new_slot][i]))
        {
            fitting_god = fitting_gods[new_slot][i];
            break;
        }
    }
    $('#god_tab' + new_slot + ' .god_circle').css('background-image', 'url(god_icons/god_'+ fitting_god +'.png)');
    $('#god_tab' + new_slot + ' .god_name').html(gods[fitting_god].name);
    $('#god_tab' + new_slot + ' .god_desc').html(gods[fitting_god].desc);
    $('#god_accept' + new_slot).attr("disabled", false);
}

function BrowseGods(direction, slot)
{
    if(panth_current[slot] == "locked"){return;}
    let prop_name_of_current = $('#god_tab' + slot + ' .god_name').html();
    prop_name_of_current = StrToLowerAndSpacesToUnderscores(prop_name_of_current);
    const index_of_current = fitting_gods[slot].indexOf(prop_name_of_current);
    let index_of_desired = index_of_current;
    let starting_i = index_of_current + Polar(direction);
    starting_i = WrapAround(starting_i, 0, fitting_gods[slot].length - 1);

    for(let i = starting_i; i != index_of_current;) //change of i inside loop
    {
        if(!HasValue(panth_current, fitting_gods[slot][i]))
        {
            index_of_desired = i;
            break;
        }
        i += Polar(direction);
        i = WrapAround(i, 0, fitting_gods[slot].length - 1);
    }
    DebugLog("index_of_current = " + index_of_current + " starting_i = " + starting_i);

    const prop_name_of_desired = fitting_gods[slot][index_of_desired];
    $('#god_tab' + slot + ' .god_circle').css('background-image', 'url(god_icons/god_'+ prop_name_of_desired +'.png)');
    $('#god_tab' + slot + ' .god_name').html(gods[prop_name_of_desired].name);
    $('#god_tab' + slot + ' .god_desc').html(gods[prop_name_of_desired].desc);
}

function PickGod(slot)
{
    const name = $('#god_tab' + slot + ' .god_name').html();
    panth_current[slot] = StrToLowerAndSpacesToUnderscores(name);
    $('#god_tab' + slot + ' .god_left').hide();
    $('#god_tab' + slot + ' .god_right').hide();
    $('#god_accept' + slot).attr("disabled", true);
    $('#god_accept' + slot).hide();
    DisplayMessage("Our citizens have started worshiping " + name + ".",3);
}

$('#pantheon_tab').click(function()
{
    $('#city_view').hide();
    $('#world_view').hide();
    $('#military_view').hide();
    $('#pantheon_view').show();
});
$('.god_right').click(function()
{
    let slot = $(this).parent().attr("id");
    slot = slot.slice(-1);
    BrowseGods(true, slot);
});
$('.god_left').click(function()
{
    let slot = $(this).parent().attr("id");
    slot = slot.slice(-1);
    BrowseGods(false, slot);
});
$('.god_accept').click(function()
{
    let slot = $(this).attr("id").slice(-1);
    PickGod(slot);
});

function GetPropNamesOfGodsForSlot(slot)
{
    let array = [];
    for(let g in gods)
    {
        if(gods[g].locked === false && HasValue(gods[g].for_slots, slot))
        {

            const prop_name = StrToLowerAndSpacesToUnderscores(gods[g].name);
            array.push(prop_name);
        }
    }
    return array;
}

//  ================= end of pantheon script ================