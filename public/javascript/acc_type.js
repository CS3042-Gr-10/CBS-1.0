$('#incomeDetailsDiv').hide();
$('#savingsPlanDiv').hide();
$("select[name = acc_type]").change(function () {
    if ($(this).val() == 'current') {
        $('#savingsPlanDiv').hide();
        $('#incomeDetailsDiv').prop('required',true);
        $('#incomeDetailsDiv').show();
    } else if ($(this).val() == 'savings') {
        $('#incomeDetailsDiv').hide();
        $('#savingsPlanDiv').prop('required',true);
        $('#savingsPlanDiv').show();
    } else {
        $('#incomeDetailsDiv').hide();
        $('#incomeDetailsDiv').prop('required',false);
        $('#savingsPlanDiv').hide();
        $('#savingsPlanDiv').prop('required',false);
    }
});