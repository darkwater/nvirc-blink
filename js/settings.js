var fs = require('fs');

document.body.onkeypress = function (a)
{
    switch (String.fromCharCode(a.charCode))
    {
        case 'r':
            location.reload();
            break;

        case 'i':
            require('nw.gui').Window.get().showDevTools();
            break;
    }
}

var xml = fs.readFileSync('data/settings.xml');
    $xml = $( $.parseXML(xml.toString()) ).children(0);

$xml.children().each(function (si, section)
{
    $('#settings-menu').append
    (
        $('<li />').text($(section).attr('label'))
            .click(function ()
            {
                $('#settings-menu li.active').removeClass('active');
                $(this).addClass('active');

                var main = $('main').html('');

                $(section).find('fieldset').each(function (fi, set)
                {
                    var fieldset = $('<fieldset />').appendTo(main)
                        .append($('<legend />').text($(set).attr('label')));
                });
            })
    );
});

$('#settings-menu li:first-child').click();
