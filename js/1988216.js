function getData(request, targetid, sourceid) {
    $.ajax({
        url: 'http://web1-api.herokuapp.com/api/' + request,
        cache: false,
        success: function (data) {
            console.log(data);
            let jsonData = {
                data
            };
            let target = $(targetid);
            let source = $(sourceid).html();
            let template = Handlebars.compile(source);
            $(target).html(template(jsonData));
        }
    });
}