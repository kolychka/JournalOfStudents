function Schedule(server) {

    var self = this;

    this.show = function() {
        server.listOfSchedules(function(result) {
            if (result && result.length) {
                var str = '';
                for (var i = 0; i < result.length; i++) {
                    str += '<div class="schedule-item" data-id="' + result[i].scheduleId + '">' +
                                '<div class="input-group mb-3">' +
                                    '<div class="input-group-prepend">' +
                                        '<input class="btn btn-outline-secondary delete-in-schedule" type="button" value="Удалить" data-id="' + result[i].scheduleId + '"/>' +
                                    '</div>' +
                                    '<input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" value="' +
                                    ' ' + result[i].scheduleDay + '; ' + result[i].scheduleTime + ' пара; ' + result[i].lessonName + '; ' + result[i].subgroupName + ' ' + '"/>' +
                                '</div>' +
                            '</div>';
                }
                $('.list-of-schedule').html(str);
                // кнопка удаления занятия
                $('.delete-in-schedule').off('click').on('click', function () {
                    var id = $(this).data('id');
                    server.deleteSchedule(id, function (result) {
                        if (result) {
                            self.show();
                        }
                    });
                });
            }
        });
        server.listOfLessons(function(result){
            if (result && result.length) {
                var str = '';
                for (var i = 0; i < result.length; i++) {
                    str += '<option value="'+ result[i].id + '">' + result[i].name + '</option>';
                }
                $('#lesson-select').html(str);
            }
        });
        server.listOfSubgroups(function(result){
            if (result && result.length) {
                var str = '';
                for (var i = 0; i < result.length; i++) {
                    str += '<option value="'+ result[i].id + '">' + result[i].name + " " + result[i].description + " " + result[i].group_code + '</option>';
                }
                $('#subgroup-select').html(str);
            }
        });
    };

    function init() {
        $('#schedule_button').on('click', function() {
            var day = $('#schedule_day').val();
            var time = $('#lesson-time-select').val();
            var lesson_name = $('#lesson-select').val();
            var subgroup_name = $('#subgroup-select').val();
            if (day && time && lesson_name && subgroup_name) {
                server.addSchedule(time, day, lesson_name, subgroup_name, self.show);
            } else {
                console.log('В расписание не добавлено.');
            }
        });
    }
    init();
}