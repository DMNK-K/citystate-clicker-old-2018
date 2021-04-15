//  ================================ UTILITY SCRIPT ===============================
//  this script holds functions commonly used in projects

function RandomInt(min, max)//inc inc
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function RandomIntExcept(min, max, ex_min, ex_max)
{
    if(ex_min < min && ex_max > max){return;}
    let result = Math.floor(Math.random() * (max - min + 1) + min);
    while(result >= ex_min && result <= ex_max)
    {
        result = Math.floor(Math.random() * (max - min + 1) + min);
    }
    return result;
}

function RandomIntExclude(min, max, exl_array = [])
{
    let result = Math.floor(Math.random() * (max - min + 1) + min);
    let e = 0;
    while (HasValue(exl_array, result))
    {
        e++;
        result = Math.floor(Math.random() * (max - min + 1) + min);
        if(e == 10000){return result;}
    }
    return result;
}

function RandomFloat(min, max)//inc inc
{
    return Math.random() * (max - min) + min;
}

function RandomFloatExcept(min, max, ex_min, ex_max)
{
    if(ex_min < min && ex_max > max){return;}
    let result = Math.random() * (max - min) + min;
    while(result >= ex_min && result <= ex_max)
    {
        result =  Math.random() * (max - min) + min;
    }
    return result;
}

function RandomPick(array)
{
    return array[Math.floor(Math.random() * array.length)];
}

function HasValue(array, value)
{
    if(array.length < 1){return false; }
    return (array.indexOf(value) == -1) ? false : true;
}

function RChance(chance)
{
    return (chance >= RandomFloat(1,100)) ? true : false;
}

function ROutcome(chance_array)
{
    //returns a random outcome index depending on an array of chances for each outcome
    let total = 0; let l = chance_array.length;
    for(let i = 0; i < l; i++)
    {
        total += chance_array[i];
    }
    let r = RandomFloat(0, total);
    let outcome = 0;
    let chance = 0;
    for(var i = 0; i < l; i++)
    {
        chance += chance_array[i];
        if(chance >= r)
        {
            outcome = i;
            break;
        }
    }
    return outcome;
}

function Round5(x)
{
    return Math.ceil(x/5)*5;
}

function PlusMinus()
{
    return (RandomInt(1,2) == 1) ? 1 : -1;
}

function Polar(boolean)
{
    return (boolean) ? 1 : -1;
}

function RandomPickProperty (obj)
{
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
}

function CountValuesInArrayOfObjects(array, prop, value)
{
    var n = 0; var l = array.length;
    for(var i = 0; i < l; i++)
    {
        if(array[i[prop]] == value){n++;}
    }
    return n;
}

function CountValuesInArray(array, value)
{
    var n = 0; var l = array.length;
    for(var i = 0; i < l; i++){if(array[i] == value){n++;};}
    return n;
}

function Plural1(str, some_int)
{
    return str (some_int > 1) ? str + "s" : str;
}

function Plural2(str, some_int, capitalize = false)
{
    if(some_int == 1){return (capitalize) ? Capitalize(str) : str;}

    const dictionary =
    {
        person:{plural:"people"},
        is:{plural:"are"},
        was:{plural:"were"}
    }

    if(dictionary.hasOwnProperty(str))
    {
        return (capitalize) ? Capitalize(dictionary[str].plural) : dictionary[str].plural;
    }
    else
    {
        return (capitalize) ? Capitalize(str) : str;
    }
}

function Capitalize(str)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function HumanifyString(str)
{
    return str.replace(/_/g, ' ');
}

function WrapP(str)
{
    return '<p>' + str + '</p>';
}

function SetCookie(cookie_name, cookie_value, days)
{
    let d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cookie_name + "=" + cookie_value + ";" + expires + ";path=/";
}

function GetCookie(cookie_name)
{
    let name = cookie_name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++)
    {
        let c = ca[i];
        while(c.charAt(0) == ' ')
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0)
        {
            return c.substring(name.length, c.length);
        }
    }
    return "empty";
}

function DeleteCookie(name) //for some reason doesn't work
{
    document.cookie = name +'=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function MarkCookie(name)
{
    SetCookie(name, "empty", 0);
}

function WrapAround(value, min, max)
{
    if(max < min){return value;}
    if(value >= min && value <= max){return value;}

    let new_value = value;
    if(value < min)
    {
        while (new_value < min)
        {
            new_value = max - (min - new_value);
        }
        return new_value;
    }
    else
    {
        while (new_value > max)
        {
            new_value = min + (new_value - max);
        }
        return new_value;
    }
}

function StrToLowerAndSpacesToUnderscores(string)
{
    let str = string.toLowerCase();
    str = str.replace(/ /g, '_');
    return str;
}

function Clamp(value, min, max = Infinity)
{
    if(min >= max)
    {
        const x = min;
        min = max;
        max = x;
    }
    if(value < min){return min;}
    if(value > max){return max;}
    return value;
}

function PadWith0(n, desired_length)
{
    let str = "" + n;
    if(str.length >= desired_length){return str;}
    const needed_0 = desired_length - str.length;
    for(let i = 0; i < needed_0; i++)
    {
        str = "0" + str;
    }
    return str;
}

//  ================= end of utility script ================