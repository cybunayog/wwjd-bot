// const request = require('request');
import request from 'request';

export async function callBibleAPI(query) {
    const options = {
        'method': 'GET',
        'url': `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/search?query=${query}`,
        'headers': {
            'api-key': process.env.BIBLE_API_TOKEN,
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) return reject(error);
            try {
                const apiResponse = resolve(JSON.parse(response.body));
                return apiResponse;
            } catch (e) {
                reject("callAPI() error: " + e);
            }
        });
    });
}

// TODO: Make API endpoints dynamic
export async function callESV(query) {
    const options = {
        'method': 'GET',
        'url': `https://api.esv.org/v3/passage/search/?q=${query}`,
        'headers': {
            'Authorization': `Token ${process.env.ESV_API_TOKEN}`
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) return reject(err);
            try {
                const apiResponse = resolve(JSON.parse(response.body));
                return apiResponse;
            } catch (e) {
                reject("callESV() error: " + e);
            }
        })
    });
}

export async function callESVPassage(query) {
    const options = {
        'method': 'GET',
        'url': `https://api.esv.org/v3/passage/text/?q=${query}&include-footnotes=false&include-headings=false&include-verse-numbers=false`,
        'headers': {
            'Authorization': `Token ${process.env.ESV_API_TOKEN}`
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) return reject(err);
            try {
                const apiResponse = resolve(JSON.parse(response.body));
                return apiResponse;
            } catch (e) {
                reject("callESV() error: " + e);
            }
        })
    });
}
