window.onload = function() {
    var server = new Server();
    var pages = {
        students: new Students(server), // добавить, удалить студентосов
        schedule: new Schedule(server), // заполнить расписание занятий
        journal: new Journal(server), // отметить посещаемость
        lesson: new Lesson(server) // список предметов (добавить, удалить)
    };

    $('.head').on('click', function() {
        var name = $(this).data('page-name');
        $('.page').hide();
        $('.' + name).show();
        pages[name].show();
    });

    // init
    $('.page').hide();
    $('.journal').show();
    pages.journal.show();
};