$(function () {
    var uname = sessionStorage.getItem('username');

    if (!uname) {
        alert('请登录');
        location.href = "pages/login.html"
    } else {
        // console.log(uname);
        //设置左上角用户名
        $("header").html(uname);
        //个人中心
        $('#personal').click(function () {
            console.log('个人中心');
            $('#container').html($('#title').html($(this).html()));
        })
        //添加新闻
        $('#addNews').click(function () {
            $('#title').html($(this).html());
            $('#container').html($('#addNewsTemplate').html());
            KindEditor.ready(function (K) {
                window.editor = K.create('#editor_id');
            });

        })
        //新闻操作
        $('#modifyNews').click(function () {
            $('#title').html($(this).html());
            $('#container').html($('#modifyNewsTemplate').html());
        })
        //修改密码
        $('#modifyPwd').click(function () {
            $('#title').html($(this).html());
            $('#container').html($('#modifyPwdTemplate').html());
            $('#container input[name="account"]').val(uname).parent().parent().hide();
            $('form').on('submit', function () {
                console.log($(this).serialize());
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