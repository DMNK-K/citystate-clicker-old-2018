"use strict";
let debug_log = ['','','','','',''];
BindDebugCheats();

function DebugLog(str)
{
    for(let i = debug_log.length - 1; i > 0; i--)
    {
        debug_log[i] = debug_log[i - 1];
    }
    debug_log[0] = str + '';
}

function DisplayDebug(location)
{
    let content = '<p>day: ' + day + ' year: ' + year + ' pop_lvl:' + pop_lvl + '</p>';
    content += '<p>';
    for(let i = 0; i < profit.length; i++)
    {
        content += 'profit['+i+'] = '+profit[i].toFixed(4) + '\xa0\xa0\xa0';
    }
    content += '</p>';
    content += '<p>';
    for(let i = 0; i < storage.length; i++)
    {
        content += 'storage['+ i +'] = '+storage[i]+'\xa0\xa0\xa0';
    }
    content += '</p>';
    content += '<p>build_force = ' + build_force + '\xa0\xa0 research_force = '+ research_force +'\xa0\xa0 research = '+ research +'</p>';
    content += '<p>';
    for(let i = 0; i < constr.length; i++)
    {
        content += 'constr[' + i + '] = ' + constr[i] + '\xa0\xa0\xa0';
    }
    content += '</p>';
    content += '<p>starvation_factor: ' + starvation_factor + '\xa0\xa0 hygine = ' + hygine + '\xa0\xa0 plague_chance = ' + plague_chance + '</p>';
    for(let i = 0; i < debug_log.length; i++)
    {
        content += '<p>d'+ i + ': ' + debug_log[i] + '</p>';
    }
    $(location).html(content);
}

function BindDebugCheats()
{
    $(document).keypress(function(e)
    {
        switch(e.which)
        {
            case 96: //tilda
                $("#debug_window").toggle();
                break;
            case 61: //+
                build_force += 50;
                research_force += 10;
                break;
            case 45: //-
                build_force -= 50;
                research_force -= 10;
                break;
            case 55: //6
                hap += 5;
                if(hap > 100){hap = 100;}
                else if(hap < 0){hap = 0;}
                break;
            case 56:
                pop += 10;
                break;
            case 101: //e
            ExploreTile();
            break;
            default:
                DebugLog(e.which);
                break;
        }
        if(e.which >= 49 && e.which <= 54) //0,1,2,3,4,5
        {
            const c_names = ['food','wood','stone','metal','money','knowl'];
            const i = e.which - 49;
            window[c_names[i]] += 10;
            if(window[c_names[i]] > storage[i])
            {
                window[c_names[i]] = storage[i];
            }
            DisplayResources();
        }
    });
}