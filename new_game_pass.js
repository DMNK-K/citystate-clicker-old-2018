"use strict";
//===========================  initial unlocking pass if the game is new  =============================|


if(HasSave() == false)
{
    for(let b in bld)
    {
        if(bld[b].hasOwnProperty("req"))
        {
            if(bld[b].req.length == 0)
            {
                //unlock building
                UnlockThing(bld[b], true, 0);
            }
        }
        else
        {
            alert("BLD " + bld[b] + " has no req property.");
        }
    }
}
$('#stone_button').attr('disabled', true);
$('#metal_button').attr('disabled', true);
InitiateGatherButtons();