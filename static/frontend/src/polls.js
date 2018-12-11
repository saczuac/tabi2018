import 'whatwg-fetch';
import Config from './config';


const PollAPIClient = {
    polls: null,

    universities: null,

    getCookie: name => {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    getPolls: _ => {
        const url = `/api/polls/`;

        return fetch(url, {
                    credentials: 'same-origin',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-csrftoken': PollAPIClient.getCookie('csrftoken')
                    },
                })
                .then(response => {
                    if (response.status === 200) return response.json();
                })
                .then(polls => {
                    PollAPIClient.polls = polls;
                    return polls;
                })
                .catch(e => false);
    },

    getUniversities: _ => {
        const url = `/api/polls/universities/`;

        return fetch(url, {
                    credentials: 'same-origin',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-csrftoken': PollAPIClient.getCookie('csrftoken')
                    },
                })
                .then(response => {
                    if (response.status === 200) return response.json();
                })
                .then(universities => {
                    PollAPIClient.universities = universities;
                    return universities;
                })
                .catch(e => false);
    },
};

export default PollAPIClient;