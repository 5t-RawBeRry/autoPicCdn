layui.use(['upload', 'form', 'element', 'layer', 'flow'], function() {
    var upload = layui.upload;
    var form = layui.form;
    var element = layui.element;
    var layer = layui.layer;

    //图片懒加载
    var flow = layui.flow;
    flow.lazyimg({
        elem: '#found img'
    });
    //图片查看器
    layer.photos({
        photos: '#found',
        anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
    });
    layer.photos({
        photos: '#lightgallery',
        anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
    });

    //执行实例
    var uploadInst = upload.render({
        elem: '#upimg' //绑定元素
            //选择的时候触发
            ,
        choose: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            this.url = './up.php';
            this.field = 'pic';
            console.log(this);
            $(".progress").hide();
            console.log(this.url);
        },
        accept: 'file',
        acceptMime: 'image/jpeg,image/pjpeg,image/png,image/x-png,image/gif,image/webp,application/woff2,application/zip,application/x-gzip,application/x-tar,text/plain,audio/basic,video/mpeg,video/vp9,video/webm',
        exts: 'jpg|jpeg|png|gif|webp|woff2|zip|tar|gz|txt|mp3|mp4|flac|acc|m4a|webm|wav|ape|css',
        size: 20480,
        before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layer.load(); //上传loading
        },
        done: function(res) {
            //console.log(res);
            //上传完毕回调
            //如果上传失败
            handleres(res);
        },
        error: function() {
            //请求异常回调
            layer.closeAll('loading');
        }
    });
    //单文件上传END

});

function handleres(res, index) {
    layui.use('layer', function() {
        var layer = layui.layer;
        if (res.code != 'success') {
            layer.open({
                title: 'Tips',
                content: res.msg
            });
            layer.closeAll('loading');

        } else {
            layer.closeAll('loading');
            $("#img-thumb a").attr('href', res.data.url);
            $("#img-thumb img").attr('src', res.data.url);
            $("#url").val(res.data.url);
            $("#html").val("<img src = '" + res.data.url + "' />");
            $("#markdown").val("![TakaHashi RyouSuke's Image bed](" + res.data.url + ")");
            $("#bbcode").val("[img]" + res.data.url + "[/img]");
            $("#imgshow").show();

        }


    });

}

//复制链接
//复制链接
function copyurl(info) {
    var copy = new clipBoard(document.getElementById('links'), {
        beforeCopy: function() {
            info = $("#" + info).val();
        },
        copy: function() {
            return info;
        },
        afterCopy: function() {

        }
    });
    layui.use('layer', function() {
        var layer = layui.layer;
        layer.msg('🎊 Link copied!', { time: 2000, icon: 0 })
    });
}


//显示图片链接
function showlink(url) {
    layer.open({
        type: 1,
        title: false,
        content: $('#imglink'),
        area: ['680px', '500px']
    });
    $("#url").val(url);
    $("#html").val("<img src = '" + url + "' />");
    $("#markdown").val("![](" + url + ")");
    $("#bbcode").val("[img]" + url + "[/img]");
    $("#imglink").show();
}


document.addEventListener('paste', function(event) {
    var isChrome = false;
    if (event.clipboardData || event.originalEvent) {
        var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
        if (clipboardData.items) {
            // for chrome
            var items = clipboardData.items,
                len = items.length,
                blob = null;
            isChrome = true;

            event.preventDefault();

            let images = [];
            for (var i = 0; i < len; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    blob = items[i].getAsFile();
                    images.push(blob);
                }
            }
            if (images.length > 0) {
                layer.confirm('Upload clipboard file?', function(index) {
                    layer.load();
                    var formData = new FormData();
                    formData.append('pic', images[0]);
                    $.ajax({
                        url: './up.php',
                        data: formData,
                        type: 'post',
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        success: function(data) {

                            handleres(data);
                        },
                        error: function(xOptions, textStatus) {
                            return;
                        }

                    });
                    layer.close(index);
                });
                // layer.confirm('', {
                //   btn: ['立马上传', '按错了'] //可以无限个按钮
                // }, function(index, layero){



                // }, function(index){
                //   console.log("取消上传");
                // });
                //layer.close(layer.index);
            }
            if (blob !== null) {
                let reader = new FileReader();
                reader.onload = function(event) {
                    let base64_str = event.target.result;
                }

            }
        } else {
            //for firefox
        }
    } else {}
});