var fs = require('fs');

var SettingsHandler = module.exports = function ()
{
    this.local = {};
    this.remote = {};
    this.defaults = {};

    this.loadDefaults()
    this.loadSettings();
}

SettingsHandler.prototype.loadSettings = function ()
{
    if (global.window.localStorage.settings)
        this.local = JSON.parse(global.window.localStorage.settings);
    else
        this.local = $.extend(true, {}, nvirc.settings.default);
}

SettingsHandler.prototype.loadDefaults = function ()
{
    this.defaults = JSON.parse(fs.readFileSync('data/default-settings.json'));

    // Not really needed at time of writing
    // recurse(this.defaults);
    // function recurse(obj, ns)
    // {
    //     for (key in obj)
    //     {
    //         if (typeof obj[key] == 'object')
    //             recurse(obj[key], ns + '.' + key)

    //         else
    //         {
    //             console.log(ns, key);
    //         }
    // }
}

SettingsHandler.prototype.set = function (path, value)
{
    if (!/^(local|remote)(\.[^a-z_]+)+/i.test(path))
        throw "Invalid path: " + path;

    var obj = this;
    path = path.split('.');

    var local = path[0] == 'local';

    while (path.length > 1)
    {
        if (obj[path[0]] == undefined) obj[path[0]] = {};
        obj = obj[path.shift()];
    }

    if (typeof(obj[path[0]]) == 'object') throw path + " is an object";

    obj[path.shift()] = value;

    if (local) localStorage.settings = JSON.stringify(nvirc.settings.local);
}

SettingsHandler.prototype.get = function (path)
{
    if (!/^(local|remote)(\.[^a-z_]+)+/i.test(path))
        throw "Invalid path: " + path;

    var obj = self;
    path = path.split('.');

    while (path.length > 0)
    {
        obj = obj[path.shift()];
        if (obj == undefined) return null;
    }

    return obj;
}
