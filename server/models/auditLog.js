const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  url: String,
  method: String,
  body: mongoose.Schema.Types.Mixed,
  params: mongoose.Schema.Types.Mixed,
  headers: mongoose.Schema.Types.Mixed,
  statusCode: Number,
  response: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;