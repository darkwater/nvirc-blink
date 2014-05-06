var nw = require('nw.gui');

document.body.onkeypress = function (a)
{
    switch (String.fromCharCode(a.charCode))
    {
        case 'r':
            location.reload();
            break;

        case 'i':
            nw.Window.get().showDevTools();
            break;
    }
}

$('#application-menu > li > button').click(function ()
{
    var active = $('#application-menu > li > button.active');

    active.removeClass('active');

    if (active[0] != this)
        $(this).addClass('active');
})
.hover(function ()
{
    var active = $('#application-menu > li > button.active');
    if (active.length > 0)
    {
        active.removeClass('active');
        $(this).addClass('active');
    }
});

$('main, #application-menu > li > menu button').click(function ()
{
    $('#application-menu > li > button.active').removeClass('active');
});
