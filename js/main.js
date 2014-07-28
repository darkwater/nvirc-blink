var nw = require('nw.gui'),
    fs = require('fs'),
    tls = require('tls'),
    win = nw.Window.get(),
    SettingsHandler = require('./js/settingshandler.js');

var nvirc = {};
global.nvirc = nvirc;

global.window = window;

// Loosely following the Semantic Versioning system
nvirc.version = { major: 0, minor: 1, patch: 0 };
nvirc.version.string = 'nvirc-blink ' + nvirc.version.major
                                + '.' + nvirc.version.minor
                                + '.' + nvirc.version.patch;

nvirc.settings = new SettingsHandler();

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

nvirc.connect = function () // {{{
{
    if (nvirc.connection) nvirc.connection.end();

    nvirc.connection = tls.connect({
        host: nvirc.settings.local.daemon.host,
        port: nvirc.settings.local.daemon.port,
        rejectUnauthorized: false
    }, function ()
    {
        this.setEncoding('utf8');
        this.write(nvirc.version.string);
        this.once('data', function (data)
        {
            var res;
            if (!(res = data.match(/^(nvircd[a-z0-9-]*) [0-9a-z](\.[0-9a-z])*$/)))
            {
                console.log(res);
                conn.end();
                return;
            }

            console.log('Connection: ' + res[0]);

            this.write(new Buffer(nvirc.settings.local.daemon.password));

            function badPassword(e)
            {
                console.log(e);
                alert('Bad password.');
            }
            this.once('end', badPassword);
            this.once('data', function (data)
            {
                if (data == 'OK')
                {
                    this.removeListener('end', badPassword);

                    // Success!

                    this.on('data', function (data)
                    {
                        if (data == 'PING')
                        {
                            data.write('PONG');
                        }
                        else if (data == 'PONG')
                        {
                            console.log('Pong!');
                        }
                        else
                        {

                        }
                    });

                    setInterval(function ()
                    {
                        nvirc.connection.write('PING');
                    }, 5000);
                }
            });
        });
    })
    .on('end', function ()
    {
        delete nvirc.connection;
    });
} // }}}

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

$('#application, #application-menu > li > menu li:not(.separator)').click(function (e)
{
    $('#application-menu > li.active').removeClass('active');
}); // }}}

// {{{ Server list
$('#server-list .server').click(function ()
{
    $(this).toggleClass('active');
}); // }}}

win.on('close', function ()
{
    win.hide();

    if (nvirc.settingsPanel) nvirc.settingsPanel.close();

    win.close(true);
});
