const axios = require('axios');

let client = axios.create({
    baseURL: 'http://localhost:1337/app/app2/',
    headers: {
        'X-Parse-Application-Id': 'app2',
        'X-Parse-Master-Key': '123456',
        'Content-Type': 'application/json'
    }
});

beforeAll(() => {
    expect.assertions(3);
});

describe('Test the REST API', () =>
{
    test('Create Parse object', () =>
    {
        let body = {
            'name': 'Indiana Jones',
            'releaseDate': new Date(Date.UTC(1981, 5, 12)),
            'rating': 8.5
        };

        return client.post('classes/Movie', body)
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.data).toHaveProperty('objectId');
                expect(res.data).toHaveProperty('createdAt');
            });
    });

    test('Query Parse object', () =>
    {
        return client.get('classes/Movie')
            .then((res) => {
                let obj = res.data.results[0];
                expect(res.status).toBe(200);
                expect(obj.name).toBe('Indiana Jones');
                expect(obj.rating).toBe(8.5);
            });
    });
});
