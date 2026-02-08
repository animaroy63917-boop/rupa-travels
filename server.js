const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const FILE_PATH = 'bookings.json';

app.use(cors());
app.use(express.json());

// Initialize the database file if it doesn't exist
if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]));
}

// 1. RECEIVE NEW BOOKINGS (From booking.html)
app.post('/api/book', (req, res) => {
    const bookings = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
    const newBooking = { 
        id: Date.now(), 
        ...req.body, 
        status: 'Pending' 
    };
    bookings.push(newBooking);
    fs.writeFileSync(FILE_PATH, JSON.stringify(bookings, null, 2));
    res.json({ success: true });
});

// 2. SEND DATA TO DASHBOARD (For admin.html)
app.get('/api/admin/bookings', (req, res) => {
    const bookings = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
    res.json(bookings);
});

// 3. UPDATE STATUS (Pending -> Completed)
app.put('/api/admin/bookings/:id/status', (req, res) => {
    const id = req.params.id;
    const newStatus = req.body.status;
    let bookings = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
    
    const index = bookings.findIndex(b => b.id.toString() === id.toString());
    if (index !== -1) {
        bookings[index].status = newStatus;
        fs.writeFileSync(FILE_PATH, JSON.stringify(bookings, null, 2));
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "Booking not found" });
    }
});

// 4. DELETE BOOKINGS
app.delete('/api/admin/bookings/:id', (req, res) => {
    const id = req.params.id;
    let bookings = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
    const filtered = bookings.filter(b => b.id.toString() !== id.toString());
    fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('-------------------------------------------');
    console.log('RUPA TRAVEL AGENCY SERVER IS LIVE');
    console.log('Running on: http://localhost:3000');
    console.log('-------------------------------------------');
});