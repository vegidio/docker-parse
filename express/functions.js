module.exports =
{
    buildConnectionUrl: (env, config, appId) =>
    {
        let url = 'mongodb://';

        if(typeof env.DB_HOST !== 'undefined')
        {
            // Add username & password
            if(typeof env.DB_USERNAME !== 'undefined' && typeof env.DB_PASSWORD !== 'undefined') {
                url += env.DB_USERNAME + ':' + env.DB_PASSWORD + '@';
            }

            // Add the host and database
            url += env.DB_HOST + '/' + appId + '?authSource=admin';
        }
        else
        {
            // Add username & password
            if(typeof config.DB_USERNAME !== 'undefined' && typeof config.DB_PASSWORD !== 'undefined') {
                url += config.DB_USERNAME + ':' + config.DB_PASSWORD + '@';
            }

            // Add the host and database
            url += config.DB_HOST + '/' + appId + '?authSource=admin';
        }

        return url;
    }
};