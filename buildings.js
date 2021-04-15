"use strict";
//  ============================== BUILDINGS SCRIPT =============================
//  this script stores all building objects inside a bld object

const bld ={
    granary: {
        name: "Granary",
        lvl: 0,
        cost_wood: [20, 70, 120, 0, 0],
        cost_stone: [0, 0, 40, 150, 350],
        cost_metal: [0, 0, 0, 0, 20],
        work: [50, 75, 100, 100, 100],
        effect: [50, 100, 250, 500, 500],
        on_complete: function(){
            storage[0] += this.effect[this.lvl];
            if(bld["palace"].lvl > 0){$('#rations_button').attr("disabled",false);}
        },
        req: [],
        desc: "Increases food storage capacity.",
        det: function(for_lvl)
        {
            var amount = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect[i];
            }
            return 'Provides ' + amount + ' food storage.';
        },
        img_pos:[57,65]
    },

    farmland:{
        name: "Farmland",
        lvl: 0,
        cost_food: [15, 25, 50, 80, 100],
        cost_wood: [0, 10, 25, 45, 100],
        cost_stone: [0, 0, 0, 15, 15],
        work: [100, 150, 225, 300, 300],
        effect: [0.02, 0.03, 0.05, 0.075, 0.1],
        mult: 1,
        passive_fast: function(){if(this.lvl==0){return;}profit[0] += this.effect[this.lvl-1] * this.mult;},
        req: [],
        desc: "Provides a constant supply of food.",
        det: function(for_lvl){return 'Provides ' + (this.effect[for_lvl-1]*10).toFixed(2) + ' food per day.';},
        img_pos:"special"
    },

    library:{
        name:"Library",
        lvl:0,
        cost_stone:[10,25,50,100,150],
        cost_wood:[30,50,0,0,0],
        cost_money:[0,0,20,50,75],
        cost_knowl:[0,0,20,35,50],
        work:[100,150,225,300,450],
        effect:[1, 1.5, 1.5, 2, 2],         //knowledge
        effect2:[5, 5, 7, 7, 10],   //chance
        effect3:[10, 10, 10, 20, 25],   //storage increase
        mult: 1,
        req:["writing"],
        on_complete: function(){storage[5] += this.effect3[this.lvl];},
        passive_slow: function()
        {
            if(this.lvl==0){return;}
            profit[5] += (RChance(this.effect2[this.lvl-1])) ? this.effect[this.lvl-1] * this.mult : 0;
        },
        desc: "Unlocks new research, provides a slow, slightly random flow of knowledge and increases knowledge storage.",
        det: function(for_lvl)
        {
            var amount = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect3[i];
            }
            return this.effect2[for_lvl-1].toFixed(3).substring(0,4) + '% chance for +'+ this.effect[for_lvl-1].toFixed(1) +' knowledge every day. Provides ' + amount + ' knowledge storage.';
        },
        img_pos:[44,42]
    },

    walls:{
        name:"Walls",
        lvl:0,
        cost_stone:[0,0,75,150,300],
        cost_wood:[75,150,50,50,50],
        cost_metal:[0,0,0,25,25],
        work:[600,900,1500,2500,3600],
        req:["lumberjack_camp_1"],
        desc: "Protect against outside threats.",
        det: function(for_lvl)
        {
            var what = ['primitive', 'low level', 'moderate', 'high level and enemy', 'sophisticated'];
            return 'Protection against ' + what[for_lvl-1] + ' threats.';
        },
        img_pos:"special"
    },

    temple:{
        name:"Temple",
        lvl:0,
        cost_stone:[20,50,90,150,250],
        cost_metal:[0,0,20,30,40],
        cost_money:[0,10,50,200,300],
        work:[200,350,600,900,1500],
        effect:[0.05, 0.07, 0.10, 0.15, 0.15],
        mult: 1,
        mult2: 1,
        counter: 0,
        on_complete:function(){UnlockNewPantheonSlot();},
        passive_slow: function()
        {
            if(this.lvl==0){return;}
            hap += (hap < 75) ? this.effect[this.lvl-1] * this.mult : this.effect[this.lvl-1] * this.mult * 0.5;
            if(tech["ritual_sacrifice"].completed)
            {
                this.counter += 1;
                if(this.counter >= 120)
                {
                    this.counter = 0;
                    var h = 5 * this.mult2;
                    if(tech["symbolic_sacrifice"].completed)
                    {
                        var n = Math.ceil(Math.sqrt(pop));
                        if(food > money)
                        {
                            if(food >= n * 2)
                            {
                                food -= n;
                                hap += h;
                                DisplayMessage(n + " food sacrificed at the temple. "+h+" happiness gained.")
                            }
                        }
                        else
                        {
                            if(money >= n * 2)
                            {
                                money -= n;
                                hap += h;
                                DisplayMessage(n + " currency sacrificed at the temple. "+h+" happiness gained.")
                            }
                        }
                    }
                    else
                    {
                        var n = Math.ceil(pop * ((pop >= 200) ? 0.01 : 0.02));
                        pop -= n;
                        hap += 5;
                        DisplayMessage(n + " " + Plural2("person",n) + " sacrificed at the temple. "+h+"happiness gained.",2);
                    }
                }
            }
        },
        req:["myth_and_legend"],
        desc: "Increases happiness and unlocks pantheon slots.",
        det: function(for_lvl)
        {
            return '+' + this.effect[for_lvl-1].toFixed(2) + ' happiness per day, if happiness is below 75. Half the effect otherwise. New pantheon slot.';
        },
        img_pos:[25,28]
    },

    quarry:{
        name:"Quarry",
        lvl:0,
        cost_wood:[25,60,120,200,200],
        cost_metal:[0,5,10,40,75],
        work:[300,500,900,1500,1500],
        effect: [0.01, 0.02, 0.05, 0.075, 0.1],
        mult: 1,
        passive_fast: function(){if(this.lvl==0){return;}profit[2] += this.effect[this.lvl-1] * this.mult;},
        req:["stonework"],
        desc: "Provides a constant supply of stone.",
        det: function(for_lvl){return 'Provides ' + (this.effect[for_lvl-1]*10).toFixed(2) + ' stone per day.';},
        img_pos:[0,0]
    },

    lumberjack_camp:{
        name:"Lumberjack Camp",
        lvl:0,
        cost_wood:[15,35,75,140,140],
        cost_metal:[0,0,15,40,80],
        work:[75,150,450,450,450],
        effect: [0.02, 0.03, 0.05, 0.075, 0.1],
        mult: 1,
        passive_fast: function(){if(this.lvl==0){return;}profit[1] += this.effect[this.lvl-1] * this.mult;},
        req:["specialized_tools"],
        desc: "Provides a constant supply of wood.",
        det: function(for_lvl){return 'Provides ' + (this.effect[for_lvl-1]*10).toFixed(2) + ' wood per day.';},
        img_pos:[8.5,15]
    },

    warehouse:{
        name:"Warehouse",
        lvl:0,
        cost_wood:[30,90,200,0,0],
        cost_stone:[0,0,75,225,300],
        cost_metal:[0,0,25,100,200],
        work:[90,180,300,425,600],
        effect: [50, 100, 250, 500, 500],
        on_complete: function()
        {
            storage[1] += this.effect[this.lvl];
            storage[2] += this.effect[this.lvl];
            storage[3] += this.effect[this.lvl];
        },        
        req:["wheel"],
        desc:"Increases storage capacity for wood, stone and metal.",
        det: function(for_lvl){
            var amount = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect[i];
            }
            return 'Provides ' + amount + " wood, stone and metal storage.";
        },
        img_pos:[58,35]
    },

    roads:{
        name:"Roads",
        lvl:0,
        cost_wood:[5,10,0,0,0],
        cost_stone:[0,40,150,300,300],
        cost_metal:[0,0,0,20,50],
        cost_money:[0,0,50,100,100],
        work:[300,500,900,1500,1500],
        effect: [0.02, 0.02, 0.02, 0.02, 0.02],
        req:["wheel"],
        desc:"Increases influx of food, wood, stone, metal and currency from all sources, except manual gathering, by a small amount.",
        det: function(for_lvl){
            var amount = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect[i];
            }
            amount = Math.round(amount * 100);
            return 'Increases influx of all basic resources from all sources, except manual gathering, by ' + amount + '%.';
        },
        img_pos:"special"
    },

    palace:{
        name:"Palace",
        lvl:0,
        cost_wood:[25, 0, 0],
        cost_stone:[0,100, 400],
        cost_metal:[0,0,20],
        cost_money:[0,50,300],
        work:[175, 1500, 2400],
        req:[],
        on_complete:function(){if(bld["granary"].lvl > 0){$('#rations_button').attr("disabled",false);}},
        desc: "Required for unlocking many management options. Unlocks research.",
        det:function(for_lvl)
        {
            switch(for_lvl)
            {
                case 1: return 'Allows research. Unlocks food ration management, if granary is present.';
                break;
                case 2: return 'Required for taxation.';
                break;
                case 3: return 'Required for diplomacy and spying.';
                break;
            }     
        },
        img_pos:[0,0]
    },

    mine:{
        name: "Mine",
        lvl: 0,
        cost_wood: [40, 130, 200, 200, 200],
        cost_metal: [0, 0, 0, 15, 15],
        cost_knowl: [0,0,0,30,60],
        work: [100, 150, 225, 300, 300],
        effect: [0.01, 0.02, 0.03, 0.04, 0.05],
        mult: 1,
        passive_fast: function(){if(this.lvl==0){return;}profit[0] += this.effect[this.lvl-1] * this.mult;},
        on_complete:function(){$('#metal_button').attr("disabled",false);},
        req: ["tunneling"],
        desc: "Provides a constant supply of metal. Unlocks manual metal gathering.",
        det: function(for_lvl){return 'Provides ' + this.effect[for_lvl-1]*10 + ' metal per day.';},
        img_pos:[52,28]
    },

    watermill:{
        name:"Watermill",
        lvl:0,
        cost_wood:[30, 60, 0],
        cost_stone:[10,20, 75],
        cost_metal:[5,20,40],
        cost_knowl:[0,0,15],
        effect:[0.25,0,0],
        effect2:[0.2, 0.2, 0.2],
        on_complete:function()
        {
            bld["farmland"].mult += this.effect[this.lvl];
            bld["lumberjack_camp"].mult += this.effect2[this.lvl];
        },
        work:[300, 450, 800],
        req:["farmland_2", "lumberjack_camp_2", "simple_engineering"],
        desc: "Increases effectivness of farmland and lumberjack camp.",
        det:function(for_lvl)
        {
            let amount = 0;
            let amount2 = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect[i];
                amount2 += this.effect2[i];
            }
            amount = Math.round(amount * 100);
            amount2 = Math.round(amount2 * 100);
            return 'Provides ' + amount + '% increased farmland food yield and ' + amount2 + '% increased lumberjack camp wood yield.';
        },
        img_pos:[0,0]
    },

    dungeons:{
        name:"Dungeons",
        lvl:0,
        cost_stone:[50,110, 175],
        cost_metal:[5,25,50],
        cost_money:[0,15,15],
        work:[400, 600, 800],
        req:["law", "palace_2"],
        desc: "Decreases crime in the city.",
        det:function(){return"";},
        img_pos:'none'
    },

    treasury:{
        name:"Treasury",
        lvl:0,
        cost_stone:[65,145,220],
        cost_metal:[0,25,50],
        cost_money:[0,25,65],
        work:[250, 300, 360],
        req:["currency"],
        effect:[100,150,250],
        on_complete:function(){storage[4] += this.effect[this.lvl];},
        desc: "Increases currency storage.",
        det:function(for_lvl)
        {
            var amount = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect[i];
            }
            return 'Provides ' + amount + ' currency storage.';
        },
        img_pos:[52,22]
    },

    marketplace:{
        name:"Marketplace",
        lvl:0,
        cost_wood:[40,80,120,30,30],
        cost_stone:[0,10,50,160,180],
        cost_money:[0,0,0,40,75],
        work:[275,350,450,725,725],
        effect:[0.02, 0.03, 0.05, 0.075, 0.1],
        mult:1,
        req:["treasury_1"],
        passive_fast: function(){if(this.lvl==0){return;}profit[4] += this.effect[this.lvl-1] * this.mult * hap / 100;},
        desc: "Provides a steady influx of currency, dependent on happiness levels.",
        det:function(for_lvl)
        {
            return 'Provides ' + (this.effect[for_lvl-1]*10).toFixed(2) + ' currency per day at maximum happiness and proportionally less at lower happiness.';
        },
        img_pos:[52,40]
    },

    aqueduct:{
        name:"Aqueduct",
        lvl:0,
        cost_stone:[150,250,300],
        cost_metal:[40,75,95],
        cost_money:[0,0,100],
        cost_knowl:[10,10,0],
        work:[1200,1500,1800],
        effect:[0.5, 1, 2.5],
        mult:1,
        req:["arches"],
        passive_slow:function(){hygine_gain += this.effect[this.lvl-1] * this.mult;},
        desc: "Increases hygine levels in the city.",
        det:function(){return "Increases hygine levels in the city.";},
        img_pos:"special"
    },

    pasture:{
        name: "Pasture",
        lvl: 0,
        cost_food: [65, 90, 120, 150, 250],
        cost_wood: [65, 90, 120, 175, 200],
        work: [200, 300, 450, 600, 600],
        effect: [0.02, 0.03, 0.05, 0.075, 0.1],
        mult: 1,
        passive_fast: function(){if(this.lvl==0){return;}profit[0] += this.effect[this.lvl-1] * this.mult;},
        req: ["food_preservation"],
        desc: "Provides a constant supply of food.",
        det: function(for_lvl){return 'Provides ' + (this.effect[for_lvl-1]*10).toFixed(2) + ' food per day.';}
    },

    academy:{
        name:"Academy",
        lvl:0,
        cost_wood:[40,80,80,80,80],
        cost_stone:[80,100,140,200,250],
        cost_money:[0,0,0,60,95],
        work:[275,350,450,725,725],
        effect:[0, 0, 0.3, 0, 0.3],
        effect2:[0, 0.2, 0, 0.2, 0],
        effect3:[0, 0.01, 0.01, 0.02, 0.02],
        passive_fast:function(){if(this.lvl==0){return;}profit[5] += this.effect3[this.lvl-1] * this.mult * bld["library"].lvl;},
        on_complete:function(){
            $('#button_experiment').attr("disabled", false);
            exp_mult += this.effect[this.lvl];
            exp_work_force += this.effect2[this.lvl];
        },
        mult:1,
        req:["concrete", "library_3"],
        desc:"Unlocks and improves experiments. Provides a reliable flow of knowledge based on library level. Increases research force.",
        det:function(for_lvl){
            if(for_lvl == 1){return "Unlocks experiments.";}
            var amount = 0;
            var str = "Provides " + (this.effect3[for_lvl-1]*10) + " knowledge per day for every library level.";
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect[i];
            }
            amount *= 100;
            str += (amount > 0) ? " Increases experiment yield by " + amount + "%." : "";
            amount = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect2[i];
            }
            str += (amount > 0) ? " Provides " + amount + " research force." : "";
            return str;
        },
        img_pos:[0,0]
    },

    docks:{
        name: "Docks",
        lvl: 0,
        cost_wood: [110, 205, 350, 300,0],
        cost_stone: [0, 0, 25, 75, 150],
        cost_metal: [0, 0, 0, 25, 105],
        work: [425, 660, 825, 1200, 1500],
        effect: [0.05, 0.075, 0.1, 0.15, 0.2],
        mult: 1,
        passive_fast: function(){if(this.lvl==0){return;}profit[0] += this.effect[this.lvl-1] * this.mult;},
        req: ["sailing", "farmland_3"],
        desc: "Provides a constant supply of food.",
        det: function(for_lvl){return 'Provides ' + (this.effect[for_lvl-1]*10).toFixed(2) + ' food per day.';},
        img_pos:"special"
    },

    lighthouse:{
        name: "Lighthouse",
        lvl: 0,
        cost_stone: [175, 220, 400],
        cost_metal: [40, 110, 200],
        cost_knowl: [0,25,50],
        work:[450,1200,3300],
        effect:[0.2, 0.3, 0.5],
        on_complete:function(){bld["docks"].mult += this.effect[this.lvl];},
        req:["optics", "docks_2"],
        desc: "Improves the output of docks.",
        det:function(for_lvl){
            var amount = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect[i];
            }
            amount = Math.round(amount * 100);
            return 'Improves the output of docks by ' + amount + '%.';
        },
        img_pos:[79,10]
    },

    lumber_mill:{
        name: "Lumber Mill",
        lvl: 0,
        cost_stone: [0, 200, 225],
        cost_wood: [175, 0, 0],
        cost_metal: [50,70,90],
        work:[450,900,1750],
        effect:[0.15, 0.15, 0.2],
        on_complete:function(){bld["lumberjack_camp"].mult += this.effect[this.lvl];},
        req:["carpentry", "lumberjack_camp_2", "simple_engineering"],
        desc: "Improves the output of lumberjack camp.",
        det:function(for_lvl){
            var amount = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect[i];
            }
            amount = Math.round(amount * 100);
            return 'Improves the output of lumberjack camp by ' + amount + '%.';
        },
        img_pos:[79,10]
    },

    mint:{
        name: "Mint",
        lvl: 0,
        cost_stone: [200, 200, 250, 250, 300],
        cost_metal: [40,50,60,70,80],
        work:[800,1200,1300,1400,1500],
        effect: [0.01, 0.02, 0.03, 0.04, 0.05],
        effect2:[0.05,0.05,0.05,0.05,0.05],
        mult:1,
        on_complete:function(){trader_rate_mult -= this.effect2[this.lvl];},
        passive_fast: function(){if(this.lvl==0){return;}profit[4] += this.effect[this.lvl-1] * this.mult;},
        req:["minting", "treasury_1"],
        desc: "Provides a steady flow of currency, but makes trade deals less favourable.",
        det:function(for_lvl){
            var amount = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount += this.effect2[i];
            }
            amount = Math.round(amount * 100);
            return 'Provides ' + (this.effect[for_lvl-1]*10).toFixed(2) + ' currency per day. Trade deals ' + amount + '% less favourable.';
        },
        img_pos:[79,10]
    },

    forester_lodge:{
        name: "Forester Lodge",
        lvl: 0,
        cost_wood: [95, 110, 150, 150, 150],
        cost_currency: [20,50,80,80,80],
        work:[400,800,1200,1300,1400],
        effect:[2, 2, 2, 2, 2],
        effect2:[0,5,0,5,0],
        on_complete:function(){},
        req:["land_knowledge", "lumberjack_camp_3"],
        desc: "Improves manual wood gathering.",
        det:function(for_lvl){
            var amount1 = 0;
            var amount2 = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount1 += this.effect[i];
                amount2 += this.effect2[i];
            }
            return 'Provides ' + amount1 + ' additional wood to gathering source and ' + amount2 + '% additional regenerate chance.';
        },
        img_pos:[79,10]
    },

    herbalist_workshop:{
        name: "Herbalist Workshop",
        lvl: 0,
        cost_stone: [80, 100, 120],
        cost_wood: [120, 120, 120],
        cost_knowl: [20,30,40],
        work:[500,1000,1250],
        effect:[0.1,0.1,0.1],
        on_complete:function(){plague_mitgate_power += this.effect[this.lvl];},
        req:["herbal_medicine"],
        desc: "Mitigates plague spread.",
        det:function(for_lvl){return "Mitigates plague spread.";},
        img_pos:[0,0]
    },

    barracks:{
        name: "Barracks",
        lvl: 0,
        cost_stone: [175, 200, 325],
        cost_metal: [35, 75, 120],
        cost_money: [0,25,50],
        work:[450,1200,3300],
        effect:[0,2,3],
        effect2:[0,25,25],
        on_complete:function(){
            $('#unit_row_wariors .unit_button').attr("disabled",false);
            units["warriors"].strength += this.effect[this.lvl];
            units["warriors"].limit += this.effect2[this.lvl];
        },
        req:["military_training"],
        desc: "Unlocks warriors unit, improves its strength and increases its limit.",
        det:function(for_lvl)
        {
            if(for_lvl == 1){return "Unlocks warrior unit.";}
            var amount1 = 0;
            var amount2 = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount1 += this.effect[i];
                amount2 += this.effect2[i];
            }
            return "Increases warrior's strength by " + amount1 + " and their limit by " + amount2 + ".";
        },
        img_pos:[0,0]
    },

    archery_range:{
        name: "Archery Range",
        lvl: 0,
        cost_stone: [175, 200, 325],
        cost_wood: [35, 75, 120],
        cost_money: [0,25,50],
        work:[450,1200,3300],
        effect:[0,2,3],
        effect2:[0,25,25],
        on_complete:function(){
            $('#unit_row_archers .unit_button').attr("disabled",false);
            units["archers"].strength += this.effect[this.lvl];
            units["archers"].limit += this.effect2[this.lvl];
        },
        req:["archery", "military_training"],
        desc: "Unlocks archers unit, improves its strength and increases its limit.",
        det:function(for_lvl)
        {
            if(for_lvl == 1){return "Unlocks archers unit.";}
            var amount1 = 0;
            var amount2 = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount1 += this.effect[i];
                amount2 += this.effect2[i];
            }
            return "Increases archers' strength by " + amount1 + " and their limit by " + amount2 + ".";
        },
        img_pos:[0,0]
    },

    stables:{
        name: "Stables",
        lvl: 0,
        cost_stone: [120, 240, 300],
        cost_metal: [20, 40, 60],
        cost_food: [100,100,100],
        work:[450,1200,3300],
        effect:[0,2,3],
        effect2:[0,25,25],
        on_complete:function(){
            $('#unit_row_cavalry .unit_button').attr("disabled",false);
            units["cavalry"].strength += this.effect[this.lvl];
            units["cavalry"].limit += this.effect2[this.lvl];
        },
        req:["horseback_riding", "military_training"],
        desc: "Unlocks cavalry unit, improves its strength and increases its limit.",
        det:function(for_lvl)
        {
            if(for_lvl == 1){return "Unlocks cavalry unit.";}
            var amount1 = 0;
            var amount2 = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount1 += this.effect[i];
                amount2 += this.effect2[i];
            }
            return "Increases cavalry's strength by " + amount1 + " and its limit by " + amount2 + ".";
        },
        img_pos:[0,0]
    },

    siege_workshop:{
        name: "Siege Workshop",
        lvl: 0,
        cost_stone: [120, 240, 300],
        cost_metal: [100, 140, 180],
        cost_wood: [70,70,70],
        work:[450,1200,3300],
        effect:[0,2,3],
        effect2:[0,25,25],
        on_complete:function(){
            $('#unit_row_siege_engine .unit_button').attr("disabled",false);
            units["siege_engine"].strength += this.effect[this.lvl];
            units["siege_engine"].limit += this.effect2[this.lvl];
        },
        req:["military_engineering", "military_training"],
        desc: "Unlocks siege engine unit, improves its strength and increases its limit.",
        det:function(for_lvl)
        {
            if(for_lvl == 1){return "Unlocks siege engine unit.";}
            var amount1 = 0;
            var amount2 = 0;
            for(var i = 0; i < for_lvl; i++)
            {
                amount1 += this.effect[i];
                amount2 += this.effect2[i];
            }
            return "Increases siege engines' strength by " + amount1 + " and their limit by " + amount2 + ".";
        },
        img_pos:[0,0]
    },

    harbor:{
        name: "Harbor",
        lvl: 0,
        cost_wood: [300, 420, 550],
        cost_metal: [50, 125, 225],
        work:[450,750,1400],
        effect:[0,2,3],
        effect2:[0,0,5],
        effect3:[0,5,5],
        on_complete:function(){
            $('#unit_row_galley .unit_button').attr("disabled",false);
            units["galley"].strength += this.effect[this.lvl];
            units["galleass"].strength += this.effect2[this.lvl];
            units["galley"].limit += this.effect3[this.lvl];
            units["galleass"].limit += this.effect3[this.lvl];
        },
        req:["military_training", "docks_2"],
        desc: "Unlocks military ship units, improves their strength and increases their limits.",
        img_pos:"special"
    }


}

//  =================== end of building script =====================