const ymd = (date_obj)=>{
    const year = date_obj.getFullYear();
    
    const month = ("0"+(date_obj.getMonth() + 1)).slice(-2);
    const date = ("0"+date_obj.getDate()).slice(-2);

    const format = `${year}-${month}-${date}`;

    return format;
}


module.exports = {
    ymd
}