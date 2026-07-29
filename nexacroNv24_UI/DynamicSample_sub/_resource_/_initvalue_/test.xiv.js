if (nexacro_init)
{
    nexacro_init.Buttoniv_Button0 = function(obj)
    {
    	obj.set_accessibilityenable("false");
    	obj.set_defaultbutton("true");
    	obj.set_background("black");
    	obj.set_accessibilitylabel("initvalue세팅 00");
    	obj.set_color("white");
    };

    nexacro_init.Buttoniv_Button1 = function(obj)
    {
    	obj.set_background("indigo");
    	obj.set_accessibilityenable("true");
    	obj.set_accessibilitylabel("initvalue세팅 01");
    	obj.set_color("white");
    };
}
