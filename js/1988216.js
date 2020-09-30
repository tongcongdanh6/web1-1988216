function initializeWOW_Effect() {
    new WOW().init();
}

/*
Handlebars Helper Register
*/
Handlebars.registerHelper('ifEqual', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

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


getGallery = (e, id) => {
    if(id) {
        getData(`gallery/categories/${id}`, '#gallery', '#gallery-template');
    }
    else {
        getData('gallery', '#gallery', '#gallery-template');
    }
    $('#gallery-categories .nav-link').removeClass('disabled');

    $(e).addClass('disabled');
}


getDetailsOfGallery = (id) => {
    if(id) {
        getData(`gallery/${id}`, '#content', '#gallery-details-template');
    }
}

getBlogs = (request, curPage = 1) => {
    $.ajax({
        url: `http://web1-api.herokuapp.com/api/${request}?page=${parseInt(curPage)}`,
        cache: false,
        success: function (data) {
            console.log(data);
            let jsonData = {
                data
            };
            let target = $("#blogs");
            let source = $("#blogs-template").html();
            let template = Handlebars.compile(source);
            $(target).html(template(jsonData));

            jsonData = {
                currentPage: parseInt(curPage),
                pageCount: data.pageCount,
                size: 2,
                api: request
            }

            target = $("#blogs-pagination");
            source = $("#blogs-pagination-template").html();
            template = Handlebars.compile(source);
            $(target).html(template(jsonData));
        }
    });
}

getBlogDetail = (request) => {
    console.log(request);
    if(request) {
        getData(`blogs/${request}`, '#blogs', '#blogs-readmore-template');
    }
}