const { logDebugMessageToConsole } = require('../utils/logger');
const { getAuthenticationStatus } = require('../utils/helpers');
const { isArchiveIdValid } = require('../utils/validators');
const { performDatabaseReadJob_ALL, submitDatabaseWriteJob } = require('../utils/database');

function reportsArchiveComments_GET(req, res) {
    getAuthenticationStatus(req.headers.authorization)
    .then((isAuthenticated) => {
        if(isAuthenticated) {
            performDatabaseReadJob_ALL('SELECT * FROM commentReportsArchive ORDER BY archive_id DESC', [])
            .then(reports => {
                res.send({isError: false, reports: reports});
            })
            .catch(error => {
                res.send({isError: true, message: 'error communicating with the MoarTube node'});
            });
        }
        else {
            logDebugMessageToConsole('unauthenticated communication was rejected', null, new Error().stack, true);

            res.send({isError: true, message: 'you are not logged in'});
        }
    })
    .catch(error => {
        logDebugMessageToConsole(null, error, new Error().stack, true);
        
        res.send({isError: true, message: 'error communicating with the MoarTube node'});
    });
}

function reportsArchiveCommentsArchiveIdDelete_DELETE(req, res) {
    getAuthenticationStatus(req.headers.authorization)
    .then((isAuthenticated) => {
        if(isAuthenticated) {
            const archiveId = req.params.archiveId;
            
            if(isArchiveIdValid(archiveId)) {
                submitDatabaseWriteJob('DELETE FROM commentReportsArchive WHERE archive_id = ?', [archiveId], function(isError) {
                    if(isError) {
                        res.send({isError: true, message: 'error communicating with the MoarTube node'});
                    }
                    else {
                        res.send({isError: false});
                    }
                });
            }
            else {
                logDebugMessageToConsole('invalid archive id: ' + archiveId, null, new Error().stack, true);
                
                res.send({isError: true, message: 'error communicating with the MoarTube node'});
            }
        }
        else {
            logDebugMessageToConsole('unauthenticated communication was rejected', null, new Error().stack, true);

            res.send({isError: true, message: 'you are not logged in'});
        }
    })
    .catch(error => {
        logDebugMessageToConsole(null, error, new Error().stack, true);
        
        res.send({isError: true, message: 'error communicating with the MoarTube node'});
    });
}

module.exports = {
    reportsArchiveComments_GET,
    reportsArchiveCommentsArchiveIdDelete_DELETE
}