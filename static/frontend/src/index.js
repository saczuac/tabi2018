import $ from 'jquery';
import h from 'hyperscript';

import PollAPIClient from './polls';

import Highcharts from 'highcharts';

import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module.
Exporting(Highcharts);

let generalPolls = [];

$("#graph1-select").on('change', function() {
	drawGeneralPollsFromYear(this.value)
});

$("#graph2-select-year").on('change', function() {
	drawSelectUniversitiesGroup(this.value);
});

const drawSelectUniversitiesGroup = year => {
	$('#graph2-select-university').empty();

	const generalPollYear = getPollsFromYear(year);

	const universitiesGroup = getUniversitiesGroup(generalPollYear);

	for (var universityGroup in universitiesGroup) {
		$('#graph2-select-university').append(`<option value="${universityGroup}">${universityGroup}</option>`);
	}
}

const getUniversitiesGroup = poll => {
	var universitiesGroup = [];

	poll.forEach(el => universitiesGroup.indexOf(el.university_group) === -1 ? universitiesGroup.push(el.university_group) : null)

	return universitiesGroup;
}


const getPollsFromYear = year => {
	return generalPolls.map(poll => {
		if (poll.year == year) return ({ university_group: poll.university_group, y: poll.center_votes })
	}).filter(e => e != null);
}


const drawGeneralPollsFromYear = year => {
  const generalPollYear = getPollsFromYear(year);

  const groupedPollYear = groupBy(generalPollYear, 'university_group');

  drawGeneralPoll(groupedPollYear, `Elecciones Estudiantiles ${year}`, "graph1-chart")
}

const groupBy = (arr, property) => {
	var groups = {};

	arr.forEach(el => {
		let groupName = el[property];

		if (!groups[groupName]) groups[groupName] = 0;

		groups[groupName] += el.y;
	})

	let groupedArray = [];

	for (var groupName in groups) {
	  groupedArray.push({[`${property}`]: groupName, y: groups[groupName]})
	}

	return groupedArray;
}


const drawGeneralPoll = (poll, title, container) => {
	Highcharts.chart(container, {
	    chart: {
	        plotBackgroundColor: null,
	        plotBorderWidth: null,
	        plotShadow: false,
	        type: 'pie'
	    },
	    title: {
	        text: title
	    },
	    tooltip: {
	        pointFormat: '{series.university_group}: <b>{point.y:.1f} votes</b>'
	    },
	    plotOptions: {
	        pie: {
	            allowPointSelect: true,
	            cursor: 'pointer',
	            dataLabels: {
	                enabled: true,
	                format: '<b>{point.university_group}</b>: {point.y:.1f} votes',
	                style: {
	                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                }
	            }
	        }
	    },
	    series: [{
	        name: 'Brands',
	        colorByPoint: true,
	        data: poll
	    }]
	});
}

const fetchPolls = _ => {
  PollAPIClient.getPolls().then(polls => {
      console.log(polls, 'VOTOS DESDE API');

      if (polls) {
      	generalPolls = polls;
      }
  })
}

// FETCH PRODUCTS IF LIST
if (window.location.pathname == '/') {
  fetchPolls();
} else {
  // Something else
}
