import $ from 'jquery';
import h from 'hyperscript';

import PollAPIClient from './polls';


const drawPolls = polls => {
  console.log(polls, 'DRAW IT !')
}

const fetchPolls = _ => {
  PollAPIClient.getPolls().then(polls => {
      console.log(polls, 'VOTOS DESDE API');

      polls && drawPolls(polls);
  })
}

// FETCH PRODUCTS IF LIST
if (window.location.pathname == '/') {
  fetchPolls();
} else {
  // Something else
}
