function RedirectGeneralError(req,res){
    res.redirect('/error');
};

function RedirectNoAccessError(req,res){
    res.redirect('/error/NoAccessError');
};

module.exports = {
    RedirectGeneralError:RedirectGeneralError,
    RedirectNoAccessError:RedirectNoAccessError
}