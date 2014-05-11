var fs = require('fs');

var xml = fs.readFileSync('data/settings.xml'),
    $xml = $( $.parseXML(xml.toString()) ).children(0),
    nvirc = global.nvirc;

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

                            if (attr == 'curvalue') return nvirc.settings.get(fielddata.attr('path'));
                            if (attr == 'contents') return fielddata.text();

                            return fielddata.attr(attr) || '';
                        });

                        var field = $(fieldhtml);

                        switch (fielddata[0].tagName)
                        {
                            case 'string':

                                if (fielddata.attr('masked'))
                                    field.find('input').attr('type', 'password');

                                field.find('input').blur(function ()
                                {
                                    nvirc.settings.set($(this).data('path'), $(this).val());
                                });

                                break;

                            case 'number':

                                field.find('input').blur(function ()
                                {
                                    nvirc.settings.set($(this).data('path'), Number($(this).val()));
                                });

                                break;
                        }

                        fieldset.append(field);
                    });
                });
            })
    );
});

$('#settings-menu li:first-child').click();
