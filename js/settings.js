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

$xml.children().each(function (_, sectiondata)
{
    sectiondata = $(sectiondata);

    $('#settings-menu').append
    (
        $('<li />').text($(sectiondata).attr('label'))
            .prepend($('<i />').addClass('fa fa-fw fa-' + $(sectiondata).attr('icon')))
            .click(function ()
            {
                $('#settings-menu li.active').removeClass('active');
                $(this).addClass('active');

                var main = $('main').html('');

                $(sectiondata).find('fieldset').each(function (_, setdata)
                {
                    setdata = $(setdata);

                    var fieldset = $('<section />').appendTo(main)
                        .append($('<h2 />').text(setdata.attr('label')));

                    setdata.children().each(function (_, fielddata)
                    {
                        fielddata = $(fielddata);

                        var fieldhtml = $('#f-' + setdata.attr('layout') +'-'+ fielddata[0].tagName.toLowerCase()).html();
                        if (!fieldhtml) return;

                        fieldhtml = fieldhtml.replace(/%[A-Z]+%/g, function (attr)
                        {
                            attr = attr.match(/[A-Z]+/)[0].toLowerCase();

                            if (attr == 'curvalue') return '';

                            return fielddata.attr(attr) || '';
                        });

                        var field = $(fieldhtml);

                        switch (fielddata[0].tagName)
                        {
                            case 'string':

                                if (fielddata.attr('masked'))
                                    field.find('input').attr('type', 'password');

                                break;
                        }

                        fieldset.append(field);
                    });
                });
            })
    );
});

$('#settings-menu li:first-child').click();
