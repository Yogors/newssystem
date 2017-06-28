$(function () {
    var uname = sessionStorage.getItem('username');

    if (!uname) {
        alert('请登录');
        location.href = "pages/login.html"
    } else {
        // console.log(uname);
        //设置左上角用户名
        $(".header-left").html(uname);
        //默认显示新闻列表
        $('#modifyNews').click();
        //退出登录
        $('#logout').click(function () {
            // console.log('我退出啦')
            location.href = "pages/login.html";
        })
        //个人中心
        $('#personal').click(function () {
            $('#container').html('');
            // console.log('个人中心');
            $('#title').html($(this).html());
        })
        //添加新闻
        var editor = null;
        $('#addNews').click(function () {
            $('#title').html($(this).html());
            $('#container').html($('#addNewsTemplate').html());
            $.getScript('../node_modules/kindeditor/kindeditor-all-min.js', function () {
                editor = KindEditor.create('textarea[name="content"]', {
                    themeType: 'simple',
                    resizeType: 1,
                    cssPath: '../src/assets/css/index.css',
                    filterMode: true,
                    allowFileManager: true,
                    allowImageUpload: true,
                    afterBlur: function () {
                        this.sync();
                    },
                });
            });
            $('input[name="uname"]').val(uname);
            $('form').on('submit', function () {
                // console.log($(this).serialize());
                var data = $(this).serialize();
                var imgSrc = editor.html();
                var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/img;
                var imgArr = imgSrc.match(srcReg) || [];
                var imgAs = '';
                // console.log(imgArr);
                if (imgArr.length) {
                    var imgA = [];
                    for (var i = 0; i < imgArr.length; i++) {
                        var oneimg = imgArr[i].substring(5);
                        oneimg = oneimg.substring(0, (oneimg.length - 1))
                        imgA.push(oneimg);
                    }
                    imgAs = JSON.stringify(imgA);
                    // console.log(imgAs)
                }
                $.ajax({
                    url: 'http://127.0.0.1:9090/api/addnews',
                    type: 'post',
                    data: $(this).serialize() + '&imgArr=' + imgAs,
                    success: function (data) {
                        // console.log(data);
                        if (data == "true") {
                            $('#modifyNews').click();
                        }
                    }
                })
                return false;
            })

        });

        //新闻操作
        var pageIndex = 1;
        $('#modifyNews').click(function () {
            $('#container').html('');
            $('#title').html($(this).html());
            $.ajax({
                url: 'http://127.0.0.1:9090/api/getnews',
                type: 'get',
                data: {
                    uname: uname,
                    page: pageIndex
                },
                success: function (data) {
                    // console.log(JSON.parse(data));
                    var res = JSON.parse(data);
                    var tpl = template('modifyNewsTemplate', res)
                    $('#container').html(tpl);
                    $('.modifyNewsBtn').on('click', function () {
                        // console.log(this);
                        modifyNews($(this));
                    })
                    $('.delNewsBtn').on('click', function () {
                        // console.log(this);
                        delNews($(this));
                    })
                    var pageList = 5;
                    var pageCount = Math.ceil(res.totalLength / 5);
                    var pageStr = '<ul id="newsPages" class="clearfix">';

                    for (var i = 0; i < pageCount; i++) {
                        pageStr += '<li>' + (i + 1) + '</li>';
                    }
                    pageStr += '</ul>';
                    $('#container').append(pageStr);
                    $("#newsPages li").click(function () {
                        $("#newsList").empty();
                        pageIndex = $(this).index() + 1;
                        $("#newsPages li").removeClass('current');
                        $(this).addClass('current');
                        $.ajax({
                            url: 'http://127.0.0.1:9090/api/getnews',
                            type: 'get',
                            data: {
                                uname: uname,
                                page: pageIndex
                            },
                            success: function (data) {
                                // console.log(JSON.parse(data));
                                var res = JSON.parse(data);
                                var tpl = template('newsChangePagesTemplate', res)
                                document.querySelector('#newsList').innerHTML = tpl;
                                // console.log($('.delNewsBtn'));
                                $('.modifyNewsBtn').on('click', function () {
                                    modifyNews($(this));
                                })
                                $('.delNewsBtn').on('click', function () {
                                    delNews($(this));
                                })
                            }
                        })
                    });

                }
            })
        })

        function modifyNews(ele) {
            $.ajax({
                url: 'http://127.0.0.1:9090/api/getchangenews',
                type: 'get',
                data: {
                    uname: uname,
                    timestamp: ele.parent().attr('timestamp')
                },
                success: function (data) {
                    var datas = JSON.parse(data)[0];
                    console.log(datas);
                    $('#modifyModal').remove();
                    var tpl = template('modifyTemplate', datas);
                    // $('#container').html(tpl);
                    $(tpl).appendTo('body');
                    $('#modifyModal option[value=' + datas.categorys + ']').attr('selected', true);
                    $.getScript('../node_modules/kindeditor/kindeditor-all-min.js', function () {
                        editor = KindEditor.create('textarea[name="content"]', {
                            themeType: 'simple',
                            resizeType: 1,
                            cssPath: '../src/assets/css/index.css',
                            filterMode: true,
                            allowFileManager: true,
                            allowImageUpload: true,
                            afterBlur: function () {
                                this.sync();
                            },
                        });
                    });
                    $('#modifyModal').modal();
                    $('#modifyModal').on('submit', 'form', function () {
                        console.log($(this).serialize());
                        $.ajax({
                            url: 'http://127.0.0.1:9090/api/changenews',
                            type: 'post',
                            data: $(this).serialize(),
                            success: function (data) {
                                // console.log(data);
                                if (data == "true") {
                                    $('#modifyModal').modal('hide')
                                    $('#modifyNews').click();
                                }
                            }
                        })
                        return false;
                    })
                }
            })
        }

        function delNews(ele) {
            // console.log(ele.parent().attr('timestamp'));
            $.ajax({
                url: 'http://127.0.0.1:9090/api/deletenews',
                type: 'get',
                data: {
                    uname: uname,
                    timestamp: ele.parent().attr('timestamp')
                },
                success: function (data) {
                    // console.log(data);
                    if (data == "true") {
                        $('#modifyNews').click();
                    }
                }
            })
        }

        //修改密码
        $('#modifyPwd').click(function () {
            $('#title').html($(this).html());
            $('#container').html($('#modifyPwdTemplate').html());
            $('#container input[name="account"]').val(uname).parent().parent().hide();
            $('form').on('submit', function () {
                // console.log($(this).serialize());
                $.ajax({
                    url: 'http://127.0.0.1:9090/api/updatapwd',
                    data: $(this).serialize(),
                    type: 'get',
                    success: function (data) {
                        // console.log(data);
                        if (data == "true") {
                            alert('密码已修改,请重新登录');
                            location.href = "pages/login.html"
                        } else {
                            alert('原密码不对或新密码不满足密码要求');
                        }
                    }
                })
                return false;
            });

            $('#cancleModify').click(function () {
                $('#container input[name="password"]').val('');
                $('#container input[name="updatapwd"]').val('');
            })
        })
    }
});