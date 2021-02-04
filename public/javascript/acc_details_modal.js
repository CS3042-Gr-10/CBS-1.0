var data = {
    keyValuePairs: [
        { key: "Account No.", value: "1234 5678 9876"},
        { key: "Name", value: "Pasindu Udawatta"},
        { key: "NIC", value: "980000000v"},
    ]
};

var accDetSource = $("#acc_det_template").html();
var accDetTemp = Handlebars.compile(accDetSource);
$("#acc_det_kvp").html(accDetTemp(data));