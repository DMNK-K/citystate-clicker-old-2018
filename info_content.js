function InfoGame()
{
    let str = '';
    str += '<h4>About</h4>';
    str += WrapP('Citystate Clicker is a browser management-clicker game about building a city. Your job is to keep your citizens alive for as long as you can and achieve victory in any way possible.');
    str += WrapP('The game is currently in beta, which means it still might have some errors and not all features work to their full extent.');

    str += '<h4>Resources</h4>';
    str += WrapP('There are 6 basic resources in the game:');
    str += WrapP('- food: required to keep your population alive and to allow growth');
    str += WrapP('- wood: needed to build and upgrade buildings of lower levels');
    str += WrapP('- stone: used to build some buildings and upgrade many at high levels');
    str += WrapP('- metal: used sparsely for buildings');
    str += WrapP('- currency: required for a myriad of different things');
    str += WrapP('- knowledge: resource almost exlusively used to research technologies');
    str += WrapP("");
    str += WrapP('You can store limited amounts of resources. At the start of the game you can store 100 of every resource except currency and knowledge, of which you can store 0 and 10 respectively.');

    str += '<h4>Gathering Resources</h4>';
    str += WrapP('You can gather resources manually by pressing the buttons on the right. Every click has some chance of failure. The amount you can gather at once is limited and it is represented as a bar in the bottom part of every button.');
    str += WrapP('While gathering resources manually pay attention to your storage - you can still gather succesfully with full storage, but the gathered resource will be wasted.');

    str += '<h4>Buildings</h4>';
    str += WrapP("Buildings are the foundation of your city. Everything revolves around their numerous effects.");
    str += WrapP("When you first construct a building it will move from the bottom left menu, to the top left menu, where all your already constructed buildings reside.");
    str += WrapP("Every building has multiple levels, most of them have 5 of them. You can see the current level of the building under its icon. Upgrading buildings works in a similar way as constructing them for the first time.");
    str += WrapP("Buildings can unlock technologies and also be unlocked by technologies.");
    str += WrapP("The speed with which buildings are constructed and upgraded depends on a hidden parameter called build force.");
    str += WrapP("The number of buildings that you can construct and upgrade simultaneously depends on the number of building slots (5 max). However, if you're working on more than 1 building, build force gets split between the construction projects, so each new construction or upgrade project slows down the ones that are already ongoing.");

    str += '<h4>Research</h4>';
    str += WrapP("Researching technologies unlocks new buildings and other technologies, while also providing useful bonuses. It's the primary motor of progression in the game.");
    str += WrapP("Technologies only require knowledge and occasionally currency. If suddenly you end up with no technologies to research, try constructing and upgrading your buildings.");

    str += '<h4>Food Rations and Growth</h4>';
    str += WrapP("Every 25 days food rations are distributed in your city. You can change the amount using the food rations button in the management section, if you have it unlocked.");
    str += WrapP("Different amounts have different results:");
    str += WrapP("- none: your citizens will get hungrier and hungrier and then starvation will begin, population will drop and happiness as well");
    str += WrapP("- low: your citizens will not starve, but it will have a negative impact on population growth");
    str += WrapP("- standard: population will grow at a regular level");
    str += WrapP("- high: population will grow on a regular level, but there will also be benefits to happiness");
    str += WrapP("You can see the amount of food required for next distribution if you hover over the button.");
    str += WrapP("If there's not enough food, the food that is left is distributed, but the effects are partially the same as if the rations were set to none.");
    str += WrapP("");
    str += WrapP("Population growth is a process that happens constantly and is predicated on current population and as mentioned before, food rations.");
    str += WrapP("Population growth is NOT dependent on happiness, city hygine, or crime levels.");

    str += '<h4>Taxes</h4>';
    str += WrapP("Taxes in CityState Clicker are only collected when you order their collection by clicking the taxes button (if unlocked) in the management section.");
    str += WrapP("The amount of currency collected in taxes is determined by population, crime level and relevant bonuses.");
    str += WrapP("The time it takes to collect taxes is determined by population only. You can see both stats when you hover over the taxes button.");

    str += '<h4>Experiments</h4>';
    str += WrapP("You can delegate conducting an experiment by clicking the experiment button (if unlocked) in the management section.");
    str += WrapP("Experiments yield knowledge based on cost, happiness in the moment of delegation and years elapsed in the game. However the yields are highly randomized.");
    str += WrapP("You can see both the time and amount of potential knowledge generated by hovering over the experiment button.");

    str += '<h4>Pantheon Tab</h4>';
    str += WrapP("Each level of the temple allows you to accept a new god into your pantheon. Different gods provide different bonuses. Once you pick a god there's no way to retract that decision.");
    str += WrapP("Gods that become available at one of the slots will also be available on the next 2 slots. Eg: gods that are first available on slot 1 will also be available on slots 2 and 3, but not 4 and 5.");
    str += WrapP("No new gods become available on slots 4 and 5.");

    str += '<h4>Military Tab</h4>';
    str += WrapP("Miltiary tab shows you your garrison, your first army and your second army and serves as a place to create military units.");
    str += WrapP("You can create units by clicking on a unit icon. Each time you create a unit its currency cost will increase, but only up to a certain point.");
    str += WrapP("There are 6 units in the game: warriors, archers, cavalry, siege engines, galleys and galleasses.");
    str += WrapP("Warriors are a run of the mill, standard land unit with no special characteristics.");
    str += WrapP("Archers are a unit that's also standard overall, but it gains a bonus for every level of walls while defending.");
    str += WrapP("Cavalry is a powerful unit that has a significant debuff to fighting in cities.");
    str += WrapP("Siege engines are units that negate negative consequences of attacking a city state with walls.");
    str += WrapP("Galleys are a basic naval unit.");
    str += WrapP("Galleasses are a strong naval unit that has a slight defensive bonus.");
    str += WrapP("You can move your units from garrison to an army and back by clicking the buttons adjacent to the number of units indicator.");

    str += '<h4>World View Tab</h4>';
    str += WrapP("This tab shows you a map of the nearby world. Your city state is represented as a white square, while other city states as blue squares.");
    str += WrapP("You can see information about a foreign city state by clicking on it on the map.");
    str += WrapP("Clicking on a foreign city state also reveals a number of buttons for possible actions.");

    str += '<h4>Foreign City States</h4>';
    str += WrapP("You can find out a lot about a foreign city state by understanding the stats displayed in world view tab.");
    str += WrapP("- size level determines how big the city is, how much resources it produces for export and how fast it creates units");
    str += WrapP("- relations determine what you can and can't do with that city state");
    str += WrapP("- walls level shows you the walls level they have built (duh)");
    str += WrapP("- defense strength shows you how strong the non-unit defenses are, including walls");
    str += WrapP("- export is how much of a resource would flow into your city per day if you had a trade route to that city state");
    str += WrapP("- import is how much of a resource you would have to provide for that city per day while trading");
    str += WrapP("- currency from trade represents your daily benefit to currency if you had a trade route to that city state");
    str += WrapP("- sea acces shows you if a city has access to the sea, while also at the same time telling you if it's accessible by land (if a city state has sea access you will need naval units)");
    str += WrapP("- land units and naval units shows you the amount of those units respectively in the cities' garrison");
    str += WrapP("- influence represents the influence of your reign and culture on citizens of that city state and it's required to install a puppet governor");

    str += '<h4>Trade Routes</h4>';
    str += WrapP("You can establish trade routes with city states if you're not already trading with them and you're not at the maximum number of trade routes.");
    str += WrapP("Trade routes provide you with currency and a resource in exchange for some amount of another resource.");
    str += WrapP("Disbanding a trade route has a negative effect on your relations.");

    str += '<h4>Diplomacy</h4>';
    str += WrapP("Sending diplomats to city states gives you a chance to improve relations, however it has a small chance to backfire.");
    str += WrapP("When you send a diplomat you'll have to wait for a few in game days untill the task is done.");

    str += '<h4>Spying</h4>';
    str += WrapP("Spying increases the level of information available about a city state. If some stats show up as question marks it's a good idea to send a spy.");
    str += WrapP("When you send a spy you'll have to wait for a few in game days untill the task is done.");

    str += '<h4>Invading and Sieges</h4>';
    str += WrapP("You can invade city states with any of your armies. If a city state has sea access your army has to have naval units.");
    str += WrapP("Attacking a city state will instantly change your relations to hostile.");
    str += WrapP("When your army gets to the city state fighting will begin. You can monitor you units in the military tab.");
    str += WrapP("The strength of your army is based on your units, happiness and relevant bonuses.");
    str += WrapP("If you win the encounter, you will take control of the city, which means currency from trade will increase by 50% and import decrease by 50%.");
    str += WrapP("You can win the game by conquering all foreign city states.");

    str += '<h4>Puppet Governors</h4>';
    str += WrapP("If you have a high enough influence over a city state, the option to install a puppet governor will become available (if unlocked). Installing a puppet governor has the same benefits for trade as conquering a city.");
    str += WrapP("You can win the game by installing puppet governors in all foreign city states.");

    str += '<h4>Cookies</h4>';
    str += WrapP('Cookies are a technology which allows a website to save strings of text in your browser and then load them from your browser.');
    str += WrapP('CityState Clicker uses cookies to save your progress every 60 in-game days and also upon exit, as well as to save the sound effects and music settings and keep track of the fact, that you have already accepted cookies, so as not to ask you again.');
    str += WrapP('The game will not be saved if cookies are disabled in your browser. Cookie files will expire after 365 days.');
    return str;
}

function InfoChangelog()
{
    let str = '';
    str += '<h4>19.07.2018 - Version 0.3 beta</h4>';
    str += WrapP('- game is now online for the first time');
    str += WrapP('- save and load feature now encapsulates most features');
    str += WrapP('- improved mood message system to not repeat parts of messages in a row');
    str += WrapP('- added new game button');
    str += WrapP('- winning and losing now wipes the save, as intended');
    str += WrapP('- display now scales nicely with any monitor with 16:9 aspect ratio');    
    str += WrapP('- FIXED BUGS:');
    str += WrapP('- numerous issues with save and load fixed');
    str += WrapP('- fixed a problem with browsing pantheon gods to the left');
    str += WrapP('- fixed a situation where gods would become unacceptable');
    str += WrapP('- fixed a bug where all gods would provide their benefits even when not worshipped');
    str += WrapP('- KNOWN BUGS:');
    str += WrapP('- tech and building icons flicker and have seizures for unknown reasons');
    str += WrapP('- hygine frequently becomes NaN');
    str += WrapP('- in rare ocassions population becomes NaN');
    str += WrapP("- second part of trade section doesn't show up as intended");
    str += WrapP('- PLANNED FEATURES:');
    str += WrapP('- new gods unlocked through winning the game for future play');
    str += WrapP('- a lot of buildings, technologies and random events');
    str += WrapP('- ambient sountrack');
    str += WrapP('- sound effects for metal gathering and hovering over unit buttons');
    str += WrapP('- defending against raids and invasions');
    str += WrapP('- field battles');
    str += WrapP('- better god descriptions');
    
    str += '<h4>13.07.2018 - Version 0.2 beta</h4>';
    str += WrapP('- pantheon, military, city view and world view tabs added');
    str += WrapP('- some technologies and buildings relevant to added tabs added');
    str += WrapP('- first draft of the save and load feature added');
    str += WrapP('- added traders and holidays in management tab');
    str += WrapP('- new random events');
    str += WrapP('- new mood messages');
    str += WrapP('- FIXED BUGS: a lot');
    str += WrapP('- KNOWN BUGS: a lot');

    str += '<h4>20.06.2018 - Version 0.1 beta</h4>';
    str += WrapP('- the base version of the game created');
    str += WrapP("- ¯|_(ツ)_/¯ i don't know what else you expected");
    return str;
}
