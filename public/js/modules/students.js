function Students(server) {

    var self = this;

    this.show = function() {
        // получить список студентов и обработать события в нем
        server.listOfStudents(function (result) {
            if (result && result.length) {
                var str = '';
                for (var i = 0; i < result.length; i++) {
                    str += '<div class="student-item" data-id="' + result[i].id + '">' +
                        /*'<span>' + result[i].surname + '</span>' +
                        '<input class="delete-student" type="button" value="Удалить" data-id="' + result[i].id + '" />' +
                        '</div>' +*/
                            '<div class="input-group mb-3">' +
                                '<div class="input-group-prepend">' +
                                    '<input class="btn btn-outline-secondary delete-student" type="button" value="Удалить"' + 
                                    'data-id="' + result[i].id + '"/>' +
                                '</div>' +
                                '<input type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1"' + 
                                'value="' + ' ' + result[i].lastname + ' ' + result[i].name + ' ' + '"/>' +
                            '</div>' +
                        '</div>';
                        //&nbsp;<span>' + result[i].name + '</span> -- если нужно будет подключить имя
                }
                $('.list-of-students').html(str);
                /*$('.student-item').off('click').on('click', function() {
                    var id = $(this).data('id');

                    console.log(id);
                });*/
                // кнопка удаления студента
                $('.delete-student').off('click').on('click', function () {
                    var id = $(this).data('id');
                    server.deleteStudent(id, function (result) {
                        if (result) {
                            self.show();
                        }
                    });
                });
            }
        });
    };

    function init() {
        $('#student_button').on('click', function() {
            var name = $('#student_name').val();
            var surname = $('#student_surname').val();
            var lastname = $('#student_lastname').val();
            var record_book = $('#student_record_book').val();
            var status = $('#student_status').val();
            if (name && surname && lastname && record_book && status) {
                server.addStudent(name, surname, lastname, record_book, status, self.show);
            } else {
                console.log('Студент не добавлен.');
            }
        });
    }
    init();
}