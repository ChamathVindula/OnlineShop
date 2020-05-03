exports.getpageNotFound = (request, response, next) => {
    response.status(404).render('404.ejs', {docTitle: '404', path: ''});
}