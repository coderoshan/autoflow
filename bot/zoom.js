const { createClient } = require('./supabase');

async function handleZoomWebhook(req, res) {
  const event = req.body.event;

  if (event === 'meeting.ended') {
    const meetingId = req.body.payload.object.id;
    console.log(`Meeting ended: ${meetingId}`);
    // TODO: Process meeting recording
  }

  res.status(200).send();
}

module.exports = { handleZoomWebhook };
