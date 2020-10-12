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
            let template = Handlebars.templates[sourceid];
            // let source = $(sourceid).html();
            // let template = Handlebars.compile(source);
            $(target).html(template(jsonData));
        }
    });
}


getGallery = (e, id) => {
    if(id) {
        getData(`gallery/categories/${id}`, '#gallery', 'menu-gallery');
    }
    else {
        getData('gallery', '#gallery', 'menu-gallery');
    }
    $('#gallery-categories .nav-link').removeClass('disabled');

    $(e).addClass('disabled');
}


getDetailsOfGallery = (id) => {
    if(id) {
        getData(`gallery/${id}`, '#content', 'menu-gallery-details');
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
            let template = Handlebars.templates["blog-blogs"];
            // let source = $("#blogs-template").html();
            // let template = Handlebars.compile(source);
            $(target).html(template(jsonData));

            jsonData = {
                currentPage: parseInt(curPage),
                pageCount: data.pageCount,
                size: 2,
                api: request
            }

            target = $("#blogs-pagination");
            template = Handlebars.templates["blog-blogs-pagination"];
            // source = $("#blogs-pagination-template").html();
            // template = Handlebars.compile(source);
            $(target).html(template(jsonData));
        }
    });
}

getBlogDetail = (request) => {
    //console.log(request);
    if(request) {
        getData(`blogs/${request}`, '#blogs', 'blog-blogs-readmore');
    }
}

addComment = () => {
    // Validate Content of Comment
    if($("#cke_comment iframe").contents().find("body").text() == "")
    {
        $("#errorModal .modal-title").html("Invalid Input");
        $("#errorContent").html("<div class='alert alert-danger'>Content of Comment cannot be empty string</div>");
        $("#errorModal").modal();
    }
    else {
        let formData = {
            name: $("#name").val(),
            email: $("#email").val(),
            comment: $("#cke_comment iframe").contents().find("body").text(),
            blogId: $("#frm-comment").data("blog-id"),
            agree: $("#agree").prop("checked")
        }

        $.ajax({
            url: 'http://web1-api.herokuapp.com/users/authenticate',
            dataType: 'json',
            type: 'POST',
            data: {
                username: 'test',
                password: '1c3cr3@m' 
            },
            success: function(result) {
                console.log(result.token);
                console.table(formData);
                $.ajax({
                    url: 'http://web1-api.herokuapp.com/users/comment',
                    dataType: 'json',
                    type: "POST",
                    headers: {
                        "Authorization":`Bearer ${result.token}`
                    },
                    data: formData,
                    success: function() {
                        $("#errorModal .modal-title").html("Woo hoo ^^");
                        $("#errorContent").html("<div class='alert alert-success'>Your comment has been added</div>");
                        $("#errorModal").modal();
                        getBlogDetail(formData.blogId);
                    },
                    error: function(xhr, status, error) {
                        let text = "";
                        switch(error) {
                            case "Unauthorized":
                                text = "You are not permit to comment this blog";
                                break;
                            default:
                                text = error;
                        }
                        $("#errorModal .modal-title").html("Error!");
                        $("#errorContent").html(`<div class='alert alert-danger'>${text}</div>`);
                        $("#errorModal").modal();
                    }
                });
            }

        });
    }
}

sendEmail = () => {
    let formData = $("#frm-contact").serialize();

    $.ajax({
        url: 'http://web1-api.herokuapp.com/users/authenticate',
        dataType: 'json',
        type: 'POST',
        data: {
            username: 'test',
            password: '1c3cr3@m' 
        },
        success: function(result) {
            console.log(result.token);
            console.table(formData);
            $.ajax({
                url: 'http://web1-api.herokuapp.com/users/send',
                dataType: 'json',
                type: "POST",
                headers: {
                    "Authorization":`Bearer ${result.token}`
                },
                data: formData,
                success: function() {
                    $("#errorModal .modal-title").html("Woo hoo ^^");
                    $("#errorContent").html("<div class='alert alert-success'>Your email has been sent</div>");
                    $("#errorModal").modal();
                },
                error: function(xhr, status, error) {
                    let text = "";
                    switch(error) {
                        case "Unauthorized":
                            text = "You are not permit to comment this blog";
                            break;
                        default:
                            text = error;
                    }
                    $("#errorModal .modal-title").html("Error!");
                    $("#errorContent").html(`<div class='alert alert-danger'>${text}</div>`);
                    $("#errorModal").modal();
                }
            });
        }

    });
}