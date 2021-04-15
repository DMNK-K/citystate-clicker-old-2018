"use strict";
//========================= RANDOM EVENTS BAD SCRIPT =======================
//this script has all the bad random events in the game

var r_events_bad = {
    animal_attack:{
        chance: 2.5,
        req: function(){return (bld['walls'].lvl < 1);},
        effect: function()
        {
            var food_theft = RChance(50);
            var killing = RChance(50);
            var animal = ["bear", "pack of wolves", "mountain lion"];
            var n_food = 0;
            var n_dead = 0;
            if(killing){n_dead = RandomInt(1, 4)}
            if(food_theft){n_food - RandomInt(0, 10);}
            pop -= n_dead;
            food -= n_food;
            if(food < 0){food = 0;}
            var msg = "";
            if(food_theft && !killing)
            {
                if(n_food > 0)
                {
                    msg = "A " + RandomPick(animal) + " was spotted stealing food from our supplies. " + n_food + " food lost.";
                }
                else
                {
                    msg = "A " + RandomPick(animal) + " was spotted near our food supplies, but nothing was lost.";
                }
                hap -= 1;
            }
            else if(!food_theft && killing)
            {
                msg = "Our citizens were attacked by a " + RandomPick(animal) + ". " + n_dead + " " + Plural2("person", n_dead) + " dead.";
                hap -= 2;
            }
            else if(food_theft && killing)
            {
                if(n_food > 0)
                {
                    msg = "A " + RandomPick(animal) + " was spotted stealing food from our supplies. ";
                    msg += "Our citizens tried to defend them, but were unsuccesful. ";
                    msg += n_food + " food lost, " + n_dead + Plural2("person", n_dead) + " died.";
                }
                else
                {
                    msg = "A " + RandomPick(animal) + " was spotted trying to steal food from our supplies. ";
                    msg += "Our citizens scared it off, but " + n_dead + " " + Plural2("person", n_dead) + " died.";
                }
                hap -= 3;
            }
            DisplayMessage(msg,1);
        }
    },

    raid:{
        chance: 1,
        req: function(){return (pop > 40);},
        effect: function()
        {
            
        }
    },

    house_collapse:{
        chance: 1,
        req: function(){return true;},
        effect: function()
        {
            var n = RandomInt(1,6);
            pop -= n;
            hap -= 3;
            DisplayMessage("A house has collapsed, "+ n + " " + Plural2("person", n) + " dead.",1);
        }
    }
}

function RollRandomEventBad()
{
    var obj;
    var req_fullfilled = false;
    for(var i = 0; i < 10; i++) //rolls it 10 times max, if still doesn't fullfill req then stop caring
    {
        obj = RandomPickProperty(r_events_bad);
        if(obj.req() == true){req_fullfilled = true; break;}
    }
    if(req_fullfilled && RChance(obj.chance))
    {
        obj.effect();
    }
}

//=========== end of random events bad script ====================