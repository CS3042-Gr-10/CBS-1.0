$('#incomeDetailsDiv').hide();
$("select[name = acc_type]").change(function () {
    if ($(this).val() != 'current') {
        $('#incomeDetailsDiv').prop('required',false);
        $('#incomeDetailsDiv').hide();
    } else {
        $('#incomeDetailsDiv').show();
        $('#incomeDetailsDiv').prop('required',true);
    }
});

// $("#acc_type_current").change(function () {
//     $("#current_acc_additions_label").append("<label for='incomeDetails' class='col-form-label ml-3'>Income Details</label>");
//     $("#current_acc_additions_label").append($("#current_acc_additions_input"));
//     $("#current_acc_additions_input").append("<input type='file' class='form-control-file my-1 ml-2' id='income_details' name='income_details' aria-describedby='incomeDetails' required>");
// });