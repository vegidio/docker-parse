import ProcessEnv = NodeJS.ProcessEnv;

export default {
    buildConnectionUrl: (env: ProcessEnv, appId: string): string =>
    {
        let url = env.DB_HOST;

        // Add username & password
        if (typeof env.DB_USERNAME !== 'undefined' && typeof env.DB_PASSWORD !== 'undefined') {
            const creds = env.DB_USERNAME + ':' + env.DB_PASSWORD + '@';
            const pos = url.indexOf('://') + 3;
            url = url.substring(0, pos) + creds + url.substring(pos);
        }

        url += '/parse_' + appId;
        if (url.startsWith('mongodb://')) url += '?authSource=admin';

        return url;
    }
}