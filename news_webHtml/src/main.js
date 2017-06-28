$(function () {
    //标签页
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        e.target // newly activated tab
        e.relatedTarget // previous active tab
    })
    $.ajax({
        url: 'http://127.0.0.1:9090/api/webgetkeynews',
        type: 'get',
        data: {
            category: '资讯新闻',
            page: 1,
        },

        success: function (data) {
            var oldDatas = JSON.parse(data);
            oldDatas.forEach(function (value) {
                value.imgArr = JSON.parse(value.imgArr);
                value.date = changeDate(value.date);
            })
            var tpl = template('newsutemTemplate', oldDatas);
            $(tpl).appendTo('div[category="资讯新闻"]');
        }
    })
    $('#newsBtn li').click(function () {
        var category = $(this).children('a').attr('category');
        $('div[category=' + category + ']').empty();
        $.ajax({
            url: 'http://127.0.0.1:9090/api/webgetkeynews',
            type: 'get',
            data: {
                category: category,
                page: 1,
            },

            success: function (data) {
                var oldDatas = JSON.parse(data);
                oldDatas.forEach(function (value) {
                    value.imgArr = JSON.parse(value.imgArr);
                    value.date = changeDate(value.date);
                })
                var tpl = template('newsutemTemplate', oldDatas);
                $(tpl).appendTo('div[category=' + category + ']');
            }
        })
    })

    function changeDate(date) {
        var newDate = new Date(parseInt(date));
        var year = newDate.getFullYear();
        var month = newDate.getMonth() + 1;
        var day = newDate.getDate();
        return year + '-' + month + '-' + day
    }
})