"use strict";

var pop = 20;
var hap = 70;

let pop_lvl = 1;
const pop_thresholds = [100,200,500,1000,2500,5000,7500,10000,20000];

var food = 20;
var wood = 0;
var stone = 0;
var metal = 0;
var money = 0;
var knowl = 0;

let profit = [0, 0, 0, 0, 0, 0];
let profit_global_multi = [1, 1, 1, 1, 1, 1];
let storage = [100, 100, 100, 100, 0, 10];

let build_force = 4; //how much constr_progress is made per second per 1 builder

//  YOU CAN ONLY BUILD AS MANY BLD AT ONCE AS THERE IS EMPTY SLOTS
let constr = ["empty", "locked", "locked", "locked", "locked"];
let constr_slots = 1;
let constr_now = 0;
let constr_progress = [0, 0, 0, 0, 0];

let research = "none";
let research_progress = 0;
let research_force = 1;  

let cursor_x = 1;
let cursor_y = 1;

const link_twitter = "https://twitter.com/TheRealDoubleV";