/*
 ~   Copyright (c) 2018 WSO2 Inc. (http://wso2.com) All Rights Reserved.
 ~
 ~   Licensed under the Apache License, Version 2.0 (the "License");
 ~   you may not use this file except in compliance with the License.
 ~   You may obtain a copy of the License at
 ~
 ~        http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~   Unless required by applicable law or agreed to in writing, software
 ~   distributed under the License is distributed on an "AS IS" BASIS,
 ~   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~   See the License for the specific language governing permissions and
 ~   limitations under the License.
 */

$(document).ready(function () {
    $(".date-time").each(function (index) {
        var randomDateTime = randomDate(new Date(2018, 0, 1), new Date());
        $(this).text(moment(randomDateTime).format('DD/MM/YYYY hh:mm A'));
    });

    $(".year").text((new Date()).getFullYear());

    $("#profile-content").hide();

    $("#back-home").click(function () {
        $("#main-content").show();
        $("#profile-content").hide();
    });

    $("#profile").click(function () {
        $("#main-content").hide();
        $("#profile-content").show();
    });
});

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var config = {
    settings: {
        hasHeaders: false,
        constrainDragToContainer: false,
        reorderEnabled: false,
        selectionEnabled: false,
        popoutWholeStack: false,
        blockedPopoutsThrowError: true,
        closePopoutsOnUnload: false,
        showPopoutIcon: false,
        showMaximiseIcon: false,
        showCloseIcon: false,
    },
    dimensions: {
        borderWidth: 5,
        minItemHeight: 10,
        minItemWidth: 0,
        headerHeight: 20,
        dragProxyWidth: 300,
        dragProxyHeight: 200,
    },
    labels: {
        close: 'close',
        maximise: 'maximise',
        minimise: 'minimise',
        popout: 'open in new window',
    },

    content: [{
        type: 'row',
        width: 100,
        content: [
            {
                id: "actionContainer",
                type: 'component',
                componentName: 'actionContainer',
                componentState: {
                    text: 'Component 1',
                    color: '#fff',
                },
                title: "Action",
                width: 100
            },
            {
                id: "viewContainer",
                title: "title",
                type: 'component',
                componentName: 'viewContainer',
                componentState: { text: "text" },
                width: 0
            }
        ]
    }]
};

var myLayout = new GoldenLayout(config, '#wrapper');

myLayout.registerComponent('actionContainer', function (container, componentState) {
    container.getElement().html($("#actionContainer"));
});

myLayout.registerComponent('viewContainer', function (container, componentState) {
    container.getElement().html($("#viewContainer"));
});

myLayout.init();

var toggleRowColumn = function () {
    var oldElement = myLayout.root.contentItems[0],
        newElement = myLayout.createContentItem({
            type: oldElement.isRow ? 'column' : 'row',
            content: []
        });

    //Prevent it from re-initialising any child items
    newElement.isInitialised = true;

    for (i = 0; i < oldElement.contentItems.length; i++) {
        newElement.addChild(oldElement.contentItems[i]);
    }
    myLayout.root.replaceChild(oldElement, newElement);

    var actionContainer = myLayout.root.contentItems[0].contentItems[0];
    var viewContainer = myLayout.root.contentItems[0].contentItems[1];

    if (newElement.isColumn) {
        $('#toggleLayout').html('<span data-toggle="tooltip" data-placement="bottom" title="Dock to right">' +
            '<i class="fas fa-columns" ></i></span>');
        columnLayout(actionContainer, viewContainer);
    } else {
        $('#toggleLayout').html('<span data-toggle="tooltip" data-placement="bottom" title="Dock to bottom">' +
            '<i class="fas fa-window-maximize"></i></span>');
        rowLayout(actionContainer, viewContainer);
    }

    myLayout.updateSize();
};

$('.request-response-title').on("click", function (e) {
    var display = $(this).next().css('display');
    $(this).next().slideToggle();
    if (display == "block") {
        $(this).children().children("i").removeClass("fa-angle-right");
        $(this).children().children("i").addClass("fa-angle-down");
    } else {
        $(this).children().children("i").removeClass("fa-angle-down")
        $(this).children().children("i").addClass("fa-angle-right");
    }
});

$('.code-container')
    .on("mouseenter", function () {
        $(this).children(".btn-clipboard").fadeTo("fast", 1);
    })
    .on("mouseleave", function () {
        $(this).children(".btn-clipboard").fadeTo("fast", 0.4);
    });


$('#clearAll').on("click", function () {
    $("#timeline-content .event").hide();
});

$('#toggleView, #console-close').on("click", function () {
    toggleConsole();
});

function toggleConsole() {
    var actionContainer = myLayout.root.contentItems[0].contentItems[0];
    var viewContainer = myLayout.root.contentItems[0].contentItems[1];

    if (viewContainer.config.width == 0) {
        rowLayout(actionContainer, viewContainer);
        $('#wrapper .lm_splitter').show();
        $("#toggleView").addClass("active");

    } else if (viewContainer.config.width == 100) {
        if (viewContainer.config.height < 100) {
            toggleRowColumn(actionContainer, viewContainer);
        }
        defaultLayout(actionContainer, viewContainer);
        $('#wrapper .lm_splitter').hide();
        $("#toggleView").removeClass("active");
    }
    else {
        defaultLayout(actionContainer, viewContainer);
        $("#toggleView").removeClass("active");
    }

    myLayout.updateSize();
}

var rowLayout = function (actionContainer, viewContainer) {
    actionContainer.config.width = 50;
    viewContainer.config.width = 50;
    actionContainer.config.height = 100;
    viewContainer.config.height = 100;
}

var defaultLayout = function (actionContainer, viewContainer) {
    actionContainer.config.width = 100;
    viewContainer.config.width = 0;
    actionContainer.config.height = 100;
    viewContainer.config.height = 100;
}

var columnLayout = function (actionContainer, viewContainer) {
    actionContainer.config.width = 100;
    viewContainer.config.width = 100;
    actionContainer.config.height = 50;
    viewContainer.config.height = 50;
}

$("#toggleLayout").on("click", function () {
    toggleRowColumn();
    $('#wrapper .lm_splitter').show();
});

var clipboard = new Clipboard('.btn-clipboard');
clipboard.on('success', function (e) {
    $(e.trigger).next().show().fadeOut(1000);
    e.clearSelection();
});

$(window).resize(function () {
    myLayout.updateSize();
});

// API call related functions
async function add_data() {
    // Do a pre-check
    if (document.getElementById("drivers").selectedIndex == 0) {
        swal("Incorrect input", "Driver must be selected", "warning");
        return;
    }

    if (!document.getElementById("passengerName").value) {
        swal("Incorrect input", "Please enter passenger name", "warning");
        return;
    }

    if (!document.getElementById("contactNumber").value) {
        swal("Incorrect input", "Please enter contact number", "warning");
        return;
    }

    var data = {
        "driver": document.getElementById("drivers").value,
        "client": document.getElementById("passengerName").value,
        "client-phone": document.getElementById("contactNumber").value
    };

    var response = await post_data(data, localStorage.getItem("API_ENDPOINT"));

    try {
        var response_json = JSON.parse(response);
        if (response_json.status == "ok") {
            document.getElementById("drivers").selectedIndex = 0;
            document.getElementById("passengerName").value = "";
            document.getElementById("contactNumber").value = "";
            swal("Record created", "ID : " + response_json["ref-id"], "success");
        } else {
            swal("Something went wrong", "Cause : " + response_json["error-code"], "error");
        }
    } catch (error) {
        swal("Something went wrong", "Cause : " + error, "error");
    }

}

async function fetch_bookings() {
    // Rewrite booking tab and append with data fetched from back-end
    var oldTBody = document.getElementById('bookingTab').getElementsByTagName('tbody')[0];

    // New table body
    var newTBody = document.createElement('tbody');
    oldTBody.parentNode.replaceChild(newTBody, oldTBody);

    var response = await get_data(localStorage.getItem("API_ENDPOINT"));

    var json_data = JSON.parse(response);

    // Iterate and append to body
    json_data["bookings"].forEach(element => {
        var row = newTBody.insertRow(newTBody.rows.length);

        var cell = row.insertCell(0);
        var text = document.createTextNode(element["ref-id"]);
        cell.appendChild(text);

        var cell = row.insertCell(1);
        var text = document.createTextNode(element["driver"]);
        cell.appendChild(text);

        var cell = row.insertCell(2);
        var text = document.createTextNode(element["client"]);
        cell.appendChild(text);

        var cell = row.insertCell(3);
        var text = document.createTextNode(element["client-phone"]);
        cell.appendChild(text);
    });
}

function get_data(url) {
    return new Promise(function (resolve, reject) {
        var xReq = new XMLHttpRequest();
        xReq.open("GET", url);
        xReq.setRequestHeader("Authorization", get_auth_header());

        xReq.onload = function () {
            resolve(xReq.response);
        };

        xReq.onerror = reject;

        xReq.send();
    });
}

function post_data(data, url) {
    return new Promise(function (resolve, reject) {
        var xReq = new XMLHttpRequest();
        xReq.open("POST", url);
        xReq.setRequestHeader("Authorization", get_auth_header());
        xReq.setRequestHeader("Content-Type", "application/json");

        xReq.onload = function () {
            resolve(xReq.response);
        };

        xReq.onerror = reject;

        xReq.send(JSON.stringify(data));
    });
}

function get_auth_header() {
    var acc_token = localStorage.getItem("ACCESS_TOKEN");
    return "Bearer " + acc_token;
}