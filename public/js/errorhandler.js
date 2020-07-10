$.ajaxSetup({
  error: function (jqXHR, status, errorThrown) {
    console.log(jqXHR);
    var errormsg = jqXHR.responseJSON.error;
    ShowError(errormsg);
  },
});

function ShowError(msg) {
  M.toast({
    html: msg,
    classes: "red yellow-text",
  });
}
