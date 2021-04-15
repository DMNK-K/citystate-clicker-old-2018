"use strict";

let gather_base = [1, 1, 1, 1];             //base amounts of resource gathered via succesfull gather

let gather_replenish = [1,1,1,1];           //how many gathers get replenished at once 
let gather_replenish_chance = [20,15,15,15];//chance for replenishement of a gather

let gather_available_now = [10, 8, 5, 4];   //how many succesfull gathers are available now
let gather_available_max = [10, 8, 5, 4];   //how many succesfull gathers can be available

let gather_lucky_mult = [3,2,2,4];          //how many times more does a lucky gather give compared to normal one
let gather_lucky_chance = [0.025, 0.025, 0.025, 0.025]; //chance for a lucky gather

let special_lucky_stone = false;
let special_lucky_metal = false;

function ButtonGather(i)
{
    const r_names = ['food', 'wood', 'stone', 'metal'];
    let available_percent = Math.round(100 * gather_available_now[i] / gather_available_max[i]);
    const gather_chance = (available_percent > 35) ? available_percent : 35;
    if(RChance(gather_chance) && gather_available_now[i] > 0)
    {
        const is_lucky = RChance(gather_lucky_chance[i] * 100);
        const gather_amount = (is_lucky) ? gather_base[i] * gather_lucky_mult[i] : gather_base[i];
        if(gather_amount > gather_available_now[i] && !is_lucky)
        {
            gather_amount = gather_available_now[i];
        }
        gather_available_now[i] -= (is_lucky) ? gather_base[i] : gather_amount;
        if(gather_available_now[i] < 0){gather_available_now[i] = 0;}
        window[r_names[i]] += gather_amount;
        if(window[r_names[i]] > storage[i])
        {
            window[r_names[i]] = storage[i]
        }
        available_percent = Math.round(100 * gather_available_now[i] / gather_available_max[i]);
        $('#' + r_names[i] + '_button .g_amount').css('width', available_percent * 0.6 + '%');
        DisplayResources();
    }
}

function ButtonGatherReplenish()
{
    const r_names = ['food', 'wood', 'stone', 'metal'];
    for (let i = 0; i < gather_base.length; i++)
    {
        let available_percent = Math.round(100 * gather_available_now[i] / gather_available_max[i]);
        const chance = (available_percent > 50) ? gather_replenish_chance[i] : gather_replenish_chance[i] + 20;
        if(RChance(chance) && gather_available_now[i] < gather_available_max[i])
        {
            gather_available_now[i] += gather_replenish[i];
            if(gather_available_now[i] > gather_available_max[i])
            {
                gather_available_now[i] = gather_available_max[i];
            }
        }
        available_percent = Math.round(100 * gather_available_now[i] / gather_available_max[i]);
        $('#' + r_names[i] + '_button .g_amount').css('width', available_percent * 0.6 + '%');
    }
}

function InitiateGatherButtons()
{
    $('#food_button').click(function () {
        ButtonGather(0);
        PlaySound("audio_food" + RandomInt(0,3));
    });

    $('#wood_button').click(function () {
        ButtonGather(1);
        PlaySound("audio_wood" + RandomInt(0, 2));
    });

    $('#stone_button').click(function () {
        ButtonGather(2);
        PlaySound("audio_stone" + RandomInt(0, 3));
    });

    $('#metal_button').click(function () {
        ButtonGather(3);
        PlaySound("audio_metal" + RandomInt(0, 3));
    });
}

function UnlockGatherButton(resource)
{
    $('#' + resource + '_button').attr('disabled', false);
    console.log(resource);
}