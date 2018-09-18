function Lesson(server) {

    var self = this;

    this.show = function () {

        server.listOfLessons(function(result){
            if (result && result.length) {
                var str = '';
                console.log(result);
                for (var i = 0; i < result.length; i++) {
                    str += '<div class="lesson-item" data-id="' + result[i].id + '">' +
                                '<div class="input-group mb-3">' +
                                    '<div class="input-group-prepend">' +
                                        '<input class="btn btn-outline-secondary delete-lesson" type="button" value="Удалить" data-id="' + result[i].id + '"/>' +
                                    '</div>' +
                                    '<input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" value="' +
                                    ' ' + result[i].name + ' ' + '"/>' +
                                '</div>' +
                            '</div>';
                }
                $('.list-of-lessons').html(str);
                // кнопка удаления дисциплины
                $('.delete-lesson').off('click').on('click', function () {
                    var id = $(this).data('id');
                    server.deleteLesson(id, function (result) {
                        if (result) {
                            self.show();
                        }
                    });
                });
            }
        });
    };

    function init() {
        $('#lesson_button').on('click', function() {
            var name = $('#lesson_name').val();
            if (name) {
                server.addLesson(name, self.show);
            } else {
                console.log('Дисциплина не добавлена.');
            }
        });
    }
    init();
}