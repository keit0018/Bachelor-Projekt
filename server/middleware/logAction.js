const AuditLog = require('../models/auditLog');

const logAction = async (req, res, next) => {
    const originalJson = res.json;

    res.json = function (body) {
      const payload = {
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        headers: req.headers,
        statusCode: res.statusCode,
        response: body,
      };
  
      const auditLog = new AuditLog(payload);
      auditLog.save()
        .then(() => {
          console.log('Audit log saved successfully');
        })
        .catch(err => {
          console.error('Error saving audit log:', err);
        });
  
      return originalJson.call(this, body);
    };
  
    next();
  };
  
  module.exports = logAction;