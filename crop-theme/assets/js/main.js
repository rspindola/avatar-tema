window.addEventListener('DOMContentLoaded', function() {
    $('#foto-tema').hide();

    var element = $("#html-content-holder"); // global variable
    var getCanvas; // global variable

    var avatar = document.getElementById('avatar');
    var image = document.getElementById('image');
    var input = document.getElementById('input');
    var $alert = $('.alert');
    var $modal = $('#modal');
    var cropper;

    $('[data-toggle="tooltip"]').tooltip();

    input.addEventListener('change', function(e) {
        var files = e.target.files;
        var done = function(url) {
            input.value = '';
            image.src = url;
            $modal.modal('show');
        };
        var reader;
        var file;
        var url;

        if (files && files.length > 0) {
            file = files[0];

            if (URL) {
                done(URL.createObjectURL(file));
            } else if (FileReader) {
                reader = new FileReader();
                reader.onload = function(e) {
                    done(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    $modal.on('shown.bs.modal', function() {
        cropper = new Cropper(image, {
            dragMode: 'crop',
            aspectRatio: 1,
            viewMode: 3,
            background: false,
            movable: false,
            zoomable: false,
            zoomOnTouch: false,
            zoomOnWheel: false,

        });
    }).on('hidden.bs.modal', function() {
        cropper.destroy();
        cropper = null;
    });

    document.getElementById('crop').addEventListener('click', function() {
        var initialAvatarURL;
        var canvas;

        $modal.modal('hide');

        if (cropper) {
            canvas = cropper.getCroppedCanvas({
                width: 500,
                height: 500,
            });
            initialAvatarURL = avatar.src;
            avatar.src = canvas.toDataURL();
            //$('#selecionaAvatar').hide();

            $alert.removeClass('alert-success alert-warning');
            canvas.toBlob(function(blob) {
                var formData = new FormData();

                formData.append('avatar', blob);
                var output = document.getElementById('output');
                output.src = canvas.toDataURL();
                $('#foto-tema').css('display','block');

                html2canvas(element, {
                    onrendered: function(canvas) {
                        getCanvas = canvas;
                    }
                });
            });
        }
    });

    $("#btn-Convert-Html2Image").on('click', function() {
        var imgageData = getCanvas.toDataURL("image/png");
        // Now browser starts downloading it instead of just showing it
        var newData = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
        $("#btn-Convert-Html2Image").attr("download", "your_pic_name.png").attr("href", newData);
    });
});