const Booking = require('../models/Booking'); // Import the Booking model

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { userId, providerId, serviceDate, serviceTime } = req.body;

        const newBooking = new Booking({
            userId,
            providerId,
            serviceDate,
            serviceTime,
        });

        const savedBooking = await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', data: savedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email') // Replace with actual user fields
            .populate('providerId', 'name serviceType'); // Replace with actual provider fields

        res.status(200).json({ data: bookings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id)
            .populate('userId', 'name email')
            .populate('providerId', 'name serviceType');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ data: booking });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
};

// Update a booking
const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', data: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
};

// Delete a booking
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
};

// Export the controller functions
module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
};
