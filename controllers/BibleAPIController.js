// const callBibleAPI = require('../utils/CallAPI.js');
import { callBibleAPI } from '../utils/CallAPI.js';

export function fetchVerses(query) {
    let verseData = callBibleAPI(query)
        .then(res => {
            var data = res.data;
            return data;
        })
        .catch(err => {
            console.log("fetchVerses err: " + err);
        });
    
    return verseData;
}