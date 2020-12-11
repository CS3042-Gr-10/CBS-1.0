const RedirectGeneralError = (req,res)=>{
    res.redirect('/error');
};

const RedirectNoAccessError = (req,res)=>{
    res.redirect('/error/NoAccessError')
};

module.exports = {
    RedirectGeneralError:RedirectGeneralError,
    RedirectNoAccessError:RedirectNoAccessError
}