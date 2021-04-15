"use strict";
//  =========================== MANAGEMENT SCRIPT =========================
//  this script holds code relevant for functionalities in management tab
$('#experiment_button').click(function(){StartConductingExperiment();});
$('#tax_button').click(function(){StartCollectingTaxes();});
$("#rations_button").click(function(){ChangeFoodRations();});

// ============== EXPERIMENT ==================

let rations_counter = 0;
let rations = 2;
let starvation_factor = 0;
let starvation_factor_max = 5;
let pop_growth_amount = 0;
const rations_freq = 100;

function DistributeRations()
{
    rations_counter += 1;
    if(rations_counter >= rations_freq)
    {
        rations_counter = 0;
        if(rations > 0)
        {
            const food_required = GetRequiredFood(rations);
            if(food_required === 0){food_required = 1;}
            if(food >= food_required)
            {
                food -= food_required;
                starvation_factor -= 1 + rations;
                if(rations === 3 && hap < 80){hap += 1;}
                if(rations === 1 && RChance(50)){hap -= 1;}
            }
            else
            {
                const percent_satisfied = 100 * food / food_required;
                food = 0;
                if(percent_satisfied < 98)
                {
                    DisplayMessage("Not enough food to fully distribute rations.", 1);
                    starvation_factor += (1 - percent_satisfied / 100);
                    hap -= (percent_satisfied >= 40) ? 2 : 4;
                }
            }
        }
        else
        {
            DisplayMessage("Rations set to none. No food being distributed.", 1);
            starvation_factor += 1;
            hap -= 5;
        }
        starvation_factor = Clamp(starvation_factor, 0, starvation_factor_max);
        hap = Clamp(hap, 0, 100);
    }
    $('#rations_button .management_progress').css('width', Math.round(rations_counter * 100 / rations_freq) + '%');
}

function GetRequiredFood(rations_lvl)
{
    return Math.ceil((Math.sqrt(pop) * 0.25 + pop * 0.033) * rations_lvl * 0.666);
}


let exp_conducting = false;
let exp_amount = 0;
let exp_mult = 1;
let exp_cost = 20;
let exp_work = 0;
let exp_work_force = 1;
let exp_progress = 0;

function StartConductingExperiment()
{
    if(money >= exp_cost)
    {
        money -= exp_cost;
        exp_work = GetExperimentTimes()[2];
        exp_amount = GetExperimentAmounts()[2];
        DisplayResources();
        $('#experiment_button').attr("disabled", true);
        exp_conducting = true;
    }
}

function GetExperimentTimes()
{
    let array = [90, 300, 0];
    array[2] = RandomInt(array[0], array[1]);
    return array;
}

function GetExperimentAmounts()
{
    let array = [0,0,0];
    array[0] = Math.round(exp_cost * (year + 1) * Math.sqrt((hap + 50) / 200) * 0.7 * exp_mult);
    array[1] = Math.round(exp_cost * (year + 1) * Math.sqrt((hap + 50) / 200) * 1.8 * exp_mult);
    array[2] = RandomInt(array[0], array[1]);
    return array;
}

function ConductExperiment()
{
    if(exp_conducting === true)
    {
        if(exp_progress >= exp_work)
        {
            exp_progress = 0;
            exp_work = 0;
            exp_conducting = false;
            exp_cost = Math.round(exp_cost * 1.2);
            const rand = RandomInt(1, 100);
            if (rand <= 5)
            {
                //terrible outcome

            }
            else if (rand > 5 && rand <= 10)
            {
                //very good outcome
                knowl += Math.round(exp_amount * 1.5);
            }
            else if (rand > 10 && rand <= 20)
            {
                //bad outcome
                DisplayMessage("Experiment was unsuccesfull, 0 knowledge gained.",2);
            }
            else if (rand > 20 && rand <= 30)
            {
                //good outcome
                knowl += exp_amount * 2;
                DisplayMessage("Experiment was very succesfull, double knowledge gained (" + exp_amount*2 + ").", 4);
            }
            else
            {
                //normal outcome
                knowl += exp_amount;
                DisplayMessage("Experiment was succesfull, " + exp_amount + " knowledge gained.", 3);
            }
            DisplayResources();
            //and unlock button
            $('#experiment_button').attr("disabled", false);
            $("#experiment_button .management_progress").css("width", "0%");
        }
        else
        {
            const percent = Math.round(100 * exp_progress / exp_work);
            const right_border_radius = (percent > 88) ? ((100 - percent) * 0.5) + "px" : "0px";
            $("#experiment_button .management_progress").css("width", percent + "%");
            $("#experiment_button .management_progress").css("border-radius", "6px " + right_border_radius + " " + right_border_radius + " 6px");
            exp_progress += exp_work_force * (hap + 50) / 1000;
        }
    }
    else
    {
        if(money >= exp_cost)
        {
            $('#experiment_button').attr("disabled", false);
        }
        else
        {
            $('#experiment_button').attr("disabled", true);
        }
    }
}

// =============== TAXES ==============

let tax_collecting = false;
let tax_amount = 0;
let tax_mult = 1;
let tax_work = 0;
let tax_work_force = 1;
let tax_progress = 0;
let tax_hap_cost = 10;

function StartCollectingTaxes()
{
    $('#tax_button').attr("disabled", true);
    tax_work = GetTaxesTime();
    tax_amount = GetTaxesAmounts()[2];
    tax_amount *= (crime > 25) ? (-crime + 175) / 150 : 1;
    tax_collecting = true;
}

function GetTaxesTime()
{
    return Math.round(Math.sqrt(pop * 2));
}

function GetTaxesAmounts()
{
    let array = [0,0,0];
    array[0] = Math.round(Math.sqrt(pop) * tax_mult * 0.8);
    array[1] = Math.round(Math.sqrt(pop) * tax_mult * 1);
    array[2] = RandomInt(array[0], array[1]);
    return array;
}

function CollectTaxes()
{
    if(tax_collecting == true)
    {
        if(tax_progress >= tax_work)
        {
            tax_progress = 0;
            tax_work = 0;
            tax_collecting = false;
            money += tax_amount;
            hap -= tax_hap_cost;
            if(money > storage[4]){money = storage[4];}
            if(hap < 0){hap = 0;}
            DisplayMessage(tax_amount + " in taxes collected.",3);
            //and unlock button
            $('#tax_button').attr("disabled", false);
            $("#tax_button .management_progress").css("width", "0%");
        }
        else
        {
            const percent = Math.round(100 * tax_progress / tax_work);
            const right_border_radius = (percent > 88) ? ((100 - percent) * 0.5) + "px" : "0px";
            $("#tax_button .management_progress").css("width", percent + "%");
            $("#tax_button .management_progress").css("border-radius", "6px " + right_border_radius + " " + right_border_radius + " 6px");
            tax_progress += tax_work_force / 10;
        }
    }
}

// ======= HOLIDAY ==========================

let holiday_announced = false;
let holiday_delay = 10;
let holiday_delay_remaining = 0;
let holiday_mult = 1;
let holiday_establish_chance = 2;

$('#holiday_button').click(function()
{
    AnnounceHoliday();
});

function AnnounceHoliday()
{
    if(money >= GetHolidayCost())
    {
        money -= GetHolidayCost();
        holiday_announced = true;
        holiday_delay_remaining = holiday_delay;
        $('#holiday_button').attr("disabled",true);
    }
    else
    {
        DisplayMessage("Insufficient currency to announce holiday.",2);
    }
}

function HaveHoliday()
{
    if(holiday_announced && holiday_delay_remaining > 0)
    {
        holiday_delay_remaining -= 1;
    }
    else if(holiday_announced === true && holiday_delay_remaining === 0)
    {
        holiday_announced = false;
        const amount = GetHolidayAmounts()[2];
        hap += amount;
        DisplayMessage("Holiday increased happiness by " + amount + ".",4);
        $('#holiday_button').attr("disabled",false);
    }
    let percent = (holiday_delay - holiday_delay_remaining) * 100 / holiday_delay;
    if(percent === 100){percent = 0;}
    $("#holiday_button .management_progress").css("width", percent + "%");
}

function GetHolidayAmounts()
{
    let array = [0,0,0];
    array[0] = Math.round(4 * holiday_mult);
    array[1] = Math.round(10 * holiday_mult);
    array[2] = RandomInt(array[0],array[1]);
    return array;
}

function GetHolidayCost()
{
    return Math.ceil(Math.sqrt(pop) * 2);
}

// ======= FOOD RATIONS =====================

const ration_names = ['None', 'Low', 'Standard', 'High'];

function ChangeFoodRations()
{
    rations += 1;
    if(rations >= 4){rations = 0;}
}

function UpdateRationsText()
{
    $("#rations_button .management_label").html("Food Rations: " + ration_names[rations]);
    $("#rations_button .management_details div p").first().html("Rations: " + ration_names[rations]);
    $("#rations_button .management_details div p").eq(1).html('Food required: ' + GetRequiredFood(rations));
}

// ============= TRADERS ======================
let trader_stay_mult = 1; //higher values make trader stay for longer
let trader_arrive_mult = 1; //higher values make trader appear faster after leaving
let trader_rates = [3, 2.5, 2.2, 1.2]; //how much stuff 1 money gets you
let trader_rate_mult = 1; //how good trade rate is, higher values = better for player
let trader_present = false;
let trader_arrive_date = RandomInt(270, 290);
let trader_leave_date;
let trader_offer ={
    sell:true,
    resource:0,
    resource_amount:0,
    money_amount:0
}

function TraderArrive()
{
    if(day === trader_arrive_date && !trader_present)
    {
        const trader_stay = 40; //how many days a trader stays on average        
        const trader_stay_variance = 25; //by how many percent trader_stay can vary
        const trader_price_variance = 10; //by how many percent prices vary     
        trader_present = true;
        trader_leave_date = day + trader_stay * trader_stay_mult * RandomFloat((1 - trader_stay_variance/100),(1 - trader_stay_variance/100));
        trader_leave_date = Math.round(trader_leave_date);
        if(trader_leave_date > 300){trader_leave_date -= 300;}
        trader_offer.sell = RChance(50);
        trader_offer.money_amount = 5 * RandomInt(2,6);
        trader_offer.resource = RandomInt(0,3);
        trader_offer.resource_amount = trader_offer.money_amount * trader_rates[trader_offer.resource];
        trader_offer.resource_amount *= (trader_offer.sell) ? trader_rate_mult : 1 / trader_rate_mult;
        trader_offer.resource_amount *= RandomFloat(1 - trader_price_variance/100, 1 + trader_price_variance/100);
        trader_offer.resource_amount = Math.round(trader_offer.resource_amount);

        const res_names = ["food", "wood", "stone", "metal"];
        let content = (trader_offer.sell) ? 'Buy ' : 'Sell ';
        content += '<img class="trade_res_icon" src="resource_icons/icon_'+ res_names[trader_offer.resource] +'.png"/> ';
        content += trader_offer.resource_amount + ' for ';
        content += '<img class="trade_res_icon" src="resource_icons/icon_money.png/> ' + trader_offer.money_amount;
        
        $('#trade').html(content);
        $('#trade_button').attr('disabled', false);
        DisplayMessage("A trader has arrived.",4);
    }
}

function Trade()
{
    const res_names = ["food", "wood", "stone", "metal"];
    if(trader_offer.sell) //traders sells to you, he gets money
    {
        if(money >= trader_offer.money_amount)
        {
            money -= trader_offer.money_amount;
            window[res_names[trader_offer.resource]] += trader_offer.resource_amount;
            if(storage[trader_offer.resource] < window[res_names[trader_offer.resource]])
            {
                window[res_names[trader_offer.resource]] = storage[trader_offer.resource];
            }
        }
        else
        {
            DisplayMessage("Not enough currency to buy from trader.",2);
        }
    }
    else    //trader buys from you, you get money
    {
        if(window[res_names[trader_offer.resource]] >= trader_offer.resource_amount)
        {
            money += trader_offer.money_amount;
            window[res_names[trader_offer.resource]] -= trader_offer.resource_amount;
            if(money > storage[4]){money = storage[4];}
        }
        else
        {
            DisplayMessage("Not enough resources to sell to trader.",2);
        }
    }
    
}

function TraderLeave()
{
    if(trader_present && day === trader_leave_date)
    {
        const trader_arrive = 200; //how long after trader leaving another trader will appear        
        const trader_arrive_variance = 30; //by how many percent trader_arrive can vary        
        trader_present = false;
        trader_arrive_date = day + RandomFloat((1 - trader_arrive_variance/100),(1 + trader_arrive_variance/100)) * trader_arrive / trader_arrive_mult;
        trader_arrive_date = Math.round(trader_arrive_date);
        if(trader_arrive_date > 300){trader_arrive_date -= 300;}
        $('#trade_button').attr('disabled', true);
        $('#trade').html('Trader unavailable.');
    }
}

// ============= DISPLAY ======================

function UpdateManagementDetails()
{
    let str = WrapP('Rations: ' + ration_names[rations]);
    str += WrapP('Food required: ' + GetRequiredFood(rations));
    $('#rations_button .management_details div').html(str);

    str = WrapP('Est. yield: ' + GetTaxesAmounts()[0] + ' - ' + GetTaxesAmounts()[1]);
    str += WrapP('Est. time: ' + GetTaxesTime());
    $('#tax_button .management_details div').html(str);

    str = WrapP('Est. yield: ' + GetExperimentAmounts()[0] + ' - ' + GetExperimentAmounts()[1]);
    str += WrapP('Est. time: ' + GetExperimentTimes()[0] + ' - ' + GetExperimentTimes()[1]);
    str += WrapP('Cost: ' + exp_cost);
    $('#experiment_button .management_details div').html(str);
}

let timeout_management_out;

$('.management_button').mouseenter(function()
{
    let this_element = $(this);
    timeout_management_out = setTimeout(function()
    {
        this_element.find(' .management_label').fadeOut(250);
        this_element.find(' .management_details').fadeIn(350);
    }, 1000);
    
});

$('.management_button').mouseleave(function()
{
    clearTimeout(timeout_management_out);
    $(this).find(' .management_details').fadeOut(100);
    $(this).find(' .management_label').fadeIn(100);
});

//  ===================== end of management script ======================== 