/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global data */

//document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2)

//var members = (data["results"][0]["members"]);
var members;
var output = document.getElementById("senate-data");
var houseUrl = "https://api.propublica.org/congress/v1/113/house/members.json";
var senateUrl = "https://api.propublica.org/congress/v1/113/senate/members.json";

//VARIABLES GENERALES - NO NECESITAN DE LOS DATOS--------
var statistics = [
    {
        party: "Republican",
        //number: 0,
        average: 0,
    },
    {
        party: "Democrat",
        //number: 0,
        average: 0,
    },
    {
        party: "Independent",
        //number: 0,
        average: 0,
    },
    {
        party: "TOTAL",
        //number: 0,
        average: 0,
    },
]

var repVotes = [];
var demVotes = [];
var indVotes = [];
var totalVotes = [];

var dataCategory = document.getElementsByTagName("body")[0];
var contentDataCategory = dataCategory.getAttribute("data-category");

if (contentDataCategory == "senate") {
    callApiData(senateUrl);
} else if (contentDataCategory == "house") {
    callApiData(houseUrl);
}


// CALLING THE OUTSIDE DATA - API--------------------------------------------------

function callApiData(outsideData) {
    fetch(outsideData, {
            method: "GET",
            headers: new Headers({
                "X-API-Key": "f8aZi0RKU1ANfVzY7Rj3edJ6I1RuG2PmF5CuaFba"
            })
        })
        .then(onDataFetched)
        .catch(onDataFetchFailed);
}

function onDataFetched(response) {
    response.json()
        .then(onConversionToJsonSuccessful)
        .catch(onConversionToJsonFailed);
}

function onDataFetchFailed(error) {
    console.log("I have failed in life.", error);
}

function onConversionToJsonSuccessful(json) {
    console.log("success!!!!", json);
    members = json["results"][0]["members"];

    //Array members duplicated and sorted ordered by the parameter missed votes
    var memAscMissedVotes = members.slice(0).sort(function (a, b) {
        return (a.missed_votes - b.missed_votes);
    });
    var memDescMissedVotes = members.slice(0).sort(function (a, b) {
        return (b.missed_votes - a.missed_votes);
    });
    var memAscPartyVotes = members.slice(0).sort(function (a, b) {
        return (a.total_votes - b.total_votes);
    });
    var memDescPartyVotes = members.slice(0).sort(function (a, b) {
        return (b.total_votes - a.total_votes);
    });


    var dataStatisticsType = document.getElementsByTagName("body")[0];
    var contentDataStatisticsType = dataStatisticsType.getAttribute("data-statisticsType");

    if (contentDataStatisticsType == "attendance") {
        statisticsTable(getTenPct(memAscMissedVotes), "senateStatistics");
        statisticsTable(getTenPct(memDescMissedVotes), "senateStatisticsMore");
    } else if (contentDataStatisticsType == "partyLoyalty") {
        statisticsTableParty(getTenPctParty(memAscPartyVotes), "partyStatisticsLess");
        statisticsTableParty(getTenPctParty(memDescPartyVotes), "partyStatisticsMore");
    }
    getTotalVotes(members);

    getDataObject(repVotes, 0, statistics);
    getDataObject(demVotes, 1, statistics);
    getDataObject(indVotes, 2, statistics);
    getDataObject(totalVotes, 3, statistics);

    fillTable(statistics);
    document.getElementById("load").style.display = "none";
}

function onConversionToJsonFailed() {
    console.log("Not a json mate!");
}
//END TO THE OUTSIDE CALLING DATA-------------------------------------


function getTotalVotes(membersArray) {
    for (var i = 0; i < membersArray.length; i++) {
        if (membersArray[i]['votes_with_party_pct'] != null) {
            totalVotes.push(membersArray[i]['votes_with_party_pct']);
            if (membersArray[i]['party'] === 'R') {
                repVotes.push(membersArray[i]['votes_with_party_pct']);
            }
            if (membersArray[i]['party'] === 'D') {
                demVotes.push(membersArray[i]['votes_with_party_pct']);
            }
            if (membersArray[i]['party'] === 'I') {
                indVotes.push(membersArray[i]['votes_with_party_pct']);
            }
        }
    }
}

function getDataObject(membersArray, position, myObject) {
    var sum = 0;
    var average = 0;
    for (var i = 0; i < membersArray.length; i++) {
        sum += membersArray[i];

    }
    average = sum / membersArray.length;
    myObject[position]['number'] = membersArray.length;
    myObject[position]['average'] = average.toFixed(2);
    if (membersArray.length == 0) {
        myObject[position]['average'] = 0.00;
    }
}

function fillTable(array) {
    for (i = 0; i < array.length; i++) {
        var tr = document.createElement('tr');
        var party = array[i].party;
        var number = array[i].number;
        var average = array[i].average;
        tr.insertCell().innerHTML = party;
        tr.insertCell().innerHTML = number;
        tr.insertCell().innerHTML = average;

        document.getElementById("table1").appendChild(tr);
    }
}

function getTenPct(membersArray) {
    var memTenPct = [];
    for (var i = 0; i < membersArray.length; i++) {
        if (membersArray[i]['missed_votes'] == null) {
            membersArray[i]['missed_votes'] = 0;
        }
        if (i <= membersArray.length * 0.1) {
            memTenPct.push(membersArray[i]);
        } else if (i > membersArray.length * 0.1 && membersArray[i - 1]['missed_votes'] === membersArray[i]['missed_votes']) {
            memTenPct.push(membersArray[i]);
        } else {
            break;
        }
    }
    return memTenPct;
}

function statisticsTable(membersArray, table) {

    var tbody = document.getElementById(table);
    tbody.innerHTML = "";

    for (var i = 0; i < membersArray.length; i++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var tdName = document.createElement("td");
        var a = document.createElement("a");
        var tdMiss = document.createElement("td");
        var tdMissPct = document.createElement("td");

        tr.appendChild(tdName);
        if ((membersArray[i]['middle_name']) === ' ') {
            a.innerHTML = (membersArray[i]['first_name']) + ' ' + ((membersArray[i]['middle_name']) || 'null') + ' ' + (membersArray[i]['last_name']);
        } else {
            a.innerHTML = (membersArray[i]['first_name']) + ' ' + (membersArray[i]['last_name']);
        }
        tdName.appendChild(a);
        a.setAttribute("href", membersArray[i]['url']);
        a.setAttribute("target", "_blank");
        //no funciona el link

        tr.appendChild(tdMiss);
        tdMiss.textContent = (membersArray[i]['missed_votes']);


        tr.appendChild(tdMissPct);
        tdMissPct.textContent = (membersArray[i]['missed_votes_pct']);

    }
}

function getTenPctParty(membersArray) {
    var memTenPct = [];
    for (var i = 0; i < membersArray.length; i++) {
        if (membersArray[i]['votes_with_party_pct'] == null) {
            membersArray[i]['votes_with_party_pct'] = 0;
        }
        if (i <= membersArray.length * 0.1) {
            memTenPct.push(membersArray[i]);
        } else if (i > membersArray.length * 0.1 && membersArray[i - 1]['votes_with_party_pct'] === membersArray[i]['votes_with_party_pct']) {
            memTenPct.push(membersArray[i]);
        } else {
            break;
        }
    }
    return memTenPct;
}

function statisticsTableParty(membersArray, table) {

    var tbody = document.getElementById(table);
    tbody.innerHTML = "";

    for (var i = 0; i < membersArray.length; i++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var tdName = document.createElement("td");
        var a = document.createElement("a");
        var tdParty = document.createElement("td");
        var tdPartyPct = document.createElement("td");

        tr.appendChild(tdName);
        if ((membersArray[i]['middle_name']) === ' ') {
            a.innerHTML = (membersArray[i]['first_name']) + ' ' + ((membersArray[i]['middle_name']) || 'null') + ' ' + (membersArray[i]['last_name']);
        } else {
            a.innerHTML = (membersArray[i]['first_name']) + ' ' + (membersArray[i]['last_name']);
        }
        tdName.appendChild(a);
        a.setAttribute("href", membersArray[i]['url']);
        a.setAttribute("target", "_blank");
        //no funciona el link

        tr.appendChild(tdParty);
        tdParty.textContent = (membersArray[i]['total_votes']);


        tr.appendChild(tdPartyPct);
        tdPartyPct.textContent = (membersArray[i]['votes_with_party_pct']);

    }
}
//SCROLL-BACK TO TOP
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}