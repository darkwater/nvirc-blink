var nw = require('nw.gui'),
    win = nw.Window.get();

var nvirc = {};

document.body.onkeypress = function (a)
{
    switch (String.fromCharCode(a.charCode))
    {
        case 'r':
            location.reload();
            break;

        case 'i':
            win.showDevTools();
            break;
    }
}

// {{{ Menu
$('#application-menu > li').click(function (e)
{
    if (e.target != this) return;

    var active = $('#application-menu > li.active');

    active.removeClass('active');

    if (active[0] != this)
        $(this).addClass('active');
})
.hover(function (e)
{
    if (e.target != this) return;

    var active = $('#application-menu > li.active');
    if (active.length > 0)
    {
        active.removeClass('active');
        $(this).addClass('active');
    }
});

$('main, #application-menu > li > menu li:not(.separator)').click(function (e)
{
    $('#application-menu > li.active').removeClass('active');
}); // }}}


nvirc.showSettings = function () // {{{
{
    nvirc.settingsPanel = nw.Window.open('settings.html',
    {
        title: 'nvirc',
        icon: 'img/icon.png',
        toolbar: false,
        frame: true,
        width: 700,
        height: 600,
        min_width: 200,
        min_height: 100,
        position: 'center'
    });
}
