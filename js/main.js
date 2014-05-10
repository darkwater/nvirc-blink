var nw = require('nw.gui'),
    win = nw.Window.get();

var nvirc = {};

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
    if (nvirc.settingsPanel)
    {
        nvirc.settingsPanel.focus();
        return;
    }

    nvirc.settingsPanel = nw.Window.open('settings.html',
    {
        title: 'nvirc',
        icon: 'img/icon.png',
        toolbar: false,
        frame: true,
        width: 700,
        height: 600,
        min_width: 400,
        min_height: 100,
        position: 'center'
    });

    nvirc.settingsPanel.on('loaded', function ()
    {
        console.log(this);
        this.window.nvirc = nvirc;
    });
    
    nvirc.settingsPanel.on('closed', function ()
    {
        nvirc.settingsPanel = null;
    });
} // }}}

win.on('close', function ()
{
    win.hide();

    if (nvirc.settingsPanel) nvirc.settingsPanel.close();

    win.close(true);
});
