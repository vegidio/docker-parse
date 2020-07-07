import * as Parse from 'parse/node'
import * as moment from 'moment'

class Movie extends Parse.Object {
    constructor() {
        super('Movie')
    }
}

beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Parse as any).serverURL = 'http://localhost/app/app1'
    Parse.initialize('app1')
    Parse.Object.registerSubclass('Movie', Movie)

    expect.assertions(3)
});

describe('Test the Parse SDK', () =>
{
    test('Create Parse object', () => {
        const movie = new Movie()
        movie.set('name', 'Indiana Jones')
        movie.set('releaseDate', moment.utc([1981, 5, 12]).toDate())
        movie.set('rating', 8.5)

        return movie.save()
            .then(obj => {
                expect(obj.get('name')).toBe('Indiana Jones')
                expect(obj.get('releaseDate')).toEqual(moment.utc([1981, 5, 12]).toDate())
                expect(obj.get('rating')).toBe(8.5)
            })
    })

    test('Query Parse object', () => {
        const query = new Parse.Query(Movie)
        query.equalTo('name', 'Indiana Jones')

        return query.find()
            .then((objs) => {
                const obj = objs[0]
                expect(obj.get('name')).toBe('Indiana Jones')
                expect(obj.get('releaseDate')).toEqual(moment.utc([1981, 5, 12]).toDate())
                expect(obj.get('rating')).toBe(8.5)
            })
    })
})