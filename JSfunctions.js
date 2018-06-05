/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global data */
// document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2)

//var members;
var mainMembers;

var app = new Vue({
    el: '#app',
    data: {
        members: [],
        state:[]
    },
});


//VARIABLES GENERALES - NO NECESITAN DE LOS DATOS--------
var houseUrl = "https://api.propublica.org/congress/v1/113/house/members.json";
var senateUrl = "https://api.propublica.org/congress/v1/113/senate/members.json";
var rep = document.getElementById("rep");
var dem = document.getElementById("dem");
var ind = document.getElementById("ind");
var drop = document.getElementById("state");

var dataCategory = document.getElementsByTagName("body")[0];
var contentDataCategory = dataCategory.getAttribute("data-category");

if (contentDataCategory == "senate") {
    callApiData(senateUrl);
} else if (contentDataCategory == "house") {
    callApiData(houseUrl);
}

function hide() {
    document.getElementById('ShowMoreBt').style.display = 'none';
}
function hideless() {
    document.getElementById('ShowMoreBt').style.display = 'block';
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
    app.mainMembers = json["results"][0]["members"];
    app.members = json["results"][0]["members"];

    rep.addEventListener('click', filtroParty);
     dem.addEventListener('click', filtroParty);
     ind.addEventListener('click', filtroParty);
     drop.addEventListener('change', filtroParty);
     /*buildTable(members);*/
    app.state=dropDownCreator();
    document.getElementById("load").style.display = "none";
}

function onConversionToJsonFailed() {
    console.log("Not a json mate!");
    document.getElementById("load").style.display = "none";
}
//END TO THE OUTSIDE CALLING DATA-------------------------------------

//FILTER BY PARTY-------------------
function filtroParty() {
    var members = app.mainMembers;
    var resultsParty = [];
    var currentSelect = document.getElementById("state").value;
    for (var i = 0; i < members.length; i++) {
        if (currentSelect === members[i]['state'] || currentSelect === "all") {
            if (rep.checked && members[i]['party'] === "R") {
                resultsParty.push(members[i]);
            }
            if (dem.checked && members[i]['party'] === "D") {
                resultsParty.push(members[i]);
            }
            if (ind.checked && members[i]['party'] === "I") {
                resultsParty.push(members[i]);
            }
        }

    }
    app.members = resultsParty;
    //buildTable(resultsParty);
}

//FILTER BY STATE-----------------

function dropDownCreator() {
    var members = app.mainMembers;
    var stateList = [];
    for (var i = 0; i < members.length; i++) {
        if (stateList.includes(members[i]['state']) !== true) {
            stateList.push(members[i]['state']);
        }
    }

    stateList.sort();
    
    for (var j = 0; j < stateList.length; j++) {
        var drop = document.getElementById('state');
        var opt = document.createElement("option");
        drop.appendChild(opt);
        opt.innerHTML = (stateList[j]);
    }
}
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
