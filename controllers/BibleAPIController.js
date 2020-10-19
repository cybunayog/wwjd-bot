import { callBibleAPI, callESV, callESVPassage } from '../utils/CallAPI.js';

export function fetchVerses(query) {
    let verseData = callBibleAPI(query)
        .then(res => {
            var data = res.data;
            console.log('fetchVerses(): ' + data);
            return data;
        })
        .catch(err => {
            console.log("fetchVerses err: " + err);
        });
    
    return verseData;
}

export function fetchESV(query) {
    let verseData = callESV(query)
        .then(res => {
            var data = res;
            console.log("fetchESV(): "+ data);
            return data;
        })
        .catch(err => {
            console.log("fetchESV err: " + err);
        });
    
    return verseData;
}

export function fetchPassage(query) {
    let passageData = callESVPassage(query)
        .then(res => {
            var data = res;
            console.log("fetchPassage()", data);
            return data;
        })
        .catch(err => {
            console.log("fetchPassage err:", err);
        });
    
    return passageData;
}