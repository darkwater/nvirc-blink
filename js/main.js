var nw = require('nw.gui'),
    fs = require('fs'),
    win = nw.Window.get();

var nvirc = {};
global.nvirc = nvirc;

nvirc.settings = { local: {}, remote: {} }; // {{{
nvirc.settings.default = JSON.parse(fs.readFileSync('data/default-settings.json'));

if (localStorage.settings)
    nvirc.settings.local = JSON.parse(localStorage.settings);
else
    nvirc.settings.local = $.extend(true, {}, nvirc.settings.default);

nvirc.settings.get = function (path)
{
    var obj = nvirc.settings;
    path = path.split('.');

    while (path.length > 0)
    {
        obj = obj[path.shift()];
        if (obj == undefined) return null;
    }

    return obj;
}

nvirc.settings.set = function (path, value)
{
    var obj = nvirc.settings;
    path = path.split('.');

    var local = path[0] == 'local';

    while (path.length > 1)
    {
        if (obj[path[0]] == undefined) obj[path[0]] = {};
        obj = obj[path.shift()];
    }

    if (typeof(obj[path[0]]) == 'object') return false;

    obj[path.shift()] = value;

    if (local) localStorage.settings = JSON.stringify(nvirc.settings.local);

    return true;
}
// }}}

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
    
    nvirc.settingsPanel.on('closed', function ()
    {
        delete nvirc.settingsPanel;
    });
} // }}}

win.on('close', function ()
{
    win.hide();

    if (nvirc.settingsPanel) nvirc.settingsPanel.close();

    win.close(true);
});
