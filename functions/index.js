const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/displays', (req, res) => {
  admin
    .firestore()
    .collection('displays')
    .get()
    .then((data) => {
      let displays = [];
      data.forEach((doc) => {
        displays.push(doc.data());
      });
      return res.json(displays);
    })
    .catch((err) => console.error(err));
});

exports.createDisplay = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not allowed' });
  }

  const newDisplay = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };

  admin
    .firestore()
    .collection('displays')
    .add(newDisplay)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
});

// https://basurl.com/api/something

exports.api = functions.https.onRequest(app);
