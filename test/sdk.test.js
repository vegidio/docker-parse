const Parse = require('parse/node');

beforeAll(() => {
    Parse.initialize('app1');
    Parse.serverURL = 'http://localhost:1337/app/app1';

    expect.assertions(3);
});

describe('Test the Parse SDK', () =>
{
    test('Create Parse object', () =>
    {
        let Movie = Parse.Object.extend('Movie');

        let movie = new Movie();
        movie.set('name', 'Indiana Jones');
        movie.set('releaseDate', new Date(Date.UTC(1981, 5, 12)));
        movie.set('rating', 8.5);

        return movie.save()
            .then((obj) => {
                expect(obj.get('name')).toBe('Indiana Jones');
                expect(obj.get('releaseDate')).toEqual(new Date(Date.UTC(1981, 5, 12)));
                expect(obj.get('rating')).toBe(8.5);
            });
    });

    test('Query Parse object', () =>
    {
        let Movie = Parse.Object.extend('Movie');

        let query = new Parse.Query(Movie);
        query.equalTo('name', 'Indiana Jones');

        return query.find()
            .then((objs) => {
                let obj = objs[0];
                expect(obj.get('name')).toBe('Indiana Jones');
                expect(obj.get('releaseDate')).toEqual(new Date(Date.UTC(1981, 5, 12)));
                expect(obj.get('rating')).toBe(8.5);
            });
    });
});
