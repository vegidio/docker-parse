module.exports =
{
    buildConnectionUrl: (env, appId) =>
    {
        let url = env.DB_HOST;

        // Add username & password
        if (typeof env.DB_USERNAME !== 'undefined' && typeof env.DB_PASSWORD !== 'undefined') {
            let creds = env.DB_USERNAME + ':' + env.DB_PASSWORD + '@';
            let pos = url.indexOf('://') + 3;
            url = url.substring(0, pos) + creds + url.substring(pos);
        }

        url += '/parse_' + appId;
        if (url.startsWith('mongodb://')) url += '?authSource=admin';

        return url;
    }
};