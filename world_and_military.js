"use strict";
//  ================================ WORLD AND MILITARY SCRIPT ===============================
//  this script holds functions for military and world stuff

$('#military_tab').click(function()
{
    $('#city_view').hide();
    $('#world_view').hide();
    $('#pantheon_view').hide();
    $('#military_view').show();    
});

$('#world_view_tab').click(function()
{
    $('#city_view').hide();
    $('#pantheon_view').hide();
    $('#military_view').hide();
    $('#world_view').show();    
});

let map_tiles = [];

function MapTile(coord, is_land, terrain = "flat", our_city = false, other_city = false, visible = false)
{
    this.coord = coord;
    this.is_land = is_land;
    this.terrain = terrain;
    this.our_city = our_city;
    this.other_city = other_city;
    this.visible = visible;
}

function CreateMap()
{
    const route = RandomInt(0,0);
    let tile;
    //3 routes of spliting the map into land and sea
    //0 = land west, sea east
    //1 = land south, sea north
    //2 = land north, sea south

    //map has 8 rows and 8 columns, thus 64 tiles (math.png)
    //coord vectors look the following way: [row, column], so it's actually reversed compared to standard carthesian [x,y]
    //this way, you can read tiles like text, from left to right, line by line 0,1,2,3,4,5,6,7 next line 8,9,10... etc
    let our_city_coord;
    if(route == 0)
    {
        for(var r = 0; r < 8; r++)
        {
            for(var c = 0; c < 8; c++)
            {
                tile = new MapTile([r,c], true);
                if(c >= 4){tile.is_land = false;}
                map_tiles.push(tile);
            }
        }
        our_city_coord = [RandomInt(0,7),RandomInt(2,3)];
        map_tiles[IndexByCoord(our_city_coord)].our_city = true;
        //tile to the east of our city always has to have sea
        if(our_city_coord[1] == 2)
        {
            map_tiles[IndexByCoord([our_city_coord[0], 3])].is_land = false;
        }
        //now lets place 2 city states on land, but not on coast
        let city1_coord = [RandomIntExcept(0,7,our_city_coord[0]-1, our_city_coord[0]+1),RandomInt(0,2)];
        let city2_coord = [RandomIntExcept(0,7,our_city_coord[0]-1, our_city_coord[0]+1),RandomInt(0,2)];
        //making sure those 2 new cities are not next to each other (vector [r,c] has to have at least one "2" somewhere in it)
        let vec = VectorBetweenCoords(city1_coord, city2_coord, true);
        while(vec[0] + vec[1] < 3) //if a vector has at least one 2 somewhere in it, the sum of r+c will be 3 or more
        {
            city2_coord = [RandomIntExcept(0,7,our_city_coord[0]-1, our_city_coord[0]+1),RandomInt(0,2)];
            vec = VectorBetweenCoords(city1_coord, city2_coord, true);
        }
        map_tiles[IndexByCoord(city1_coord)].other_city = true;
        map_tiles[IndexByCoord(city2_coord)].other_city = true;
        //now let's pick 2 cities at sea, and make islands
        var city3_coord = [RandomInt(0,7), RandomInt(5,7)]; //var (not let) needed for later
        var city4_coord = [RandomInt(0,7), RandomInt(5,7)]; //var (not let) needed for later
        vec = VectorBetweenCoords(city3_coord, city4_coord, true);
        while(vec[0] + vec[1] < 3) //if a vector has at least one 2 somewhere in it, the sum of r+c will be 3 or more
        {
            city4_coord = [RandomInt(0,7), RandomInt(5,7)];
            vec = VectorBetweenCoords(city3_coord, city4_coord, true);
        }
        map_tiles[IndexByCoord(city3_coord)].is_land = true;
        map_tiles[IndexByCoord(city4_coord)].is_land = true;
        map_tiles[IndexByCoord(city3_coord)].other_city = true;
        map_tiles[IndexByCoord(city4_coord)].other_city = true;
        //put 2-3 water tiles on the shoreline, to make it less artificial
        let shoreline_water = [];
        for(let i = RandomInt(0,1); i < 3; i++)
        {
            const coord = [RandomIntExcept(0,7,our_city_coord[0]-1,our_city_coord[0]+1), 3];
            shoreline_water.push(IndexByCoord(coord));
        }
        for(let i = 0; i < shoreline_water.length; i++)
        {
            let city_to_west = true;
            while(city_to_west)
            {
                if(map_tiles[shoreline_water[i]-1].other_city)
                {
                    const coord = [RandomIntExcept(0,7,our_city_coord[0]-1,our_city_coord[0]+1), 3];
                    shoreline_water[i] = IndexByCoord(coord);
                }
                else
                {
                    city_to_west = false;
                }
            }
            map_tiles[shoreline_water[i]].is_land = false;
        }
        //picking one tile in column 0 to change into water
        let lake_in_col0 = IndexByCoord([RandomInt(0,7), 0]);
        let lake_on_city = true;
        while(lake_on_city)
        {
            if(map_tiles[lake_in_col0].other_city)
            {
                lake_in_col0 = IndexByCoord([RandomInt(0,7), 0]);
            }
            else{lake_on_city = false;}
        }
        map_tiles[lake_in_col0].is_land = false;
        //picking one tile in column 4 to change into land, if there's land to the west
        let land_in_col4 = IndexByCoord([RandomInt(0,7), 4]);
        let land_to_west = false;
        let land_to_east = true;
        while(land_to_west == false || land_to_east == true)
        {
            land_in_col4 = IndexByCoord([RandomInt(0,7), 4]);
            if(map_tiles[land_in_col4 - 1].is_land){land_to_west = true;}
            else{land_to_west = false;}
            if(map_tiles[land_in_col4 + 1].is_land){land_to_east = true}
            else{land_to_east = false;}
        }
        map_tiles[land_in_col4].is_land = true;
    }
    else if(route == 1)
    {
        for(let r = 0; r < 8; r++)
        {
            for(let c = 0; c < 8; c++)
            {
                tile = {coord:[r,c], is_land:true, terrain:"flat", our_city:false, other_city:false, visible:false};
                if(r < 4){tile.is_land = false;}
                map_tiles.push(tile);
            }
        }
    }
    else if(route == 2)
    {
        for(let r = 0; r < 8; r++)
        {
            for(let c = 0; c < 8; c++)
            {
                tile = {coord:[r,c], is_land:true, terrain:"flat", our_city:false, other_city:false, visible:false};
                if(r >= 4){tile.is_land = false;}
                map_tiles.push(tile);
            }
        }
    }
    //making tiles visible around and in our city
    //| -1 | -1 | -1 |
    //| -1 | +0 | +1 |
    //----------------
    //| +0 | +0 | +0 |  <= explanation of i and q in loop,
    //| -1 | +0 | +1 |     this way we get all 9 tiles with 2 loops
    //----------------
    //| +1 | +1 | +1 |
    //| -1 | +0 | +1 |
    for(let i = -1; i < 2; i++)
    {
        for(let q = -1; q < 2; q++)
        {
            const index = IndexByCoord([our_city_coord[0] + i, our_city_coord[1] + q]);
            if(index >= 0 && index < 64)
            {
                map_tiles[index].visible = true;
            }
            DebugLog("["+(our_city_coord[0] + i) + ", " + (our_city_coord[1] + q) + "]");    
        }
    }
    //assigning indexes to all 4 city states in city_states array
    for(let i = 0, q = 0; i < map_tiles.length; i++)
    {
        if(map_tiles[i].other_city)
        {
            city_states[q].index = i;
            const vec = VectorBetweenCoords(CoordByIndex(i),our_city_coord,true);
            city_states[q].distance = vec[0] + vec[1]; //it's not real vector distance
            if(i == IndexByCoord(city3_coord) || i == IndexByCoord(city4_coord))
            {
                city_states[q].sea_acces = true;
            }
            q++;
        }
    }
}

function PopulateWorldMap()
{
    for(let i = 0; i < map_tiles.length; i++)
    {
        $('#world_map').append('<div class="map_tile" id="map_tile'+i+'"></div>');
    }
}

function UpdateMapDisplay()
{
    const color_unseen = "rgba(30,30,38,1)";
    const color_sea = "rgba(45,56,80,1)";
    const color_flat = "rgba(50,200,90,1)";
    const l = map_tiles.length;
    for(let i = 0; i < l; i++)
    {
        if(map_tiles[i].visible == false)
        {
            $('#map_tile' + i).css("background-color", color_unseen);
        }
        else
        {
            if(map_tiles[i].is_land)
            {
                $('#map_tile' + i).css("background-color", color_flat);
            }
            else
            {
                $('#map_tile' + i).css("background-color", color_sea);
            }

            if(map_tiles[i].our_city)
            {
                $('#map_tile'+ i).addClass("map_tile_city_our");
                $('#map_tile' + i).html('<div class="map_marker_city"></div>')
            }
            else if(map_tiles[i].other_city)
            {
                $('#map_tile' + i).addClass("map_tile_city_other");
                $('#map_tile' + i).html('<div class="map_marker_city"></div>')
                $('#map_tile' + i).unbind("click");
                $('#map_tile' + i).click(function()
                {
                    var index = $(this).attr("id");
                    index = (index.length == 10) ? index.slice(-2) : index.slice(-1);
                    LookAtCity(index);
                });
            }
        }
    }
}

function IndexByCoord(coord_array)
{
    const index = coord_array[0] * 8 + coord_array[1]; //row * 8 + column
    return index;
}

function CoordByIndex(index)
{
    const coord = [Math.floor(index/8), index % 8];
    return coord;
}

function VectorBetweenCoords(coord1, coord2, abs = false)
{
    if(abs){
        return [Math.abs(coord2[0]-coord1[0]), Math.abs(coord2[1]-coord1[1])];
    }
    else{
        return [coord2[0] - coord1[0], coord2[1] - coord1[1]];        
    }
}

function ExploreTile()
{
    let visible_tiles = [];
    for(let i = 0; i < map_tiles.length; i++)
    {
        if(map_tiles[i].visible){visible_tiles.push(i);}
    }
    //alert(visible_tiles);
    if(visible_tiles.length == map_tiles.length){return;} //no more to explore
    let tile_from_which_explore = RandomPick(visible_tiles);
    let has_unexplored_neighbours = false;
    let unexplored_neighbours_array = [];
    while(has_unexplored_neighbours == false)
    {
        unexplored_neighbours_array = [];
        if(tile_from_which_explore-8 >= 0 && map_tiles[tile_from_which_explore-8].visible == false)
        {
            has_unexplored_neighbours = true;
            unexplored_neighbours_array.push(tile_from_which_explore-8);
        }
        if(tile_from_which_explore+8 < 64 && map_tiles[tile_from_which_explore+8].visible == false)
        {
            has_unexplored_neighbours = true;
            unexplored_neighbours_array.push(tile_from_which_explore+8);
        }
        if(tile_from_which_explore-1 >= 0 && map_tiles[tile_from_which_explore-1].visible == false && !(tile_from_which_explore % 8 === 0))
        {
            has_unexplored_neighbours = true;
            unexplored_neighbours_array.push(tile_from_which_explore-1);
        }
        if(tile_from_which_explore+1 < 64 && map_tiles[tile_from_which_explore+1].visible == false && !((tile_from_which_explore+1) % 8 === 0))
        {
            has_unexplored_neighbours = true;
            unexplored_neighbours_array.push(tile_from_which_explore+1);
        }
        if(has_unexplored_neighbours == false){tile_from_which_explore = RandomPick(visible_tiles);}
    }
    map_tiles[RandomPick(unexplored_neighbours_array)].visible = true;
    UpdateMapDisplay();
}

const city_state_names_0 = ["Ten","Ne","Ruo","Tec","Aes","Vast","By"];
const city_state_names_1 = ["rer","qec","water","peak"];
const city_state_names_2 = ["um","ville","town","","s",""];
const city_state_relations = ["Hostile", "Bad", "Neutral", "Good", "Friendly"];

let city_states = [];

function CityState()
{
    this.name = RandomPick(city_state_names_0) + RandomPick(city_state_names_1) + RandomPick(city_state_names_2);
    this.index = 0;
    // 1-20     hostile
    // 21-40    bad
    // 41-60    neutral
    // 61-80    good
    // 81-100   friendly
    this.relations = (this.index <= 1) ? 10 : 65; //hostile for 2, good for 2
    this.relations_name = function(){return city_state_relations[Math.floor((this.relations-1)/20)];};
    this.walls = 0;
    this.other_defenses = 0;
    this.defense_strength = function(){return this.walls * 5 + this.other_defenses * 10;};
    this.aggression = RandomInt(1,3);              //how often wants to attack
    this.economic_mindset = RandomInt(1,3);        //how much it's focused on economy
    this.military_mindset = RandomInt(1,3);        //how much it's focused on making units 
    this.diplomatic_resistance = RandomInt(1,3);   //how much it resists player dyplomatic actions
    this.agent_propensity = RandomInt(1,3);        //how often it tries dyplomatic and agent action
    this.export_res = RandomInt(0,3);
    this.import_res = RandomInt(0,3);           
    this.spy_resistance = RandomInt(1,3);          //how difficult it is to spy on
    this.influence = 0;                            //player's influence on this city state
    this.units = [0,0,0,0,0,0];
    this.land_units = function(){return this.units[0] + this.units[1] + this.units[2] + this.units[3];};
    this.naval_units = function(){return this.units[4] + this.units[5];};
    this.info_lvl = 0;
    this.besieged_by = 'none';
    this.sea_acces = false;
    this.trade_route = false;
    this.governor = false;
    this.conquered = false;
    this.distance = 0; //not real vector distance, just sum of vector elements
    this.size_lvl = 1;
}

function GenerateCityStates()
{
    for(let i = 0; i < 4; i++)
    {
        const new_city_state = new CityState();
        while(new_city_state.export_res == new_city_state.import_res)
        {new_city_state.export_res = RandomInt(0,3);}
        if(new_city_state.aggression == 3 && new_city_state.military_mindset == 1){new_city_state.military_mindset += 1;}
        city_states.push(new_city_state);
    }
    //getting rid of duplicate names:
    let duplicate_names_exist = true;
    while(duplicate_names_exist)
    {
        duplicate_names_exist = false;
        for(let i = 0; i < city_states.length; i++)
        {
            for(let q = 0; q < city_states.length; q++)
            {
                if(i != q && city_states[i].name == city_states[q].name)
                {
                    duplicate_names_exist = true;
                    city_states[i].name = RandomPick(city_state_names_0) + RandomPick(city_state_names_1) +RandomPick(city_state_names_2);
                }
            }
        }
    }
}

let currently_picked_citystate = "none";

function LookAtCity(index)
{ 
    for(let i = 0; i < city_states.length; i++)
    {
        if(city_states[i].index == index)
        {   
            //alert(index + " " + city_states[i].index);  
            currently_picked_citystate = i;
            if(city_states[i])
            break;
        }
    }
    UpdateCityStateButtons();
    DisplayCityStateInfo();
}

function DisplayCityStateInfo()
{
    $('#foreign_city_det1').html('');
    $('#foreign_city_det3').html('');
    if(currently_picked_citystate != "none")
    {
        let city_state_obj;
        city_state_obj = city_states[currently_picked_citystate];
        $('#foreign_city_name').html(city_state_obj.name); 
        $('#foreign_city_det1').append(WrapP(city_state_obj.size_lvl));
        $('#foreign_city_det1').append(WrapP(city_state_obj.walls));
        $('#foreign_city_det1').append(WrapP(GetCityStateTradeAmounts(currently_picked_citystate,true).exp_amount));
        $('#foreign_city_det1').append(WrapP(GetCityStateTradeAmounts(currently_picked_citystate,true).imp_amount));
        $('#foreign_city_det1').append(WrapP(GetCityStateTradeAmounts(currently_picked_citystate,true).benefit));
        $('#foreign_city_det1').append(WrapP((city_state_obj.sea_acces) ? "Yes" : "No"));
        var relations_class_name = '';
        $('#foreign_city_det3').append('<p class="' + relations_class_name + '">'+city_state_obj.relations_name()+'</p>');
        $('#foreign_city_det3').append(WrapP((city_state_obj.info_lvl > 1) ? city_state_obj.defense_strength() : "???"));
        $('#foreign_city_det3').append(WrapP((city_state_obj.info_lvl > 3) ? city_state_obj.land_units() : "???"));
        $('#foreign_city_det3').append(WrapP((city_state_obj.info_lvl > 2) ? city_state_obj.naval_units() : "???"));
        $('#foreign_city_det3').append(WrapP((city_state_obj.info_lvl > 4) ? city_state_obj.influence + "%" : "???"));
    }
    else
    {
        $('#foreign_city_name').html('-');
        for(let i = 0; i < 6; i++){$('#foreign_city_det1').append(WrapP('-'));}
        for(let i = 0; i < 5; i++){$('#foreign_city_det3').append(WrapP('-'));}
    }
}

function UpdateCityStateButtons()
{
    if(currently_picked_citystate == "none")
    {
        $('#foreign_city_spy').attr("disabled", true);
        $('#foreign_city_diplomat').attr("disabled",true);
        $('#foreign_city_governor').attr("disabled",true);
        $('#foreign_city_trade').attr("disabled",true);
        $('#foreign_city_army1').attr("disabled",true);
        $('#foreign_city_army2').attr("disabled",true);
    }
    else
    {
        if(spying[currently_picked_citystate] || spying_unlocked == false)
        {
            $('#foreign_city_spy').attr("disabled", true);
            if(spying[currently_picked_citystate])
            {$('#foreign_city_spy').html('Spy '+spying_left[currently_picked_citystate]);}
        }
        else
        {
            $('#foreign_city_spy').attr("disabled", false);
        }

        if(diplomacy[currently_picked_citystate] || diplomacy_unlocked == false)
        {
            $('#foreign_city_diplomat').attr("disabled",true);
            if(diplomacy[currently_picked_citystate])
            {$('#foreign_city_diplomat').html("Sending diplomat "+diplomacy_left[currently_picked_citystate]);}
        }
        else
        {
            $('#foreign_city_diplomat').attr("disabled", false);
        }

        if(city_states[currently_picked_citystate].trade_route)
        {
            $('#foreign_city_trade').attr("disabled",false);
            $('#foreign_city_trade').html("Disband Trade Route");
        }
        else
        {
            $('#foreign_city_trade').html("Establish Trade Route");
            var current_trade_routes = CountValuesInArrayOfObjects(city_states, "trade_route" , true);
            if(current_trade_routes == max_trade_routes)
            {
                $('#foreign_city_trade').attr("disabled",true);
            }
            else
            {
                $('#foreign_city_trade').attr("disabled",false);
            }
        }

        if(city_states[currently_picked_citystate].governor || city_states[currently_picked_citystate].influence < 90)
        {
            $('#foreign_city_governor').attr("disabled",true);
        }
        else
        {
            $('#foreign_city_governor').attr("disabled",false);
        }

        if(city_states[currently_picked_citystate].besieged_by != "none" || invasion[currently_picked_citystate] != "none")
        {
            $('#foreign_city_army1').attr("disabled",true);
            $('#foreign_city_army2').attr("disabled",true);
        }
        else
        {
            $('#foreign_city_army1').attr("disabled",false);
            $('#foreign_city_army2').attr("disabled",false);
        }
    }
}

let trade_route_rates = [3, 2.2, 2, 1.4]; //how much stuff you get for equivalent of 1 money
let trade_route_mult = 1; //the higher it is the more favourable is trading
let trade_route_money_mult = 1;

function GetCityStateTradeAmounts(i, as_str = false)
{

    //first calc import to citystate based on its size_lvl, then how much it would cost if it was represented in money
    //then using this value calculate an equivalent in resource that is being exported to the player
    //then calculate money benefit from trade
    let import_amount = 1 + Math.round(city_states[i].size_lvl / 4 * city_states[i].economic_mindset);
    const import_money_equivalent = import_amount / trade_route_rates[city_states[i].import_res];
    let export_amount = import_money_equivalent * trade_route_rates[city_states[i].export_res];
    export_amount *= trade_route_mult;
    let money_benefit = (import_amount + export_amount) / 10 * trade_route_money_mult;
    //having a governor or having this city as conquered makes the trade more beneficial for player
    if(city_states[i].governor || city_states[i].conquered)
    {
        money_benefit *= 1.5;
        import_amount = Math.floor(import_amount / 2);
    }
    else
    {
        if(city_states[i].relations > 80)
        {
            export_amount *= 1.2;
        }
        else if(city_states[i].relations <= 40)
        {
            export_amount *= 0.75;
        }
    }
    if(city_states[i].sea_acces)
    {
        money_benefit *= 1.5;
    }
    let obj = {
        imp_amount: import_amount,
        exp_amount: export_amount,
        benefit: money_benefit
    }
    if(as_str)
    {
        obj.exp_amount = parseFloat(obj.exp_amount).toFixed(2);
        obj.benefit = parseFloat(obj.benefit).toFixed(2);
    }
    return obj;
}

let spying = [false,false,false,false];
let spying_unlocked = false;
let spying_left = [0,0,0,0];
let spying_chance_mult = 1;
let diplomacy = [false,false,false,false];
let diplomacy_unlocked = false;
let diplomacy_left = [0,0,0,0];
let diplomacy_chance_mult = 1;
let invasion = ["none","none","none","none"];
let invasion_left = [0,0,0,0];

$('#foreign_city_spy').click(function()
{
    if($(this).attr("disabled")){return;}
    SendSpy();
});

$('#foreign_city_diplomat').click(function()
{
    if($(this).attr("disabled")){return;}
    SendDiplomat();
});

$('#foreign_city_governor').click(function()
{
    if($(this).attr("disabled")){return;}
    InstallPuppetGovernor();
});

$('#foreign_city_trade').click(function()
{
    if($(this).attr("disabled")){return;}
    ControlTradeRoute();
});

$('#foreign_city_army1, #foreign_city_army2').click(function()
{
    if($(this).attr("disabled")){return;}
    const what_army = $(this).attr("id").slice(13);
    Invade(what_army);
});

function SendSpy()
{
    if(currently_picked_citystate != "none")
    {
        spying[currently_picked_citystate] = true;
        spying_left[currently_picked_citystate] = 1 + Math.round(city_states[currently_picked_citystate].distance/2);
        $('#foreign_city_spy').attr("disabled",true);
    }
}

function SendDiplomat()
{
    if(currently_picked_citystate != "none")
    {
        diplomacy[currently_picked_citystate] = true;
        diplomacy_left[currently_picked_citystate] = 5 + Math.round(city_states[currently_picked_citystate].distance/1.75);
        $('#foreign_city_diplomat').attr("disabled",true);
    }
}

function InstallPuppetGovernor()
{
    if(currently_picked_citystate != "none")
    {
        const chance = (city_states[currently_picked_citystate].influence - 90) * 3;
        if(RChance(chance))
        {
            city_states[currently_picked_citystate].governor = true;
            DisplayMessage("Attempt to install a puppet governor in " + city_states[currently_picked_citystate].name + "was succesfull.",4);
            const governors_everywhere = true;
            WinCheck();
        }
        else
        {
            city_states[currently_picked_citystate].influence -= 10;
            city_states[currently_picked_citystate].relations -= 7.5;
            DisplayMessage("Attempt to install a puppet governor in " + city_states[currently_picked_citystate].name + "failed.",2);
        }
    }
}

function Invade(what_army)
{
    if(currently_picked_citystate == "none"){return;}
    if(city_states[currently_picked_citystate].sea_acces && CountNavalUnitsIn(what_army) == 0)
    {
        //no naval units, but city is only accessible by sea
        DisplayMessage("Can't invade a city state only accessible by sea with an army that has no naval units.",2);
        return;
    }
    if(city_states[currently_picked_citystate].sea_acces == false && CountNavalUnitsIn(what_army) > 0)
    {
        //city state has no sea access, but army has naval units
        DisplayMessage("Can't invade a city state with no sea access with an army that has naval units.",2);
        return;
    }
    if(CountLandUnitsIn(what_army) == 0)
    {
        //no land units to capture the city
        DisplayMessage("Can't invade with an army that has no land units.",2);
        return;
    }
    invasion[currently_picked_citystate] = what_army;
    invasion_left[currently_picked_citystate] = 1 + Math.round(city_states[currently_picked_citystate].distance/2);
    city_states[currently_picked_citystate].relations = 5;
}

let max_trade_routes = 0;
function ControlTradeRoute()
{
    if(currently_picked_citystate == "none"){return;}
    const current_trade_routes = CountValuesInArrayOfObjects(city_states, "trade_route" , true);
    if(max_trade_routes > current_trade_routes && city_states[currently_picked_citystate].trade_route == false)
    {
        city_states[currently_picked_citystate].trade_route = true;
        DisplayMessage("Trade route to " + city_states[currently_picked_citystate].name + " established.",3);
        $('#foreign_city_trade').html("Disband Trade Route");
    }
    else
    {
        city_states[currently_picked_citystate].trade_route = false;
        city_states[currently_picked_citystate].relations -= 5;
        $('#foreign_city_trade').html("Establish Trade Route");
    }
}

function ProcessCityStates()
{
    for(let i = 0; i < city_states.length; i++)
    {
        //handling export and import
        if(city_states[i].trade_route)
        {
            const res_names = ["food","wood","stone","metal"];
            const obj = GetCityStateTradeAmounts(i);
            const import_amount = obj.imp_amount;
            const export_amount = obj.exp_amount;
            const money_benefit = obj.benefit;
            if(window[res_names[city_states[i].import_res]] >= import_amount)
            {
                window[res_names[city_states[i].import_res]] -= import_amount;
                profit[city_states[i].export_res] += export_amount;
                profit[4] += money_benefit;
            }
        }
        //relations and influence
        if(!city_states[i].governor && !city_states[i].conquered)
        {
            //bad relations get worse by themselves
            if(city_states[i].relations <= 40){city_states[i].relations -= 0.02;}
            //trade routes slightly improve relations
            if(city_states[i].trade_route){city_states[i].relations += 0.02;}
            //relations are mostly changed not here, but by actions like invasion, raids, dyplomats, spying

            //influence changes based on both relations and happiness of player's city
            //happiness only has an effect with neutral and higher relations
            //influence slowly falls by itself if it's not already high
            if(city_states[i].relations <= 40){city_states[i].influence -= 0.015;}
            else if(city_states[i].relations > 80){city_states[i].influence += 0.015;}
            if(city_states[i].relations > 40 && hap >= 90)
            {
                city_states[i].influence += (hap >= 95) ? 0.025 : 0.02;
            }
            if(city_states[i].influence < 90)
            {
                city_states[i].influence -= 0.005;
            }
        }
        //handling diplomacy
        if(diplomacy[i] && diplomacy_left > 0)
        {
            diplomacy_left[i] -= 1;
        }
        else if(diplomacy[i] && diplomacy_left == 0)
        {
            diplomacy[i] = false;
            //rolling dice with diplomacy
            let diplomacy_chance = 50; //base chance for success
            diplomacy_chance = diplomacy_chance * diplomacy_chance_mult / city_states[i].diplomatic_resistance;
            if(RChance(diplomacy_chance))
            {
                //diplomacy attempt succesful, but now 25% of them end extra well
                if(RChance(25))
                {
                    city_states[i].relations += 15;
                    DisplayMessage("Our diplomat in " + city_states[i].name + " improved our relations substantially.",4);
                }
                else
                {
                    city_states[i].relations += 7.5;
                    DisplayMessage("Our diplomat in " + city_states[i].name + " was succesfull.",4);
                }
            }
            else
            {
                //diplomatic attempt failed, now 33% of them end terribly
                if(RChance(33))
                {
                    city_states[i].relations -= 5;
                    DisplayMessage("Our diplomat in " + city_states[i].name + " angered the residing establishment. Relations sour.",1);
                }
                else
                {
                    DisplayMessage("Our diplomat in " + city_states[i].name + " was unable to accomplish anything.",3);
                }
            }   
        }

        //handling spying
        if(spying[i] && spying_left[i] > 0)
        {
            spying_left[i] -= 1;
        }
        else if(spying[i] && spying_left[i] == 0)
        {
            spying[i] = false;
            //rolling dice with spying (first determining success chance)
            let spying_chance = 40; //base chance for succes
            spying_chance = spying_chance * spying_chance_mult / city_states[i].spy_resistance;
            if(RChance(spying_chance))
            {
                //spying was succesfull
                city_states[i].info_lvl += 1;
                DisplayMessage("Spying mission in the city state of " + city_states[i].name + " has ended succesfully.",4);
            }
            else
            {
                //spying wasn't successfull, now 33% of spyings end extra terrible
                if(RChance(33))
                {
                    city_states[i].relations -= 10;
                    DisplayMessage("Our spy was captured in " + city_states[i].name + ". Relations sour.",1);
                }
                else
                {
                    DisplayMessage("Our spy in " + city_states[i].name + " survived, but was unsuccesful.",2);
                }
            }  
        }

        //handling invasion
        if(invasion[i] != "none" && invasion_left[i] > 0)
        {
            invasion_left[i] -= 1;
        }
        else if(invasion[i] != "none" && invasion_left[i] == 0)
        {
            //army has arrived to besiege the city
            city_states[i].besieged_by = invasion[i];
            invasion[i] = "none";
            DisplayMessage("Our army has reached " + city_states[i].name + ".",3);
        }
        //handling actual siege
        if(city_states[i].besieged_by != "none")
        {
            let player_strength = units["warriors"][city_states[i].besieged_by] * units["warriors"].strength;
            player_strength += units["archers"][city_states[i].besieged_by] * units["archers"].strength;
            player_strength += units["cavalry"][city_states[i].besieged_by] * units["cavalry"].strength * 0.4;
            player_strength += units["siege_engine"][city_states[i].besieged_by] * units["siege_engine"].strength;
            const walls_factor = CalcWallsFactor(city_states[i].walls, units["siege_engine"][city_states[i].besieged_by]);
            player_strength *= walls_factor;
            player_strength *= units_strength_mult;
            let cs_strength = city_states[i].units[0] * units["warriors"].base_strength * 0.9;
            cs_strength += city_states[i].units[1] * units["archers"].base_strength * (1 + 0.1 * city_states[i].walls);
            cs_strength += city_states[i].units[2] * units["cavalry"].base_strength * 0.4;
            cs_strength += city_states[i].units[3] * units["siege_engine"].base_strength;
            cs_strength += city_states[i].defense_strength;
            if(cs_strength == 0){city_states[i].besieged_by = "none"; city_states[i].conquered = true; return;}
            //at this point military strengths of both sides are calculated
            //but since armies fight differently based on different morale,
            //a happiness mult is applied to player's strength (at 75 = 1, at 100 = 1.1, at 0 = 0.7)
            player_strength *= 0.7 + hap/250;
            //also, armies fight differently because of random circumstances, so both strengths can vary by 15%
            const variance = 0.15;
            player_strength *= RandomFloat(1 - variance, 1 + variance);
            cs_strength *= RandomFloat(1 - variance, 1 + variance);
            //also, there's 25% chance that the course of battle at this 1 point will radically change
            if(RChance(25))
            {
                if(RChance(50))
                {
                    player_strength *= RandomFloat(1.5,2.5);
                }
                else
                {
                    cs_strength *= RandomFloat(1.5,2.4);
                }
            }
            //now we determine how many units each side loses, based on the strength of the oposition
            //rounding is favourable for the winner
            const units_lost_p = (player_strength > cs_strength) ? Math.floor(cs_strength/20) : Math.ceil(cs_strength/20);
            const units_lost_c = (cs_strength > player_strength) ? Math.floor(player_strength/20) : Math.ceil(player_strength/20);
            let units_p = units["warriors"][city_states[i].besieged_by] + units["archers"][city_states[i].besieged_by];
            units_p += units["cavalry"][city_states[i].besieged_by] + units["siege_engine"][city_states[i].besieged_by];
            //need to know if an army even has enough units to lose
            if(units_lost_p >= units_p){units_lost_p = units_p;}
            if(units_lost_c >= city_states[i].land_units){units_lost_c = city_states[i].land_units;}
            //rates of likelyhood of picking a certain land unit type as the one that died:
            const death_chance_p = [25,25,30,20]; //note that siege_engine has lowest chance
            const death_chance_c = [30,20,30,20];
            for(let i = 0; i < units_lost_p; i++)
            {
                let picked_unit = unit_prop_names[ROutcome(death_chance_p)];
                let picked_unit_present = false;
                while(picked_unit_present == false)
                {
                    if(units[picked_unit][city_states[i].besieged_by] > 0)
                    {
                        picked_unit_present = true;
                    }
                    else
                    {
                        picked_unit = unit_prop_names[ROutcome(death_chance_p)];
                    }
                }
                //unit is present on the battlefield, and was picked to destruction so:
                units[picked_unit][city_states[i].besieged_by] -= 1;
            }
            for(let i = 0; i < units_lost_c; i++)
            {
                let picked_unit = ROutcome(death_chance_c);
                let picked_unit_present = false;
                while(picked_unit_present == false)
                {
                    if(city_states[i].units[picked_unit] > 0)
                    {
                        picked_unit_present = true;
                    }
                    else
                    {
                        picked_unit = ROutcome(death_chance_p);
                    }
                }
                //unit is present on the battlefield, and was picked to destruction so:
                city_states[i].units[picked_unit] -= 1;
            }
            units_p = units["warriors"][city_states[i].besieged_by] + units["archers"][city_states[i].besieged_by];
            units_p += units["cavalry"][city_states[i].besieged_by] + units["siege_engine"][city_states[i].besieged_by];

            if(units_p == 0)
            {
                //player lost, since the number of units reached 0
                city_states[i].besieged_by = "none";
                DisplayMessage("Our army lost the siege of " + city_states[i].name + ".",1);
            }
            else if(city_states[i].land_units == 0)
            {
                //player won, since the number of city state units is 0
                city_states[i].besieged_by = "none";
                city_states[i].conquered = true;
                DisplayMessage("We've captured the city of " + city_states[i].name + ".",4);
                WinCheck();
            }
        }
        else
        {
            //thins only done when not besieged
            //unit creation:
            const chance_for_unit_creation = 1.6 * city_states[i].military_mindset * (1 + Math.floor(city_states[i].size_lvl/5));
            if(RChance(chance_for_unit_creation))
            {
                //pick unit to create
                var unit_preference = (city_states[i].sea_acces) ? [35,30,25,10] : [25,25,15,5,23,7];
                city_states[i].units[ROutcome(unit_preference)] += 1;
            } 
        }

        if(city_states[i].relations < 1){city_states[i].relations = 1;}
        else if(city_states[i] > 100){city_states[i].relations = 100;}
    }  
    DisplayCityStateInfo();
}

function CalcWallsFactor(walls, n_of_siege_engines)
{
    //this function calculates how much walls impare strength based on n_of_siege_engines of attacker
    switch(walls)
    {
        case 0: return 1;
        case 1: return (n_of_siege_engines > 0) ? 1 : 0.9;
        //ternaries from here to protect against floating point issues (i just want a nice round 1 at a certain n_of_siege_engines)
        case 2: return (n_of_siege_engines >= 2) ? 1 : 0.7 + n_of_siege_engines * 0.15;
        case 3: return (n_of_siege_engines >= 5) ? 1 : 0.5 + n_of_siege_engines * 0.1;
        case 4: return (n_of_siege_engines >= 7) ? 1 : 0.3 + n_of_siege_engines * 0.1;
        case 5: return (n_of_siege_engines >= 10) ? 1 : 0.1 + n_of_siege_engines * 0.09; 
        default: return 1;
    }
}

function DevelopCityStates()
{
    for(let i = 0; i < city_states.length; i++)
    {
        if(RChance(7))
        {
            const development = RandomInt(0,3);
            switch(development)
            {
                case 0: city_states[i].walls += 1; if(city_states[i].walls > 5){city_states[i].walls = 5;} break;
                case 1:
                    if(city_states[i].walls > 3 && city_states[i].other_defenses < 10)
                    {
                        city_states[i].other_defenses += 1;
                    }
                    break;
                case 2: city_states[i].size_lvl += 1; break;
                case 3: city_states[i].size_lvl += 1; break;
            }
        }
    }
}

function WinCheck()
{
    const l = city_states.length;
    let n_conquered_or_governor = 0;
    for(let i = 0; i < l; i++)
    {
        if(city_states[i].conquered || city_states[i].governor)
        {
            n_conquered_or_governor += 1;
        }
    }
    if((tech.hasOwnProperty("gunpowder") && tech.gunpowder.completed) || n_conquered_or_governor == l)
    {
        // YOU WIN
        clearInterval(fast_clock_interval);
        clearInterval(slow_clock_interval);
        $('#gamewin_scrn').fadeIn(200);
        save_blocked = true;
        DeleteSave();
    }
}

const unit_prop_names = ["warriors","archers","cavalry","siege_engine","galley","galleass"];
let units_strength_mult = 1;
const units={
    warriors:{
        name:"Warriors",
        garrison:0,
        army1:0,
        army2:0,
        base_strength:10,
        strength:10,
        cost_money:10,
        cost_money_max:50,
        cost_food:20,
        cost_metal:5,
        limit:50
    },
    archers:{
        name:"Archers",
        garrison:0,
        army1:0,
        army2:0,
        base_strength:8,
        strength:8,
        cost_money:10,
        cost_money_max:50,
        cost_food:20,
        cost_wood:5,
        limit:50
    },
    cavalry:{
        name:"Cavalry",
        garrison:0,
        army1:0,
        army2:0,
        base_strength:16,
        strength:16,
        cost_money:15,
        cost_money_max:70,
        cost_food:30,
        cost_metal:5,
        limit:50
    },
    siege_engine:{
        name:"Siege Engine",
        garrison:0,
        army1:0,
        army2:0,
        base_strength:20,
        strength:20,
        cost_money:20,
        cost_money_max:75,
        cost_wood:25,
        cost_metal:15,
        limit:10
    },
    galley:{
        name:"Galley",
        garrison:0,
        army1:0,
        army2:0,
        base_strength:15,
        strength:15,
        cost_money:25,
        cost_money_max:80,
        cost_wood:60,
        cost_metal:15,
        limit:20
    },
    galleass:{
        name:"Galleass",
        garrison:0,
        army1:0,
        army2:0,
        base_strength:22,
        strength:22,
        cost_money:30,
        cost_money_max:90,
        cost_wood:100,
        cost_metal:20,
        limit:20
    }
}

$('.unit_button').click(function()
{
    let prop_name = $(this).parent().attr("id");
    prop_name = prop_name.slice(9);   //slicing unit_row_
    RecruitUnit(prop_name);
});

function RecruitUnit(prop_name)
{
    if(!units.hasOwnProperty(prop_name)){return;}
    if(units[prop_name].garrison > units[prop_name].limit)
    {
        DisplayMessage("Can't create " + prop_name + " unit, limit reached.",2);
        return;
    }
    let enough_resources = true;
    if(units[prop_name].hasOwnProperty("cost_food") && units[prop_name].cost_food > food){enough_resources = false;}
    if(units[prop_name].hasOwnProperty("cost_wood") && units[prop_name].cost_wood > wood){enough_resources = false;}
    if(units[prop_name].hasOwnProperty("cost_metal") && units[prop_name].cost_metal > metal){enough_resources = false;}
    if(units[prop_name].cost_money > money){enough_resources = false;}
    if(enough_resources)
    {
        units[prop_name].garrison += 1;
        money -= units[prop_name].cost_money;
        food -= (units[prop_name].hasOwnProperty("cost_food")) ? units[prop_name].cost_food : 0;
        wood -= (units[prop_name].hasOwnProperty("cost_wood")) ? units[prop_name].cost_wood : 0;
        metal -= (units[prop_name].hasOwnProperty("cost_metal")) ? units[prop_name].cost_metal : 0;
        if(units[prop_name].cost_money < units[prop_name].cost_money_max)
        {
            units[prop_name].cost_money += 1;
        }
        $('#unit_row_' + prop_name + ' .unit_number').html(units[prop_name].garrison);
        $('#unit_row_' + prop_name + ' #unit_cost_money').html(units[prop_name].cost_money);
        DisplayResources();
    }
    else
    {
        DisplayMessage("Not enough resources to create " + HumanifyString(prop_name) + " unit.",2);
    }
}

$('.army_row button').click(function()
{
    const change = ($(this).hasClass('army_button_plus')) ? $(this).html().slice(1) : $(this).html().slice(1) * -1;
    const index = $(this).parent().index();
    const army = $(this).parent().parent().attr("id").slice(-1);
    
    ChangeArmyUnits(change, unit_prop_names[index], index, army);
    //alert(index + ' ' + change + ' ' + army);
});

function ChangeArmyUnits(change, unit, unit_index, army)
{
    DebugLog("ChangeArmyUnits(" + change + " " + unit + " " + unit_index + " " + army + ")");
    if((change > 0 && units[unit].garrison >= change) || (change < 0 && units[unit]["army"+army]))
    {
        units[unit].garrison -= change;
        units[unit]["army"+army] += change*1;
    }
    $('#unit_row_' + unit + ' .unit_number').html(units[unit].garrison);
    $('#army' + army + ' .army_row:nth-child('+(unit_index + 1)+') span').html(units[unit]["army"+army]);
}

function CountAllUnitsOfType(type_str)
{
    return units[type_str].garrison + units[type_str].army1 + units[type_str].army2;
}

function CountLandUnitsIn(prop_string)
{
    return units["warriors"][prop_string] + units["archers"][prop_string] + units["cavalry"][prop_string] + units["siege_engine"][prop_string];
}

function CountNavalUnitsIn(prop_string)
{
    return units["galley"][prop_string] + units["galleass"][prop_string];
}

//  ================= end of world and military script ================