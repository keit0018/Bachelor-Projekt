const assert = require('assert');
const sinon = require('sinon');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const {
  createMeeting,
  getUnattendedMeetings,
  updateMeeting,
  deleteMeeting,
} = require('../controllers/meetings'); 
const Meeting = require('../models/meeting');
const Attendance = require('../models/attendence');
const User = require('../models/user');

describe('Meeting Controller', () => {
    let server;
    const port = 3001;
    const userId = 'testUserId';
  
    before((done) => {
      const app = express();
      app.use(bodyParser.json());
      app.post('/createMeeting', (req, res, next) => { req.user = { userId }; next(); }, createMeeting);
      app.get('/unattended', (req, res, next) => { req.user = { userId }; next(); }, getUnattendedMeetings);
      app.put('/updateMeeting/:id', (req, res, next) => { req.user = { userId }; next(); }, updateMeeting);
      app.delete('/deleteMeeting/:id', (req, res, next) => { req.user = { userId }; next(); }, deleteMeeting);
      server = app.listen(port, done);
    });
  
    after((done) => {
      server.close(done);
    });
  
    describe('createMeeting', () => {
      it('should create a new meeting and attendance record', async () => {
        const meetingSaveStub = sinon.stub(Meeting.prototype, 'save').resolves({
          _id: 'test-meeting-id',
          title: 'Test Meeting',
          dateTime: new Date(),
          participants: [],
          groupId: 'test-group-id',
          createdBy: userId,
        });
  
        const attendanceSaveStub = sinon.stub(Attendance.prototype, 'save').resolves({
          meetingId: 'test-meeting-id',
          userId,
          attended: false,
        });
  
        const res = await makeRequest('/createMeeting', 'POST', {
          title: 'Test Meeting',
          dateTime: new Date(),
          participants: [],
        });
  
        assert.strictEqual(res.statusCode, 201);
        const response = JSON.parse(res.body);
        assert.strictEqual(response.title, 'Test Meeting');
  
        meetingSaveStub.restore();
        attendanceSaveStub.restore();
      });
    });
  
    describe('updateMeeting', () => {
      it('should update the meeting if the user is authorized', async () => {
        const meetingFindByIdStub = sinon.stub(Meeting, 'findById').resolves({
          _id: 'test-meeting-id',
          title: 'Old Title',
          dateTime: new Date(),
          participants: [],
          createdBy: userId,
        });
  
        const updateStub = sinon.stub(Meeting, 'findByIdAndUpdate').resolves({
          _id: 'test-meeting-id',
          title: 'New Title',
          dateTime: new Date(),
          participants: [],
          createdBy: userId,
        });
  
        const res = await makeRequest('/updateMeeting/test-meeting-id', 'PUT', {
          title: 'New Title',
          dateTime: new Date(),
          participants: [],
        });
  
        assert.strictEqual(res.statusCode, 200);
        const response = JSON.parse(res.body);
        assert.strictEqual(response.title, 'New Title');
  
        meetingFindByIdStub.restore();
        updateStub.restore();
      });
  
      it('should return 403 if the user is not authorized', async () => {
        const meetingFindByIdStub = sinon.stub(Meeting, 'findById').resolves({
          _id: 'test-meeting-id',
          title: 'Old Title',
          dateTime: new Date(),
          participants: [],
          createdBy: 'another-user-id',
        });
  
        const res = await makeRequest('/updateMeeting/test-meeting-id', 'PUT', {
          title: 'New Title',
          dateTime: new Date(),
          participants: [],
        });
  
        assert.strictEqual(res.statusCode, 403);
        const response = JSON.parse(res.body);
        assert.strictEqual(response.message, 'User not authorized to update this meeting');
  
        meetingFindByIdStub.restore();
      });
    });
  
    describe('deleteMeeting', () => {
      it('should delete the meeting', async () => {
        const deleteStub = sinon.stub(Meeting, 'findByIdAndDelete').resolves();
  
        const res = await makeRequest('/deleteMeeting/test-meeting-id', 'DELETE');
  
        assert.strictEqual(res.statusCode, 200);
        const response = JSON.parse(res.body);
        assert.strictEqual(response.message, 'Meeting deleted successfully');
  
        deleteStub.restore();
      });
    });
  
    async function makeRequest(path, method, body = null) {
      return new Promise((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port,
          path: encodeURI(path),
          method,
          headers: {
            'Content-Type': 'application/json',
          },
        };
  
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve({ statusCode: res.statusCode, body: data });
          });
        });
  
        req.on('error', reject);
  
        if (body) {
          req.write(JSON.stringify(body));
        }
  
        req.end();
      });
    }
  });