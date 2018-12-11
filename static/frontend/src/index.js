import $ from 'jquery';
import h from 'hyperscript';

import PollAPIClient from './polls';

import Highcharts from 'highcharts';

import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module.
Exporting(Highcharts);

let generalPolls = [];
let generalUniversities = [];

let selectedYear = null;
let selectedUniversity = null;
let selected2University = null;


$("#graph1-select").on('change', function() {
	drawGeneralPollsFromYear(this.value)
});

$("#graph2-select-year").on('change', function() {
	selectedYear = this.value;

	drawSecondGraph();
});

$("#graph2-select-university").on('change', function() {
	selectedUniversity = this.value;

	drawSecondGraph();
});

$("#graph3-select-university").on('change', function() {
	selected2University = this.value;

	drawStackChart(generalPolls, selected2University);
});

const drawUniversitiesSelect = (universities, select='#graph2-select-university') => {
	universities.forEach(university => {
		$(select).append(`<option value="${university.name}">${university.name}</option>`);
	})
}

const drawSecondGraph = _ => {
	if (!selectedUniversity || !selectedYear) return;

	const notGeneralPollYear = getPollsFromYear(selectedYear, selectedUniversity);

	const groupedPollYear = groupBy(notGeneralPollYear, 'university_group');

	drawGeneralPoll(groupedPollYear, `Elecciones Estudiantiles ${selectedYear} - ${selectedUniversity}`, "graph2-chart")

}

const getUniversitiesGroup = poll => {
	var universitiesGroup = [];

	poll.forEach(el => universitiesGroup.indexOf(el.university_group) === -1 ? universitiesGroup.push(el.university_group) : null)

	return universitiesGroup;
}


const getPollsFromYear = (year, university=null) => {
	return generalPolls.map(poll => {
		if (university) {
			if (poll.year == year && poll.university_school == university) return ({ university_group: poll.university_group, y: poll.center_votes });
			return null;
		}

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

const fetchUniversities = _ => {
  PollAPIClient.getUniversities().then(universities => {
      console.log(universities, 'UNIVERSIDADES DESDE API');

      drawUniversitiesSelect(universities);
      drawUniversitiesSelect(universities, '#graph3-select-university');

      if (universities) {
      	generalUniversities = universities;
      }
  })
}


const drawStackChart = (polls, university)  => {
	const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018];

	let pollsPerYear = [];

	let pollsPerYearObj = {};

	let allGroups = [];

	years.forEach(year => {
		let generalPollYear = getPollsFromYear(year, university);

		let allGroupsFromYear = generalPollYear.map(gpy => gpy.university_group);

		allGroupsFromYear.forEach(g => {
			if (allGroups.indexOf(g) === -1) {
				allGroups.push(g);
				pollsPerYearObj[g] = [];

				let yearsPast = years.indexOf(year);

				for (let i = 0; i < yearsPast; i++) {
					pollsPerYearObj[g].push(0)
				}
			}
			
		});

		const groupsNotAppearThisYear = allGroups.filter(g => allGroupsFromYear.indexOf(g) === -1);

		groupsNotAppearThisYear.forEach(g => {
			pollsPerYearObj[g].push(0); // 0 votes this year
		})

		generalPollYear.forEach(pollYear => {
			if (!pollsPerYearObj[pollYear.university_group]) pollsPerYearObj[pollYear.university_group] = [];

			pollsPerYearObj[pollYear.university_group].push(pollYear.y)
		})
	});


	Object.keys(pollsPerYearObj).forEach(group => {
		pollsPerYear.push({
			name: group,
			data: pollsPerYearObj[group]
		})
	})

	stackChart(pollsPerYear, `Evolución cantidad de votos por año por agrupación en ${university}`, 'graph3-chart')
}


const stackChart = (data, title, container) => {
	Highcharts.chart(container, {

	    title: {
	        text: title
	    },

	    subtitle: {
	        text: ''
	    },

	    yAxis: {
	        title: {
	            text: 'Cantidad de votos'
	        }
	    },
	    legend: {
	        layout: 'vertical',
	        align: 'right',
	        verticalAlign: 'middle'
	    },

	    plotOptions: {
	        series: {
	            label: {
	                connectorAllowed: false
	            },
	            pointStart: 2012
	        }
	    },

	    series: data,
	    responsive: {
	        rules: [{
	            condition: {
	                maxWidth: 500
	            },
	            chartOptions: {
	                legend: {
	                    layout: 'horizontal',
	                    align: 'center',
	                    verticalAlign: 'bottom'
	                }
	            }
	        }]
	    }

	});
}

// FETCH PRODUCTS IF LIST
if (window.location.pathname == '/') {
  fetchPolls();
  fetchUniversities();
} else {
  // Something else
}
