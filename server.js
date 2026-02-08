const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE_PATH = 'bookings.json';

app.use(cors());
app.use(express.json());

// This line tells the server it is allowed to show your HTML files
app.use(express.static(__dirname)); 

const readData = () => {
    if (!fs.existsSync(FILE_PATH)) return [];
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        return [];
    }
};

const writeData = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

app.post('/api/book', (req, res) => {
    const bookings = readData();
    const newBooking = { id: Date.now(), ...req.body, status: 'Pending' };
    bookings.push(newBooking);
    writeData(bookings);
    res.status(201).json({ message: 'Booking successful!' });
});

app.get('/api/admin/bookings', (req, res) => {
    res.json(readData());
});

app.put('/api/admin/bookings/:id/status', (req, res) => {
    let bookings = readData();
    const { id } = req.params;
    const { status } = req.body;
    bookings = bookings.map(b => b.id == id ? { ...b, status } : b);
    writeData(bookings);
    res.json({ message: 'Status updated!' });
});

app.delete('/api/admin/bookings/:id', (req, res) => {
    let bookings = readData();
    bookings = bookings.filter(b => b.id != req.params.id);
    writeData(bookings);
    res.json({ message: 'Booking deleted!' });
});

app.listen(PORT, () => {
    console.log(`SERVER IS LIVE ON PORT ${PORT}`);
});