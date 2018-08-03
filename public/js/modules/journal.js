function Journal(server) {

    var self = this;

    this.show = function () {
        // получить список студентов и положить их на страницу
        server.listOfStudents(function (result){
            if (result && result.length) {
                var str = '';
                for (var i = 0; i < result.length; i++) {
                    str += '<div class="journal-item">' +
                        /*'<span>' + result[i].surname + '</span>' +
                        '<input class="note-student" type="checkbox" data-id="' + result[i].id + '"/>' +
                        '</div>' + */
                        '<div class="input-group">' +
                        '<div class="input-group-prepend">' +
                        '<div class="input-group-text">' +
                        '<input class="note-student" type="checkbox" data-id="' + result[i].id +'" aria-label="Radio button for following text input">' +
                        '</div>' +
                        '</div>' +
                        '<input type="text" class="form-control" value="' + result[i].surname + '">' +
                        '</div>' +
                        '</div>';
                }
                $('.note-students').html(str);
            }
        });
        // получить расписание и положить его в выпадашку
        server.listOfSchedule(function (result) {
            if (result && result.length) {
                var str = '';
                for (var i = 0; i < result.length; i++) {
                    str += '<option value="'+ result[i].scheduleId + '">' + result[i].day + '&nbsp;' + result[i].time  + '&nbsp;' + result[i].name + '</option>';
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