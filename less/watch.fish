#!/usr/bin/fish

inotifywait -e CLOSE_WRITE -m . \
    | grep -oE '.less$' --line-buffered \
    | while read
        date
        for file in main.less settings.less
            lessc $file > ../css/(basename $file .less).css
        end
        true
    end
