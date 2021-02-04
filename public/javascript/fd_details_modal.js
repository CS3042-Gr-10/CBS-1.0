var data = {
    keyValuePairs: [
        { key: "FD No.", value: "1234 5678 9876 7536"},
        { key: "Name", value: "Pasindu Udawatta"},
        { key: "NIC", value: "980000000v"},
    ]
};

var fdSource = $("#fd_template").html();
var fdTemp = Handlebars.compile(fdSource);
$("#fd_kvp").html(accDetTemp(data));