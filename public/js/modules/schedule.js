function Schedule(server) {

    var self = this;

    this.show = function() {
        server.listOfSchedule(function(result) {
            if (result && result.length) {
                var str = '';
                for (var i = 0; i < result.length; i++) {
                    str += '<div class="schedule-item" data-id="' + result[i].scheduleId + '">' +
                        /*'<span>' + result[i].day + '</span>&nbsp;<span>' + result[i].time + '&nbsp;пара</span>' +
                        '&nbsp;<span>' + result[i].name + '</span>' +
                        '<input class="delete-in-schedule" type="button" value="Удалить" data-id="' + result[i].scheduleId + '" />' +
                    '</div>' +*/
                        '<div class="input-group mb-3">' +
                        '<div class="input-group-prepend">' +
                        '<input class="btn btn-outline-secondary delete-in-schedule" type="button" value="Удалить" data-id="' + result[i].scheduleId + '"/>' +
                        '</div>' +
                        '<input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1" value="' +
                                                ' ' + result[i].day + '; ' + result[i].time + ' пара; ' + result[i].name + ' ' + '"/>' +
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
    };

    function init() {
        $('#schedule_button').on('click', function() {
            var day = $('#schedule_day').val();
            var time = $('#lesson-time-select').val();
            var name = $('#lesson-select').val();
            if (day && time && name) {
                server.addSchedule(day, time, name, self.show);
            } else {
                console.log('В расписание не добавлено.');
            }
        });
    }
    init();
}