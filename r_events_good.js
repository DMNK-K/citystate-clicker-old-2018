"use strict";
//========================= RANDOM EVENTS GOOD SCRIPT =======================
//this script has all the good random events in the game
var r_events_good = {
    eureka:{
        chance: 3,
        req: function(){return (bld["library"].lvl < 3);},
        effect: function()
        {
            var n = RandomInt(2,4);
            if(knowl + n > storage[5]){n = storage[5] - knowl;}
            if(n == 0){return;}
            knowl += n;
            if(RChance(50) && bld["palace"].lvl > 0)
            {
                DisplayMessage("One of the citizens came to the palace to share new ideas, +" + n + " knowledge." ,4);
            }
            else
            {
                DisplayMessage("A wiseman was spotted lecturing on the streets, +" + n + " knowledge." ,4);
            }
        }
    },

    join:{
        chance: 1.1,
        req: function(){return (pop < 100);},
        effect: function()
        {
            var n = RandomInt(3,10);
            pop += n;
            DisplayMessage("Travelers come from distand lands, "+ n + " " + Plural2("person", n) + " join the city.",4);
        }
    },

    explore_tile:{
        chance:1,
        req: function(){return tech["cartography"].completed;},
        effect: function(){ExploreTile();}
    },

    explore_tile_exploration:{
        chance:1.5,
        req:function(){return tech["exploration"].completed;},
        effect: function(){ExploreTile();}
    }
}

function RollRandomEventGood()
{
    var obj;
    var req_fullfilled = false;
    for(var i = 0; i < 10; i++) //rolls it 10 times max, if still doesn't fullfill req then stop caring
    {
        obj = RandomPickProperty(r_events_good);
        if(obj.req() == true){req_fullfilled = true; break;}
    }
    if(req_fullfilled && RChance(obj.chance))
    {
        obj.effect();
    }
}

//=========== end of random events good script ====================