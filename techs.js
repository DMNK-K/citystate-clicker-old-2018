"use strict";
//  ========================== TECH SCRIPT ========================
//  this script holds all tech objects inside an object called tech

const tech ={
    specialized_tools:{
        name:"Specialized Tools",
        cost_knowl: 3,
        work: 20,
        completed: false,
        on_complete: function(){UnlockGatherButton('stone');},
        req:["palace_1"],
        desc: "Unlocks stonework, screw pump and wheel technologies, the lumberjack camp building and enables stone gathering."
    },

    stonework:{
        name:"Stonework",
        cost_knowl: 5,
        work: 45,
        completed: false,
        req:["specialized_tools"],
        desc: "Unlocks quarry. Required for craftsmanship."
    },

    currency: {
        name: "Currency",
        cost_knowl: 10,
        work: 60,
        completed: false,
        req: ["library_1"],
        desc: "Unlocks the treasury."
    },

    wheel: {
        name: "Wheel",
        cost_knowl: 4,
        work: 60,
        completed: false,
        req: ["specialized_tools"],
        desc: "Unlocks roads and warehouse. Required for many technologies. Also, it's the wheel."
    },

    land_knowledge:{
        name:"Land Knowledge",
        cost_knowl: 8,
        work: 30,
        completed: false,
        on_complete: function(){},
        req: ["library_1"],
        desc: "Higher chance of success for manual resource gathering. Gathering stone now has a chance of yielding metal. Required for tunneling and exploration."
    },

    craftsmanship:{
        name: "Craftsmanship",
        cost_knowl: 9,
        work: 60,
        completed: false,
        on_complete: function(){build_force += 1;},
        req: ["stonework", "lumberjack_camp_1", "wheel"],
        desc: "+1 to build force (increases building and upgrading speed). Required for many technologies."
    },

    archery:{
        name: "Archery",
        cost_knowl: 12,
        work: 80,
        completed: false,
        on_complete: function(){gather_available_max[0] += 3;},
        req: ["craftsmanship"],
        desc: "Increases max amount of food available for manual gathering by 3. Required for archery range."
    },

    sailing:{
        name: "Sailing",
        cost_knowl: 19,
        work: 60,
        completed: false,
        req: ["simple_engineering"],
        desc: "Unlocks docks."
    },

    optics:{
        name: "Optics",
        cost_knowl: 30,
        work: 90,
        completed: false,
        on_complete: function(){research_force += 0.2;},
        req: ["craftsmanship", "library_3"],
        desc: "Required to build lighthouse. +0.2 research force (increases research speed)."
    },

    simple_engineering:{
        name: "Simple Engineering",
        cost_knowl: 15,
        work: 75,
        completed: false,
        req: ["craftsmanship", "library_3"],
        desc: "Unlocks watermill."
    },

    concrete:{
        name: "Concrete",
        cost_knowl: 16,
        work: 60,
        completed: false,
        req: ["craftsmanship", "land_knowledge"],
        desc: "Required to build academy."
    },

    carpentry:{
        name: "Carpentry",
        cost_knowl: 9,
        work: 50,
        completed: false,
        req: ["craftsmanship", "lumberjack_camp_1"],
        desc: "Required to build lumber mill."
    },

    cranes:{
        name: "Cranes",
        cost_knowl: 17,
        cost_money: 5,
        work: 40,
        completed: false,
        on_complete: function(){build_force += 1;},
        req: ["simple_engineering"],
        desc: "+1 to build force (increases building and upgrading speed)."
    },

    masonry:{
        name: "Masonry",
        cost_knowl: 20,
        work: 75,
        completed: false,
        on_complete: function(){constr[1] = "empty"; constr_slots += 1;},
        req: ["craftsmanship", "quarry_1"],
        desc: "Adds a construction slot (enables more simultaneous construction projects). Unlocks arches."
    },

    screw_pump:{
        name:"Screw Pump",
        cost_knowl: 10,
        work: 45,
        completed: false,
        req: ["library_1", "specialized_tools"],
        desc: "Required for researching irigation and tunneling."
    },

    irigation:{
        name: "Irigation",
        cost_knowl: 15,
        work: 60,
        completed: false,
        on_complete: function(){bld["farmland"].mult += 0.5;},
        req: ["library_1", "farmland_2", "screw_pump"],
        desc: "Increases yields of farmland by 50%."
    },

    writing: {
        name: "Writing",
        cost_knowl: 7,
        work: 45,
        completed: false,
        req: ["palace_1"],
        desc: "Unlocks library."
    },

    alphabet:{
        name: "Alphabet",
        cost_knowl: 11,
        work: 70,
        completed: false,
        on_complete: function(){storage[5] += 15;},
        req: ["library_2"],
        desc: "+15 knowledge storage."
    },

    myth_and_legend:{
        name: "Myth and Legend",
        cost_knowl: 10,
        work: 30,
        completed: false,
        req: ["palace_1"],
        desc: "Unlocks temple."
    },

    pantheon:{
        name: "Pantheon",
        cost_knowl: 15,
        work: 45,
        completed: false,
        on_complete:function(){$('#pantheon_tab').show();},
        req: ["temple_1"],
        desc: "Unlocks pantheon window."
    },

    food_preservation:{
        name: "Food Preservation",
        cost_knowl: 15,
        work: 60,
        completed: false,
        on_complete: function(){storage[0] += 500;},
        req: ["library_1", "granary_3", "farmland_2", "herbal_medicine"],
        desc: "+500 food storage. Unlocks pasture."
    },

    ceremonial_burial:{
        name: "Ceremonial Burial",
        cost_knowl: 10,
        work: 30,
        completed: false,
        on_complete: function(){bld["temple"].mult += 0.15;},
        req: ["temple_1"],
        desc: "Increases temple's happiness impact by 15%."
    },

    ritual_sacrifice:{
        name: "Ritual Sacrifice",
        cost_knowl: 8,
        work: 30,
        completed: false,
        req: ["temple_2", "ceremonial_burial"],
        desc: "Temples increase happiness even more for the cost of population."
    },

    symbolic_sacrifice:{
        name: "Symbolic Sacrifice",
        cost_knowl: 8,
        work: 45,
        completed: false,
        req: ["temple_3", "ritual_sacrifice", "treasury_1", "granary_2"],
        desc: "Temple sacrifices no longer use population, but food, or currency, whatever is more plentiful."
    },

    law:{
        name: "Law",
        cost_knowl: 20,
        work: 45,
        completed: false,
        req: ["alphabet"],
        desc: "Unlocks dungeons and is required for researching taxation."
    },

    taxation:{
        name: "Taxation",
        cost_knowl: 10,
        work: 20,
        completed: false,
        on_complete: function(){},
        req: ["law", "treasury_1"],
        desc: "Required for tax collection."
    },

    arches:{
        name: "Arches",
        cost_knowl: 10,
        work: 20,
        completed: false,
        req: ["masonry"],
        desc: "Unlocks aqueduct."
    },

    herbal_medicine:{
        name: "Herbal Medicine",
        cost_knowl: 27,
        work: 80,
        completed: false,
        req: ["granary_2", "library_2"],
        desc: "Unlocks herbalist workshop."
    },

    draft_animals:{
        name: "Draft Animals",
        cost_knowl: 12,
        work: 30,
        completed: false,
        on_complete: function(){bld["farmland"].mult += 0.25; bld["quarry"].mult += 0.25;},
        req: ["farmland_2", "palace_1", "pasture_2"],
        desc: "Increases effectivness of farmland and quarry by 25%."
    },

    horseback_riding:{
        name: "Horseback Riding",
        cost_knowl: 13,
        work: 30,
        completed: false,
        req: ["draft_animals", "pasture_3"],
        desc: "Required for stables."
    },

    tunneling:{
        name: "Tunneling",
        cost_knowl: 25,
        work: 60,
        completed: false,
        req: ["craftsmanship", "screw_pump", "land_knowledge"],
        desc: "Unlocks mine."
    },

    smelting:{
        name: "Smelting",
        cost_knowl: 30,
        work: 95,
        completed: false,
        req: ["craftsmanship", "mine_2"],
        desc: "Increases yields of mine by 20%."
    },

    minting:{
        name: "Minting",
        cost_knowl: 15,
        work: 30,
        completed: false,
        req: ["treasury_1", "mine_1"],
        desc: "Unlocks mint."
    },

    mathematics:{
        name: "Mathematics",
        cost_knowl: 50,
        work: 200,
        completed: false,
        req: ["academy_1", "alphabet"],
        on_complete:function(){tax_mult += 0.1; research_force += 0.1;},
        desc: "Tax revenue +10%. Research force +0.1 (increased research speed). Required for many technologies."
    },

    logic:{
        name: "Logic",
        cost_knowl: 60,
        work: 220,
        completed: false,
        req: ["mathematics"],
        on_complete:function(){research_force += 0.2;},
        desc: "Research force +0.2 (increased research speed)."
    },

    philosophy:{
        name: "Phisolophy",
        cost_knowl: 55,
        work: 220,
        completed: false,
        req: ["logic"],
        on_complete:function(){storage[5] += 20;},
        desc: "Knowledge storage +20."
    },

    military_training:{
        name: "Military Training",
        cost_knowl: 30,
        work: 95,
        completed: false,
        on_complete:function(){$('#military_tab').show();},
        req: ["academy_1", "law"],
        desc: "Unlocks military tab. Required for barracks and archery range."
    },

    cartography:{
        name: "Cartography",
        cost_knowl: 31,
        work: 90,
        completed: false,
        on_complete:function(){$('#world_view_tab').show();},
        req: ["land_knowledge", "library_4"],
        desc: "Unlocks world view tab. Scouts will slowly explore new tiles."
    },

    exploration:{
        name: "Exploration",
        cost_knowl: 15,
        work: 70,
        completed: false,
        req: ["sailing", "cartography"],
        desc: "New terrain is discovered quicker."
    },

    astronomy:{
        name: "Astronomy",
        cost_knowl: 45,
        work: 120,
        completed: false,
        req: ["optics", "academy_2"],
        desc: "Unlocks observatory."
    },

    astronavigation:{
        name: "Astronavigation",
        cost_knowl: 55,
        work: 160,
        completed: false,
        req: ["sailing", "cartography", "astronomy", "mathematics"],
        desc: "Unlocks port."
    },

    calendar:{
        name:"Calendar",
        cost_knowl: 38,
        work: 105,
        completed: false,
        on_complete:function(){profit_global_multi[0] += 0.05; tax_mult += 0.1;},
        req: ["astronomy"],
        desc: "Improves food yield from all sources, except manual gathering, by 5%. Increases tax yield by 10%."
    },

    plantations:{
        name:"Plantations",
        cost_knowl: 45,
        work: 90,
        completed: false,
        req: ["farmland_5", "calendar"],
        desc: "Unlocks orchard."
    },

    military_engineering:{
        name:"Military Engineering",
        cost_knowl: 90,
        work: 135,
        completed: false,
        req: ["military_training", "academy_2", "barracks_1", "simple_engineering"],
        desc: "Unlocks siege workshop."
    },




    alchemy:{
        name:"Alchemy",
        cost_knowl: 130,
        work: 400,
        completed: false,
        req: ["academy_4"],
        desc: "Unlocks gunpowder."
    },

    gunpowder:{
        name:"Gunpowder",
        cost_knowl: 200,
        work: 900,
        completed: false,
        on_complete:function(){WinCheck();},
        req: ["academy_5", "alchemy"],
        desc: "Achieves victory."
    }
}

//  ================= end of tech script ===================