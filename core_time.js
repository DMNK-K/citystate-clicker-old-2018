"use strict";
//===========================  CORE OF THE GAME'S TIME MANAGEMENT  =============================|

var fast_clock_interval = setInterval(FastClock, 100);
var slow_clock_interval = setInterval(SlowClock, 1000);

var day_ticks = 0;
var day_ticks_for_change = 4;
var day = 0;
var days_in_year = 300;
var year = 1;

//main clock of the game, runs at 10 Hz
function FastClock()
{
    Calendar();
    for (let i = 0; i < constr.length; i++)
    {
        ActiveBuild(i);
    }
    ActiveResearch();
    PassiveEffectsFast();
    DisplayDebug('#debug_window');
    ResourceProfit();
    DistributeRations();
    ConductExperiment();
    CollectTaxes();
    HappinessProcess();
    GameOverCheck();
    DisplayResources();  
}

//secondary clock of the game, runs at 1 Hz
//used mostly for rand events, population changes, happines and some slow processes like plague
function SlowClock()
{
    PassiveEffectsSlow();
    ProcessCityStates();
    RollRandomEventBad();
    RollRandomEventGood();
    DemographicProcess();
    CheckPopulationLevel();
    HygineProcess();
    HaveHoliday();
    TraderArrive();
    TraderLeave();
    ButtonGatherReplenish();
    NarrationMood();
    UpdateManagementDetails();
    DisplayResources();
}

function Calendar()
{
    day_ticks += 1;
    if(day_ticks >= day_ticks_for_change)
    {
        day_ticks = 0;
        day += 1;
        if (day > days_in_year)
        {
            day = 1; year += 1;
            DevelopCityStates();
            DisplayMessage("Year " + year + " has begun, population: " + pop + ".", 0);
        }
        $("#time_box").html('Day ' + day + ' of year ' + year + '.');
        if(day % 60 === 0)
        {
            SaveGame();
        }
    }
}
