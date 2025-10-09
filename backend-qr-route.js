// Add this route to your backend server
// File: routes/qr.js or add to your main server file

const express = require("express");
const { db } = require("../config/database");
const { emitToDoctor } = require("../socket"); // Make sure this exists

const router = express.Router();

// POST /qr/doctor-scan
// Body: { doctorId, patientId, timestamp, type }
router.post("/qr/doctor-scan", async (req, res) => {
    const { doctorId, patientId, timestamp, type } = req.body || {};

    if (!doctorId || !patientId) {
        return res.status(400).json({ error: "doctorId and patientId are required" });
    }

    try {
        // Latest booking record for the patient
        const [rows] = await db.query(
            "SELECT * FROM bookings WHERE patient_id = ? ORDER BY id DESC LIMIT 1",
            [patientId]
        );

        if (!rows.length) {
            return res.status(404).json({ error: "no_booking_found_for_patient" });
        }

        const latestBooking = rows[0];

        // Emit socket event to the doctor's private room
        emitToDoctor(doctorId, "patient_qr_scan", {
            meta: {
                type: type || "doctor_qr",
                timestamp: timestamp || new Date().toISOString(),
            },
            booking: latestBooking,
        });

        return res.json({ success: true });
    } catch (err) {
        console.error("POST /qr/doctor-scan error", err);
        return res.status(500).json({ error: "internal_server_error" });
    }
});

module.exports = router;
