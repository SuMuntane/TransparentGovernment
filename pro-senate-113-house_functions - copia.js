/* eslint-env browser */
/* eslint "no-console": "off"  */
/* global data */
// document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2)

var members = (data["results"][0]["members"]);


var rep = document.getElementById("rep");
var dem = document.getElementById("dem");
var ind = document.getElementById("ind");
var drop = document.getElementById("state");

rep.addEventListener('click', filtroParty);
dem.addEventListener('click', filtroParty);
ind.addEventListener('click', filtroParty);
drop.addEventListener('change', filtroParty);


buildTable(members);
dropDownCreator();

function buildTable(members) {

    var tbody = document.getElementById("senate-data");

    tbody.innerHTML = "";

    for (var i = 0; i < members.length; i++) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        var td = document.createElement("td");
        var a = document.createElement("a");
        tr.appendChild(a);
        if ((members[i]['middle_name']) === ' ') {
            a.innerHTML = (members[i]['first_name']) + ' ' + ((members[i]['middle_name']) || 'null') + ' ' + (members[i]['last_name']);
        } else {
            a.innerHTML = (members[i]['first_name']) + ' ' + (members[i]['last_name']);
        }
        a.setAttribute("href", members[i]['url']);
        a.setAttribute("target", "_blank");

        td = document.createElement("td");
        tr.appendChild(td);
        td.innerHTML = (members[i]['party']);

        td = document.createElement("td");
        tr.appendChild(td);
        td.innerHTML = (members[i]['state']);

        td = document.createElement("td");
        tr.appendChild(td);
        td.innerHTML = (members[i]['seniority']);

        td = document.createElement("td");
        tr.appendChild(td);
        td.innerHTML = (members[i]['votes_with_party_pct']);
    }
}

//Crear la funció per filtrar segons el partit
function filtroParty() {
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

    buildTable(resultsParty);
}

//Funció per filtre estat

function dropDownCreator() {
    var stateList = [];
    for (var i = 0; i < members.length; i++) {
        if (stateList.includes(members[i]['state']) !== true) {
            stateList.push(members[i]['state']);
        }
    }

    stateList.sort();
    //stateList.unshift("ALL");

    for (var j = 0; j < stateList.length; j++) {
        var drop = document.getElementById('state');
        var opt = document.createElement("option");
        drop.appendChild(opt);
        opt.innerHTML = (stateList[j]);
    }
}


/*var resultsDrop = [];
function myDrop() {
    
    var currentSelect = document.getElementById("state").value;
    //alert("You selected: " + currentSelect);
    for (var i = 0; i < members.length; i++) {
        if (currentSelect.includes(members[i]['state']) == true) {
            resultsDrop.push(members[i]['state']);
        }
    }
    console.log(currentSelect);
    console.log(resultsDrop);
    console.log("-------");
}*/

//dropDownCreator(members);
//myDrop(resultsDrop);

/*var resultsState = [];
function () {
    for (var i=0; i<members.length; i++){
        if (state.select) && (state.value)==="state"{
            resultsState.push(members[i]);
        }
    }
    buildTable(resultsState);
}*/



/*
var membersState = (data["results"][0]["members"][i]['state']);
var State = [];
var Equal = function (a,b){
    return a.state ===b.state;
}
var arrayOrdenado = membersState.sort(Equal);



function buildDropState (){
    
    var tbodySt = document.getElementById("state");
    tbodySt.innerHTML ="";
    for (var i=0; i<members.length; i++) {
        var trSt = document.createElement("trSt");
        tbodySt.appendChild(trSt); 
        var tdSt = document.createElement("tdSt");
        tdSt = document.createElement("tdSt");
        trSt.appendChild(tdSt);
        tdSt.innerHTML = (members[i]['state']); 
    }
    
}
buildDropState(State);
*/
