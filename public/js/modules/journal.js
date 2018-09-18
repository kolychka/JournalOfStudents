function Journal(server) {

    var self = this;

    this.show = function () {
        // получить список студентов и положить их на страницу
        server.listOfStudents(function (result){
            if (result && result.length) {
                var str = '';
                for (var i = 0; i < result.length; i++) {
                    str += '<div class="journal-item">' +
                                '<div class="input-group">' +
                                    '<div class="input-group-prepend">' +
                                        '<div class="input-group-text">' +
                                            '<input class="note-student" type="checkbox" data-id="' + result[i].id +
                                            '" aria-label="Radio button for following text input">' +
                                        '</div>' +
                                    '</div>' +
                                    '<input type="text" class="form-control" value="' + result[i].lastname + '">' +
                                '</div>' +
                            '</div>';
                }
                $('.note-students').html(str);
            }
        });
        // получить расписание и положить его в выпадашку
        server.listOfSchedules(function (result) {
            if (result && result.length) {
                var str = '';
                for (var i = 0; i < result.length; i++) {
                    str += '<option value="'+ result[i].scheduleId + '">' + result[i].scheduleDay + 
                                '&nbsp;' + result[i].scheduleTime  + '&nbsp;' + result[i].lessonName  + 
                                '&nbsp;' + result[i].subgroupName + '</option>';
                }
                $('#schedule-select').html(str);
            }
        });
    };

    function init() {
        // отправить отмеченных студентов на сервер
        $('.add-in-journal').on('click', function () {
            var scheduleId = $('#schedule-select')[0].selectedOptions[0].value; // взять предмет
            // взять студентов
            var elems = $('.note-student');
            var noteList = [];
            for (var i = 0; i < elems.length; i++) {
                noteList.push($(elems[i]).data('id') + ',' + ((elems[i].checked) ? '1' : '0'));
            }
            // запулить на сервер
            server.noteStudents(noteList.join(';'), scheduleId, function (result) {
                if (result) {
                    self.show();
                }
            });
        });
    }
    init();
}