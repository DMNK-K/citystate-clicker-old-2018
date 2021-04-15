"use strict";
//===========================  FUNCTIONS FOR SLOW CLOCK  =============================|

function CheckPopulationLevel()
{
    const l = pop_thresholds.length;
    for(let i = 0; i < l; i++)
    {
        if(pop >= pop_thresholds[i] && pop_lvl - 1 == i)
        {
            pop_lvl += 1;
            DisplayMessage("Our city has reached " + pop_thresholds[i] + " population.",0);
            $('#cvimg_houses').attr("src", "city_view/houses_" + (pop_lvl-1) + ".png");
        }
    }
}

function PassiveEffectsSlow()
{
    for(let b in bld)
    {
        const obj = bld[b];
        if(obj.hasOwnProperty("passive_slow"))
        {
            obj.passive_slow();
        }
    }
    for(let t in tech)
    {
        const obj = tech[t];
        if(obj.hasOwnProperty("passive_slow"))
        {
            obj.passive_slow();
        }
    }
    for(let i = 0; i < panth_current.length; i++)
    {
        if(panth_current[i] != "empty" && panth_current[i] != "locked" && gods[panth_current[i]].hasOwnProperty("effect"))
        {
            gods[panth_current[i]].effect();
        }
    }
}

function DemographicProcess()
{
    if(starvation_factor <= 0.5)
    {
        //don't be weirded out by those low numbers, it's a daily rate, not annual
        let pop_growth_rate = (rations > 1) ? 0.002 : 0.001;
        pop_growth_rate += (hap >= 75) ? 0.0005 : 0;
        const rand0 = RandomFloat(pop_growth_rate/2, pop_growth_rate);
        pop_growth_amount += pop * rand0;
        const pop_increase = Math.floor(pop_growth_amount);
        if(pop_increase >= 1)
        {
            pop_growth_amount -= pop_increase;
            pop += pop_increase;
        }           
    }

    const starve_treshhold = 1.2;
    if (starvation_factor >= starve_treshhold)
    {
        //oh no, people die of starvation, i guess it's your
        //._____________.
        //|      |      |
        //|  |   |  |l  |
        //|=============|
        //|      |      |
        //|  ||  |  |_  |
        //===============

        const rand1 = RandomInt(3, 4);
        const rand2 = RandomFloat(0.05, 0.25);
        pop -= Math.round(pop * (starvation_factor - starve_treshhold) / 100) + Math.round(Math.pow(pop, 1/rand1) * rand2 + 2 * starvation_factor * Math.pow(rand2, 2));
    }
}

let hygine = 75;
let hygine_gain = 0;
let hygine_loss = 0;
let hygine_gain_mult = 1;
let hygine_loss_mult = 1;
let hygine_hap_benefit = 0.1;
let hygine_hap_benefit_mult = 1;
let hygine_hap_loss = 0.15;
const hygine_pop_thresh = 200;

function HygineProcess()
{   
    if(pop >= hygine_pop_thresh){hygine_loss += (Math.floor(pop/50) - 3) / 10;}
    console.log("hygine="+hygine + " hygine_gain="+hygine_gain+" hygine_loss="+hygine_loss);
    hygine += hygine_gain * hygine_gain_mult - hygine_loss * hygine_loss_mult;
    hygine_gain = 0;
    hygine_loss = 0;
    hygine = Clamp(hygine, 1, 100);
    const hygine_lvl = Math.ceil(hygine/20);
    if(hygine_lvl === 1 && day % 30 === 0)
    {
        DisplayMessage("The entire city is one big gutter.",1);
    }
    else if(hygine_lvl === 2 && day % 30 === 0)
    {
        DisplayMessage("Citizens complain about how filthy the city is.", 2);
    }
    //effects on happiness
    if(hygine_lvl === 5){hap += hygine_hap_benefit * hygine_hap_benefit_mult;}
    else if(hygine_lvl < 3){hap -= hygine_hap_loss * (-hygine_lvl + 3);}
}

let plague_chance = 0;
let plague_ticks = 0;
let plague_ticks_left = 0;
let plague_ticks_min = 30;
let plague_ticks_max = 300;
let plague_now = false;
let plague_sick = 0;
let plague_dead = 0;
let plague_spread = 0.1;
let plague_healing_power = 0;
let plague_mitgate_power = 0;
let plague_max_patients = 0;

function PlagueProcess()
{
    if(hygine <= 50)
    {
        plague_chance += (51 - hygine) / 250;
    }
    else
    {
        plague_chance += (51 - hygine) / 125;
    }
    if(RChance(plague_chance) && !plague_now && pop >= 200)
    {
        plague_now = true;
        plague_ticks = RandomInt(plague_ticks_min, plague_ticks_max);
        plague_ticks_left = plague_ticks;
        plague_sick = Math.round(RandomFloat(pop/40, pop/30));  //initial spread
    }

    if(plague_now)
    {
        plague_ticks_left -= 1;
        const plague_percent = 100 - plague_ticks_left / plague_ticks;

        //spread part:
        const standard_spread = plague_sick * plague_spread * plague_percent / 100 * RandomFloat(0.9, 1.1);
        const spread_hygine_mod = (hygine >= 50) ? (-hygine + 150) / 100 : 1; //1 at 50 hygine and below, grad drops to 0.5 at 100 hygine
        const spread_mitigate_mod = 1 - plague_mitgate_power;
        plague_sick += standard_spread * spread_hygine_mod * spread_mitigate_mod;
        plague_sick = Math.round(plague_sick);

        //heal part:
        let healed = Math.round(plague_sick * plague_healing_power);
        if(healed > plague_max_patients){healed = plague_max_patients;}
        plague_sick -= healed;

        //death part:
        let dying_mult = (plague_percent - 10) / 10;
        if(dying_mult > 1){dying_mult = 1;}
        else if(dying_mult < 0){dying_mult = 0;}
        let dying = Math.round(RandomFloat(pop/40, pop/30) * dying_mult);
        if(plague_percent < 10){dying = 0;}
        if(dying > plague_sick){dying = plague_sick;}
        plague_dead += dying;
        plague_sick -= dying;
        pop -= dying;
    }

    //the plague ends when ticks run out or when plague_sick reaches 0
    if((plague_sick == 0 || plague_ticks_left == 0) && plague_now)
    {
        plague_now = false;
        plague_chance = 0;
        DisplayMessage("The plague has ended after "+ plague_ticks +" days, it claimed the lives of "+ plague_dead + " people.", 4);
    }
}

let crime = 0;  //crime makes certain r_events possible, decreases money and metal inputs and tax revenue
let crime_decrease = 0;
let crime_resource_mult = 1;
const crime_pop_thresh = 100;

function CrimeProcess()
{
    //crime grows quicker the higher the pop and the lower the hap
    let crime_increase = (pop - crime_pop_thresh) / 1000;
    crime_increase *= (-hap + 100) / 50;
    crime += (crime_increase - crime_decrease);
    crime_decrease = 0;
    crime = Clamp(crime, 0, 100);
    if(crime > 50){hap -= (crime - 50) / 100;}
    crime_resource_mult = (crime > 25) ? (-crime + 175) / 150 : 1;
}

let mood_day = RandomInt(10, 30);
let last_picked_mood = [];

function NarrationMood()
{
    if(day == mood_day)
    {
        const mood_text = [
            {
                beg: ["Ominous clouds", "Glowing constellations", "Flocks of birds"],
                mid: [" soar across the sky ", " move gracefully ", " shift "],
                end: ["in the distance.", "over the vast expanse.", "to the west.", "between the mountain peaks."]
            },
            {
                beg: ["Light breeze blows", "Wild buffallo gallop down", "Howling winds come whistling", "The sounds of nature echo"],
                mid: [" from the south", " from the hills", " from the nearby lands"],
                end: [" as the city slumbers.", " as the sun rises.", "."]
            }
        ];

        mood_day += RandomInt(90, 180);
        if(mood_day > 300){mood_day -= 300;}

        let which = RandomInt(0, mood_text.length - 1);
        let pick0 = RandomInt(0, mood_text[which].beg.length - 1);
        let pick1 = RandomInt(0, mood_text[which].mid.length - 1);
        let pick2 = RandomInt(0, mood_text[which].end.length - 1);
        if(last_picked_mood.length > 0 && last_picked_mood[3] == which)
        {
            let n_of_repeating_parts = 3;
            while(n_of_repeating_parts > 0)
            {
                n_of_repeating_parts = 0;
                pick0 = RandomInt(0, mood_text[which].beg.length - 1);
                pick1 = RandomInt(0, mood_text[which].mid.length - 1);
                pick2 = RandomInt(0, mood_text[which].end.length - 1);
                n_of_repeating_parts += (pick0 == last_picked_mood[0]) ? 1 : 0;
                n_of_repeating_parts += (pick1 == last_picked_mood[1]) ? 1 : 0;
                n_of_repeating_parts += (pick2 == last_picked_mood[2]) ? 1 : 0;
            }
        }
        last_picked_mood = [pick0, pick1, pick2, which];
        DisplayMessage(mood_text[which].beg[pick0] + mood_text[which].mid[pick1] + mood_text[which].end[pick2], 0);
    }
}